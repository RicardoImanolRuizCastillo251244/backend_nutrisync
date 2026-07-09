import type { EdamamRepository, SuggestedMealItem } from "../../core/repositories/EdamamRepository";
import { env } from "../../shared/config/env";

interface EdamamHit {
  recipe: {
    label: string;
    image?: string;
    calories: number;
    totalNutrients?: Record<string, { quantity: number }>;
    healthLabels?: string[];
    dietLabels?: string[];
    url?: string;
  };
}

export class EdamamApiClient implements EdamamRepository {
  private buildRecipeUrl(params: { mealType: string; targetCalories: number; tolerance: number; randomSeed?: number }) {
    const minCalories = Math.max(50, Math.floor(params.targetCalories - params.tolerance));
    const maxCalories = Math.max(minCalories + 10, Math.ceil(params.targetCalories + params.tolerance));
    const query = new URLSearchParams({
      type: "public",
      app_id: env.EDAMAM_RECIPE_APP_ID,
      app_key: env.EDAMAM_RECIPE_APP_KEY,
      mealType: params.mealType,
      calories: `${minCalories}-${maxCalories}`,
      random: "true",
    });

    if (params.randomSeed !== undefined) {
      query.set("co2EmissionsClass", params.randomSeed % 2 === 0 ? "A+" : "A");
    }

    return `${env.EDAMAM_BASE_URL}/api/recipes/v2?${query.toString()}`;
  }

  private mapHit(hit: EdamamHit): SuggestedMealItem {
    const nutrients = hit.recipe.totalNutrients ?? {};
    return {
      name: hit.recipe.label,
      calories: Math.round(hit.recipe.calories),
      protein: Number((nutrients.PROCNT?.quantity ?? 0).toFixed(2)),
      carbs: Number((nutrients.CHOCDF?.quantity ?? 0).toFixed(2)),
      fat: Number((nutrients.FAT?.quantity ?? 0).toFixed(2)),
      healthLabels: hit.recipe.healthLabels ?? [],
      dietLabels: hit.recipe.dietLabels ?? [],
      portion: "1 serving",
      ...(hit.recipe.image ? { imageUrl: hit.recipe.image } : {}),
      ...(hit.recipe.url ? { sourceUrl: hit.recipe.url } : {}),
    };
  }

  async searchRecipes(params: { mealType: string; targetCalories: number; tolerance: number; randomSeed?: number; }): Promise<SuggestedMealItem[]> {
    const response = await fetch(this.buildRecipeUrl(params), { method: "GET" });

    if (response.status === 429) {
      throw new Error("Edamam rate limit reached");
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Edamam request failed (${response.status}): ${text}`);
    }

    const payload = (await response.json()) as { hits?: EdamamHit[] };
    return (payload.hits ?? []).map((hit) => this.mapHit(hit));
  }

  async searchFood(query: string): Promise<SuggestedMealItem[]> {
    const qs = new URLSearchParams({
      app_id: env.EDAMAM_FOOD_APP_ID,
      app_key: env.EDAMAM_FOOD_APP_KEY,
      ingr: query,
      "nutrition-type": "logging",
    });

    const response = await fetch(`${env.EDAMAM_BASE_URL}/api/food-database/v2/parser?${qs.toString()}`);

    if (!response.ok) {
      throw new Error(`Edamam food request failed (${response.status})`);
    }

    const payload = (await response.json()) as {
      hints?: Array<{
        food: {
          label: string;
          image?: string;
          nutrients?: {
            ENERC_KCAL?: number;
            PROCNT?: number;
            CHOCDF?: number;
            FAT?: number;
          };
        };
      }>;
    };

    return (payload.hints ?? []).slice(0, 10).map((hint) => ({
      name: hint.food.label,
      calories: Math.round(hint.food.nutrients?.ENERC_KCAL ?? 0),
      protein: Number((hint.food.nutrients?.PROCNT ?? 0).toFixed(2)),
      carbs: Number((hint.food.nutrients?.CHOCDF ?? 0).toFixed(2)),
      fat: Number((hint.food.nutrients?.FAT ?? 0).toFixed(2)),
      healthLabels: [],
      dietLabels: [],
      portion: "100 g",
      ...(hint.food.image ? { imageUrl: hint.food.image } : {}),
    }));
  }
}
