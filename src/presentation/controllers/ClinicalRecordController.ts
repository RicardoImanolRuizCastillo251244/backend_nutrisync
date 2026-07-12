import type { Request, Response } from "express";
import { CreateClinicalRecordUseCase } from "../../core/use-cases/clinical-records/CreateClinicalRecordUseCase";
import { UpdateClinicalRecordUseCase } from "../../core/use-cases/clinical-records/UpdateClinicalRecordUseCase";
import { CalculateClinicalMetrics } from "../../core/use-cases/clinical-records/CalculateClinicalMetrics";
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

  static async getMetrics(req: Request, res: Response) {
    try {
      const patientId = req.user!.patientId;
      if (!patientId) {
        return fail(res, "No tienes un perfil de paciente asociado", 403);
      }

      const records = await repository.listByPatient(patientId);
      if (records.length === 0) {
        return ok(res, null);
      }

      const latest = records.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
      if (!latest) return ok(res, null);
      return ok(res, latest.data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al obtener métricas";
      return fail(res, message, 502);
    }
  }

  static async upsertMetrics(req: Request, res: Response) {
    try {
      const patientId = req.user!.patientId;
      if (!patientId) {
        return fail(res, "No tienes un perfil de paciente asociado", 403);
      }

      const { weightKg, heightCm, dateOfBirth, gender } = req.body;
      if (!weightKg || !heightCm || !dateOfBirth || !gender) {
        return fail(res, "Faltan datos: weightKg, heightCm, dateOfBirth, gender", 400);
      }

      const birthDate = new Date(dateOfBirth as string);
      const now = new Date();
      let age = now.getFullYear() - birthDate.getFullYear();
      const m = now.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
        age--;
      }

      const calculator = new CalculateClinicalMetrics();
      const metrics = calculator.execute({
        weightKg: Number(weightKg),
        heightCm: Number(heightCm),
        age,
        gender: gender as "male" | "female",
      });

      const existingRecords = await repository.listByPatient(patientId);
      const todayStr = now.toISOString().slice(0, 10);
      const todayRecord = existingRecords.find(
        (r) => r.date.toISOString().slice(0, 10) === todayStr
      );

      const dataPayload = {
        weightKg: Number(weightKg),
        heightCm: Number(heightCm),
        age,
        gender: gender as string,
        dateOfBirth: dateOfBirth as string,
        ...metrics,
      };

      if (todayRecord) {
        const updated = await repository.update(todayRecord.id, patientId, {
          data: dataPayload,
          bmi: metrics.bmi,
          bodyFatPercentage: metrics.bodyFatPercentage,
          riskLevel: metrics.riskLevel,
        });
        return ok(res, updated);
      }

      const created = await repository.create({
        patientId,
        date: new Date(),
        data: dataPayload,
        bmi: metrics.bmi,
        bodyFatPercentage: metrics.bodyFatPercentage,
        riskLevel: metrics.riskLevel,
      });
      return ok(res, created, 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al guardar métricas";
      return fail(res, message, 502);
    }
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