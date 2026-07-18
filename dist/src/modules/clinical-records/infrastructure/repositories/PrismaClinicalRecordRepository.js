"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClinicalRecordRepository = void 0;
const prisma_1 = require("@/shared/infrastructure/database/prisma");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cast = (v) => v;
class PrismaClinicalRecordRepository {
    async create(input) {
        return cast(prisma_1.prisma.clinicalRecord.create({ data: input }));
    }
    async getById(id, patientId) {
        const r = await prisma_1.prisma.clinicalRecord.findFirst({ where: { id, patientId, deletedAt: null } });
        return r ? cast(r) : null;
    }
    async listByPatient(patientId) {
        return cast(prisma_1.prisma.clinicalRecord.findMany({
            where: { patientId, deletedAt: null },
            orderBy: { date: "desc" },
        }));
    }
    async update(id, patientId, updates) {
        const existing = await prisma_1.prisma.clinicalRecord.findFirst({ where: { id, patientId, deletedAt: null } });
        if (!existing)
            return null;
        return cast(prisma_1.prisma.clinicalRecord.update({ where: { id }, data: updates }));
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