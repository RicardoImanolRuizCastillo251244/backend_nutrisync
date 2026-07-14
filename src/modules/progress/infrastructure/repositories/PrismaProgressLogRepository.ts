import type { ProgressLogRepository, CreateProgressLogInput } from "@/modules/progress/domain/ports/repositories/ProgressLogRepository";
import type { ProgressLogEntity } from "@/modules/progress/domain/entities/ProgressLog";
import { prisma } from "@/shared/infrastructure/database/prisma";

export class PrismaProgressLogRepository implements ProgressLogRepository {
  async create(input: CreateProgressLogInput): Promise<ProgressLogEntity> {
    const bmi = input.heightCm && input.heightCm > 0
      ? Math.round((input.weightKg / ((input.heightCm / 100) ** 2)) * 100) / 100
      : null;

    const log = await prisma.progressLog.create({
      data: {
        patientUserId: input.patientUserId,
        weightKg: input.weightKg,
        bmi,
      },
    });

    return log as ProgressLogEntity;
  }

  async listByPatient(patientUserId: string, limit = 30): Promise<ProgressLogEntity[]> {
    const logs = await prisma.progressLog.findMany({
      where: { patientUserId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return logs as ProgressLogEntity[];
  }

  async findPatientByUserId(userId: string): Promise<{ patientId: string } | null> {
    const patient = await prisma.patient.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!patient) return null;
    return { patientId: patient.id };
  }
}