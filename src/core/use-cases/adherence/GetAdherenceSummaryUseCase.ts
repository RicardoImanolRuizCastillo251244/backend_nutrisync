import type { AdherenceRepository } from "../../repositories/AdherenceRepository";

interface Input {
  patientUserId: string;
  days?: number;
}

export class GetAdherenceSummaryUseCase {
  constructor(private readonly repository: AdherenceRepository) {}

  async execute(input: Input) {
    const days = input.days ?? 30;
    return this.repository.getSummary(input.patientUserId, days);
  }
}