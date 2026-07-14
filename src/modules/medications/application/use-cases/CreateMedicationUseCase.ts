import type { MedicationRepository, CreateMedicationInput } from "@/modules/medications/domain/ports/repositories/MedicationRepository";

interface Input {
  patientUserId: string;
  name: string;
  dosage: string;
  reminderEnabled?: boolean;
  times: string[];
  days: string[];
  intervalHours?: number;
}

export class CreateMedicationUseCase {
  constructor(private readonly repository: MedicationRepository) {}

  async execute(input: Input) {
    const payload: CreateMedicationInput = {
      patientUserId: input.patientUserId,
      name: input.name,
      dosage: input.dosage,
      reminderEnabled: input.reminderEnabled ?? false,
      times: input.times,
      days: input.days,
      ...(input.intervalHours ? { intervalHours: input.intervalHours } : {}),
    };

    return this.repository.create(payload);
  }
}