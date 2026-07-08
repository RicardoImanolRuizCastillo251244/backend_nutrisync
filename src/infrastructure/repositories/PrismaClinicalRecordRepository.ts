import type {
  ClinicalRecordRepository,
  CreateClinicalRecordInput,
  UpdateClinicalRecordInput,
} from "../../core/repositories/ClinicalRecordRepository";
import { prisma } from "../database/prisma";

export class PrismaClinicalRecordRepository implements ClinicalRecordRepository {
  async create(input: CreateClinicalRecordInput) {
    const record = await prisma.clinicalRecord.create({
      data: {
        patientId: input.patientId,
        date: input.date,
        data: JSON.parse(JSON.stringify(input.data)),
        bmi: input.bmi ?? null,
        bodyFatPercentage: input.bodyFatPercentage ?? null,
        riskLevel: input.riskLevel ?? null,
      },
    });

    return {
      ...record,
      data: record.data as unknown as Record<string, unknown>,
    };
  }

  async getById(id: string, patientId: string) {
    const record = await prisma.clinicalRecord.findFirst({
      where: { id, patientId },
    });

    if (!record) return null;

    return {
      ...record,
      data: record.data as unknown as Record<string, unknown>,
    };
  }

  async listByPatient(patientId: string) {
    const rows = await prisma.clinicalRecord.findMany({
      where: { patientId },
      orderBy: { date: "desc" },
    });

    return rows.map((row) => ({
      ...row,
      data: row.data as unknown as Record<string, unknown>,
    }));
  }

  async update(id: string, patientId: string, updates: UpdateClinicalRecordInput) {
    const existing = await prisma.clinicalRecord.findFirst({
      where: { id, patientId },
    });

    if (!existing) return null;

    const data: Record<string, unknown> = {};
    if (updates.date !== undefined) data.date = updates.date;
    if (updates.data !== undefined) data.data = JSON.parse(JSON.stringify(updates.data));
    if (updates.bmi !== undefined) data.bmi = updates.bmi;
    if (updates.bodyFatPercentage !== undefined) data.bodyFatPercentage = updates.bodyFatPercentage;
    if (updates.riskLevel !== undefined) data.riskLevel = updates.riskLevel;

    const updated = await prisma.clinicalRecord.update({
      where: { id },
      data,
    });

    return {
      ...updated,
      data: updated.data as unknown as Record<string, unknown>,
    };
  }

  async softDelete(id: string, patientId: string) {
    await prisma.clinicalRecord.deleteMany({
      where: { id, patientId },
    });
  }
}