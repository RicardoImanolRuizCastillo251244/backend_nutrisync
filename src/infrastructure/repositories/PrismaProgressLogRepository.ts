import type { ProgressLogRepository, CreateProgressLogInput } from "../../core/repositories/ProgressLogRepository";
import { prisma } from "../database/prisma";

export class PrismaProgressLogRepository implements ProgressLogRepository {
  async create(input: CreateProgressLogInput) {
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

    return log;
  }

  async listByPatient(patientUserId: string, limit = 30) {
    return prisma.progressLog.findMany({
      where: { patientUserId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async findPatientByUserId(userId: string) {
    const patient = await prisma.patient.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!patient) return null;
    return { patientId: patient.id };
  }
}