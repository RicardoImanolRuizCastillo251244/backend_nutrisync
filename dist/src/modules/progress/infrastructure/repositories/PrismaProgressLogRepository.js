"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaProgressLogRepository = void 0;
const prisma_1 = require("../../../../shared/infrastructure/database/prisma");
class PrismaProgressLogRepository {
    async create(input) {
        const bmi = input.heightCm && input.heightCm > 0
            ? Math.round((input.weightKg / ((input.heightCm / 100) ** 2)) * 100) / 100
            : null;
        const log = await prisma_1.prisma.progressLog.create({
            data: {
                patientUserId: input.patientUserId,
                weightKg: input.weightKg,
                bmi,
            },
        });
        return log;
    }
    async listByPatient(patientUserId, limit = 30) {
        const logs = await prisma_1.prisma.progressLog.findMany({
            where: { patientUserId },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
        return logs;
    }
    async findPatientByUserId(userId) {
        const patient = await prisma_1.prisma.patient.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (!patient)
            return null;
        return { patientId: patient.id };
    }
}
exports.PrismaProgressLogRepository = PrismaProgressLogRepository;
//# sourceMappingURL=PrismaProgressLogRepository.js.map