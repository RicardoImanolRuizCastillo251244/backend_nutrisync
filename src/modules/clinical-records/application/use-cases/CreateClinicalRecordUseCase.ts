import type { ClinicalRecordRepository, ClinicalRecordInput } from "@/modules/clinical-records/domain/ports/repositories/ClinicalRecordRepository";

type Input = ClinicalRecordInput;

export class CreateClinicalRecordUseCase {
  constructor(private readonly repository: ClinicalRecordRepository) {}

  async execute(input: Input) {
    return this.repository.create(input);
  }
}