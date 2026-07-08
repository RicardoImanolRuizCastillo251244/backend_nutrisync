"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenUseCase = void 0;
const crypto_1 = require("../../../shared/utils/crypto");
const jwt_1 = require("../../../shared/utils/jwt");
class RefreshTokenUseCase {
    constructor(authRepository, sessionRepository) {
        this.authRepository = authRepository;
        this.sessionRepository = sessionRepository;
    }
    async execute(token) {
        const payload = (0, jwt_1.verifyRefreshToken)(token);
        const tokenHash = (0, crypto_1.sha256)(token);
        const session = await this.sessionRepository.findByTokenHash(tokenHash);
        if (!session || session.revokedAt || session.expiresAt <= new Date()) {
            throw new Error("Invalid refresh token");
        }
        const user = await this.authRepository.findUserById(payload.sub);
        if (!user)
            throw new Error("User not found");
        const replacementSessionId = crypto.randomUUID();
        const nextRefreshToken = (0, jwt_1.signRefreshToken)({ sub: user.id, sessionId: replacementSessionId });
        const nextRefreshHash = (0, crypto_1.sha256)(nextRefreshToken);
        await this.sessionRepository.createSession(user.id, nextRefreshHash, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
        await this.sessionRepository.replaceSession(session.id, replacementSessionId);
        const accessToken = (0, jwt_1.signAccessToken)({ sub: user.id, role: user.role });
        return {
            accessToken,
            refreshToken: nextRefreshToken,
        };
    }
}
exports.RefreshTokenUseCase = RefreshTokenUseCase;
//# sourceMappingURL=RefreshTokenUseCase.js.map