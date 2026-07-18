"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const PrismaPatientRepository_1 = require("@/modules/patients/infrastructure/repositories/PrismaPatientRepository");
const PrismaAdherenceRepository_1 = require("@/modules/adherence/infrastructure/repositories/PrismaAdherenceRepository");
const prisma_1 = require("@/shared/infrastructure/database/prisma");
const response_1 = require("@/shared/utils/response");
const patientRepo = new PrismaPatientRepository_1.PrismaPatientRepository();
const adherenceRepo = new PrismaAdherenceRepository_1.PrismaAdherenceRepository();
class DashboardController {
    static async getNutritionistDashboard(req, res) {
        try {
            const nutritionistUserId = req.user.userId;
            // Pacientes totales
            const patients = await patientRepo.listByNutritionist(nutritionistUserId);
            const totalPatients = patients.length;
            // Planes activos
            const activePlans = await prisma_1.prisma.dietPlan.count({
                where: { nutritionistUserId, deletedAt: null },
            });
            // Adherencia promedio
            const summaries = await Promise.all(patients.slice(0, 20).map(async (p) => {
                try {
                    const summary = await adherenceRepo.getSummary(p.userId);
                    return { patientId: p.id, userId: p.userId, ...summary };
                }
                catch {
                    return { patientId: p.id, userId: p.userId };
                }
            }));
            const adherenceRates = summaries
                .map((s) => s.adherenceRate ?? 0)
                .filter((r) => r > 0);
            const averageAdherence = adherenceRates.length > 0
                ? Math.round(adherenceRates.reduce((a, b) => a + b, 0) / adherenceRates.length)
                : 0;
            return (0, response_1.ok)(res, {
                totalPatients,
                activePlans,
                averageAdherence,
                summaries,
            });
        }
        catch (e) {
            return (0, response_1.fail)(res, e instanceof Error ? e.message : "Error", 500);
        }
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=DashboardController.js.map