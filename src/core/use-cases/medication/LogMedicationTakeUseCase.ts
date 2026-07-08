import type { MedicationRepository } from "../../repositories/MedicationRepository";

interface Input {
  medicationId: string;
  patientUserId: string;
}

export class LogMedicationTakeUseCase {
  constructor(private readonly repository: MedicationRepository) {}

  async execute(input: Input) {
    return this.repository.logTake(input.medicationId, input.patientUserId);
  }
}