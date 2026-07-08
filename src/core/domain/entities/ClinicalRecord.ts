export interface ClinicalRecordEntity {
  id: string;
  patientId: string;
  date: Date;
  data: Record<string, unknown>;
  bmi: number | null;
  bodyFatPercentage: number | null;
  riskLevel: string | null;
  createdAt: Date;
  updatedAt: Date;
}