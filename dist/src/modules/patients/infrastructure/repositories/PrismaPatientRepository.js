"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPatientRepository = void 0;
const prisma_1 = require("@/shared/infrastructure/database/prisma");
const cast = (v) => v;
class PrismaPatientRepository {
    async findById(id) {
        const p = await prisma_1.prisma.patient.findUnique({
            where: { id },
            include: { user: { select: { id: true, email: true, name: true } } },
        });
        return p ? cast(p) : null;
    }
    async findByUserId(userId) {
        const p = await prisma_1.prisma.patient.findUnique({ where: { userId } });
        return p ? cast(p) : null;
    }
    async listByNutritionist(nutritionistUserId) {
        const rows = await prisma_1.prisma.patient.findMany({
            where: { nutritionistUserId, deletedAt: null },
            include: { user: { select: { id: true, email: true, name: true } } },
            orderBy: { createdAt: "desc" },
        });
        return cast(rows);
    }
    async listPending() {
        const rows = await prisma_1.prisma.patient.findMany({
            where: { nutritionistUserId: null, deletedAt: null, status: "pending" },
            include: { user: { select: { id: true, email: true, name: true } } },
            orderBy: { createdAt: "desc" },
        });
        return cast(rows);
    }
    async createPatientWithUser(input) {
        // Crear User con role "patient"
        const user = await prisma_1.prisma.user.create({
            data: {
                email: input.email,
                passwordHash: input.passwordHash,
                name: input.name,
                role: "patient",
            },
        });
        // Crear Patient vinculado al User
        const patient = await prisma_1.prisma.patient.create({
            data: {
                userId: user.id,
                phone: input.phone ?? null,
                birthDate: input.birthDate ?? null,
                gender: input.gender ?? null,
                status: "pending",
            },
        });
        return cast(patient);
    }
    async update(id, data) {
        try {
            return cast(prisma_1.prisma.patient.update({ where: { id }, data }));
        }
        catch {
            return null;
        }
    }
    async softDelete(id) {
        await prisma_1.prisma.patient.updateMany({ where: { id }, data: { deletedAt: new Date() } });
    }
    async linkToNutritionist(patientId, nutritionistUserId) {
        return cast(prisma_1.prisma.patient.update({
            where: { id: patientId },
            data: { nutritionistUserId, status: "active" },
        }));
    }
}
exports.PrismaPatientRepository = PrismaPatientRepository;
//# sourceMappingURL=PrismaPatientRepository.js.map