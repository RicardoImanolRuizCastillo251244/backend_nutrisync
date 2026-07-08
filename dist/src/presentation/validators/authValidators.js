"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutSchema = exports.refreshSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(10),
});
exports.logoutSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(10),
});
//# sourceMappingURL=authValidators.js.map