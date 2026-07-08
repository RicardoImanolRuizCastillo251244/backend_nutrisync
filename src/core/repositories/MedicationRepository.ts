import type { MedicationEntity, MedicationTakeEntity } from "../domain/entities/Medication";

export interface CreateMedicationInput {
  patientUserId: string;
  name: string;
  dosage: string;
  reminderEnabled?: boolean;
  times: string[];
  days: string[];
  intervalHours?: number;
}

export interface UpdateMedicationInput {
  name?: string;
  dosage?: string;
  reminderEnabled?: boolean;
  times?: string[];
  days?: string[];
  intervalHours?: number | null;
}

export interface MedicationRepository {
  create(input: CreateMedicationInput): Promise<MedicationEntity>;
  getById(id: string, patientUserId: string): Promise<MedicationEntity | null>;
  listByPatient(patientUserId: string): Promise<MedicationEntity[]>;
  update(id: string, patientUserId: string, updates: UpdateMedicationInput): Promise<MedicationEntity | null>;
  delete(id: string, patientUserId: string): Promise<void>;
  logTake(medicationId: string, patientUserId: string): Promise<MedicationTakeEntity>;
  listTakes(medicationId: string, patientUserId: string): Promise<MedicationTakeEntity[]>;
}