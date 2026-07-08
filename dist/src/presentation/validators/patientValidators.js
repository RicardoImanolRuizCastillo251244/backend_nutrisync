"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePatientSchema = exports.createPatientSchema = void 0;
const zod_1 = require("zod");
exports.createPatientSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    name: zod_1.z.string().min(2),
    phone: zod_1.z.string().optional(),
    birthDate: zod_1.z.string().optional(),
    gender: zod_1.z.enum(["male", "female", "other"]).optional(),
});
exports.updatePatientSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    phone: zod_1.z.string().optional(),
    birthDate: zod_1.z.string().optional(),
    gender: zod_1.z.enum(["male", "female", "other"]).optional(),
});
//# sourceMappingURL=patientValidators.js.map