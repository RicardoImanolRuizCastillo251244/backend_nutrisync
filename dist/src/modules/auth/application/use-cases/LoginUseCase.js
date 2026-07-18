"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
const hash_1 = require("@/shared/infrastructure/security/hash");
const jwt_1 = require("@/shared/infrastructure/security/jwt");
const crypto_1 = require("@/shared/infrastructure/security/crypto");
class LoginUseCase {
    constructor(authRepository, sessionRepository) {
        this.authRepository = authRepository;
        this.sessionRepository = sessionRepository;
    }
    async execute(email, password) {
        const user = await this.authRepository.findUserByEmail(email);
        if (!user)
            throw new Error("Invalid credentials");
        const isValid = await (0, hash_1.comparePassword)(password, user.passwordHash);
        if (!isValid)
            throw new Error("Invalid credentials");
        if (user.role === "patient" && !user.patientNutritionistId) {
            throw new Error("Tu cuenta aún no ha sido aprobada por un nutriólogo.");
        }
        const sessionId = crypto.randomUUID();
        const refreshToken = (0, jwt_1.signRefreshToken)({ sub: user.id, sessionId });
        const refreshTokenHash = (0, crypto_1.sha256)(refreshToken);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.sessionRepository.createSession(user.id, refreshTokenHash, expiresAt);
        const accessPayload = { sub: user.id, role: user.role };
        if (user.patientProfileId)
            accessPayload.patientId = user.patientProfileId;
        return {
            accessToken: (0, jwt_1.signAccessToken)(accessPayload),
            refreshToken,
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        };
    }
}
exports.LoginUseCase = LoginUseCase;
//# sourceMappingURL=LoginUseCase.js.map