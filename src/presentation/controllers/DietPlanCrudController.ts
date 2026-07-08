import type { Request, Response } from "express";
import { CreateDietPlanUseCase } from "../../core/use-cases/diet-plans/CreateDietPlanUseCase";
import { UpdateDietPlanUseCase } from "../../core/use-cases/diet-plans/UpdateDietPlanUseCase";
import { PrismaDietPlanRepository } from "../../infrastructure/repositories/PrismaDietPlanRepository";
import { ok, fail } from "../../shared/utils/response";

const repository = new PrismaDietPlanRepository();
const createUseCase = new CreateDietPlanUseCase(repository);
const updateUseCase = new UpdateDietPlanUseCase(repository);

export class DietPlanCrudController {
  static async create(req: Request, res: Response) {
    const plan = await createUseCase.execute({
      nutritionistUserId: req.user!.userId,
      ...req.body,
    });
    return ok(res, plan, 201);
  }

  static async list(req: Request, res: Response) {
    const plans = await repository.listByNutritionist(req.user!.userId);
    return ok(res, plans);
  }

  static async getById(req: Request, res: Response) {
    const id = String(req.params.id ?? "");
    const plan = await repository.getById(id, req.user!.userId);
    if (!plan) return fail(res, "Diet plan not found", 404);
    return ok(res, plan);
  }

  static async update(req: Request, res: Response) {
    const id = String(req.params.id ?? "");
    const updated = await updateUseCase.execute({
      id,
      nutritionistUserId: req.user!.userId,
      ...req.body,
    });
    if (!updated) return fail(res, "Diet plan not found", 404);
    return ok(res, updated);
  }

  static async remove(req: Request, res: Response) {
    const id = String(req.params.id ?? "");
    await repository.softDelete(id, req.user!.userId);
    return ok(res, { message: "Diet plan soft deleted" });
  }
}