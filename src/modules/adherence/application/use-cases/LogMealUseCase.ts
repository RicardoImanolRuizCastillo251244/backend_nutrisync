import type { AdherenceRepository, CreateMealLogInput } from "@/modules/adherence/domain/ports/repositories/AdherenceRepository";

interface Input {
  patientUserId: string;
  planId?: string;
  mealName: string;
  date: string;
  consumed?: boolean;
  consumedAt?: string;
}

export class LogMealUseCase {
  constructor(private readonly repository: AdherenceRepository) {}

  async execute(input: Input) {
    const payload: CreateMealLogInput = {
      patientUserId: input.patientUserId,
      mealName: input.mealName,
      date: new Date(input.date),
      consumed: input.consumed ?? false,
      ...(input.planId ? { planId: input.planId } : {}),
      ...(input.consumedAt ? { consumedAt: new Date(input.consumedAt) } : {}),
    };

    return this.repository.createMealLog(payload);
  }
}