import type { Request, Response } from "express";
import { CreateClinicalRecordUseCase } from "@/modules/clinical-records/application/use-cases/CreateClinicalRecordUseCase";
import { UpdateClinicalRecordUseCase } from "@/modules/clinical-records/application/use-cases/UpdateClinicalRecordUseCase";
import { CalculateClinicalMetrics } from "@/modules/clinical-records/domain/services/CalculateClinicalMetrics";
import { PrismaClinicalRecordRepository } from "@/modules/clinical-records/infrastructure/repositories/PrismaClinicalRecordRepository";
import { ok, fail } from "@/shared/utils/response";

const repository = new PrismaClinicalRecordRepository();
const createUseCase = new CreateClinicalRecordUseCase(repository);
const updateUseCase = new UpdateClinicalRecordUseCase(repository);

export class ClinicalRecordController {
  static async create(req: Request, res: Response) {
    try {
      const body = req.body as Record<string, unknown>;
      const input: any = { ...body, date: body.date ? new Date(body.date as string) : new Date() };
      const record = await createUseCase.execute(input);
      return ok(res, record, 201);
    } catch (error) { return fail(res, error instanceof Error ? error.message : "Error", 500); }
  }

  static async list(req: Request, res: Response) {
    try {
      const patientId = String(req.params.patientId ?? "");
      const records = await repository.listByPatient(patientId);
      return ok(res, records);
    } catch (error) { return fail(res, error instanceof Error ? error.message : "Error", 500); }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id ?? "");
      const patientId = String(req.params.patientId ?? req.query.patientId ?? "");
      const record = await repository.getById(id, patientId);
      if (!record) return fail(res, "Clinical record not found", 404);
      return ok(res, record);
    } catch (error) { return fail(res, error instanceof Error ? error.message : "Error", 500); }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id ?? "");
      const body = req.body as Record<string, unknown>;
      const patientId = String(body.patientId ?? req.params.patientId ?? "");
      const updated = await updateUseCase.execute({ id, patientId, ...req.body, ...(typeof body.date === "string" ? { date: new Date(body.date as string) } : {}) });
      if (!updated) return fail(res, "Clinical record not found", 404);
      return ok(res, updated);
    } catch (error) { return fail(res, error instanceof Error ? error.message : "Error", 500); }
  }

  static async remove(req: Request, res: Response) {
    try {
      const id = String(req.params.id ?? "");
      const body = req.body as Record<string, unknown>;
      const patientId = String(body.patientId ?? req.params.patientId ?? "");
      await repository.softDelete(id, patientId);
      return ok(res, { message: "Clinical record deleted" });
    } catch (error) { return fail(res, error instanceof Error ? error.message : "Error", 500); }
  }

  static async getMetrics(req: Request, res: Response) {
    try {
      const patientId = req.user!.patientId;
      if (!patientId) return fail(res, "No tienes un perfil de paciente asociado", 403);
      const records = await repository.listByPatient(patientId);
      if (records.length === 0) return ok(res, null);
      const latest = records.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
      return ok(res, latest ?? null);
    } catch (error) { return fail(res, error instanceof Error ? error.message : "Error", 502); }
  }

  static async upsertMetrics(req: Request, res: Response) {
    try {
      const patientId = req.user!.patientId;
      if (!patientId) return fail(res, "No tienes un perfil de paciente asociado", 403);
      const { weightKg, heightCm, dateOfBirth, gender, name } = req.body;
      if (!weightKg || !heightCm || !dateOfBirth || !gender) return fail(res, "Faltan datos: weightKg, heightCm, dateOfBirth, gender", 400);

      const birthDate = new Date(dateOfBirth as string);
      const now = new Date();
      let age = now.getFullYear() - birthDate.getFullYear();
      const m = now.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) age--;

      const calculator = new CalculateClinicalMetrics();
      const metrics = calculator.execute({ weightKg: Number(weightKg), heightCm: Number(heightCm), age, gender: gender as "male" | "female" });

      const existingRecords = await repository.listByPatient(patientId);
      const todayStr = now.toISOString().slice(0, 10);
      const todayRecord = existingRecords.find(r => r.date.toISOString().slice(0, 10) === todayStr);

      const data = { name: String(name ?? ''), weightKg: Number(weightKg), heightCm: Number(heightCm), age, sex: gender === "male" ? "Masculino" : "Femenino", ...metrics };

      if (todayRecord) {
        const updated = await repository.update(todayRecord.id, patientId, data);
        return ok(res, updated);
      }

      const created = await repository.create({ patientId, date: new Date(), ...data });
      return ok(res, created, 201);
    } catch (error) { return fail(res, error instanceof Error ? error.message : "Error", 502); }
  }
}