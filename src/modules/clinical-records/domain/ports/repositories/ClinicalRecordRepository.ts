import type { ClinicalRecordEntity } from "@/modules/clinical-records/domain/entities/ClinicalRecord";

export interface ClinicalRecordInput {
  patientId: string;
  date: Date;
  name?: string | null;
  sex?: string | null;
  age?: number | null;
  occupation?: string | null;
  bloodType?: string | null;
  consultationReason?: string | null;
  phone?: string | null;
  weightKg?: number | null;
  heightCm?: number | null;
  maritalStatus?: string | null;
  allergies?: string | null;
  feedingDifficulty?: boolean;
  address?: string | null;
  familyObesity?: boolean;
  familyCancer?: boolean;
  familyHypertension?: boolean;
  familyHIV?: boolean;
  familyDiabetesType1?: boolean;
  familyDiabetesType2?: boolean;
  familyOther?: string | null;
  personalDiarrhea?: boolean;
  personalColitis?: boolean;
  personalReflux?: boolean;
  personalConstipation?: boolean;
  personalNausea?: boolean;
  personalGastritis?: boolean;
  personalVomiting?: boolean;
  personalOther?: string | null;
  labGlucose?: number | null;
  labCholesterol?: number | null;
  labTriglycerides?: number | null;
  physicalHair?: string | null;
  physicalMouth?: string | null;
  physicalTeeth?: string | null;
  physicalEyes?: string | null;
  physicalGums?: string | null;
  physicalNails?: string | null;
  bmi?: number | null;
  bmiClassification?: string | null;
  bodyFatPercentage?: number | null;
  visceralFat?: number | null;
  muscleMass?: number | null;
  biologicalAge?: number | null;
  restingMetabolism?: number | null;
  riskLevel?: string | null;
}

export type ClinicalRecordUpdateInput = Partial<ClinicalRecordInput> & { date?: Date };

export interface ClinicalRecordRepository {
  create(input: ClinicalRecordInput): Promise<ClinicalRecordEntity>;
  getById(id: string, patientId: string): Promise<ClinicalRecordEntity | null>;
  listByPatient(patientId: string): Promise<ClinicalRecordEntity[]>;
  update(id: string, patientId: string, updates: ClinicalRecordUpdateInput): Promise<ClinicalRecordEntity | null>;
  softDelete(id: string, patientId: string): Promise<void>;
}