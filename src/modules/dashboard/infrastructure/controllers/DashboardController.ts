import type { Request, Response } from "express";
import { PrismaPatientRepository } from "@/modules/patients/infrastructure/repositories/PrismaPatientRepository";
import { PrismaAdherenceRepository } from "@/modules/adherence/infrastructure/repositories/PrismaAdherenceRepository";
import { prisma } from "@/shared/infrastructure/database/prisma";
import { ok, fail } from "@/shared/utils/response";

const patientRepo = new PrismaPatientRepository();
const adherenceRepo = new PrismaAdherenceRepository();

export class DashboardController {
  static async getNutritionistDashboard(req: Request, res: Response) {
    try {
      const nutritionistUserId = req.user!.userId;

      // Pacientes totales
      const patients = await patientRepo.listByNutritionist(nutritionistUserId);
      const totalPatients = patients.length;

      // Planes activos
      const activePlans = await prisma.dietPlan.count({
        where: { nutritionistUserId, deletedAt: null },
      });

      // Adherencia promedio
      const summaries = await Promise.all(patients.slice(0, 20).map(async (p) => {
        try {
          const summary = await adherenceRepo.getSummary(p.userId);
          return { patientId: p.id, userId: p.userId, ...summary };
        } catch { return { patientId: p.id, userId: p.userId }; }
      }));

      const adherenceRates = summaries
        .map((s: any) => s.adherenceRate ?? 0)
        .filter((r: number) => r > 0);
      const averageAdherence = adherenceRates.length > 0
        ? Math.round(adherenceRates.reduce((a: number, b: number) => a + b, 0) / adherenceRates.length)
        : 0;

      return ok(res, {
        totalPatients,
        activePlans,
        averageAdherence,
        summaries,
      });
    } catch (e) {
      return fail(res, e instanceof Error ? e.message : "Error", 500);
    }
  }
}