import type { Request, Response } from "express";
import { CreateClinicalRecordUseCase } from "../../core/use-cases/clinical-records/CreateClinicalRecordUseCase";
import { UpdateClinicalRecordUseCase } from "../../core/use-cases/clinical-records/UpdateClinicalRecordUseCase";
import { PrismaClinicalRecordRepository } from "../../infrastructure/repositories/PrismaClinicalRecordRepository";
import { ok, fail } from "../../shared/utils/response";

const repository = new PrismaClinicalRecordRepository();
const createUseCase = new CreateClinicalRecordUseCase(repository);
const updateUseCase = new UpdateClinicalRecordUseCase(repository);

export class ClinicalRecordController {
  static async create(req: Request, res: Response) {
    const record = await createUseCase.execute(req.body);
    return ok(res, record, 201);
  }

  static async list(req: Request, res: Response) {
    const patientId = String(req.params.patientId ?? "");
    const records = await repository.listByPatient(patientId);
    return ok(res, records);
  }

  static async getById(req: Request, res: Response) {
    const id = String(req.params.id ?? "");
    const patientId = String(req.params.patientId ?? "");
    const record = await repository.getById(id, patientId);
    if (!record) return fail(res, "Clinical record not found", 404);
    return ok(res, record);
  }

  static async update(req: Request, res: Response) {
    const id = String(req.params.id ?? "");
    const patientId = String(req.params.patientId ?? "");
    const updated = await updateUseCase.execute({
      id,
      patientId,
      ...req.body,
    });
    if (!updated) return fail(res, "Clinical record not found", 404);
    return ok(res, updated);
  }

  static async remove(req: Request, res: Response) {
    const id = String(req.params.id ?? "");
    const patientId = String(req.params.patientId ?? "");
    await repository.softDelete(id, patientId);
    return ok(res, { message: "Clinical record deleted" });
  }

  static async recalculate(req: Request, res: Response) {
    const id = String(req.params.id ?? "");
    const patientId = String(req.params.patientId ?? "");

    const existing = await repository.getById(id, patientId);
    if (!existing) return fail(res, "Clinical record not found", 404);

    const updateData = req.body as Record<string, unknown>;
    const updated = await updateUseCase.execute({
      id,
      patientId,
      data: updateData,
    });
    if (!updated) return fail(res, "Clinical record not found", 404);
    return ok(res, updated);
  }
}