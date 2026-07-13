"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recalculateMetricsSchema = exports.updateClinicalRecordSchema = exports.createClinicalRecordSchema = void 0;
const zod_1 = require("zod");
const clinicalRecordFlatFieldsSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    sex: zod_1.z.string().optional(),
    age: zod_1.z.number().int().optional(),
    occupation: zod_1.z.string().optional(),
    bloodType: zod_1.z.string().optional(),
    consultationReason: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    weightKg: zod_1.z.number().optional(),
    heightCm: zod_1.z.number().optional(),
    maritalStatus: zod_1.z.string().optional(),
    allergies: zod_1.z.string().optional(),
    feedingDifficulty: zod_1.z.boolean().optional(),
    address: zod_1.z.string().optional(),
    familyObesity: zod_1.z.boolean().optional(),
    familyCancer: zod_1.z.boolean().optional(),
    familyHypertension: zod_1.z.boolean().optional(),
    familyHIV: zod_1.z.boolean().optional(),
    familyDiabetesType1: zod_1.z.boolean().optional(),
    familyDiabetesType2: zod_1.z.boolean().optional(),
    familyOther: zod_1.z.string().optional(),
    personalDiarrhea: zod_1.z.boolean().optional(),
    personalColitis: zod_1.z.boolean().optional(),
    personalReflux: zod_1.z.boolean().optional(),
    personalConstipation: zod_1.z.boolean().optional(),
    personalNausea: zod_1.z.boolean().optional(),
    personalGastritis: zod_1.z.boolean().optional(),
    personalVomiting: zod_1.z.boolean().optional(),
    personalOther: zod_1.z.string().optional(),
    labGlucose: zod_1.z.number().optional(),
    labCholesterol: zod_1.z.number().optional(),
    labTriglycerides: zod_1.z.number().optional(),
    physicalHair: zod_1.z.string().optional(),
    physicalMouth: zod_1.z.string().optional(),
    physicalTeeth: zod_1.z.string().optional(),
    physicalEyes: zod_1.z.string().optional(),
    physicalGums: zod_1.z.string().optional(),
    physicalNails: zod_1.z.string().optional(),
    bmi: zod_1.z.number().optional(),
    bmiClassification: zod_1.z.string().optional(),
    bodyFatPercentage: zod_1.z.number().optional(),
    visceralFat: zod_1.z.number().optional(),
    muscleMass: zod_1.z.number().optional(),
    biologicalAge: zod_1.z.number().int().optional(),
    restingMetabolism: zod_1.z.number().int().optional(),
    riskLevel: zod_1.z.string().optional(),
});
exports.createClinicalRecordSchema = zod_1.z.object({
    patientId: zod_1.z.string().uuid(),
    date: zod_1.z.string(),
}).merge(clinicalRecordFlatFieldsSchema);
exports.updateClinicalRecordSchema = zod_1.z.object({
    patientId: zod_1.z.string().uuid().optional(),
    date: zod_1.z.string().optional(),
}).merge(clinicalRecordFlatFieldsSchema.partial());
exports.recalculateMetricsSchema = zod_1.z.object({
    weightKg: zod_1.z.number().positive().optional(),
    heightCm: zod_1.z.number().positive().optional(),
    age: zod_1.z.number().int().positive().optional(),
    gender: zod_1.z.enum(["male", "female"]).optional(),
});
//# sourceMappingURL=clinicalRecordValidators.js.map