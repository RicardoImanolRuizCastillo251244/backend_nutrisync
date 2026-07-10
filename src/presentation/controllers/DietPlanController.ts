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
