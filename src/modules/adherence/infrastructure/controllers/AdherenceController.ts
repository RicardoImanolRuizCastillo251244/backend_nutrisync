import type { Request, Response } from "express";
import { LogMealUseCase } from "@/modules/adherence/application/use-cases/LogMealUseCase";
import { LogHydrationUseCase } from "@/modules/adherence/application/use-cases/LogHydrationUseCase";
import { LogMoodUseCase } from "@/modules/adherence/application/use-cases/LogMoodUseCase";
import { GetAdherenceSummaryUseCase } from "@/modules/adherence/application/use-cases/GetAdherenceSummaryUseCase";
import type { MealLogEntity } from "@/modules/adherence/domain/ports/repositories/AdherenceRepository";
import { PrismaAdherenceRepository } from "@/modules/adherence/infrastructure/repositories/PrismaAdherenceRepository";
import { PrismaPatientRepository } from "@/modules/patients/infrastructure/repositories/PrismaPatientRepository";
import { ok, fail } from "@/shared/utils/response";

const repository = new PrismaAdherenceRepository();
const patientRepo = new PrismaPatientRepository();
const logMealUseCase = new LogMealUseCase(repository);
const logHydrationUseCase = new LogHydrationUseCase(repository);
const logMoodUseCase = new LogMoodUseCase(repository);
const getSummaryUseCase = new GetAdherenceSummaryUseCase(repository);

/**
 * Resuelve el patientUserId real (FK de la tabla User) a partir de:
 * 1. req.user.userId si es un paciente autenticado (propia adherencia)
 * 2. req.query.patientId → busca el Patient y devuelve su userId
 * 3. req.params.patientUserId → busca como Patient o lo usa directo
 */
async function getPatientUserId(req: Request): Promise<string> {
  // Si viene patientId en query (nutriólogo consultando), resolver a userId
  if (req.query.patientId) {
    const patientId = String(req.query.patientId as string);
    const patient = await patientRepo.findById(patientId);
    if (patient) return patient.userId;
  }

  // Si viene en params como patientUserId, intentar resolver
  if (req.params.patientUserId) {
    const param = String(req.params.patientUserId);
    const patient = await patientRepo.findById(param);
    if (patient) return patient.userId;
    return param; // Asumir que ya es un userId directo
  }

  // Fallback: el userId del token (paciente autenticado)
  return req.user!.userId;
}

export class AdherenceController {
  static async logMeal(req: Request, res: Response) {
    try {
      const patientUserId = await getPatientUserId(req);
      const log = await logMealUseCase.execute({ patientUserId, ...req.body });
      return ok(res, log, 201);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  static async logHydration(req: Request, res: Response) {
    try {
      const patientUserId = await getPatientUserId(req);
      const log = await logHydrationUseCase.execute({ patientUserId, ...req.body });
      return ok(res, log, 201);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  static async logMood(req: Request, res: Response) {
    try {
      const patientUserId = await getPatientUserId(req);
      const log = await logMoodUseCase.execute({ patientUserId, ...req.body });
      return ok(res, log, 201);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  static async getMySummary(req: Request, res: Response) {
    try {
      const patientUserId = req.user!.userId;
      const from = new Date();
      from.setDate(from.getDate() - 7);
      const summary = await repository.getSummaryInRange(patientUserId, from);
      return ok(res, summary);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  static async getSummary(req: Request, res: Response) {
    try {
      const patientUserId = await getPatientUserId(req);
      const days = req.query.days ? Number(req.query.days) : 30;
      const from = new Date();
      from.setDate(from.getDate() - days);
      const summary = await repository.getSummaryInRange(patientUserId, from);
      return ok(res, summary);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  static async listMeals(req: Request, res: Response) {
    try {
      const patientUserId = await getPatientUserId(req);
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const logs = await repository.listMealLogs(patientUserId, date);

      // Deduplicar: 1 log por mealName, priorizando consumed=true y el más reciente
      const deduped = new Map<string, MealLogEntity>();
      for (const log of logs as any[]) {
        const existing = deduped.get(log.mealName);
        if (
          !existing ||
          (log.consumed && !existing.consumed) ||
          (log.consumed === existing.consumed && new Date(log.createdAt) > new Date(existing.createdAt))
        ) {
          deduped.set(log.mealName, log);
        }
      }

      return ok(res, Array.from(deduped.values()));
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }

  static async listHydration(req: Request, res: Response) {
    try {
      const patientUserId = await getPatientUserId(req);
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const logs = await repository.listHydrationLogs(patientUserId, date);
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
      const patientUserId = await getPatientUserId(req);
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const logs = await repository.listMoodLogs(patientUserId, date);
      return ok(res, logs);
    } catch (error) {
      return fail(res, error instanceof Error ? error.message : "Error", 500);
    }
  }
}