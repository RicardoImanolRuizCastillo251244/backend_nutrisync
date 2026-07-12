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

// ── Meal Planner API types ──────────────────────────────────────

interface EnergyFit {
  min: number;
  max: number;
}

interface EnergyParam {
  energy: {
    fit: EnergyFit;
  };
}

interface MealPlanBody {
  size: number;
  plan: {
    accept: {
      all: EnergyParam[];
    };
  };
}

interface MealPlanDay {
  day: number;
  sections: Record<string, {
    assigned: string;
    _recipe?: {
      uri: string;
      label: string;
      image?: string;
      calories: number;
      totalNutrients?: Record<string, { quantity: number }>;
      healthLabels?: string[];
      dietLabels?: string[];
      url?: string;
    };
  }>;
}

interface MealPlanResponse {
  selection?: MealPlanDay[];
  status?: string;
}

interface CachedRecipesEntry {
  expiresAt: number;
  items: SuggestedMealItem[];
}

// ── Mapper ───────────────────────────────────────────────────────

function mapMealPlanDay(day: MealPlanDay) {
  const meals: Array<{ name: string; items: SuggestedMealItem[] }> = [];

  // Solo 3 comidas fijas: Desayuno, Comida, Cena
  const sectionMap: Record<string, string> = {
    Breakfast: "Desayuno",
    Lunch: "Comida",
    Dinner: "Cena",
  };

  for (const [sectionName, sectionData] of Object.entries(day.sections ?? {})) {
    const recipe = sectionData._recipe;
    if (!recipe) continue;

    // Ignorar secciones que no sean Breakfast, Lunch o Dinner
    const mealName = sectionMap[sectionName];
    if (!mealName) continue;

    const nutrients = recipe.totalNutrients ?? {};
    const item: SuggestedMealItem = {
      name: recipe.label,
      calories: Math.round(recipe.calories),
      protein: Number((nutrients.PROCNT?.quantity ?? 0).toFixed(2)),
      carbs: Number((nutrients.CHOCDF?.quantity ?? 0).toFixed(2)),
      fat: Number((nutrients.FAT?.quantity ?? 0).toFixed(2)),
      healthLabels: recipe.healthLabels ?? [],
      dietLabels: recipe.dietLabels ?? [],
      portion: "1 serving",
      ...(recipe.image ? { imageUrl: recipe.image } : {}),
      ...(recipe.url ? { sourceUrl: recipe.url } : {}),
    };

    meals.push({ name: mealName, items: [item] });
  }

  return meals;
}

export class EdamamApiClient implements EdamamRepository {
  private static readonly RECIPE_CACHE_TTL_MS = 5 * 60 * 1000;
  private static readonly recipeCache = new Map<string, CachedRecipesEntry>();

  private buildRecipeCacheKey(params: {
    mealType: string;
    targetCalories: number;
    tolerance: number;
  }) {
    return [params.mealType, params.targetCalories, params.tolerance].join(":");
  }

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
    const cacheKey = this.buildRecipeCacheKey(params);
    const cached = EdamamApiClient.recipeCache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.items.map((item) => ({ ...item }));
    }

    const response = await fetch(this.buildRecipeUrl(params), { method: "GET" });

    if (response.status === 429) {
      throw new Error("Edamam rate limit reached");
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Edamam request failed (${response.status}): ${text}`);
    }

    const payload = (await response.json()) as { hits?: EdamamHit[] };
    const items = (payload.hits ?? []).map((hit) => this.mapHit(hit));

    EdamamApiClient.recipeCache.set(cacheKey, {
      expiresAt: Date.now() + EdamamApiClient.RECIPE_CACHE_TTL_MS,
      items,
    });

    return items.map((item) => ({ ...item }));
  }

  async searchMealPlan(caloriesTarget: number, days: number = 1) {
    const minCal = Math.max(50, caloriesTarget - 50);
    const maxCal = caloriesTarget + 50;

    const body: MealPlanBody = {
      size: days,
      plan: {
        accept: {
          all: [
            {
              energy: {
                fit: {
                  min: minCal,
                  max: maxCal,
                },
              },
            },
          ],
        },
      },
    };

    const qs = new URLSearchParams({
      type: "public",
      beta: "true",
      options: "defaults",
    });

    const url = `${env.EDAMAM_BASE_URL}/api/meal-planner/v1/${env.EDAMAM_RECIPE_APP_ID}/select?${qs.toString()}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Edamam-Account-User": env.EDAMAM_MEAL_PLANNER_ACCOUNT_USER,
      },
      body: JSON.stringify(body),
    });

    if (response.status === 429) {
      throw new Error("Edamam rate limit reached");
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Edamam meal planner failed (${response.status}): ${text}`);
    }

    const payload = (await response.json()) as MealPlanResponse;

    if (!payload.selection || payload.selection.length === 0) {
      return [];
    }

    return payload.selection.map((day) => mapMealPlanDay(day));
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
