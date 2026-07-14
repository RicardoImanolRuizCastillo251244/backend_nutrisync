import type { Request, Response } from "express";
import { LogProgressUseCase } from "@/modules/progress/application/use-cases/LogProgressUseCase";
import { PrismaProgressLogRepository } from "@/modules/progress/infrastructure/repositories/PrismaProgressLogRepository";
import { ok, fail } from "@/shared/utils/response";

const repository = new PrismaProgressLogRepository();
const logProgressUseCase = new LogProgressUseCase(repository);

export class ProgressController {
  static async log(req: Request, res: Response) {
    try {
      const entry = await logProgressUseCase.execute({
        patientUserId: req.user!.userId,
        ...req.body,
      });
      return ok(res, entry, 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al registrar progreso";
      return fail(res, message, 500);
    }
  }

  static async getMyHistory(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 30;
      const logs = await repository.listByPatient(req.user!.userId, limit);
      return ok(res, logs);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al obtener historial";
      return fail(res, message, 500);
    }
  }

  static async getPatientHistory(req: Request, res: Response) {
    try {
      const patientUserId = String(req.params.patientUserId ?? "");
      const patient = await repository.findPatientByUserId(patientUserId);
      if (!patient) return fail(res, "Patient not found", 404);

      const limit = req.query.limit ? Number(req.query.limit) : 30;
      const logs = await repository.listByPatient(patientUserId, limit);
      return ok(res, logs);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al obtener historial";
      return fail(res, message, 500);
    }
  }
}