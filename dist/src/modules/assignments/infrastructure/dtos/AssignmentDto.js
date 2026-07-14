"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unassignPlanSchema = exports.assignPlanSchema = void 0;
const zod_1 = require("zod");
exports.assignPlanSchema = zod_1.z.object({
    planId: zod_1.z.string().min(1),
});
exports.unassignPlanSchema = zod_1.z.object({
    patientId: zod_1.z.string().min(1),
});
//# sourceMappingURL=AssignmentDto.js.map