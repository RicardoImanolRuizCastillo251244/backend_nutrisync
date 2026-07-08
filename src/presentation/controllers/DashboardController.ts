import type { Request, Response } from "express";
import { GetNutritionistDashboardUseCase } from "../../core/use-cases/dashboard/GetNutritionistDashboardUseCase";
import { PrismaAdherenceRepository } from "../../infrastructure/repositories/PrismaAdherenceRepository";
import { ok } from "../../shared/utils/response";

const adherenceRepository = new PrismaAdherenceRepository();
const dashboardUseCase = new GetNutritionistDashboardUseCase(adherenceRepository);

export class DashboardController {
  static async get(req: Request, res: Response) {
    const result = await dashboardUseCase.execute(req.user!.userId);
    return ok(res, result);
  }
}