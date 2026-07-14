import type { ProgressLogRepository, CreateProgressLogInput } from "@/modules/progress/domain/ports/repositories/ProgressLogRepository";

interface Input {
  patientUserId: string;
  weightKg: number;
  heightCm?: number;
}

export class LogProgressUseCase {
  constructor(private readonly repository: ProgressLogRepository) {}

  async execute(input: Input) {
    const payload: CreateProgressLogInput = {
      patientUserId: input.patientUserId,
      weightKg: input.weightKg,
      ...(input.heightCm ? { heightCm: input.heightCm } : {}),
    };

    return this.repository.create(payload);
  }
}