import type {
  MedicationRepository,
  CreateMedicationInput,
  UpdateMedicationInput,
} from "@/modules/medications/domain/ports/repositories/MedicationRepository";
import type { MedicationEntity, MedicationTakeEntity } from "@/modules/medications/domain/entities/Medication";
import { prisma } from "@/shared/infrastructure/database/prisma";

export class PrismaMedicationRepository implements MedicationRepository {
  async create(input: CreateMedicationInput): Promise<MedicationEntity> {
    const med = await prisma.medication.create({
      data: {
        patientUserId: input.patientUserId,
        name: input.name,
        dosage: input.dosage,
        reminderEnabled: input.reminderEnabled ?? false,
        times: input.times,
        days: input.days,
        intervalHours: input.intervalHours ?? null,
      },
    });

    return med as MedicationEntity;
  }

  async getById(id: string, patientUserId: string): Promise<MedicationEntity | null> {
    const med = await prisma.medication.findFirst({
      where: { id, patientUserId },
    });

    if (!med) return null;
    return med as MedicationEntity;
  }

  async listByPatient(patientUserId: string): Promise<MedicationEntity[]> {
    const meds = await prisma.medication.findMany({
      where: { patientUserId },
      orderBy: { createdAt: "desc" },
    });

    return meds as MedicationEntity[];
  }

  async update(id: string, patientUserId: string, updates: UpdateMedicationInput): Promise<MedicationEntity | null> {
    const existing = await prisma.medication.findFirst({
      where: { id, patientUserId },
    });

    if (!existing) return null;

    const data: Record<string, unknown> = {};
    if (updates.name !== undefined) data.name = updates.name;
    if (updates.dosage !== undefined) data.dosage = updates.dosage;
    if (updates.reminderEnabled !== undefined) data.reminderEnabled = updates.reminderEnabled;
    if (updates.times !== undefined) data.times = updates.times;
    if (updates.days !== undefined) data.days = updates.days;
    if (updates.intervalHours !== undefined) data.intervalHours = updates.intervalHours;

    const updated = await prisma.medication.update({
      where: { id },
      data,
    });

    return updated as MedicationEntity;
  }

  async delete(id: string, patientUserId: string): Promise<void> {
    await prisma.medication.deleteMany({
      where: { id, patientUserId },
    });
  }

  async logTake(medicationId: string, patientUserId: string): Promise<MedicationTakeEntity> {
    const med = await prisma.medication.findFirst({
      where: { id: medicationId, patientUserId },
    });

    if (!med) throw new Error("Medication not found");

    const take = await prisma.medicationTake.create({
      data: { medicationId },
    });

    return take as MedicationTakeEntity;
  }

  async listTakes(medicationId: string, patientUserId: string): Promise<MedicationTakeEntity[]> {
    const med = await prisma.medication.findFirst({
      where: { id: medicationId, patientUserId },
    });

    if (!med) throw new Error("Medication not found");

    const takes = await prisma.medicationTake.findMany({
      where: { medicationId },
      orderBy: { takenAt: "desc" },
    });

    return takes as MedicationTakeEntity[];
  }
}