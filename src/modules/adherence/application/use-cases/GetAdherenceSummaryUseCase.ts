import type { AdherenceRepository } from "@/modules/adherence/domain/ports/repositories/AdherenceRepository";

export class GetAdherenceSummaryUseCase {
  constructor(private readonly repository: AdherenceRepository) {}

  async execute(patientUserId: string, date?: string) {
    return this.repository.getSummary(patientUserId, date ? new Date(date) : undefined);
  }
}