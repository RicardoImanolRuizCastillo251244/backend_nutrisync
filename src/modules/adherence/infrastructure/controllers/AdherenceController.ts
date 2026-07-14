import type { Request, Response } from "express";
import { LogMealUseCase } from "@/modules/adherence/application/use-cases/LogMealUseCase";
import { LogHydrationUseCase } from "@/modules/adherence/application/use-cases/LogHydrationUseCase";
import { LogMoodUseCase } from "@/modules/adherence/application/use-cases/LogMoodUseCase";
import { GetAdherenceSummaryUseCase } from "@/modules/adherence/application/use-cases/GetAdherenceSummaryUseCase";
import { PrismaAdherenceRepository } from "@/modules/adherence/infrastructure/repositories/PrismaAdherenceRepository";
import { ok, fail } from "@/shared/utils/response";

const repository = new PrismaAdherenceRepository();
const logMealUseCase = new LogMealUseCase(repository);
const logHydrationUseCase = new LogHydrationUseCase(repository);
const logMoodUseCase = new LogMoodUseCase(repository);
const getSummaryUseCase = new GetAdherenceSummaryUseCase(repository);

export class AdherenceController {
  static async logMeal(req: Request, res: Response) {
    try {
      const log = await logMealUseCase.execute({ patientUserId: req.user!.userId, ...req.body });
      return ok(res, log, 201);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  static async logHydration(req: Request, res: Response) {
    try {
      const log = await logHydrationUseCase.execute({ patientUserId: req.user!.userId, ...req.body });
      return ok(res, log, 201);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  static async logMood(req: Request, res: Response) {
    try {
      const log = await logMoodUseCase.execute({ patientUserId: req.user!.userId, ...req.body });
      return ok(res, log, 201);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  static async getSummary(req: Request, res: Response) {
    try {
      const date = req.query.date as string | undefined;
      const summary = await getSummaryUseCase.execute(req.user!.userId, date);
      return ok(res, summary);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  static async listMeals(req: Request, res: Response) {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const logs = await repository.listMealLogs(req.user!.userId, date);
      return ok(res, logs);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  static async listHydration(req: Request, res: Response) {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const logs = await repository.listHydrationLogs(req.user!.userId, date);
      return ok(res, logs);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  static async listMood(req: Request, res: Response) {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const logs = await repository.listMoodLogs(req.user!.userId, date);
      return ok(res, logs);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }
}