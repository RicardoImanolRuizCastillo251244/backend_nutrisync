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
      const rangeDays = parseInt(req.query.range as string, 10) || 1;

      // Calcular fecha "from" según el rango
      const now = new Date();
      let from: Date;
      let to: Date;

      if (rangeDays === -1) {
        // "Desde siempre": usar la fecha del paciente más antiguo
        const oldestPatient = await prisma.patient.findFirst({
          where: { nutritionistUserId, deletedAt: null },
          orderBy: { createdAt: "asc" },
          select: { createdAt: true },
        });
        from = oldestPatient?.createdAt ?? new Date("2020-01-01");
        from.setHours(0, 0, 0, 0);
        to = new Date();
        to.setHours(23, 59, 59, 999);
      } else {
        from = new Date();
        from.setDate(from.getDate() - Math.max(0, rangeDays - 1));
        from.setHours(0, 0, 0, 0);
        to = new Date();
        to.setHours(23, 59, 59, 999);
      }

      // Pacientes totales
      const patients = await patientRepo.listByNutritionist(nutritionistUserId);
      const totalPatients = patients.length;

      // Planes activos
      const activePlans = await prisma.dietPlan.count({
        where: { nutritionistUserId, deletedAt: null },
      });

      // Adherencia por paciente en el rango seleccionado
      const patientAdherenceData: Array<{ patientId: string; patientName: string; adherence: number; mealsCompleted: number; mealsLogged: number }> = [];

      for (const p of patients) {
        try {
          const summary = await adherenceRepo.getSummaryInRange(p.userId, from, to);
          patientAdherenceData.push({
            patientId: p.id,
            patientName: p.user?.name ?? 'Sin nombre',
            adherence: Math.round((summary.adherenceRate ?? 0) * 100),
            mealsCompleted: summary.mealsCompleted ?? 0,
            mealsLogged: summary.mealsLogged ?? 0,
          });
        } catch {
          patientAdherenceData.push({
            patientId: p.id,
            patientName: p.user?.name ?? 'Sin nombre',
            adherence: 0,
            mealsCompleted: 0,
            mealsLogged: 0,
          });
        }
      }

      // Adherencia promedio (solo pacientes con datos)
      const ratesWithData = patientAdherenceData
        .filter((p) => p.mealsLogged > 0)
        .map((p) => p.adherence);
      const averageAdherence = ratesWithData.length > 0
        ? Math.round(ratesWithData.reduce((a, b) => a + b, 0) / ratesWithData.length)
        : 0;

      return ok(res, {
        totalPatients,
        activePlans,
        averageAdherence,
        patientAdherence: patientAdherenceData,
        range: rangeDays,
      });
    } catch (e) {
      return fail(res, e instanceof Error ? e.message : "Error", 500);
    }
  }
}