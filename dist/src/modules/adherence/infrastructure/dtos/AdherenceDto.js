"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logMoodSchema = exports.logHydrationSchema = exports.logMealSchema = void 0;
const zod_1 = require("zod");
exports.logMealSchema = zod_1.z.object({
    planId: zod_1.z.string().optional(),
    mealName: zod_1.z.string().min(1),
    date: zod_1.z.string(),
    consumed: zod_1.z.boolean().optional(),
    consumedAt: zod_1.z.string().optional(),
});
exports.logHydrationSchema = zod_1.z.object({
    date: zod_1.z.string(),
    amountMl: zod_1.z.number().positive(),
});
exports.logMoodSchema = zod_1.z.object({
    date: zod_1.z.string(),
    mood: zod_1.z.string().min(1),
    note: zod_1.z.string().optional(),
});
//# sourceMappingURL=AdherenceDto.js.map