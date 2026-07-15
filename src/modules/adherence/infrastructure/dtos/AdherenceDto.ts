import { z } from "zod";

export const logMealSchema = z.object({
  planId: z.string().optional(),
  mealName: z.string().min(1),
  note: z.string().optional(),
  date: z.string(),
  consumed: z.boolean().optional(),
  consumedAt: z.string().optional(),
});

export const logHydrationSchema = z.object({
  date: z.string(),
  amountMl: z.number().positive(),
});

export const logMoodSchema = z.object({
  date: z.string(),
  mood: z.string().min(1),
  note: z.string().optional(),
});

export type LogMealDto = z.infer<typeof logMealSchema>;
export type LogHydrationDto = z.infer<typeof logHydrationSchema>;
export type LogMoodDto = z.infer<typeof logMoodSchema>;