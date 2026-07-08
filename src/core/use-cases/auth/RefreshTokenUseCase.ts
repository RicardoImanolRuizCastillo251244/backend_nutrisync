import type { AuthRepository } from "../../repositories/AuthRepository";
import type { SessionRepository } from "../../repositories/SessionRepository";
import { sha256 } from "../../../shared/utils/crypto";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../../shared/utils/jwt";

export class RefreshTokenUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionRepository: SessionRepository
  ) {}

  async execute(token: string) {
    const payload = verifyRefreshToken(token);
    const tokenHash = sha256(token);
    const session = await this.sessionRepository.findByTokenHash(tokenHash);

    if (!session || session.revokedAt || session.expiresAt <= new Date()) {
      throw new Error("Invalid refresh token");
    }

    const user = await this.authRepository.findUserById(payload.sub);
    if (!user) throw new Error("User not found");

    const replacementSessionId = crypto.randomUUID();
    const nextRefreshToken = signRefreshToken({ sub: user.id, sessionId: replacementSessionId });
    const nextRefreshHash = sha256(nextRefreshToken);

    await this.sessionRepository.createSession(
      user.id,
      nextRefreshHash,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    await this.sessionRepository.replaceSession(session.id, replacementSessionId);

    const accessToken = signAccessToken({ sub: user.id, role: user.role });

    return {
      accessToken,
      refreshToken: nextRefreshToken,
    };
  }
}
