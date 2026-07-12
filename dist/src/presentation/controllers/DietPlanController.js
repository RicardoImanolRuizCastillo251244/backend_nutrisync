"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DietPlanController = void 0;
const GenerateSuggestedDietPlanUseCase_1 = require("../../core/use-cases/diet-plans/GenerateSuggestedDietPlanUseCase");
const EdamamApiClient_1 = require("../../infrastructure/external-apis/EdamamApiClient");
const PrismaPatientPlanAssignmentRepository_1 = require("../../infrastructure/repositories/PrismaPatientPlanAssignmentRepository");
const PrismaDietPlanRepository_1 = require("../../infrastructure/repositories/PrismaDietPlanRepository");
const response_1 = require("../../shared/utils/response");
const edamamClient = new EdamamApiClient_1.EdamamApiClient();
const generateUseCase = new GenerateSuggestedDietPlanUseCase_1.GenerateSuggestedDietPlanUseCase(edamamClient);
const assignmentRepository = new PrismaPatientPlanAssignmentRepository_1.PrismaPatientPlanAssignmentRepository();
const dietPlanRepository = new PrismaDietPlanRepository_1.PrismaDietPlanRepository();
class DietPlanController {
    static async generateSuggested(req, res) {
        try {
            const result = await generateUseCase.execute({ caloriesTarget: req.body.caloriesTarget });
            return (0, response_1.ok)(res, result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al generar plan sugerido";
            return (0, response_1.fail)(res, message, 502);
        }
    }
    static async calculateItem(req, res) {
        const { name, portion, calories, protein, carbs, fat, grams } = req.body;
        // Extraer gramos de referencia de la porción (ej: "100g" → 100, "1 serving" → 100)
        const refMatch = String(portion ?? "").match(/(\d+)\s*g/i);
        const refGrams = refMatch ? Number(refMatch[1]) : 100;
        const factor = Math.max(0, Number(grams)) / refGrams;
        return (0, response_1.ok)(res, {
            foodName: String(name ?? ""),
            quantity: Number(grams),
            unit: "g",
            portion: String(portion ?? `${grams} g`),
            calories: Math.round(Number(calories ?? 0) * factor),
            protein: Number((Number(protein ?? 0) * factor).toFixed(1)),
            carbs: Number((Number(carbs ?? 0) * factor).toFixed(1)),
            fat: Number((Number(fat ?? 0) * factor).toFixed(1)),
        });
    }
    static async getMyPlan(req, res) {
        const patientId = req.user.patientId;
        if (!patientId) {
            return (0, response_1.fail)(res, "No tienes un perfil de paciente asociado", 403);
        }
        try {
            const assignment = await assignmentRepository.findActiveByPatient(patientId);
            if (!assignment) {
                return (0, response_1.ok)(res, null);
            }
            // Cargar el plan completo usando el nutritionistUserId de la asignación
            const plan = await dietPlanRepository.getById(assignment.planId, assignment.nutritionistUserId);
            if (!plan) {
                return (0, response_1.ok)(res, null);
            }
            return (0, response_1.ok)(res, plan);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al obtener plan";
            return (0, response_1.fail)(res, message, 502);
        }
    }
    static async searchFood(req, res) {
        try {
            const query = String(req.query.query ?? "");
            const foods = await edamamClient.searchFood(query);
            return (0, response_1.ok)(res, foods);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al buscar alimentos";
            return (0, response_1.fail)(res, message, 502);
        }
    }
}
exports.DietPlanController = DietPlanController;
//# sourceMappingURL=DietPlanController.js.map