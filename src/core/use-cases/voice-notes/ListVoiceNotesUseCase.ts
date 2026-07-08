import type { VoiceNoteRepository } from "../../repositories/VoiceNoteRepository";

export class ListVoiceNotesUseCase {
  constructor(private readonly repository: VoiceNoteRepository) {}

  async execute(patientUserId: string) {
    return this.repository.listByPatient(patientUserId);
  }
}