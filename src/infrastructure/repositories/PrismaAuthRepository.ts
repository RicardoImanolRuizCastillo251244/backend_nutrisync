import type { AuthRepository } from "../../core/repositories/AuthRepository";
import { prisma } from "../database/prisma";

export class PrismaAuthRepository implements AuthRepository {
  async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { patientProfile: true },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      nutritionistId: user.nutritionistId,
      createdAt: user.createdAt,
      passwordHash: user.passwordHash,
      patientProfileId: user.patientProfile?.id,
    };
  }

  async findUserById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;

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
