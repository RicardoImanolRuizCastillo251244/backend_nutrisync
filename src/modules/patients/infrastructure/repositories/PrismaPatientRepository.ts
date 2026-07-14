import type { PatientRepository } from "@/modules/patients/domain/ports/repositories/PatientRepository";
import type { PatientEntity } from "@/modules/patients/domain/entities/Patient";
import { prisma } from "@/shared/infrastructure/database/prisma";

const cast = <T>(v: unknown): T => v as unknown as T;

export class PrismaPatientRepository implements PatientRepository {
  async findById(id: string): Promise<PatientEntity | null> {
    const p = await prisma.patient.findUnique({ where: { id } });
    return p ? cast<PatientEntity>(p) : null;
  }

  async findByUserId(userId: string): Promise<PatientEntity | null> {
    const p = await prisma.patient.findUnique({ where: { userId } });
    return p ? cast<PatientEntity>(p) : null;
  }

  async listByNutritionist(nutritionistUserId: string): Promise<PatientEntity[]> {
    return cast<PatientEntity[]>(prisma.patient.findMany({
      where: { nutritionistUserId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    }));
  }

  async update(id: string, data: Partial<Pick<PatientEntity, "nutritionistUserId" | "status" | "phone" | "birthDate" | "gender">>): Promise<PatientEntity | null> {
    try { return cast<PatientEntity>(prisma.patient.update({ where: { id }, data })); } catch { return null; }
  }

  async softDelete(id: string): Promise<void> {
    await prisma.patient.updateMany({ where: { id }, data: { deletedAt: new Date() } });
  }

  async linkToNutritionist(patientId: string, nutritionistUserId: string): Promise<PatientEntity> {
    return cast<PatientEntity>(prisma.patient.update({ where: { id: patientId }, data: { nutritionistUserId, status: "active" } }));
  }
}