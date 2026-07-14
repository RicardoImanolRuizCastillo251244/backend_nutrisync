import type { Request, Response } from "express";
import { PrismaPatientRepository } from "@/modules/patients/infrastructure/repositories/PrismaPatientRepository";
import { PrismaAdherenceRepository } from "@/modules/adherence/infrastructure/repositories/PrismaAdherenceRepository";
import { ok, fail } from "@/shared/utils/response";

const patientRepo = new PrismaPatientRepository();
const adherenceRepo = new PrismaAdherenceRepository();

export class DashboardController {
  static async getNutritionistDashboard(req: Request, res: Response) {
    try {
      const patients = await patientRepo.listByNutritionist(req.user!.userId);
      const summaries = await Promise.all(patients.slice(0, 20).map(async (p) => {
        try {
          const summary = await adherenceRepo.getSummary(p.userId);
          return { patientId: p.id, userId: p.userId, ...summary };
        } catch { return { patientId: p.id, userId: p.userId }; }
      }));
      return ok(res, { totalPatients: patients.length, summaries });
    } catch (e) { return fail(res, e instanceof Error ? e.message : "Error", 500); }
  }
}