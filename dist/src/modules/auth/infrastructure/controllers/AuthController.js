"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const LoginUseCase_1 = require("@/modules/auth/application/use-cases/LoginUseCase");
const PrismaAuthRepository_1 = require("@/modules/auth/infrastructure/repositories/PrismaAuthRepository");
const PrismaPatientRepository_1 = require("@/modules/patients/infrastructure/repositories/PrismaPatientRepository");
const hash_1 = require("@/shared/infrastructure/security/hash");
const response_1 = require("@/shared/utils/response");
const authRepository = new PrismaAuthRepository_1.PrismaAuthRepository();
const patientRepository = new PrismaPatientRepository_1.PrismaPatientRepository();
const loginUseCase = new LoginUseCase_1.LoginUseCase(authRepository, authRepository);
class AuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password)
                return (0, response_1.fail)(res, "Email y password son requeridos", 400);
            const result = await loginUseCase.execute(email, password);
            return (0, response_1.ok)(res, result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error de autenticación";
            return (0, response_1.fail)(res, message, 401);
        }
    }
    static async register(req, res) {
        try {
            const { email, password, name, role } = req.body;
            if (!email || !password || !name)
                return (0, response_1.fail)(res, "Email, password y name son requeridos", 400);
            const userRole = role === "nutritionist" ? "nutritionist" : "patient";
            const passwordHash = await (0, hash_1.hashPassword)(password);
            if (userRole === "patient") {
                // Crear User + Patient vinculado (aparece como pendiente en la web)
                const patient = await patientRepository.createPatientWithUser({
                    email,
                    passwordHash,
                    name,
                });
                return (0, response_1.ok)(res, { id: patient.id, email, name, role: userRole }, 201);
            }
            // Nutricionista: solo crear User
            const user = await authRepository.createUser({ email, name, passwordHash, role: userRole });
            return (0, response_1.ok)(res, { id: user.id, email: user.email, name: user.name, role: user.role }, 201);
        }
        catch (error) {
            if (error?.code === "P2002")
                return (0, response_1.fail)(res, "El email ya está registrado", 409);
            return (0, response_1.fail)(res, error instanceof Error ? error.message : "Error al registrar", 500);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map