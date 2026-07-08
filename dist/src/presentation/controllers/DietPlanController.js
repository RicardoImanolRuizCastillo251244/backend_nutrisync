"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DietPlanController = void 0;
const GenerateSuggestedDietPlanUseCase_1 = require("../../core/use-cases/diet-plans/GenerateSuggestedDietPlanUseCase");
const EdamamApiClient_1 = require("../../infrastructure/external-apis/EdamamApiClient");
const response_1 = require("../../shared/utils/response");
const edamamClient = new EdamamApiClient_1.EdamamApiClient();
const generateUseCase = new GenerateSuggestedDietPlanUseCase_1.GenerateSuggestedDietPlanUseCase(edamamClient);
class DietPlanController {
    static async generateSuggested(req, res) {
        const result = await generateUseCase.execute({ caloriesTarget: req.body.caloriesTarget });
        return (0, response_1.ok)(res, result);
    }
    static async searchFood(req, res) {
        const query = String(req.query.query ?? "");
        const foods = await edamamClient.searchFood(query);
        return (0, response_1.ok)(res, foods);
    }
}
exports.DietPlanController = DietPlanController;
//# sourceMappingURL=DietPlanController.js.map