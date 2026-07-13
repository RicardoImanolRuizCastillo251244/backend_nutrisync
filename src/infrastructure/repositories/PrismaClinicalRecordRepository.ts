import type {
  ClinicalRecordRepository,
  ClinicalRecordInput,
  ClinicalRecordUpdateInput,
} from "../../core/repositories/ClinicalRecordRepository";
import { prisma } from "../database/prisma";
import type { ClinicalRecordEntity } from "../../core/domain/entities/ClinicalRecord";

function mapRow(row: any): ClinicalRecordEntity {
  return {
    id: row.id,
    patientId: row.patientId,
    date: row.date,
    name: row.name,
    sex: row.sex,
    age: row.age,
    occupation: row.occupation,
    bloodType: row.bloodType,
    consultationReason: row.consultationReason,
    phone: row.phone,
    weightKg: row.weightKg,
    heightCm: row.heightCm,
    maritalStatus: row.maritalStatus,
    allergies: row.allergies,
    feedingDifficulty: row.feedingDifficulty,
    address: row.address,
    familyObesity: row.familyObesity,
    familyCancer: row.familyCancer,
    familyHypertension: row.familyHypertension,
    familyHIV: row.familyHIV,
    familyDiabetesType1: row.familyDiabetesType1,
    familyDiabetesType2: row.familyDiabetesType2,
    familyOther: row.familyOther,
    personalDiarrhea: row.personalDiarrhea,
    personalColitis: row.personalColitis,
    personalReflux: row.personalReflux,
    personalConstipation: row.personalConstipation,
    personalNausea: row.personalNausea,
    personalGastritis: row.personalGastritis,
    personalVomiting: row.personalVomiting,
    personalOther: row.personalOther,
    labGlucose: row.labGlucose,
    labCholesterol: row.labCholesterol,
    labTriglycerides: row.labTriglycerides,
    physicalHair: row.physicalHair,
    physicalMouth: row.physicalMouth,
    physicalTeeth: row.physicalTeeth,
    physicalEyes: row.physicalEyes,
    physicalGums: row.physicalGums,
    physicalNails: row.physicalNails,
    bmi: row.bmi,
    bmiClassification: row.bmiClassification,
    bodyFatPercentage: row.bodyFatPercentage,
    visceralFat: row.visceralFat,
    muscleMass: row.muscleMass,
    biologicalAge: row.biologicalAge,
    restingMetabolism: row.restingMetabolism,
    riskLevel: row.riskLevel,
    deletedAt: row.deletedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaClinicalRecordRepository implements ClinicalRecordRepository {
  async create(input: ClinicalRecordInput) {
    const record = await prisma.clinicalRecord.create({
      data: input,
    });
    return mapRow(record);
  }

  async getById(id: string, patientId: string) {
    const record = await prisma.clinicalRecord.findFirst({
      where: { id, patientId, deletedAt: null },
    });
    if (!record) return null;
    return mapRow(record);
  }

  async listByPatient(patientId: string) {
    const rows = await prisma.clinicalRecord.findMany({
      where: { patientId, deletedAt: null },
      orderBy: { date: "desc" },
    });
    return rows.map(mapRow);
  }

  async update(id: string, patientId: string, updates: ClinicalRecordUpdateInput) {
    const existing = await prisma.clinicalRecord.findFirst({
      where: { id, patientId, deletedAt: null },
    });
    if (!existing) return null;

    const updated = await prisma.clinicalRecord.update({
      where: { id },
      data: updates,
    });
    return mapRow(updated);
  }

  async softDelete(id: string, patientId: string) {
    await prisma.clinicalRecord.updateMany({
      where: { id, patientId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}