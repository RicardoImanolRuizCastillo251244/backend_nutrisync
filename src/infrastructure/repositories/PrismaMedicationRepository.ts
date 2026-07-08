import type {
  MedicationRepository,
  CreateMedicationInput,
  UpdateMedicationInput,
} from "../../core/repositories/MedicationRepository";
import { prisma } from "../database/prisma";

export class PrismaMedicationRepository implements MedicationRepository {
  async create(input: CreateMedicationInput) {
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

    return med;
  }

  async getById(id: string, patientUserId: string) {
    const med = await prisma.medication.findFirst({
      where: { id, patientUserId },
    });

    if (!med) return null;
    return med;
  }

  async listByPatient(patientUserId: string) {
    return prisma.medication.findMany({
      where: { patientUserId },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(id: string, patientUserId: string, updates: UpdateMedicationInput) {
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

    return prisma.medication.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, patientUserId: string) {
    await prisma.medication.deleteMany({
      where: { id, patientUserId },
    });
  }

  async logTake(medicationId: string, patientUserId: string) {
    // Verify medication belongs to patient
    const med = await prisma.medication.findFirst({
      where: { id: medicationId, patientUserId },
    });

    if (!med) throw new Error("Medication not found");

    return prisma.medicationTake.create({
      data: { medicationId },
    });
  }

  async listTakes(medicationId: string, patientUserId: string) {
    // Verify ownership
    const med = await prisma.medication.findFirst({
      where: { id: medicationId, patientUserId },
    });

    if (!med) throw new Error("Medication not found");

    return prisma.medicationTake.findMany({
      where: { medicationId },
      orderBy: { takenAt: "desc" },
    });
  }
}