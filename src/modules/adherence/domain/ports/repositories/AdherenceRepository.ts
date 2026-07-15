export interface MealLogEntity {
  id: string;
  patientUserId: string;
  planId?: string | null;
  mealName: string;
  date: Date;
  consumed: boolean;
  consumedAt?: Date | null;
  createdAt: Date;
}

export interface HydrationLogEntity {
  id: string;
  patientUserId: string;
  date: Date;
  amountMl: number;
  createdAt: Date;
}

export interface MoodLogEntity {
  id: string;
  patientUserId: string;
  date: Date;
  mood: string;
  note?: string | null;
  createdAt: Date;
}

export interface CreateMealLogInput {
  patientUserId: string;
  planId?: string;
  mealName: string;
  note?: string;
  date: Date;
  consumed?: boolean;
  consumedAt?: Date;
}

export interface CreateHydrationLogInput {
  patientUserId: string;
  date: Date;
  amountMl: number;
}

export interface CreateMoodLogInput {
  patientUserId: string;
  date: Date;
  mood: string;
  note?: string;
}

export interface AdherenceSummary {
  mealsLogged: number;
  mealsCompleted: number;
  hydrationTotalMl: number;
  moodEntries: number;
  adherenceRate: number;
}

export interface AdherenceRepository {
  createMealLog(input: CreateMealLogInput): Promise<MealLogEntity>;
  createHydrationLog(input: CreateHydrationLogInput): Promise<HydrationLogEntity>;
  createMoodLog(input: CreateMoodLogInput): Promise<MoodLogEntity>;
  listMealLogs(patientUserId: string, date?: Date): Promise<MealLogEntity[]>;
  listHydrationLogs(patientUserId: string, date?: Date): Promise<HydrationLogEntity[]>;
  listMoodLogs(patientUserId: string, date?: Date): Promise<MoodLogEntity[]>;
  getSummary(patientUserId: string, date?: Date): Promise<AdherenceSummary>;
  getSummaryInRange(patientUserId: string, from: Date, to?: Date): Promise<AdherenceSummary>;
  updateMealLog(id: string, data: Partial<MealLogEntity>): Promise<MealLogEntity | null>;
}
