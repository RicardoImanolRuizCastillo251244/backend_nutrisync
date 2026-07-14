import type { Request, Response } from "express";
import { CreateMedicationUseCase } from "@/modules/medications/application/use-cases/CreateMedicationUseCase";
import { UpdateMedicationUseCase } from "@/modules/medications/application/use-cases/UpdateMedicationUseCase";
import { LogMedicationTakeUseCase } from "@/modules/medications/application/use-cases/LogMedicationTakeUseCase";
import { PrismaMedicationRepository } from "@/modules/medications/infrastructure/repositories/PrismaMedicationRepository";
import { ok, fail } from "@/shared/utils/response";

const repository = new PrismaMedicationRepository();
const createUseCase = new CreateMedicationUseCase(repository);
const updateUseCase = new UpdateMedicationUseCase(repository);
const logTakeUseCase = new LogMedicationTakeUseCase(repository);

export class MedicationController {
  static async create(req: Request, res: Response) {
    try {
      const med = await createUseCase.execute({
        patientUserId: req.user!.userId,
        ...req.body,
      });
      return ok(res, med, 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al crear medicación";
      return fail(res, message, 500);
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const meds = await repository.listByPatient(req.user!.userId);
      return ok(res, meds);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al listar medicaciones";
      return fail(res, message, 500);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id ?? "");
      const med = await repository.getById(id, req.user!.userId);
      if (!med) return fail(res, "Medication not found", 404);
      return ok(res, med);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al obtener medicación";
      return fail(res, message, 500);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id ?? "");
      const updated = await updateUseCase.execute({
        id,
        patientUserId: req.user!.userId,
        ...req.body,
      });
      if (!updated) return fail(res, "Medication not found", 404);
      return ok(res, updated);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al actualizar medicación";
      return fail(res, message, 500);
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      const id = String(req.params.id ?? "");
      await repository.delete(id, req.user!.userId);
      return ok(res, { message: "Medication deleted" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al eliminar medicación";
      return fail(res, message, 500);
    }
  }

  static async logTake(req: Request, res: Response) {
    try {
      const medicationId = String(req.params.id ?? "");
      const take = await logTakeUseCase.execute({
        medicationId,
        patientUserId: req.user!.userId,
      });
      return ok(res, take, 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al registrar toma";
      return fail(res, message, 500);
    }
  }

  static async listTakes(req: Request, res: Response) {
    try {
      const medicationId = String(req.params.id ?? "");
      const takes = await repository.listTakes(medicationId, req.user!.userId);
      return ok(res, takes);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al listar tomas";
      return fail(res, message, 500);
    }
  }
}