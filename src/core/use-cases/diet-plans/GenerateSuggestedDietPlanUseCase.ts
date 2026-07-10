import type { EdamamRepository } from "../../repositories/EdamamRepository";

interface Input {
  caloriesTarget: number;
}

const DISTRIBUTION = [
  { meal: "Desayuno", pct: 0.2, edamamMealType: "Breakfast" },
  { meal: "Comida", pct: 0.35, edamamMealType: "Lunch" },
  { meal: "Cena", pct: 0.25, edamamMealType: "Dinner" },
  { meal: "Colacion", pct: 0.2, edamamMealType: "Snack" },
] as const;

export class GenerateSuggestedDietPlanUseCase {
  constructor(private readonly edamamRepository: EdamamRepository) {}

  async execute(input: Input) {
    const randomSeed = Math.floor(Math.random() * 10_000);
    const meals = [];

    for (const slot of DISTRIBUTION) {
      const slotCalories = Math.round(input.caloriesTarget * slot.pct);

      // Delay 600ms entre llamadas para respetar el rate limit de Edamam (plan gratuito)
      if (meals.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      let recipes;
      try {
        recipes = await this.edamamRepository.searchRecipes({
          mealType: slot.edamamMealType,
          targetCalories: slotCalories,
          tolerance: 120,
          randomSeed: randomSeed + meals.length,
        });
      } catch {
        // Si falla una llamada, continuamos con las demás
        meals.push({ name: slot.meal, items: [] });
        continue;
      }

      const selected = recipes[0];
      if (!selected) {
        meals.push({ name: slot.meal, items: [] });
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
