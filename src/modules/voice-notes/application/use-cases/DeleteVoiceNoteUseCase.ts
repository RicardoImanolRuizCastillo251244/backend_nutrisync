import type { VoiceNoteRepository } from "@/modules/voice-notes/domain/ports/repositories/VoiceNoteRepository";

interface Input {
  id: string;
  patientUserId: string;
}

export class DeleteVoiceNoteUseCase {
  constructor(private readonly repository: VoiceNoteRepository) {}

  async execute(input: Input) {
    return this.repository.delete(input.id, input.patientUserId);
  }
}