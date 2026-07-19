"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const PrismaPatientRepository_1 = require("../../../../modules/patients/infrastructure/repositories/PrismaPatientRepository");
const PrismaAdherenceRepository_1 = require("../../../../modules/adherence/infrastructure/repositories/PrismaAdherenceRepository");
const prisma_1 = require("../../../../shared/infrastructure/database/prisma");
const response_1 = require("../../../../shared/utils/response");
const patientRepo = new PrismaPatientRepository_1.PrismaPatientRepository();
const adherenceRepo = new PrismaAdherenceRepository_1.PrismaAdherenceRepository();
class DashboardController {
    static async getNutritionistDashboard(req, res) {
        try {
            const nutritionistUserId = req.user.userId;
            const rangeDays = parseInt(req.query.range, 10) || 1;
            // Calcular fecha "from" según el rango
            const now = new Date();
            let from;
            let to;
            if (rangeDays > 0) {
                from = new Date();
                from.setDate(from.getDate() - Math.max(0, rangeDays - 1));
                from.setHours(0, 0, 0, 0);
                to = new Date();
                to.setHours(23, 59, 59, 999);
            }
            // rangeDays <= 0 significa "desde siempre" — sin filtro de fecha
            // Pacientes totales
            const patients = await patientRepo.listByNutritionist(nutritionistUserId);
            const totalPatients = patients.length;
            // Planes activos
            const activePlans = await prisma_1.prisma.dietPlan.count({
                where: { nutritionistUserId, deletedAt: null },
            });
            // Adherencia por paciente en el rango seleccionado
            const patientAdherenceData = [];
            for (const p of patients) {
                try {
                    const summary = from
                        ? await adherenceRepo.getSummaryInRange(p.userId, from, to)
                        : await adherenceRepo.getSummary(p.userId);
                    patientAdherenceData.push({
                        patientId: p.id,
                        patientName: p.user?.name ?? 'Sin nombre',
                        adherence: Math.round((summary.adherenceRate ?? 0) * 100),
                        mealsCompleted: summary.mealsCompleted ?? 0,
                        mealsLogged: summary.mealsLogged ?? 0,
                    });
                }
                catch {
                    patientAdherenceData.push({
                        patientId: p.id,
                        patientName: p.user?.name ?? 'Sin nombre',
                        adherence: 0,
                        mealsCompleted: 0,
                        mealsLogged: 0,
                    });
                }
            }
            // Adherencia promedio (solo pacientes con datos)
            const ratesWithData = patientAdherenceData
                .filter((p) => p.mealsLogged > 0)
                .map((p) => p.adherence);
            const averageAdherence = ratesWithData.length > 0
                ? Math.round(ratesWithData.reduce((a, b) => a + b, 0) / ratesWithData.length)
                : 0;
            return (0, response_1.ok)(res, {
                totalPatients,
                activePlans,
                averageAdherence,
                patientAdherence: patientAdherenceData,
                range: rangeDays,
            });
        }
        catch (e) {
            return (0, response_1.fail)(res, e instanceof Error ? e.message : "Error", 500);
        }
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=DashboardController.js.map