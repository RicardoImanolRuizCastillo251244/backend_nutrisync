"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDietPlanUseCase = void 0;
class CreateDietPlanUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        const payload = {
            nutritionistUserId: input.nutritionistUserId,
            name: input.name,
            ...(input.notes ? { notes: input.notes } : {}),
            days: input.days.map((day) => ({
                dayNumber: day.dayNumber,
                meals: day.meals.map((meal) => ({
                    name: meal.name,
                    ...(meal.note ? { note: meal.note } : {}),
                    items: meal.items.map((item) => ({
                        name: item.name,
                        ...(item.portion ? { portion: item.portion } : {}),
                        ...(item.calories ? { calories: item.calories } : {}),
                        ...(item.protein ? { protein: item.protein } : {}),
                        ...(item.carbs ? { carbs: item.carbs } : {}),
                        ...(item.fat ? { fat: item.fat } : {}),
                        ...(item.edamamRecipeUrl ? { edamamRecipeUrl: item.edamamRecipeUrl } : {}),
                        ...(item.imageUrl ? { imageUrl: item.imageUrl } : {}),
                        healthLabels: item.healthLabels ?? [],
                        dietLabels: item.dietLabels ?? [],
                    })),
                })),
            })),
        };
        return this.repository.create(payload);
    }
}
exports.CreateDietPlanUseCase = CreateDietPlanUseCase;
//# sourceMappingURL=CreateDietPlanUseCase.js.map