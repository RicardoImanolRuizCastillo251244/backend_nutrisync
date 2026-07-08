import type { SessionRepository } from "../../repositories/SessionRepository";
import { sha256 } from "../../../shared/utils/crypto";

export class LogoutUseCase {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(refreshToken: string) {
    const tokenHash = sha256(refreshToken);
    const session = await this.sessionRepository.findByTokenHash(tokenHash);
    if (session) {
      await this.sessionRepository.revokeSession(session.id);
    }
  }
}
