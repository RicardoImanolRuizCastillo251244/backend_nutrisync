"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDietPlanUseCase = void 0;
class UpdateDietPlanUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        const existing = await this.repository.getById(input.id, input.nutritionistUserId);
        if (!existing)
            return null;
        const updates = {};
        if (input.name !== undefined)
            updates.name = input.name;
        if (input.notes !== undefined)
            updates.notes = input.notes;
        if (input.isActive !== undefined)
            updates.isActive = input.isActive;
        if (input.days) {
            updates.days = input.days.map((day) => ({
                ...(day.id ? { id: day.id } : {}),
                ...(day.dayNumber !== undefined ? { dayNumber: day.dayNumber } : {}),
                ...(day.meals
                    ? {
                        meals: day.meals.map((meal) => ({
                            ...(meal.id ? { id: meal.id } : {}),
                            ...(meal.name !== undefined ? { name: meal.name } : {}),
                            ...(meal.note !== undefined ? { note: meal.note } : {}),
                            ...(meal.items
                                ? {
                                    items: meal.items.map((item) => ({
                                        ...(item.id ? { id: item.id } : {}),
                                        ...(item.name !== undefined ? { name: item.name } : {}),
                                        ...(item.portion !== undefined ? { portion: item.portion } : {}),
                                        ...(item.calories !== undefined ? { calories: item.calories } : {}),
                                        ...(item.protein !== undefined ? { protein: item.protein } : {}),
                                        ...(item.carbs !== undefined ? { carbs: item.carbs } : {}),
                                        ...(item.fat !== undefined ? { fat: item.fat } : {}),
                                        ...(item.edamamRecipeUrl !== undefined
                                            ? { edamamRecipeUrl: item.edamamRecipeUrl }
                                            : {}),
                                        ...(item.imageUrl !== undefined ? { imageUrl: item.imageUrl } : {}),
                                        ...(item.healthLabels !== undefined
                                            ? { healthLabels: item.healthLabels }
                                            : {}),
                                        ...(item.dietLabels !== undefined
                                            ? { dietLabels: item.dietLabels }
                                            : {}),
                                    })),
                                }
                                : {}),
                        })),
                    }
                    : {}),
            }));
        }
        return this.repository.update(input.id, input.nutritionistUserId, updates);
    }
}
exports.UpdateDietPlanUseCase = UpdateDietPlanUseCase;
//# sourceMappingURL=UpdateDietPlanUseCase.js.map