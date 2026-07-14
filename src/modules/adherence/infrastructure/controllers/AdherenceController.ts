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

// Helper: resolve patientUserId from params, query, or current user
function getPatientId(req: Request): string {
  if (req.params.patientUserId) return String(req.params.patientUserId);
  if (req.query.patientId) return String(req.query.patientId as string);
  return req.user!.userId;
}

export class AdherenceController {
  static async logMeal(req: Request, res: Response) {
    try {
      const log = await logMealUseCase.execute({ patientUserId: getPatientId(req), ...req.body });
      return ok(res, log, 201);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  static async logHydration(req: Request, res: Response) {
    try {
      const log = await logHydrationUseCase.execute({ patientUserId: getPatientId(req), ...req.body });
      return ok(res, log, 201);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  static async logMood(req: Request, res: Response) {
    try {
      const log = await logMoodUseCase.execute({ patientUserId: getPatientId(req), ...req.body });
      return ok(res, log, 201);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  static async getSummary(req: Request, res: Response) {
    try {
      const patientId = getPatientId(req);
      const days = req.query.days ? Number(req.query.days) : 30;
      const from = new Date();
      from.setDate(from.getDate() - days);
      const summary = await repository.getSummaryInRange(patientId, from);
      return ok(res, summary);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  static async listMeals(req: Request, res: Response) {
    try {
      const patientId = getPatientId(req);
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const logs = await repository.listMealLogs(patientId, date);
      return ok(res, logs);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  static async listHydration(req: Request, res: Response) {
    try {
      const patientId = getPatientId(req);
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const logs = await repository.listHydrationLogs(patientId, date);
      return ok(res, logs);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  static async updateMeal(req: Request, res: Response) {
    try {
      const id = String(req.params.id ?? "");
      const updated = await repository.updateMealLog(id, req.body as any);
      if (!updated) return fail(res, "Meal log not found", 404);
      return ok(res, updated);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  static async listMood(req: Request, res: Response) {
    try {
      const patientId = getPatientId(req);
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const logs = await repository.listMoodLogs(patientId, date);
      return ok(res, logs);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }
}