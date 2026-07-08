import type { ProgressLogEntity } from "../domain/entities/ProgressLog";

export interface CreateProgressLogInput {
  patientUserId: string;
  weightKg: number;
  heightCm?: number;
}

export interface ProgressLogRepository {
  create(input: CreateProgressLogInput): Promise<ProgressLogEntity>;
  listByPatient(patientUserId: string, limit?: number): Promise<ProgressLogEntity[]>;
  findPatientByUserId(userId: string): Promise<{ patientId: string } | null>;
}