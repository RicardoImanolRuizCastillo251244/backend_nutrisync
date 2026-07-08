"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recalculateMetricsSchema = exports.updateClinicalRecordSchema = exports.createClinicalRecordSchema = void 0;
const zod_1 = require("zod");
exports.createClinicalRecordSchema = zod_1.z.object({
    patientId: zod_1.z.string().uuid(),
    date: zod_1.z.string(),
    data: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()),
});
exports.updateClinicalRecordSchema = zod_1.z.object({
    date: zod_1.z.string().optional(),
    data: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
});
exports.recalculateMetricsSchema = zod_1.z.object({
    weightKg: zod_1.z.number().positive().optional(),
    heightCm: zod_1.z.number().positive().optional(),
    age: zod_1.z.number().int().positive().optional(),
    gender: zod_1.z.enum(["male", "female"]).optional(),
});
//# sourceMappingURL=clinicalRecordValidators.js.map