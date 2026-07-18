"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const response_1 = require("@/shared/utils/response");
const requireRole = (...roles) => (req, res, next) => {
    if (!req.user)
        return (0, response_1.fail)(res, "Unauthorized", 401);
    if (!roles.includes(req.user.role))
        return (0, response_1.fail)(res, "Forbidden", 403);
    return next();
};
exports.requireRole = requireRole;
//# sourceMappingURL=requireRole.js.map