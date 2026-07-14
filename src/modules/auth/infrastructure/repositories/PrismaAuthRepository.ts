import type { AuthRepository } from "@/modules/auth/domain/ports/repositories/AuthRepository";
import type { SessionRepository } from "@/modules/auth/domain/ports/repositories/SessionRepository";
import type { UserEntity } from "@/modules/auth/domain/entities/User";
import { prisma } from "@/shared/infrastructure/database/prisma";

const cast = <T>(v: unknown): T => v as unknown as T;

export class PrismaAuthRepository implements AuthRepository, SessionRepository {
  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const u = await prisma.user.findUnique({ where: { email } });
    return u ? cast<UserEntity>(u) : null;
  }

  async createUser(data: { email: string; name: string; passwordHash: string; role: "nutritionist" | "patient" }): Promise<UserEntity> {
    return cast<UserEntity>(prisma.user.create({ data }));
  }

  async createSession(userId: string, refreshTokenHash: string, expiresAt: Date): Promise<void> {
    await (prisma as any).refreshSession.create({ data: { userId, tokenHash: refreshTokenHash, expiresAt } });
  }
}