import type { AdherenceRepository, CreateHydrationLogInput } from "@/modules/adherence/domain/ports/repositories/AdherenceRepository";

interface Input {
  patientUserId: string;
  date: string;
  amountMl: number;
}

export class LogHydrationUseCase {
  constructor(private readonly repository: AdherenceRepository) {}

  async execute(input: Input) {
    const payload: CreateHydrationLogInput = {
      patientUserId: input.patientUserId,
      loggedAt: new Date(input.date),
      amountMl: input.amountMl,
    };

    return this.repository.createHydrationLog(payload);
  }
}