export interface MealLogEntry {
  id: string;
  patientUserId: string;
  planId: string | null;
  mealName: string;
  date: Date;
  consumed: boolean;
  consumedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface HydrationLogEntry {
  id: string;
  patientUserId: string;
  amountMl: number;
  loggedAt: Date;
}

export interface MoodLogEntry {
  id: string;
  patientUserId: string;
  mood: string;
  note: string | null;
  loggedAt: Date;
}

export interface CreateMealLogInput {
  patientUserId: string;
  planId?: string;
  mealName: string;
  date: Date;
  consumed?: boolean;
  consumedAt?: Date;
}

export interface CreateHydrationLogInput {
  patientUserId: string;
  amountMl: number;
}

export interface CreateMoodLogInput {
  patientUserId: string;
  mood: string;
  note?: string;
}

export interface AdherenceSummary {
  mealAdherencePercent: number;
  totalMealsLogged: number;
  totalMealsConsumed: number;
  avgDailyWaterMl: number;
  totalHydrationLogs: number;
  moodDistribution: Record<string, number>;
  periodDays: number;
}

export interface AdherenceRepository {
  createMealLog(input: CreateMealLogInput): Promise<MealLogEntry>;
  createHydrationLog(input: CreateHydrationLogInput): Promise<HydrationLogEntry>;
  createMoodLog(input: CreateMoodLogInput): Promise<MoodLogEntry>;
  getMealLogs(patientUserId: string, since: Date): Promise<MealLogEntry[]>;
  getHydrationLogs(patientUserId: string, since: Date): Promise<HydrationLogEntry[]>;
  getMoodLogs(patientUserId: string, since: Date): Promise<MoodLogEntry[]>;
  getSummary(patientUserId: string, days?: number): Promise<AdherenceSummary>;
  findPatientByUserId(userId: string): Promise<{ patientId: string } | null>;
}