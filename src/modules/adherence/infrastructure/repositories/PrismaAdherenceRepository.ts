import type { AdherenceRepository, CreateMealLogInput, CreateHydrationLogInput, CreateMoodLogInput, MealLogEntity, HydrationLogEntity, MoodLogEntity, AdherenceSummary } from "@/modules/adherence/domain/ports/repositories/AdherenceRepository";
import { prisma } from "@/shared/infrastructure/database/prisma";

const cast = <T>(v: unknown): T => v as unknown as T;

export class PrismaAdherenceRepository implements AdherenceRepository {
  async createMealLog(input: CreateMealLogInput): Promise<MealLogEntity> {
    // Bypass del tipado estricto de Prisma para campos nuevos (note)
    // que existen en BD pero no en el cliente generado en Render
    return cast<MealLogEntity>((prisma.mealLog as any).create({ data: input }));
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

    const [rawMeals, hydrations, moods] = await Promise.all([
      prisma.mealLog.findMany({ where: mealsWhere }),
      prisma.hydrationLog.findMany({ where: hydrationsWhere }),
      prisma.moodLog.findMany({ where: moodsWhere }),
    ]);

    // Deduplicar: 1 log por mealName por día, priorizando consumed=true y el más reciente
    const deduped = new Map<string, (typeof rawMeals)[number]>();
    for (const log of rawMeals as any[]) {
      const day = (log.date as Date).toISOString().slice(0, 10);
      const key = `${day}::${log.mealName}`;
      const existing = deduped.get(key);
      if (
        !existing ||
        (log.consumed && !existing.consumed) ||
        (log.consumed === existing.consumed && new Date(log.createdAt) > new Date(existing.createdAt))
      ) {
        deduped.set(key, log);
      }
    }
    const dedupedMeals = Array.from(deduped.values());

    // Limitar a máximo 3 comidas por día (conservando las más recientes)
    const mealsByDay = new Map<string, typeof dedupedMeals>();
    for (const m of dedupedMeals) {
      const day = ((m as any).date as Date).toISOString().slice(0, 10);
      if (!mealsByDay.has(day)) mealsByDay.set(day, []);
      mealsByDay.get(day)!.push(m);
    }
    const meals = Array.from(mealsByDay.values()).flatMap(dayMeals =>
      dayMeals
        .sort((a, b) => new Date((b as any).createdAt).getTime() - new Date((a as any).createdAt).getTime())
        .slice(0, 3),
    );
    const mealsCompleted = meals.filter(m => m.consumed).length;

    // Calcular días totales en el rango
    const daysInRange = Math.max(1, Math.ceil((to.getTime() - from.getTime()) / 86_400_000));
    // Se esperan 3 comidas por día en el rango
    const expectedMeals = daysInRange * 3;
    const adherenceRate = expectedMeals > 0 ? Math.min(1, mealsCompleted / expectedMeals) : 0;

    const hydrationTotalMl = hydrations.reduce((sum, h) => sum + h.amountMl, 0);
    return {
      mealsLogged: meals.length,
      mealsCompleted,
      expectedMeals,
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