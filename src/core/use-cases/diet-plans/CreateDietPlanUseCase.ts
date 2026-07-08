import type { DietPlanRepository, CreateDietPlanInput } from "../../repositories/DietPlanRepository";

interface MealItemInput {
  name: string;
  portion?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  edamamRecipeUrl?: string;
  imageUrl?: string;
  healthLabels?: string[];
  dietLabels?: string[];
}

interface MealInput {
  name: string;
  note?: string;
  items: MealItemInput[];
}

interface DayInput {
  dayNumber: number;
  meals: MealInput[];
}

interface Input {
  nutritionistUserId: string;
  name: string;
  notes?: string;
  days: DayInput[];
}

export class CreateDietPlanUseCase {
  constructor(private readonly repository: DietPlanRepository) {}

  async execute(input: Input) {
    const payload: CreateDietPlanInput = {
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