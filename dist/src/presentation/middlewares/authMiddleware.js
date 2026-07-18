"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jwt_1 = require("@/shared/utils/jwt");
const response_1 = require("@/shared/utils/response");
const requireAuth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return (0, response_1.fail)(res, "Missing bearer token", 401);
    }
    try {
        const token = header.slice("Bearer ".length);
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = {
            userId: payload.sub,
            role: payload.role,
            ...(payload.patientId ? { patientId: payload.patientId } : {}),
        };
        return next();
    }
    catch {
        return (0, response_1.fail)(res, "Invalid token", 401);
    }
};
exports.requireAuth = requireAuth;
//# sourceMappingURL=authMiddleware.js.map