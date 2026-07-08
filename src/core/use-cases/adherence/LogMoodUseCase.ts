import type { AdherenceRepository, CreateMoodLogInput } from "../../repositories/AdherenceRepository";

interface Input {
  patientUserId: string;
  mood: string;
  note?: string;
}

export class LogMoodUseCase {
  constructor(private readonly repository: AdherenceRepository) {}

  async execute(input: Input) {
    const payload: CreateMoodLogInput = {
      patientUserId: input.patientUserId,
      mood: input.mood,
      ...(input.note ? { note: input.note } : {}),
    };

    return this.repository.createMoodLog(payload);
  }
}