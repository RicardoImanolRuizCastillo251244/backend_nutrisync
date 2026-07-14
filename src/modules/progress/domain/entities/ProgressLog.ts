export interface ProgressLogEntity {
  id: string;
  patientUserId: string;
  weightKg: number;
  bmi: number | null;
  createdAt: Date;
}