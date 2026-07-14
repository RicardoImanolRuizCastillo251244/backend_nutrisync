import type { AuthRepository } from "@/modules/auth/domain/ports/repositories/AuthRepository";
import type { SessionRepository } from "@/modules/auth/domain/ports/repositories/SessionRepository";
import { comparePassword } from "@/shared/infrastructure/security/hash";
import { signAccessToken, signRefreshToken } from "@/shared/infrastructure/security/jwt";
import { sha256 } from "@/shared/infrastructure/security/crypto";

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

    if (user.role === "patient" && !user.patientNutritionistId) {
      throw new Error("Tu cuenta aún no ha sido aprobada por un nutriólogo.");
    }

    const sessionId = crypto.randomUUID();
    const refreshToken = signRefreshToken({ sub: user.id, sessionId });
    const refreshTokenHash = sha256(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.sessionRepository.createSession(user.id, refreshTokenHash, expiresAt);

    const accessPayload: Record<string, unknown> = { sub: user.id, role: user.role };
    if (user.patientProfileId) accessPayload.patientId = user.patientProfileId;

    return {
      accessToken: signAccessToken(accessPayload),
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }
}