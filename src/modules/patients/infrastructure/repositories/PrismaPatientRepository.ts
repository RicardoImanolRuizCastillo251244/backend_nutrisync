import type { PatientRepository, PatientWithUser, CreatePatientInput } from "@/modules/patients/domain/ports/repositories/PatientRepository";
import type { PatientEntity } from "@/modules/patients/domain/entities/Patient";
import { prisma } from "@/shared/infrastructure/database/prisma";

const cast = <T>(v: unknown): T => v as unknown as T;

export class PrismaPatientRepository implements PatientRepository {
  async findById(id: string): Promise<PatientWithUser | null> {
    const p = await prisma.patient.findUnique({
      where: { id },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
    return p ? cast<PatientWithUser>(p) : null;
  }

  async findByUserId(userId: string): Promise<PatientEntity | null> {
    const p = await prisma.patient.findUnique({ where: { userId } });
    return p ? cast<PatientEntity>(p) : null;
  }

  async listByNutritionist(nutritionistUserId: string): Promise<PatientWithUser[]> {
    const rows = await prisma.patient.findMany({
      where: { nutritionistUserId, deletedAt: null },
      include: { user: { select: { id: true, email: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return cast<PatientWithUser[]>(rows);
  }

  async listPending(): Promise<PatientWithUser[]> {
    const rows = await prisma.patient.findMany({
      where: { nutritionistUserId: null, deletedAt: null, status: "pending" },
      include: { user: { select: { id: true, email: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return cast<PatientWithUser[]>(rows);
  }

  async createPatientWithUser(input: CreatePatientInput): Promise<PatientEntity> {
    // Crear User con role "patient"
    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        name: input.name,
        role: "patient",
      },
    });

    // Crear Patient vinculado al User
    const patient = await prisma.patient.create({
      data: {
        userId: user.id,
        phone: input.phone ?? null,
        birthDate: input.birthDate ?? null,
        gender: input.gender ?? null,
        status: "pending",
      },
    });

    return cast<PatientEntity>(patient);
  }

  async update(id: string, data: Partial<Pick<PatientEntity, "nutritionistUserId" | "status" | "phone" | "birthDate" | "gender">>): Promise<PatientEntity | null> {
    try {
      return cast<PatientEntity>(prisma.patient.update({ where: { id }, data }));
    } catch {
      return null;
    }
  }

  async softDelete(id: string): Promise<void> {
    await prisma.patient.updateMany({ where: { id }, data: { deletedAt: new Date() } });
  }

  async linkToNutritionist(patientId: string, nutritionistUserId: string): Promise<PatientEntity> {
    return cast<PatientEntity>(prisma.patient.update({
      where: { id: patientId },
      data: { nutritionistUserId, status: "active" },
    }));
  }
}