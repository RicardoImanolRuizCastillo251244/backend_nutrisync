"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    const message = err.message || "Internal server error";
    return res.status(500).json({ success: false, error: { message } });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map