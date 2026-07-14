"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClinicalRecordSchema = exports.createClinicalRecordSchema = void 0;
const zod_1 = require("zod");
exports.createClinicalRecordSchema = zod_1.z.object({
    patientId: zod_1.z.string().min(1),
    date: zod_1.z.string().optional(),
    name: zod_1.z.string().optional().nullable(),
    sex: zod_1.z.string().optional().nullable(),
    age: zod_1.z.number().optional().nullable(),
    occupation: zod_1.z.string().optional().nullable(),
    bloodType: zod_1.z.string().optional().nullable(),
    consultationReason: zod_1.z.string().optional().nullable(),
    phone: zod_1.z.string().optional().nullable(),
    weightKg: zod_1.z.number().optional().nullable(),
    heightCm: zod_1.z.number().optional().nullable(),
});
exports.updateClinicalRecordSchema = zod_1.z.object({
    date: zod_1.z.string().optional(),
}).passthrough();
//# sourceMappingURL=ClinicalRecordDto.js.map