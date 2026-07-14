import type { MedicationRepository, UpdateMedicationInput } from "@/modules/medications/domain/ports/repositories/MedicationRepository";

interface Input {
  id: string;
  patientUserId: string;
  name?: string;
  dosage?: string;
  reminderEnabled?: boolean;
  times?: string[];
  days?: string[];
  intervalHours?: number | null;
}

export class UpdateMedicationUseCase {
  constructor(private readonly repository: MedicationRepository) {}

  async execute(input: Input) {
    const existing = await this.repository.getById(input.id, input.patientUserId);
    if (!existing) return null;

    const updates: UpdateMedicationInput = {};
    if (input.name !== undefined) updates.name = input.name;
    if (input.dosage !== undefined) updates.dosage = input.dosage;
    if (input.reminderEnabled !== undefined) updates.reminderEnabled = input.reminderEnabled;
    if (input.times !== undefined) updates.times = input.times;
    if (input.days !== undefined) updates.days = input.days;
    if (input.intervalHours !== undefined) updates.intervalHours = input.intervalHours;

    return this.repository.update(input.id, input.patientUserId, updates);
  }
}