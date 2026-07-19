import type { Request, Response } from "express";
import { mexiNutriClient } from "@/shared/infrastructure/http/mexinutriClient";
import { ok, fail } from "@/shared/utils/response";

const mapFoodItem = (item: {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  unit?: string;
  baseAmount?: string;
  name: string;
  imageUrl?: string | null;
}) => ({
  name: item.name,
  calories: Math.round(item.calories ?? 0),
  protein: Number((item.protein ?? 0).toFixed(1)),
  carbs: Number((item.carbs ?? 0).toFixed(1)),
  fat: Number((item.fat ?? 0).toFixed(1)),
  portion: item.baseAmount ?? '100 g',
  imageUrl: item.imageUrl ?? null,
});

export class MealPlannerController {
  static async searchFood(req: Request, res: Response) {
    try {
      const query = String(req.query.query ?? req.query.q ?? "");
      if (!query.trim()) return ok(res, []);

      const results = await mexiNutriClient.search(query.trim());
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
        type: (r as any).type ?? null,
        ingredients: (r as any).ingredients ?? null,
        description: (r as any).description ?? '',
      }));

      return ok(res, foods);
    } catch (e) {
      return fail(res, e instanceof Error ? e.message : "Error al buscar alimentos", 500);
    }
  }

  static async generateSuggested(req: Request, res: Response) {
    try {
      const caloriesTarget = Number(req.body.caloriesTarget ?? req.body.targetCalories ?? 2000);
      const numberOfMeals = Number(req.body.numberOfMeals ?? 3);

      const plan = await mexiNutriClient.generateMealPlan(caloriesTarget, numberOfMeals);

      const meals = plan.meals.map((meal) => {
        const totalCalories = Math.round(meal.nutrition.calories);
        const ingredientsText = meal.ingredients
          .map((i) => `${i.name} (${i.quantity}${i.unit === 'pieza' ? ' pzas' : 'g'})`)
          .join(', ');
        return {
          name: meal.name,
          totalCalories,
          ingredients: ingredientsText,
          items: [
            {
              name: meal.name,
              calories: totalCalories,
              protein: Number(meal.nutrition.protein.toFixed(1)),
              carbs: Number(meal.nutrition.carbs.toFixed(1)),
              fat: Number(meal.nutrition.fat.toFixed(1)),
              portion: '1 platillo',
              imageUrl: meal.imageUrl ?? null,
            },
          ],
        };
      });

      return ok(res, { meals, totalCalories: plan.total.calories });
    } catch (e) {
      return fail(res, e instanceof Error ? e.message : "Error al generar plan sugerido", 500);
    }
  }

  static async calculateItem(req: Request, res: Response) {
    try {
      const { name, portion, calories, protein, carbs, fat, grams } = req.body;
      const portionGrams = portion ? parseInt(portion.match(/(\d+)\s*g/i)?.[1] ?? "100") : 100;
      const factor = grams / portionGrams;

      return ok(res, {
        foodName: name,
        quantity: grams,
        unit: 'g',
        portion: `${grams} g`,
        calories: Math.round(calories * factor),
        protein: Number((protein * factor).toFixed(1)),
        carbs: Number((carbs * factor).toFixed(1)),
        fat: Number((fat * factor).toFixed(1)),
      });
    } catch (e) {
      return fail(res, e instanceof Error ? e.message : "Error al calcular el item", 500);
    }
  }
}