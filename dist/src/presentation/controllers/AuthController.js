"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const LoginUseCase_1 = require("../../core/use-cases/auth/LoginUseCase");
const LogoutUseCase_1 = require("../../core/use-cases/auth/LogoutUseCase");
const RefreshTokenUseCase_1 = require("../../core/use-cases/auth/RefreshTokenUseCase");
const PrismaAuthRepository_1 = require("../../infrastructure/repositories/PrismaAuthRepository");
const PrismaSessionRepository_1 = require("../../infrastructure/repositories/PrismaSessionRepository");
const PrismaPatientRepository_1 = require("../../infrastructure/repositories/PrismaPatientRepository");
const hash_1 = require("../../shared/utils/hash");
const crypto_1 = require("../../shared/utils/crypto");
const jwt_1 = require("../../shared/utils/jwt");
const response_1 = require("../../shared/utils/response");
const authRepository = new PrismaAuthRepository_1.PrismaAuthRepository();
const sessionRepository = new PrismaSessionRepository_1.PrismaSessionRepository();
const patientRepository = new PrismaPatientRepository_1.PrismaPatientRepository();
const loginUseCase = new LoginUseCase_1.LoginUseCase(authRepository, sessionRepository);
const refreshUseCase = new RefreshTokenUseCase_1.RefreshTokenUseCase(authRepository, sessionRepository);
const logoutUseCase = new LogoutUseCase_1.LogoutUseCase(sessionRepository);
class AuthController {
    static async login(req, res) {
        const result = await loginUseCase.execute(req.body.email, req.body.password);
        return (0, response_1.ok)(res, result);
    }
    static async register(req, res) {
        const { name, email, password } = req.body;
        const passwordHash = await (0, hash_1.hashPassword)(password);
        const patient = await patientRepository.create({
            email,
            passwordHash,
            name,
        });
        const accessToken = (0, jwt_1.signAccessToken)({
            sub: patient.user.id,
            role: "patient",
            patientId: patient.id,
        });
        const refreshTokenRaw = (0, jwt_1.signRefreshToken)({
            sub: patient.user.id,
            sessionId: "pending",
        });
        const tokenHash = (0, crypto_1.sha256)(refreshTokenRaw);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await sessionRepository.createSession(patient.user.id, tokenHash, expiresAt);
        return (0, response_1.ok)(res, {
            accessToken,
            refreshToken: refreshTokenRaw,
            user: {
                id: patient.user.id,
                email: patient.user.email,
                name: patient.user.name,
                role: "patient",
                patientProfileId: patient.id,
            },
        }, 201);
    }
    static async refresh(req, res) {
        const result = await refreshUseCase.execute(req.body.refreshToken);
        return (0, response_1.ok)(res, result);
    }
    static async logout(req, res) {
        await logoutUseCase.execute(req.body.refreshToken);
        return (0, response_1.ok)(res, { message: "Logged out" });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map