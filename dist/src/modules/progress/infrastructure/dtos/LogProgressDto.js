"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logProgressSchema = void 0;
const zod_1 = require("zod");
exports.logProgressSchema = zod_1.z.object({
    weightKg: zod_1.z.number().positive(),
    heightCm: zod_1.z.number().positive().optional(),
});
//# sourceMappingURL=LogProgressDto.js.map