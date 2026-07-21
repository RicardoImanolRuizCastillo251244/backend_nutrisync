import type { DietPlanRepository, CreateDietPlanInput } from "@/modules/diet-plans/domain/ports/repositories/DietPlanRepository";

interface Input {
  nutritionistUserId: string;
  name: string;
  notes?: string;
  days: Array<{
    dayNumber: number;
    meals: Array<{
      name: string;
      note?: string;
      items: Array<{
        name: string;
        portion?: string;
        calories?: number;
        protein?: number;
        carbs?: number;
        fat?: number;
        type?: string;
        edamamRecipeUrl?: string;
        imageUrl?: string;
        healthLabels?: string[];
        dietLabels?: string[];
        ingredients?: unknown;
      }>;
    }>;
  }>;
}

export class CreateDietPlanUseCase {
  constructor(private readonly repository: DietPlanRepository) {}

  async execute(input: Input) {
    const payload: CreateDietPlanInput = {
      nutritionistUserId: input.nutritionistUserId,
      name: input.name,
      ...(input.notes ? { notes: input.notes } : {}),
      days: input.days.map(day => ({
        dayNumber: day.dayNumber,
        meals: day.meals.map(meal => ({
          name: meal.name,
          ...(meal.note ? { note: meal.note } : {}),
          items: meal.items.map(item => ({
            name: item.name,
            ...(item.portion ? { portion: item.portion } : {}),
            ...(item.calories ? { calories: item.calories } : {}),
            ...(item.protein ? { protein: item.protein } : {}),
            ...(item.carbs ? { carbs: item.carbs } : {}),
            ...(item.fat ? { fat: item.fat } : {}),
            ...(item.type ? { type: item.type } : {}),
            ...(item.edamamRecipeUrl ? { edamamRecipeUrl: item.edamamRecipeUrl } : {}),
            ...(item.imageUrl ? { imageUrl: item.imageUrl } : {}),
            ...(item.ingredients != null ? { ingredients: item.ingredients } : {}),
            healthLabels: item.healthLabels ?? [],
            dietLabels: item.dietLabels ?? [],
          })),
        })),
      })),
    };
    return this.repository.create(payload);
  }
}