"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdamamApiClient = void 0;
const env_1 = require("../../shared/config/env");
// ── Mapper ───────────────────────────────────────────────────────
function mapMealPlanDay(day) {
    const meals = [];
    for (const [sectionName, sectionData] of Object.entries(day.sections ?? {})) {
        const recipe = sectionData._recipe;
        if (!recipe)
            continue;
        const nutrients = recipe.totalNutrients ?? {};
        const item = {
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
        meals.push({ name: sectionName, items: [item] });
    }
    return meals;
}
class EdamamApiClient {
    buildRecipeUrl(params) {
        const minCalories = Math.max(50, Math.floor(params.targetCalories - params.tolerance));
        const maxCalories = Math.max(minCalories + 10, Math.ceil(params.targetCalories + params.tolerance));
        const query = new URLSearchParams({
            type: "public",
            app_id: env_1.env.EDAMAM_RECIPE_APP_ID,
            app_key: env_1.env.EDAMAM_RECIPE_APP_KEY,
            mealType: params.mealType,
            calories: `${minCalories}-${maxCalories}`,
            random: "true",
        });
        if (params.randomSeed !== undefined) {
            query.set("co2EmissionsClass", params.randomSeed % 2 === 0 ? "A+" : "A");
        }
        return `${env_1.env.EDAMAM_BASE_URL}/api/recipes/v2?${query.toString()}`;
    }
    mapHit(hit) {
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
    async searchRecipes(params) {
        const response = await fetch(this.buildRecipeUrl(params), { method: "GET" });
        if (response.status === 429) {
            throw new Error("Edamam rate limit reached");
        }
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Edamam request failed (${response.status}): ${text}`);
        }
        const payload = (await response.json());
        return (payload.hits ?? []).map((hit) => this.mapHit(hit));
    }
    async searchMealPlan(caloriesTarget, days = 1) {
        const minCal = Math.max(50, caloriesTarget - 50);
        const maxCal = caloriesTarget + 50;
        const body = {
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
        const url = `${env_1.env.EDAMAM_BASE_URL}/api/meal-planner/v1/${env_1.env.EDAMAM_RECIPE_APP_ID}/select?${qs.toString()}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Edamam-Account-User": env_1.env.EDAMAM_MEAL_PLANNER_ACCOUNT_USER,
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
        const payload = (await response.json());
        if (!payload.selection || payload.selection.length === 0) {
            return [];
        }
        return payload.selection.map((day) => mapMealPlanDay(day));
    }
    async searchFood(query) {
        const qs = new URLSearchParams({
            app_id: env_1.env.EDAMAM_FOOD_APP_ID,
            app_key: env_1.env.EDAMAM_FOOD_APP_KEY,
            ingr: query,
            "nutrition-type": "logging",
        });
        const response = await fetch(`${env_1.env.EDAMAM_BASE_URL}/api/food-database/v2/parser?${qs.toString()}`);
        if (!response.ok) {
            throw new Error(`Edamam food request failed (${response.status})`);
        }
        const payload = (await response.json());
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
exports.EdamamApiClient = EdamamApiClient;
//# sourceMappingURL=EdamamApiClient.js.map