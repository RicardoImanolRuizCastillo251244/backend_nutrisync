import type { AuthRepository } from "../../repositories/AuthRepository";
import type { SessionRepository } from "../../repositories/SessionRepository";
import { comparePassword } from "../../../shared/utils/hash";
import { signAccessToken, signRefreshToken } from "../../../shared/utils/jwt";
import { sha256 } from "../../../shared/utils/crypto";

export class LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionRepository: SessionRepository
  ) {}

  async execute(email: string, password: string) {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) throw new Error("Invalid credentials");

    const sessionId = crypto.randomUUID();
    const refreshToken = signRefreshToken({ sub: user.id, sessionId });
    const refreshTokenHash = sha256(refreshToken);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.sessionRepository.createSession(user.id, refreshTokenHash, expiresAt);

    const accessPayload = {
      sub: user.id,
      role: user.role,
      ...(user.patientProfileId ? { patientId: user.patientProfileId } : {}),
    };

    const accessToken = signAccessToken(accessPayload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
