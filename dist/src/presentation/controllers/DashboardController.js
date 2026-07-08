"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const GetNutritionistDashboardUseCase_1 = require("../../core/use-cases/dashboard/GetNutritionistDashboardUseCase");
const PrismaAdherenceRepository_1 = require("../../infrastructure/repositories/PrismaAdherenceRepository");
const response_1 = require("../../shared/utils/response");
const adherenceRepository = new PrismaAdherenceRepository_1.PrismaAdherenceRepository();
const dashboardUseCase = new GetNutritionistDashboardUseCase_1.GetNutritionistDashboardUseCase(adherenceRepository);
class DashboardController {
    static async get(req, res) {
        const result = await dashboardUseCase.execute(req.user.userId);
        return (0, response_1.ok)(res, result);
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=DashboardController.js.map