"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const DuplicateEmailError_1 = require("@/shared/errors/DuplicateEmailError");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof DuplicateEmailError_1.DuplicateEmailError) {
        return res.status(409).json({ success: false, error: { message: err.message } });
    }
    const message = err.message || "Internal server error";
    return res.status(500).json({ success: false, error: { message } });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map