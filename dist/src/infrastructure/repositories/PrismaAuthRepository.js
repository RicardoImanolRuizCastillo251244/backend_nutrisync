"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAuthRepository = void 0;
const prisma_1 = require("../database/prisma");
class PrismaAuthRepository {
    async findUserByEmail(email) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
            include: { patientProfile: true },
        });
        if (!user)
            return null;
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            nutritionistId: user.nutritionistId,
            createdAt: user.createdAt,
            passwordHash: user.passwordHash,
            patientProfileId: user.patientProfile?.id,
            patientNutritionistId: user.patientProfile?.nutritionistUserId ?? null,
        };
    }
    async findUserById(id) {
        const user = await prisma_1.prisma.user.findUnique({ where: { id } });
        if (!user)
            return null;
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            nutritionistId: user.nutritionistId,
            createdAt: user.createdAt,
        };
    }
}
exports.PrismaAuthRepository = PrismaAuthRepository;
//# sourceMappingURL=PrismaAuthRepository.js.map