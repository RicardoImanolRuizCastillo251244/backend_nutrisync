"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClinicalRecordRepository = void 0;
const prisma_1 = require("../database/prisma");
function mapRow(row) {
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
class PrismaClinicalRecordRepository {
    async create(input) {
        const record = await prisma_1.prisma.clinicalRecord.create({
            data: input,
        });
        return mapRow(record);
    }
    async getById(id, patientId) {
        const record = await prisma_1.prisma.clinicalRecord.findFirst({
            where: { id, patientId, deletedAt: null },
        });
        if (!record)
            return null;
        return mapRow(record);
    }
    async listByPatient(patientId) {
        const rows = await prisma_1.prisma.clinicalRecord.findMany({
            where: { patientId, deletedAt: null },
            orderBy: { date: "desc" },
        });
        return rows.map(mapRow);
    }
    async update(id, patientId, updates) {
        const existing = await prisma_1.prisma.clinicalRecord.findFirst({
            where: { id, patientId, deletedAt: null },
        });
        if (!existing)
            return null;
        const updated = await prisma_1.prisma.clinicalRecord.update({
            where: { id },
            data: updates,
        });
        return mapRow(updated);
    }
    async softDelete(id, patientId) {
        await prisma_1.prisma.clinicalRecord.updateMany({
            where: { id, patientId, deletedAt: null },
            data: { deletedAt: new Date() },
        });
    }
}
exports.PrismaClinicalRecordRepository = PrismaClinicalRecordRepository;
//# sourceMappingURL=PrismaClinicalRecordRepository.js.map