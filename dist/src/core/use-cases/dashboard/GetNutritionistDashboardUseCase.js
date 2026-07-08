"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNutritionistDashboardUseCase = void 0;
const prisma_1 = require("../../../infrastructure/database/prisma");
class GetNutritionistDashboardUseCase {
    constructor(adherenceRepository) {
        this.adherenceRepository = adherenceRepository;
    }
    async execute(nutritionistUserId) {
        const patients = await prisma_1.prisma.patient.findMany({
            where: { nutritionistUserId, deletedAt: null },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
        const totalPatients = patients.length;
        const activePlansCount = await prisma_1.prisma.patientPlanAssignment.count({
            where: {
                nutritionistUserId,
                active: true,
                patient: { deletedAt: null },
            },
        });
        // Calculate avg adherence across all patients
        let totalAdherence = 0;
        const lowAdherencePatients = [];
        for (const patient of patients) {
            const summary = await this.adherenceRepository.getSummary(patient.user.id, 30);
            totalAdherence += summary.mealAdherencePercent;
            if (summary.mealAdherencePercent < 50) {
                lowAdherencePatients.push({
                    patientId: patient.id,
                    patientName: patient.user.name,
                    adherencePercent: summary.mealAdherencePercent,
                });
            }
        }
        const avgAdherence = totalPatients > 0 ? Math.round(totalAdherence / totalPatients) : 0;
        // Recent activity: last 10 meal/hydration/mood logs
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const patientUserIds = patients.map((p) => p.user.id);
        const [recentMeals, recentHydrations, recentMoods] = await Promise.all([
            prisma_1.prisma.mealLog.findMany({
                where: { patientUserId: { in: patientUserIds }, date: { gte: thirtyDaysAgo } },
                orderBy: { createdAt: "desc" },
                take: 10,
                include: { patientUser: { select: { name: true } } },
            }),
            prisma_1.prisma.hydrationLog.findMany({
                where: { patientUserId: { in: patientUserIds }, loggedAt: { gte: thirtyDaysAgo } },
                orderBy: { loggedAt: "desc" },
                take: 10,
                include: { patientUser: { select: { name: true } } },
            }),
            prisma_1.prisma.moodLog.findMany({
                where: { patientUserId: { in: patientUserIds }, loggedAt: { gte: thirtyDaysAgo } },
                orderBy: { loggedAt: "desc" },
                take: 10,
                include: { patientUser: { select: { name: true } } },
            }),
        ]);
        const recentActivity = [
            ...recentMeals.map((m) => ({
                type: "meal",
                patientName: m.patientUser.name,
                detail: `${m.mealName} ${m.consumed ? "consumed" : "logged"}`,
                timestamp: m.createdAt,
            })),
            ...recentHydrations.map((h) => ({
                type: "hydration",
                patientName: h.patientUser.name,
                detail: `${h.amountMl}ml`,
                timestamp: h.loggedAt,
            })),
            ...recentMoods.map((m) => ({
                type: "mood",
                patientName: m.patientUser.name,
                detail: m.mood,
                timestamp: m.loggedAt,
            })),
        ]
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 10);
        return {
            totalPatients,
            activePlans: activePlansCount,
            avgAdherence,
            recentActivity,
            patientsWithLowAdherence: lowAdherencePatients,
        };
    }
}
exports.GetNutritionistDashboardUseCase = GetNutritionistDashboardUseCase;
//# sourceMappingURL=GetNutritionistDashboardUseCase.js.map