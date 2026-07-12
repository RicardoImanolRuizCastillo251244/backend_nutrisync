import { z } from "zod";

const mealItemSchema = z.object({
  name: z.string().min(1),
  portion: z.string().optional(),
  calories: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
  edamamRecipeUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  healthLabels: z.array(z.string()).optional(),
  dietLabels: z.array(z.string()).optional(),
});

const mealSchema = z.object({
  name: z.string().min(1),
  note: z.string().optional(),
  items: z.array(mealItemSchema),
});

const daySchema = z.object({
  dayNumber: z.number().int().min(1),
  meals: z.array(mealSchema).min(1),
});

export const createDietPlanSchema = z.object({
  name: z.string().min(1),
  notes: z.string().optional(),
  days: z.array(daySchema).min(1),
});

const mealItemUpdateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).optional(),
  portion: z.string().optional(),
  calories: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
  edamamRecipeUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  healthLabels: z.array(z.string()).optional(),
  dietLabels: z.array(z.string()).optional(),
});

const mealUpdateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).optional(),
  note: z.string().optional(),
  items: z.array(mealItemUpdateSchema).optional(),
});

const dayUpdateSchema = z.object({
  id: z.string().uuid().optional(),
  dayNumber: z.number().int().min(1).optional(),
  meals: z.array(mealUpdateSchema).optional(),
});

export const updateDietPlanSchema = z.object({
  name: z.string().min(1).optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
  days: z.array(dayUpdateSchema).optional(),
});