import type { Request, Response } from "express";
import { LogProgressUseCase } from "../../core/use-cases/progress/LogProgressUseCase";
import { PrismaProgressLogRepository } from "../../infrastructure/repositories/PrismaProgressLogRepository";
import { ok, fail } from "../../shared/utils/response";

const repository = new PrismaProgressLogRepository();
const logProgressUseCase = new LogProgressUseCase(repository);

export class ProgressController {
  static async log(req: Request, res: Response) {
    const entry = await logProgressUseCase.execute({
      patientUserId: req.user!.userId,
      ...req.body,
    });
    return ok(res, entry, 201);
  }

  static async getMyHistory(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 30;
    const logs = await repository.listByPatient(req.user!.userId, limit);
    return ok(res, logs);
  }

  static async getPatientHistory(req: Request, res: Response) {
    const patientUserId = String(req.params.patientUserId ?? "");
    const patient = await repository.findPatientByUserId(patientUserId);
    if (!patient) return fail(res, "Patient not found", 404);

    const limit = req.query.limit ? Number(req.query.limit) : 30;
    const logs = await repository.listByPatient(patientUserId, limit);
    return ok(res, logs);
  }
}