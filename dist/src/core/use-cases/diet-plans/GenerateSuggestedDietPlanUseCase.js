"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateSuggestedDietPlanUseCase = void 0;
const DISTRIBUTION = [
    { meal: "Desayuno", pct: 0.2, edamamMealType: "Breakfast" },
    { meal: "Comida", pct: 0.35, edamamMealType: "Lunch" },
    { meal: "Cena", pct: 0.25, edamamMealType: "Dinner" },
    { meal: "Colacion", pct: 0.2, edamamMealType: "Snack" },
];
class GenerateSuggestedDietPlanUseCase {
    constructor(edamamRepository) {
        this.edamamRepository = edamamRepository;
    }
    async execute(input) {
        const meals = [];
        for (const slot of DISTRIBUTION) {
            const slotCalories = Math.round(input.caloriesTarget * slot.pct);
            const recipes = await this.edamamRepository.searchRecipes({
                mealType: slot.edamamMealType,
                targetCalories: slotCalories,
                tolerance: 120,
            });
            const selected = recipes[0];
            if (!selected) {
                meals.push({
                    name: slot.meal,
                    items: [],
                });
                continue;
            }
            meals.push({
                name: slot.meal,
                items: [
                    {
                        name: selected.name,
                        portion: selected.portion,
                        calories: selected.calories,
                        protein: selected.protein,
                        carbs: selected.carbs,
                        fat: selected.fat,
                        imageUrl: selected.imageUrl,
                        sourceUrl: selected.sourceUrl,
                        healthLabels: selected.healthLabels,
                        dietLabels: selected.dietLabels,
                    },
                ],
            });
        }
        return {
            caloriesTarget: input.caloriesTarget,
            generatedAt: new Date().toISOString(),
            meals,
        };
    }
}
exports.GenerateSuggestedDietPlanUseCase = GenerateSuggestedDietPlanUseCase;
//# sourceMappingURL=GenerateSuggestedDietPlanUseCase.js.map