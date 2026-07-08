import type {
  CreatePatientInput,
  PatientRepository,
} from "../../core/repositories/PatientRepository";
import { prisma } from "../database/prisma";

export class PrismaPatientRepository implements PatientRepository {
  async create(input: CreatePatientInput) {
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
          role: "patient" as const,
          name: input.name,
          ...(input.nutritionistUserId ? { nutritionistId: input.nutritionistUserId } : {}),
        },
      },
    };

    const created = await prisma.patient.create({
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

  async listByNutritionist(nutritionistUserId: string) {
    const rows = await prisma.patient.findMany({
      where: { nutritionistUserId, deletedAt: null },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return rows.map((row: (typeof rows)[number]) => ({
      ...row,
      user: {
        id: row.user.id,
        email: row.user.email,
        name: row.user.name,
      },
    }));
  }

  async getById(id: string, nutritionistUserId: string) {
    const row = await prisma.patient.findFirst({
      where: { id, nutritionistUserId, deletedAt: null },
      include: { user: true },
    });

    if (!row) return null;

    return {
      ...row,
      user: {
        id: row.user.id,
        email: row.user.email,
        name: row.user.name,
      },
    };
  }

  async update(id: string, nutritionistUserId: string, updates: { name?: string; phone?: string; birthDate?: Date; gender?: "male" | "female" | "other"; }) {
    const row = await prisma.patient.findFirst({
      where: { id, nutritionistUserId, deletedAt: null },
      include: { user: true },
    });

    if (!row) return null;

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

    const updated = await prisma.patient.update({
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
    const rows = await prisma.patient.findMany({
      where: { status: "pending", deletedAt: null },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return rows.map((row: (typeof rows)[number]) => ({
      ...row,
      user: {
        id: row.user.id,
        email: row.user.email,
        name: row.user.name,
      },
    }));
  }

  async approve(id: string, nutritionistUserId: string) {
    const existing = await prisma.patient.findFirst({
      where: { id, status: "pending", deletedAt: null },
    });

    if (!existing) return null;

    const updated = await prisma.patient.update({
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

  async softDelete(id: string, nutritionistUserId: string) {
    await prisma.patient.updateMany({
      where: { id, nutritionistUserId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}
