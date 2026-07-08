import type { ClinicalRecordEntity } from "../domain/entities/ClinicalRecord";

export interface CreateClinicalRecordInput {
  patientId: string;
  date: Date;
  data: Record<string, unknown>;
  bmi?: number | null;
  bodyFatPercentage?: number | null;
  riskLevel?: string | null;
}

export interface UpdateClinicalRecordInput {
  date?: Date;
  data?: Record<string, unknown>;
  bmi?: number | null;
  bodyFatPercentage?: number | null;
  riskLevel?: string | null;
}

export interface ClinicalRecordRepository {
  create(input: CreateClinicalRecordInput): Promise<ClinicalRecordEntity>;
  getById(id: string, patientId: string): Promise<ClinicalRecordEntity | null>;
  listByPatient(patientId: string): Promise<ClinicalRecordEntity[]>;
  update(id: string, patientId: string, updates: UpdateClinicalRecordInput): Promise<ClinicalRecordEntity | null>;
  softDelete(id: string, patientId: string): Promise<void>;
}