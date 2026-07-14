import type { ClinicalRecordRepository, ClinicalRecordInput, ClinicalRecordUpdateInput } from "@/modules/clinical-records/domain/ports/repositories/ClinicalRecordRepository";
import type { ClinicalRecordEntity } from "@/modules/clinical-records/domain/entities/ClinicalRecord";
import { prisma } from "@/shared/infrastructure/database/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cast = <T>(v: unknown): T => v as unknown as T;

export class PrismaClinicalRecordRepository implements ClinicalRecordRepository {
  async create(input: ClinicalRecordInput): Promise<ClinicalRecordEntity> {
    return cast<ClinicalRecordEntity>(prisma.clinicalRecord.create({ data: input }));
  }

  async getById(id: string, patientId: string): Promise<ClinicalRecordEntity | null> {
    const r = await prisma.clinicalRecord.findFirst({ where: { id, patientId, deletedAt: null } });
    return r ? cast<ClinicalRecordEntity>(r) : null;
  }

  async listByPatient(patientId: string): Promise<ClinicalRecordEntity[]> {
    return cast<ClinicalRecordEntity[]>(prisma.clinicalRecord.findMany({
      where: { patientId, deletedAt: null },
      orderBy: { date: "desc" },
    }));
  }

  async update(id: string, patientId: string, updates: ClinicalRecordUpdateInput): Promise<ClinicalRecordEntity | null> {
    const existing = await prisma.clinicalRecord.findFirst({ where: { id, patientId, deletedAt: null } });
    if (!existing) return null;
    return cast<ClinicalRecordEntity>(prisma.clinicalRecord.update({ where: { id }, data: updates }));
  }

  async softDelete(id: string, patientId: string): Promise<void> {
    await prisma.clinicalRecord.updateMany({
      where: { id, patientId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}