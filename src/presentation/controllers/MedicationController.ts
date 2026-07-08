import type { Request, Response } from "express";
import { CreateMedicationUseCase } from "../../core/use-cases/medication/CreateMedicationUseCase";
import { UpdateMedicationUseCase } from "../../core/use-cases/medication/UpdateMedicationUseCase";
import { LogMedicationTakeUseCase } from "../../core/use-cases/medication/LogMedicationTakeUseCase";
import { PrismaMedicationRepository } from "../../infrastructure/repositories/PrismaMedicationRepository";
import { ok, fail } from "../../shared/utils/response";

const repository = new PrismaMedicationRepository();
const createUseCase = new CreateMedicationUseCase(repository);
const updateUseCase = new UpdateMedicationUseCase(repository);
const logTakeUseCase = new LogMedicationTakeUseCase(repository);

export class MedicationController {
  static async create(req: Request, res: Response) {
    const med = await createUseCase.execute({
      patientUserId: req.user!.userId,
      ...req.body,
    });
    return ok(res, med, 201);
  }

  static async list(req: Request, res: Response) {
    const meds = await repository.listByPatient(req.user!.userId);
    return ok(res, meds);
  }

  static async getById(req: Request, res: Response) {
    const id = String(req.params.id ?? "");
    const med = await repository.getById(id, req.user!.userId);
    if (!med) return fail(res, "Medication not found", 404);
    return ok(res, med);
  }

  static async update(req: Request, res: Response) {
    const id = String(req.params.id ?? "");
    const updated = await updateUseCase.execute({
      id,
      patientUserId: req.user!.userId,
      ...req.body,
    });
    if (!updated) return fail(res, "Medication not found", 404);
    return ok(res, updated);
  }

  static async remove(req: Request, res: Response) {
    const id = String(req.params.id ?? "");
    await repository.delete(id, req.user!.userId);
    return ok(res, { message: "Medication deleted" });
  }

  static async logTake(req: Request, res: Response) {
    const medicationId = String(req.params.id ?? "");
    try {
      const take = await logTakeUseCase.execute({
        medicationId,
        patientUserId: req.user!.userId,
      });
      return ok(res, take, 201);
    } catch {
      return fail(res, "Medication not found", 404);
    }
  }

  static async listTakes(req: Request, res: Response) {
    const medicationId = String(req.params.id ?? "");
    try {
      const takes = await repository.listTakes(medicationId, req.user!.userId);
      return ok(res, takes);
    } catch {
      return fail(res, "Medication not found", 404);
    }
  }
}