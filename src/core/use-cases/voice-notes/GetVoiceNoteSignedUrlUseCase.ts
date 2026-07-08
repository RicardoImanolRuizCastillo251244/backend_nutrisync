import type { VoiceNoteRepository } from "../../repositories/VoiceNoteRepository";

interface Input {
  key: string;
  expiresInSeconds?: number;
}

export class GetVoiceNoteSignedUrlUseCase {
  constructor(private readonly repository: VoiceNoteRepository) {}

  async execute(input: Input) {
    return this.repository.getSignedUrl(input.key, input.expiresInSeconds);
  }
}