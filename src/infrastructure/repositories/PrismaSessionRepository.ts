import type { SessionRepository } from "../../core/repositories/SessionRepository";
import { prisma } from "../database/prisma";

export class PrismaSessionRepository implements SessionRepository {
  createSession(userId: string, tokenHash: string, expiresAt: Date) {
    return prisma.refreshSession.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

  findByTokenHash(tokenHash: string) {
    return prisma.refreshSession.findUnique({ where: { tokenHash } });
  }

  async revokeSession(id: string) {
    await prisma.refreshSession.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async replaceSession(id: string, replacementSessionId: string) {
    await prisma.refreshSession.update({
      where: { id },
      data: { revokedAt: new Date(), replacedBy: replacementSessionId },
    });
  }
}
