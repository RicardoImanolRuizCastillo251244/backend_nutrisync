import { z } from "zod";

const clinicalRecordFlatFieldsSchema = z.object({
  name: z.string().optional(),
  sex: z.string().optional(),
  age: z.number().int().optional(),
  occupation: z.string().optional(),
  bloodType: z.string().optional(),
  consultationReason: z.string().optional(),
  phone: z.string().optional(),
  weightKg: z.number().optional(),
  heightCm: z.number().optional(),
  maritalStatus: z.string().optional(),
  allergies: z.string().optional(),
  feedingDifficulty: z.boolean().optional(),
  address: z.string().optional(),
  familyObesity: z.boolean().optional(),
  familyCancer: z.boolean().optional(),
  familyHypertension: z.boolean().optional(),
  familyHIV: z.boolean().optional(),
  familyDiabetesType1: z.boolean().optional(),
  familyDiabetesType2: z.boolean().optional(),
  familyOther: z.string().optional(),
  personalDiarrhea: z.boolean().optional(),
  personalColitis: z.boolean().optional(),
  personalReflux: z.boolean().optional(),
  personalConstipation: z.boolean().optional(),
  personalNausea: z.boolean().optional(),
  personalGastritis: z.boolean().optional(),
  personalVomiting: z.boolean().optional(),
  personalOther: z.string().optional(),
  labGlucose: z.number().optional(),
  labCholesterol: z.number().optional(),
  labTriglycerides: z.number().optional(),
  physicalHair: z.string().optional(),
  physicalMouth: z.string().optional(),
  physicalTeeth: z.string().optional(),
  physicalEyes: z.string().optional(),
  physicalGums: z.string().optional(),
  physicalNails: z.string().optional(),
  bmi: z.number().optional(),
  bmiClassification: z.string().optional(),
  bodyFatPercentage: z.number().optional(),
  visceralFat: z.number().optional(),
  muscleMass: z.number().optional(),
  biologicalAge: z.number().int().optional(),
  restingMetabolism: z.number().int().optional(),
  riskLevel: z.string().optional(),
});

export const createClinicalRecordSchema = z.object({
  patientId: z.string().uuid(),
  date: z.string(),
}).merge(clinicalRecordFlatFieldsSchema);

export const updateClinicalRecordSchema = z.object({
  patientId: z.string().uuid().optional(),
  date: z.string().optional(),
}).merge(clinicalRecordFlatFieldsSchema.partial());

export const recalculateMetricsSchema = z.object({
  weightKg: z.number().positive().optional(),
  heightCm: z.number().positive().optional(),
  age: z.number().int().positive().optional(),
  gender: z.enum(["male", "female"]).optional(),
});