import type { Request, Response } from "express";
import { GenerateSuggestedDietPlanUseCase } from "../../core/use-cases/diet-plans/GenerateSuggestedDietPlanUseCase";
import { EdamamApiClient } from "../../infrastructure/external-apis/EdamamApiClient";
import { ok } from "../../shared/utils/response";

const edamamClient = new EdamamApiClient();
const generateUseCase = new GenerateSuggestedDietPlanUseCase(edamamClient);

export class DietPlanController {
  static async generateSuggested(req: Request, res: Response) {
    const result = await generateUseCase.execute({ caloriesTarget: req.body.caloriesTarget });
    return ok(res, result);
  }

  static async searchFood(req: Request, res: Response) {
    const query = String(req.query.query ?? "");
    const foods = await edamamClient.searchFood(query);
    return ok(res, foods);
  }
}
