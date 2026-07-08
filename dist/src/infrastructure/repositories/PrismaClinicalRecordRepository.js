"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClinicalRecordRepository = void 0;
const prisma_1 = require("../database/prisma");
class PrismaClinicalRecordRepository {
    async create(input) {
        const record = await prisma_1.prisma.clinicalRecord.create({
            data: {
                patientId: input.patientId,
                date: input.date,
                data: JSON.parse(JSON.stringify(input.data)),
                bmi: input.bmi ?? null,
                bodyFatPercentage: input.bodyFatPercentage ?? null,
                riskLevel: input.riskLevel ?? null,
            },
        });
        return {
            ...record,
            data: record.data,
        };
    }
    async getById(id, patientId) {
        const record = await prisma_1.prisma.clinicalRecord.findFirst({
            where: { id, patientId },
        });
        if (!record)
            return null;
        return {
            ...record,
            data: record.data,
        };
    }
    async listByPatient(patientId) {
        const rows = await prisma_1.prisma.clinicalRecord.findMany({
            where: { patientId },
            orderBy: { date: "desc" },
        });
        return rows.map((row) => ({
            ...row,
            data: row.data,
        }));
    }
    async update(id, patientId, updates) {
        const existing = await prisma_1.prisma.clinicalRecord.findFirst({
            where: { id, patientId },
        });
        if (!existing)
            return null;
        const data = {};
        if (updates.date !== undefined)
            data.date = updates.date;
        if (updates.data !== undefined)
            data.data = JSON.parse(JSON.stringify(updates.data));
        if (updates.bmi !== undefined)
            data.bmi = updates.bmi;
        if (updates.bodyFatPercentage !== undefined)
            data.bodyFatPercentage = updates.bodyFatPercentage;
        if (updates.riskLevel !== undefined)
            data.riskLevel = updates.riskLevel;
        const updated = await prisma_1.prisma.clinicalRecord.update({
            where: { id },
            data,
        });
        return {
            ...updated,
            data: updated.data,
        };
    }
    async softDelete(id, patientId) {
        await prisma_1.prisma.clinicalRecord.deleteMany({
            where: { id, patientId },
        });
    }
}
exports.PrismaClinicalRecordRepository = PrismaClinicalRecordRepository;
//# sourceMappingURL=PrismaClinicalRecordRepository.js.map