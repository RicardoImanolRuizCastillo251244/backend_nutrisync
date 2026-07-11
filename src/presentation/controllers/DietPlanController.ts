import type { Request, Response } from "express";
import { GenerateSuggestedDietPlanUseCase } from "../../core/use-cases/diet-plans/GenerateSuggestedDietPlanUseCase";
import { EdamamApiClient } from "../../infrastructure/external-apis/EdamamApiClient";
import { ok, fail } from "../../shared/utils/response";

const edamamClient = new EdamamApiClient();
const generateUseCase = new GenerateSuggestedDietPlanUseCase(edamamClient);

export class DietPlanController {
  static async generateSuggested(req: Request, res: Response) {
    try {
      const result = await generateUseCase.execute({ caloriesTarget: req.body.caloriesTarget });
      return ok(res, result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al generar plan sugerido";
      return fail(res, message, 502);
    }
  }

  static async calculateItem(req: Request, res: Response) {
    const { name, portion, calories, protein, carbs, fat, grams } = req.body;

    // Extraer gramos de referencia de la porción (ej: "100g" → 100, "1 serving" → 100)
    const refMatch = String(portion ?? "").match(/(\d+)\s*g/i);
    const refGrams = refMatch ? Number(refMatch[1]) : 100;

    const factor = Math.max(0, Number(grams)) / refGrams;

    return ok(res, {
      foodName: String(name ?? ""),
      quantity: Number(grams),
      unit: "g" as const,
      portion: String(portion ?? `${grams} g`),
      calories: Math.round(Number(calories ?? 0) * factor),
      protein: Number((Number(protein ?? 0) * factor).toFixed(1)),
      carbs: Number((Number(carbs ?? 0) * factor).toFixed(1)),
      fat: Number((Number(fat ?? 0) * factor).toFixed(1)),
    });
  }

  static async searchFood(req: Request, res: Response) {
    try {
      const query = String(req.query.query ?? "");
      const foods = await edamamClient.searchFood(query);
      return ok(res, foods);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al buscar alimentos";
      return fail(res, message, 502);
    }
  }
}
