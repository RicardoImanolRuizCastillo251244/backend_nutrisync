export interface ProgressLogEntity {
  id: string;
  patientUserId: string;
  weightKg: number | null;
  bmi: number | null;
  createdAt: Date;
}