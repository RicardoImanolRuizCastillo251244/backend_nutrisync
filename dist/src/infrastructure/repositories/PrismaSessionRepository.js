"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaSessionRepository = void 0;
const prisma_1 = require("../database/prisma");
class PrismaSessionRepository {
    createSession(userId, tokenHash, expiresAt) {
        return prisma_1.prisma.refreshSession.create({
            data: {
                userId,
                tokenHash,
                expiresAt,
            },
        });
    }
    findByTokenHash(tokenHash) {
        return prisma_1.prisma.refreshSession.findUnique({ where: { tokenHash } });
    }
    async revokeSession(id) {
        await prisma_1.prisma.refreshSession.update({
            where: { id },
            data: { revokedAt: new Date() },
        });
    }
    async replaceSession(id, replacementSessionId) {
        await prisma_1.prisma.refreshSession.update({
            where: { id },
            data: { revokedAt: new Date(), replacedBy: replacementSessionId },
        });
    }
}
exports.PrismaSessionRepository = PrismaSessionRepository;
//# sourceMappingURL=PrismaSessionRepository.js.map