import type { AdherenceRepository } from "../../repositories/AdherenceRepository";
import { prisma } from "../../../infrastructure/database/prisma";

interface DashboardResult {
  totalPatients: number;
  activePlans: number;
  avgAdherence: number;
  recentActivity: Array<{
    type: string;
    patientName: string;
    detail: string;
    timestamp: Date;
  }>;
  patientsWithLowAdherence: Array<{
    patientId: string;
    patientName: string;
    adherencePercent: number;
  }>;
}

export class GetNutritionistDashboardUseCase {
  constructor(private readonly adherenceRepository: AdherenceRepository) {}

  async execute(nutritionistUserId: string): Promise<DashboardResult> {
    const patients = await prisma.patient.findMany({
      where: { nutritionistUserId, deletedAt: null },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    const totalPatients = patients.length;

    const activePlansCount = await prisma.patientPlanAssignment.count({
      where: {
        nutritionistUserId,
        active: true,
        patient: { deletedAt: null },
      },
    });

    // Calculate avg adherence across all patients
    let totalAdherence = 0;
    const lowAdherencePatients: DashboardResult["patientsWithLowAdherence"] = [];

    for (const patient of patients) {
      const summary = await this.adherenceRepository.getSummary(patient.user.id, 30);
      totalAdherence += summary.mealAdherencePercent;

      if (summary.mealAdherencePercent < 50) {
        lowAdherencePatients.push({
          patientId: patient.id,
          patientName: patient.user.name,
          adherencePercent: summary.mealAdherencePercent,
        });
      }
    }

    const avgAdherence = totalPatients > 0 ? Math.round(totalAdherence / totalPatients) : 0;

    // Recent activity: last 10 meal/hydration/mood logs
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const patientUserIds = patients.map((p) => p.user.id);

    const [recentMeals, recentHydrations, recentMoods] = await Promise.all([
      prisma.mealLog.findMany({
        where: { patientUserId: { in: patientUserIds }, date: { gte: thirtyDaysAgo } },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { patientUser: { select: { name: true } } },
      }),
      prisma.hydrationLog.findMany({
        where: { patientUserId: { in: patientUserIds }, loggedAt: { gte: thirtyDaysAgo } },
        orderBy: { loggedAt: "desc" },
        take: 10,
        include: { patientUser: { select: { name: true } } },
      }),
      prisma.moodLog.findMany({
        where: { patientUserId: { in: patientUserIds }, loggedAt: { gte: thirtyDaysAgo } },
        orderBy: { loggedAt: "desc" },
        take: 10,
        include: { patientUser: { select: { name: true } } },
      }),
    ]);

    const recentActivity: DashboardResult["recentActivity"] = [
      ...recentMeals.map((m) => ({
        type: "meal",
        patientName: m.patientUser.name,
        detail: `${m.mealName} ${m.consumed ? "consumed" : "logged"}`,
        timestamp: m.createdAt,
      })),
      ...recentHydrations.map((h) => ({
        type: "hydration",
        patientName: h.patientUser.name,
        detail: `${h.amountMl}ml`,
        timestamp: h.loggedAt,
      })),
      ...recentMoods.map((m) => ({
        type: "mood",
        patientName: m.patientUser.name,
        detail: m.mood,
        timestamp: m.loggedAt,
      })),
    ]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return {
      totalPatients,
      activePlans: activePlansCount,
      avgAdherence,
      recentActivity,
      patientsWithLowAdherence: lowAdherencePatients,
    };
  }
}