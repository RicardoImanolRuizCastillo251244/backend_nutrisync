"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDietPlanSchema = void 0;
const zod_1 = require("zod");
exports.generateDietPlanSchema = zod_1.z.object({
    caloriesTarget: zod_1.z.number().int().min(800).max(5000),
});
//# sourceMappingURL=dietPlanValidators.js.map