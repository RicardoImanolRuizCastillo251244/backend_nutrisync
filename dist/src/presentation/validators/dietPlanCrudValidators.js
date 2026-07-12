"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDietPlanSchema = exports.createDietPlanSchema = void 0;
const zod_1 = require("zod");
const mealItemSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    portion: zod_1.z.string().optional(),
    calories: zod_1.z.number().optional(),
    protein: zod_1.z.number().optional(),
    carbs: zod_1.z.number().optional(),
    fat: zod_1.z.number().optional(),
    edamamRecipeUrl: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().optional(),
    healthLabels: zod_1.z.array(zod_1.z.string()).optional(),
    dietLabels: zod_1.z.array(zod_1.z.string()).optional(),
});
const mealSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    note: zod_1.z.string().optional(),
    items: zod_1.z.array(mealItemSchema),
});
const daySchema = zod_1.z.object({
    dayNumber: zod_1.z.number().int().min(1),
    meals: zod_1.z.array(mealSchema).min(1),
});
exports.createDietPlanSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    notes: zod_1.z.string().optional(),
    days: zod_1.z.array(daySchema).min(1),
});
const mealItemUpdateSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    name: zod_1.z.string().min(1).optional(),
    portion: zod_1.z.string().optional(),
    calories: zod_1.z.number().optional(),
    protein: zod_1.z.number().optional(),
    carbs: zod_1.z.number().optional(),
    fat: zod_1.z.number().optional(),
    edamamRecipeUrl: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().optional(),
    healthLabels: zod_1.z.array(zod_1.z.string()).optional(),
    dietLabels: zod_1.z.array(zod_1.z.string()).optional(),
});
const mealUpdateSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    name: zod_1.z.string().min(1).optional(),
    note: zod_1.z.string().optional(),
    items: zod_1.z.array(mealItemUpdateSchema).optional(),
});
const dayUpdateSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    dayNumber: zod_1.z.number().int().min(1).optional(),
    meals: zod_1.z.array(mealUpdateSchema).optional(),
});
exports.updateDietPlanSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    notes: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
    days: zod_1.z.array(dayUpdateSchema).optional(),
});
//# sourceMappingURL=dietPlanCrudValidators.js.map