import type { AdherenceRepository, CreateMealLogInput, CreateHydrationLogInput, CreateMoodLogInput, MealLogEntity, HydrationLogEntity, MoodLogEntity, AdherenceSummary } from "@/modules/adherence/domain/ports/repositories/AdherenceRepository";
import { prisma } from "@/shared/infrastructure/database/prisma";

const cast = <T>(v: unknown): T => v as unknown as T;

export class PrismaAdherenceRepository implements AdherenceRepository {
  async createMealLog(input: CreateMealLogInput): Promise<MealLogEntity> {
    return cast<MealLogEntity>(prisma.mealLog.create({ data: input }));
  }

  async createHydrationLog(input: CreateHydrationLogInput): Promise<HydrationLogEntity> {
    return cast<HydrationLogEntity>(prisma.hydrationLog.create({ data: input }));
  }

  async createMoodLog(input: CreateMoodLogInput): Promise<MoodLogEntity> {
    return cast<MoodLogEntity>(prisma.moodLog.create({ data: input }));
  }

  async listMealLogs(patientUserId: string, date?: Date): Promise<MealLogEntity[]> {
    const where: Record<string, unknown> = { patientUserId };
    if (date) where.date = { gte: new Date(date.toISOString().slice(0, 10)), lt: new Date(new Date(date.toISOString().slice(0, 10)).getTime() + 86400000) };
    return cast<MealLogEntity[]>(prisma.mealLog.findMany({ where, orderBy: { createdAt: "desc" }, include: { voiceNotes: true } }));
  }

  async listHydrationLogs(patientUserId: string, date?: Date): Promise<HydrationLogEntity[]> {
    const where: Record<string, unknown> = { patientUserId };
    if (date) where.loggedAt = { gte: new Date(date.toISOString().slice(0, 10)), lt: new Date(new Date(date.toISOString().slice(0, 10)).getTime() + 86400000) };
    return cast<HydrationLogEntity[]>(prisma.hydrationLog.findMany({ where, orderBy: { loggedAt: "desc" } }));
  }

  async listMoodLogs(patientUserId: string, date?: Date): Promise<MoodLogEntity[]> {
    const where: Record<string, unknown> = { patientUserId };
    if (date) where.loggedAt = { gte: new Date(date.toISOString().slice(0, 10)), lt: new Date(new Date(date.toISOString().slice(0, 10)).getTime() + 86400000) };
    return cast<MoodLogEntity[]>(prisma.moodLog.findMany({ where, orderBy: { loggedAt: "desc" } }));
  }

  async getSummary(patientUserId: string, date?: Date): Promise<AdherenceSummary> {
    const today = date ? new Date(date.toISOString().slice(0, 10)) : new Date(new Date().toISOString().slice(0, 10));
    const tomorrow = new Date(today.getTime() + 86400000);
    return this.computeSummary(patientUserId, today, tomorrow);
  }

  async getSummaryInRange(patientUserId: string, from: Date, to?: Date): Promise<AdherenceSummary> {
    const toDate = to ?? new Date();
    return this.computeSummary(patientUserId, from, toDate);
  }

  private async computeSummary(patientUserId: string, from: Date, to: Date): Promise<AdherenceSummary> {
    const mealsWhere = { patientUserId, date: { gte: from, lt: to } };
    const hydrationsWhere = { patientUserId, loggedAt: { gte: from, lt: to } };
    const moodsWhere = { patientUserId, loggedAt: { gte: from, lt: to } };

    const [meals, hydrations, moods] = await Promise.all([
      prisma.mealLog.findMany({ where: mealsWhere }),
      prisma.hydrationLog.findMany({ where: hydrationsWhere }),
      prisma.moodLog.findMany({ where: moodsWhere }),
    ]);
    const mealsCompleted = meals.filter(m => m.consumed).length;
    const hydrationTotalMl = hydrations.reduce((sum, h) => sum + h.amountMl, 0);
    const adherenceRate = meals.length > 0 ? mealsCompleted / meals.length : 0;
    return {
      mealsLogged: meals.length,
      mealsCompleted,
      hydrationTotalMl,
      moodEntries: moods.length,
      adherenceRate: Math.round(adherenceRate * 100) / 100,
    };
  }

  async updateMealLog(id: string, data: Partial<MealLogEntity>): Promise<MealLogEntity | null> {
    try {
      return cast<MealLogEntity>(prisma.mealLog.update({ where: { id }, data: data as any }));
    } catch {
      return null;
    }
  }
}