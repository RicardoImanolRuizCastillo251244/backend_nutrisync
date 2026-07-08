import type { Request, Response } from "express";
import { LoginUseCase } from "../../core/use-cases/auth/LoginUseCase";
import { LogoutUseCase } from "../../core/use-cases/auth/LogoutUseCase";
import { RefreshTokenUseCase } from "../../core/use-cases/auth/RefreshTokenUseCase";
import { PrismaAuthRepository } from "../../infrastructure/repositories/PrismaAuthRepository";
import { PrismaSessionRepository } from "../../infrastructure/repositories/PrismaSessionRepository";
import { PrismaPatientRepository } from "../../infrastructure/repositories/PrismaPatientRepository";
import { hashPassword } from "../../shared/utils/hash";
import { sha256 } from "../../shared/utils/crypto";
import { signAccessToken, signRefreshToken } from "../../shared/utils/jwt";
import { ok } from "../../shared/utils/response";

const authRepository = new PrismaAuthRepository();
const sessionRepository = new PrismaSessionRepository();
const patientRepository = new PrismaPatientRepository();

const loginUseCase = new LoginUseCase(authRepository, sessionRepository);
const refreshUseCase = new RefreshTokenUseCase(authRepository, sessionRepository);
const logoutUseCase = new LogoutUseCase(sessionRepository);

export class AuthController {
  static async login(req: Request, res: Response) {
    const result = await loginUseCase.execute(req.body.email, req.body.password);
    return ok(res, result);
  }

  static async register(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const passwordHash = await hashPassword(password);

    const patient = await patientRepository.create({
      email,
      passwordHash,
      name,
    });

    const accessToken = signAccessToken({
      sub: patient.user.id,
      role: "patient",
      patientId: patient.id,
    });

    const refreshTokenRaw = signRefreshToken({
      sub: patient.user.id,
      sessionId: "pending",
    });
    const tokenHash = sha256(refreshTokenRaw);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await sessionRepository.createSession(patient.user.id, tokenHash, expiresAt);

    return ok(
      res,
      {
        accessToken,
        refreshToken: refreshTokenRaw,
        user: {
          id: patient.user.id,
          email: patient.user.email,
          name: patient.user.name,
          role: "patient",
          patientProfileId: patient.id,
        },
      },
      201,
    );
  }

  static async refresh(req: Request, res: Response) {
    const result = await refreshUseCase.execute(req.body.refreshToken);
    return ok(res, result);
  }

  static async logout(req: Request, res: Response) {
    await logoutUseCase.execute(req.body.refreshToken);
    return ok(res, { message: "Logged out" });
  }
}