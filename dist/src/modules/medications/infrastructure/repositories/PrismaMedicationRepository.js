"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaMedicationRepository = void 0;
const prisma_1 = require("@/shared/infrastructure/database/prisma");
class PrismaMedicationRepository {
    async create(input) {
        const med = await prisma_1.prisma.medication.create({
            data: {
                patientUserId: input.patientUserId,
                name: input.name,
                dosage: input.dosage,
                reminderEnabled: input.reminderEnabled ?? false,
                times: input.times,
                days: input.days,
                intervalHours: input.intervalHours ?? null,
            },
        });
        return med;
    }
    async getById(id, patientUserId) {
        const med = await prisma_1.prisma.medication.findFirst({
            where: { id, patientUserId },
        });
        if (!med)
            return null;
        return med;
    }
    async listByPatient(patientUserId) {
        const meds = await prisma_1.prisma.medication.findMany({
            where: { patientUserId },
            orderBy: { createdAt: "desc" },
        });
        return meds;
    }
    async update(id, patientUserId, updates) {
        const existing = await prisma_1.prisma.medication.findFirst({
            where: { id, patientUserId },
        });
        if (!existing)
            return null;
        const data = {};
        if (updates.name !== undefined)
            data.name = updates.name;
        if (updates.dosage !== undefined)
            data.dosage = updates.dosage;
        if (updates.reminderEnabled !== undefined)
            data.reminderEnabled = updates.reminderEnabled;
        if (updates.times !== undefined)
            data.times = updates.times;
        if (updates.days !== undefined)
            data.days = updates.days;
        if (updates.intervalHours !== undefined)
            data.intervalHours = updates.intervalHours;
        const updated = await prisma_1.prisma.medication.update({
            where: { id },
            data,
        });
        return updated;
    }
    async delete(id, patientUserId) {
        await prisma_1.prisma.medication.deleteMany({
            where: { id, patientUserId },
        });
    }
    async logTake(medicationId, patientUserId) {
        const med = await prisma_1.prisma.medication.findFirst({
            where: { id: medicationId, patientUserId },
        });
        if (!med)
            throw new Error("Medication not found");
        const take = await prisma_1.prisma.medicationTake.create({
            data: { medicationId },
        });
        return take;
    }
    async listTakes(medicationId, patientUserId) {
        const med = await prisma_1.prisma.medication.findFirst({
            where: { id: medicationId, patientUserId },
        });
        if (!med)
            throw new Error("Medication not found");
        const takes = await prisma_1.prisma.medicationTake.findMany({
            where: { medicationId },
            orderBy: { takenAt: "desc" },
        });
        return takes;
    }
}
exports.PrismaMedicationRepository = PrismaMedicationRepository;
//# sourceMappingURL=PrismaMedicationRepository.js.map