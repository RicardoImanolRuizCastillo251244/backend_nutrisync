"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const PrismaPatientRepository_1 = require("../../../../modules/patients/infrastructure/repositories/PrismaPatientRepository");
const PrismaAdherenceRepository_1 = require("../../../../modules/adherence/infrastructure/repositories/PrismaAdherenceRepository");
const response_1 = require("../../../../shared/utils/response");
const patientRepo = new PrismaPatientRepository_1.PrismaPatientRepository();
const adherenceRepo = new PrismaAdherenceRepository_1.PrismaAdherenceRepository();
class DashboardController {
    static async getNutritionistDashboard(req, res) {
        try {
            const patients = await patientRepo.listByNutritionist(req.user.userId);
            const summaries = await Promise.all(patients.slice(0, 20).map(async (p) => {
                try {
                    const summary = await adherenceRepo.getSummary(p.userId);
                    return { patientId: p.id, userId: p.userId, ...summary };
                }
                catch {
                    return { patientId: p.id, userId: p.userId };
                }
            }));
            return (0, response_1.ok)(res, { totalPatients: patients.length, summaries });
        }
        catch (e) {
            return (0, response_1.fail)(res, e instanceof Error ? e.message : "Error", 500);
        }
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=DashboardController.js.map