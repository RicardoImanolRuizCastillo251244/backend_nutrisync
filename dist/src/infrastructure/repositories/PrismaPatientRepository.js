"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPatientRepository = void 0;
const prisma_1 = require("../database/prisma");
const SupabaseStorageService_1 = require("../storage/SupabaseStorageService");
const client_1 = require("../../generated/prisma/client");
const DuplicateEmailError_1 = require("../../shared/errors/DuplicateEmailError");
const storage = new SupabaseStorageService_1.SupabaseStorageService();
class PrismaPatientRepository {
    async create(input) {
        const data = {
            ...(input.nutritionistUserId ? { nutritionistUserId: input.nutritionistUserId } : {}),
            status: input.nutritionistUserId ? "active" : "pending",
            ...(input.phone ? { phone: input.phone } : {}),
            ...(input.birthDate ? { birthDate: input.birthDate } : {}),
            ...(input.gender ? { gender: input.gender } : {}),
            user: {
                create: {
                    email: input.email,
                    passwordHash: input.passwordHash,
                    role: "patient",
                    name: input.name,
                    ...(input.nutritionistUserId ? { nutritionistId: input.nutritionistUserId } : {}),
                },
            },
        };
        try {
            const created = await prisma_1.prisma.patient.create({
                data,
                include: { user: true },
            });
            return {
                ...created,
                user: {
                    id: created.user.id,
                    email: created.user.email,
                    name: created.user.name,
                },
            };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002") {
                throw new DuplicateEmailError_1.DuplicateEmailError(input.email);
            }
            throw error;
        }
    }
    async listByNutritionist(nutritionistUserId) {
        const rows = await prisma_1.prisma.patient.findMany({
            where: { nutritionistUserId, deletedAt: null },
            include: { user: true },
            orderBy: { createdAt: "desc" },
        });
        return rows.map((row) => ({
            ...row,
            user: {
                id: row.user.id,
                email: row.user.email,
                name: row.user.name,
            },
        }));
    }
    async getById(id, nutritionistUserId) {
        const row = await prisma_1.prisma.patient.findFirst({
            where: { id, nutritionistUserId, deletedAt: null },
            include: { user: true },
        });
        if (!row)
            return null;
        return {
            ...row,
            user: {
                id: row.user.id,
                email: row.user.email,
                name: row.user.name,
            },
        };
    }
    async update(id, nutritionistUserId, updates) {
        const row = await prisma_1.prisma.patient.findFirst({
            where: { id, nutritionistUserId, deletedAt: null },
            include: { user: true },
        });
        if (!row)
            return null;
        const data = {
            ...(updates.phone ? { phone: updates.phone } : {}),
            ...(updates.birthDate ? { birthDate: updates.birthDate } : {}),
            ...(updates.gender ? { gender: updates.gender } : {}),
            ...(updates.name
                ? {
                    user: {
                        update: {
                            name: updates.name,
                        },
                    },
                }
                : {}),
        };
        const updated = await prisma_1.prisma.patient.update({
            where: { id: row.id },
            data,
            include: { user: true },
        });
        return {
            ...updated,
            user: {
                id: updated.user.id,
                email: updated.user.email,
                name: updated.user.name,
            },
        };
    }
    async listPending() {
        const rows = await prisma_1.prisma.patient.findMany({
            where: { status: "pending", deletedAt: null },
            include: { user: true },
            orderBy: { createdAt: "desc" },
        });
        return rows.map((row) => ({
            ...row,
            user: {
                id: row.user.id,
                email: row.user.email,
                name: row.user.name,
            },
        }));
    }
    async approve(id, nutritionistUserId) {
        const existing = await prisma_1.prisma.patient.findFirst({
            where: { id, status: "pending", deletedAt: null },
        });
        if (!existing)
            return null;
        const updated = await prisma_1.prisma.patient.update({
            where: { id },
            data: {
                nutritionistUserId,
                status: "active",
                user: {
                    update: {
                        nutritionistId: nutritionistUserId,
                    },
                },
            },
            include: { user: true },
        });
        return {
            ...updated,
            user: {
                id: updated.user.id,
                email: updated.user.email,
                name: updated.user.name,
            },
        };
    }
    async hardDelete(id, nutritionistUserId) {
        const row = await prisma_1.prisma.patient.findFirst({
            where: {
                id,
                deletedAt: null,
                OR: [{ nutritionistUserId }, { status: "pending" }],
            },
            select: { id: true, userId: true },
        });
        if (!row)
            return false;
        const notes = await prisma_1.prisma.voiceNote.findMany({
            where: { patientUserId: row.userId },
            select: { storageKey: true },
        });
        const keys = notes
            .map((note) => note.storageKey)
            .filter((key) => Boolean(key));
        await storage.deleteObjects(keys);
        await prisma_1.prisma.$transaction(async (tx) => {
            await tx.user.delete({ where: { id: row.userId } });
        });
        return true;
    }
}
exports.PrismaPatientRepository = PrismaPatientRepository;
//# sourceMappingURL=PrismaPatientRepository.js.map