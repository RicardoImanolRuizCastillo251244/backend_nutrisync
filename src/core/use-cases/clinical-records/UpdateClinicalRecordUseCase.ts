import type { ClinicalRecordRepository, ClinicalRecordUpdateInput } from "../../repositories/ClinicalRecordRepository";

interface Input extends ClinicalRecordUpdateInput {
  id: string;
  patientId: string;
}

export class UpdateClinicalRecordUseCase {
  constructor(private readonly repository: ClinicalRecordRepository) {}

  async execute(input: Input) {
    const { id, patientId, ...updates } = input;
    return this.repository.update(id, patientId, updates);
  }
}