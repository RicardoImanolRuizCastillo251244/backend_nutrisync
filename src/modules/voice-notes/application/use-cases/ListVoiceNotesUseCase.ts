import type { VoiceNoteRepository } from "@/modules/voice-notes/domain/ports/repositories/VoiceNoteRepository";

export class ListVoiceNotesUseCase {
  constructor(private readonly repository: VoiceNoteRepository) {}

  async execute(patientUserId: string) {
    return this.repository.listByPatient(patientUserId);
  }
}