import type { AdherenceRepository, CreateMoodLogInput } from "@/modules/adherence/domain/ports/repositories/AdherenceRepository";

interface Input {
  patientUserId: string;
  date: string;
  mood: string;
  note?: string;
}

export class LogMoodUseCase {
  constructor(private readonly repository: AdherenceRepository) {}

  async execute(input: Input) {
    const payload: CreateMoodLogInput = {
      patientUserId: input.patientUserId,
      date: new Date(input.date),
      mood: input.mood,
      ...(input.note ? { note: input.note } : {}),
    };

    return this.repository.createMoodLog(payload);
  }
}