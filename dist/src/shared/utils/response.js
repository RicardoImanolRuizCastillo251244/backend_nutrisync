"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = exports.ok = void 0;
const ok = (res, data, status = 200) => res.status(status).json({ success: true, data });
exports.ok = ok;
const fail = (res, message, status = 400, details) => res.status(status).json({ success: false, error: { message, details } });
exports.fail = fail;
//# sourceMappingURL=response.js.map