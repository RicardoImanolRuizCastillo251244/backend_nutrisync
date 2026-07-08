"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMedicationSchema = exports.createMedicationSchema = void 0;
const zod_1 = require("zod");
exports.createMedicationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    dosage: zod_1.z.string().min(1),
    reminderEnabled: zod_1.z.boolean().optional(),
    times: zod_1.z.array(zod_1.z.string()).min(1),
    days: zod_1.z.array(zod_1.z.string()).min(1),
    intervalHours: zod_1.z.number().int().positive().optional(),
});
exports.updateMedicationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    dosage: zod_1.z.string().min(1).optional(),
    reminderEnabled: zod_1.z.boolean().optional(),
    times: zod_1.z.array(zod_1.z.string()).optional(),
    days: zod_1.z.array(zod_1.z.string()).optional(),
    intervalHours: zod_1.z.number().int().positive().nullable().optional(),
});
//# sourceMappingURL=medicationValidators.js.map