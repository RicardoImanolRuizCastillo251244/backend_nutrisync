export interface ClinicalRecordEntity {
  id: string;
  patientId: string;
  date: Date;

  // Datos personales
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
  feedingDifficulty?: boolean | null;
  address?: string | null;

  // Antecedentes heredofamiliares
  familyObesity?: boolean | null;
  familyCancer?: boolean | null;
  familyHypertension?: boolean | null;
  familyHIV?: boolean | null;
  familyDiabetesType1?: boolean | null;
  familyDiabetesType2?: boolean | null;
  familyOther?: string | null;

  // Antecedentes patológicos personales
  personalDiarrhea?: boolean | null;
  personalColitis?: boolean | null;
  personalReflux?: boolean | null;
  personalConstipation?: boolean | null;
  personalNausea?: boolean | null;
  personalGastritis?: boolean | null;
  personalVomiting?: boolean | null;
  personalOther?: string | null;

  // Laboratorios
  labGlucose?: number | null;
  labCholesterol?: number | null;
  labTriglycerides?: number | null;

  // Exploración física
  physicalHair?: string | null;
  physicalMouth?: string | null;
  physicalTeeth?: string | null;
  physicalEyes?: string | null;
  physicalGums?: string | null;
  physicalNails?: string | null;

  // Métricas calculadas
  bmi?: number | null;
  bmiClassification?: string | null;
  bodyFatPercentage?: number | null;
  visceralFat?: number | null;
  muscleMass?: number | null;
  biologicalAge?: number | null;
  restingMetabolism?: number | null;
  riskLevel?: string | null;

  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}