import { z } from "zod";

export const logMealSchema = z.object({
  planId: z.string().uuid().optional(),
  mealName: z.string().min(1),
  date: z.string(),
  consumed: z.boolean().optional(),
  consumedAt: z.string().optional(),
});

export const logHydrationSchema = z.object({
  amountMl: z.number().int().min(1).max(5000),
});

export const logMoodSchema = z.object({
  mood: z.string().min(1),
  note: z.string().optional(),
});