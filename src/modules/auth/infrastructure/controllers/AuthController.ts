import type { Request, Response } from "express";
import { LoginUseCase } from "@/modules/auth/application/use-cases/LoginUseCase";
import { PrismaAuthRepository } from "@/modules/auth/infrastructure/repositories/PrismaAuthRepository";
import { PrismaPatientRepository } from "@/modules/patients/infrastructure/repositories/PrismaPatientRepository";
import { hashPassword } from "@/shared/infrastructure/security/hash";
import { ok, fail } from "@/shared/utils/response";

const authRepository = new PrismaAuthRepository();
const patientRepository = new PrismaPatientRepository();
const loginUseCase = new LoginUseCase(authRepository, authRepository);

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return fail(res, "Email y password son requeridos", 400);
      const result = await loginUseCase.execute(email, password);
      return ok(res, result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error de autenticación";
      return fail(res, message, 401);
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { email, password, name, role } = req.body;
      if (!email || !password || !name) return fail(res, "Email, password y name son requeridos", 400);
      const userRole = role === "nutritionist" ? "nutritionist" : "patient";
      const passwordHash = await hashPassword(password);

      if (userRole === "patient") {
        // Crear User + Patient vinculado (aparece como pendiente en la web)
        const patient = await patientRepository.createPatientWithUser({
          email,
          passwordHash,
          name,
        });
        return ok(res, { id: patient.id, email, name, role: userRole }, 201);
      }

      // Nutricionista: solo crear User
      const user = await authRepository.createUser({ email, name, passwordHash, role: userRole });
      return ok(res, { id: user.id, email: user.email, name: user.name, role: user.role }, 201);
    } catch (error: any) {
      if (error?.code === "P2002") return fail(res, "El email ya está registrado", 409);
      return fail(res, error instanceof Error ? error.message : "Error al registrar", 500);
    }
  }
}
