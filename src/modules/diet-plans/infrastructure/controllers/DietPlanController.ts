import type { Request, Response } from "express";
import { CreateDietPlanUseCase } from "@/modules/diet-plans/application/use-cases/CreateDietPlanUseCase";
import { PrismaDietPlanRepository } from "@/modules/diet-plans/infrastructure/repositories/PrismaDietPlanRepository";
import { ok, fail } from "@/shared/utils/response";

const repository = new PrismaDietPlanRepository();
const createUseCase = new CreateDietPlanUseCase(repository);

export class DietPlanController {
  static async create(req: Request, res: Response) {
    try {
      const plan = await createUseCase.execute({ nutritionistUserId: req.user!.userId, ...req.body });
      return ok(res, plan, 201);
    } catch (e) { return fail(res, e instanceof Error ? e.message : "Error", 500); }
  }

  static async list(req: Request, res: Response) {
    try {
      const plans = await repository.listByNutritionist(req.user!.userId);
      return ok(res, plans);
    } catch (e) { return fail(res, e instanceof Error ? e.message : "Error", 500); }
  }

  static async getById(req: Request, res: Response) {
    try {
      const plan = await repository.findById(String(req.params.id ?? ""));
      if (!plan) return fail(res, "Diet plan not found", 404);
      return ok(res, plan);
    } catch (e) { return fail(res, e instanceof Error ? e.message : "Error", 500); }
  }

  static async update(req: Request, res: Response) {
    try {
      const updated = await repository.update(String(req.params.id ?? ""), req.body);
      if (!updated) return fail(res, "Diet plan not found", 404);
      return ok(res, updated);
    } catch (e) { return fail(res, e instanceof Error ? e.message : "Error", 500); }
  }

  static async remove(req: Request, res: Response) {
    try {
      await repository.softDelete(String(req.params.id ?? ""));
      return ok(res, { message: "Diet plan deleted" });
    } catch (e) { return fail(res, e instanceof Error ? e.message : "Error", 500); }
  }
}