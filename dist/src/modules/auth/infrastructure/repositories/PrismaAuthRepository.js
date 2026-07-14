"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAuthRepository = void 0;
const prisma_1 = require("../../../../shared/infrastructure/database/prisma");
const cast = (v) => v;
class PrismaAuthRepository {
    async findUserByEmail(email) {
        const u = await prisma_1.prisma.user.findUnique({
            where: { email },
            include: { patientProfile: { select: { id: true, nutritionistUserId: true } } },
        });
        if (!u)
            return null;
        // Mapear patientProfile.nutritionistUserId → patientNutritionistId
        return {
            id: u.id,
            email: u.email,
            name: u.name,
            role: u.role,
            passwordHash: u.passwordHash,
            patientProfileId: u.patientProfile?.id ?? null,
            patientNutritionistId: u.patientProfile?.nutritionistUserId ?? null,
            createdAt: u.createdAt,
        };
    }
    async createUser(data) {
        return cast(prisma_1.prisma.user.create({ data }));
    }
    async createSession(userId, refreshTokenHash, expiresAt) {
        await prisma_1.prisma.refreshSession.create({ data: { userId, tokenHash: refreshTokenHash, expiresAt } });
    }
}
exports.PrismaAuthRepository = PrismaAuthRepository;
//# sourceMappingURL=PrismaAuthRepository.js.map