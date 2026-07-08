import type { AdherenceRepository, CreateHydrationLogInput } from "../../repositories/AdherenceRepository";

interface Input {
  patientUserId: string;
  amountMl: number;
}

export class LogHydrationUseCase {
  constructor(private readonly repository: AdherenceRepository) {}

  async execute(input: Input) {
    const payload: CreateHydrationLogInput = {
      patientUserId: input.patientUserId,
      amountMl: input.amountMl,
    };

    return this.repository.createHydrationLog(payload);
  }
}