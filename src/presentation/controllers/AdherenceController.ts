import type { Request, Response } from "express";
import { LogMealUseCase } from "../../core/use-cases/adherence/LogMealUseCase";
import { LogHydrationUseCase } from "../../core/use-cases/adherence/LogHydrationUseCase";
import { LogMoodUseCase } from "../../core/use-cases/adherence/LogMoodUseCase";
import { GetAdherenceSummaryUseCase } from "../../core/use-cases/adherence/GetAdherenceSummaryUseCase";
import { PrismaAdherenceRepository } from "../../infrastructure/repositories/PrismaAdherenceRepository";
import { ok, fail } from "../../shared/utils/response";

const repository = new PrismaAdherenceRepository();
const logMealUseCase = new LogMealUseCase(repository);
const logHydrationUseCase = new LogHydrationUseCase(repository);
const logMoodUseCase = new LogMoodUseCase(repository);
const summaryUseCase = new GetAdherenceSummaryUseCase(repository);

export class AdherenceController {
  static async logMeal(req: Request, res: Response) {
    const log = await logMealUseCase.execute({
      patientUserId: req.user!.userId,
      ...req.body,
    });
    return ok(res, log, 201);
  }

  static async logHydration(req: Request, res: Response) {
    const log = await logHydrationUseCase.execute({
      patientUserId: req.user!.userId,
      ...req.body,
    });
    return ok(res, log, 201);
  }

  static async logMood(req: Request, res: Response) {
    const log = await logMoodUseCase.execute({
      patientUserId: req.user!.userId,
      ...req.body,
    });
    return ok(res, log, 201);
  }

  static async getSummaryForNutritionist(req: Request, res: Response) {
    const patientUserId = String(req.params.patientId ?? "");
    const patient = await repository.findPatientByUserId(patientUserId);
    if (!patient) return fail(res, "Patient not found", 404);

    const summary = await summaryUseCase.execute({
      patientUserId: patientUserId,
      days: req.query.days ? Number(req.query.days) : 30,
    });
    return ok(res, summary);
  }

  static async getMySummary(req: Request, res: Response) {
    const summary = await summaryUseCase.execute({
      patientUserId: req.user!.userId,
      days: req.query.days ? Number(req.query.days) : 30,
    });
    return ok(res, summary);
  }
}