"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealPlannerController = void 0;
const mexinutriClient_1 = require("../../../../shared/infrastructure/http/mexinutriClient");
const response_1 = require("../../../../shared/utils/response");
const mapFoodItem = (item) => ({
    name: item.name,
    calories: Math.round(item.calories ?? 0),
    protein: Number((item.protein ?? 0).toFixed(1)),
    carbs: Number((item.carbs ?? 0).toFixed(1)),
    fat: Number((item.fat ?? 0).toFixed(1)),
    portion: item.baseAmount ?? '100 g',
    imageUrl: item.imageUrl ?? null,
});
class MealPlannerController {
    static async searchFood(req, res) {
        try {
            const query = String(req.query.query ?? req.query.q ?? "");
            if (!query.trim())
                return (0, response_1.ok)(res, []);
            const results = await mexinutriClient_1.mexiNutriClient.search(query.trim());
            const foods = results.map((r) => ({
                name: r.name,
                calories: Math.round(r.calories ?? (r.nutrition?.calories ?? 0)),
                protein: Number((r.protein ?? (r.nutrition?.protein ?? 0)).toFixed(1)),
                carbs: Number((r.carbs ?? (r.nutrition?.carbs ?? 0)).toFixed(1)),
                fat: Number((r.fat ?? (r.nutrition?.fat ?? 0)).toFixed(1)),
                portion: r.baseAmount ?? '100 g',
                imageUrl: r.imageUrl ?? null,
                sourceUrl: null,
                healthLabels: r.tags ?? [],
                dietLabels: [],
            }));
            return (0, response_1.ok)(res, foods);
        }
        catch (e) {
            return (0, response_1.fail)(res, e instanceof Error ? e.message : "Error al buscar alimentos", 500);
        }
    }
    static async generateSuggested(req, res) {
        try {
            const caloriesTarget = Number(req.body.caloriesTarget ?? req.body.targetCalories ?? 2000);
            const numberOfMeals = Number(req.body.numberOfMeals ?? 3);
            const plan = await mexinutriClient_1.mexiNutriClient.generateMealPlan(caloriesTarget, numberOfMeals);
            const meals = plan.meals.map((meal) => ({
                name: meal.name,
                items: meal.items.map((item) => ({
                    name: item.name,
                    calories: Math.round(item.calories),
                    protein: Number(item.protein.toFixed(1)),
                    carbs: Number(item.carbs.toFixed(1)),
                    fat: Number(item.fat.toFixed(1)),
                    portion: item.portion,
                    imageUrl: item.imageUrl ?? null,
                })),
            }));
            return (0, response_1.ok)(res, { meals, totalCalories: plan.totalCalories });
        }
        catch (e) {
            return (0, response_1.fail)(res, e instanceof Error ? e.message : "Error al generar plan sugerido", 500);
        }
    }
    static async calculateItem(req, res) {
        try {
            const { name, portion, calories, protein, carbs, fat, grams } = req.body;
            const portionGrams = portion ? parseInt(portion.match(/(\d+)\s*g/i)?.[1] ?? "100") : 100;
            const factor = grams / portionGrams;
            return (0, response_1.ok)(res, {
                foodName: name,
                quantity: grams,
                unit: 'g',
                portion: `${grams} g`,
                calories: Math.round(calories * factor),
                protein: Number((protein * factor).toFixed(1)),
                carbs: Number((carbs * factor).toFixed(1)),
                fat: Number((fat * factor).toFixed(1)),
            });
        }
        catch (e) {
            return (0, response_1.fail)(res, e instanceof Error ? e.message : "Error al calcular el item", 500);
        }
    }
}
exports.MealPlannerController = MealPlannerController;
//# sourceMappingURL=mealPlannerController.js.map