"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutUseCase = void 0;
const crypto_1 = require("../../../shared/utils/crypto");
class LogoutUseCase {
    constructor(sessionRepository) {
        this.sessionRepository = sessionRepository;
    }
    async execute(refreshToken) {
        const tokenHash = (0, crypto_1.sha256)(refreshToken);
        const session = await this.sessionRepository.findByTokenHash(tokenHash);
        if (session) {
            await this.sessionRepository.revokeSession(session.id);
        }
    }
}
exports.LogoutUseCase = LogoutUseCase;
//# sourceMappingURL=LogoutUseCase.js.map