import { z } from "zod";

export const logProgressSchema = z.object({
  weightKg: z.number().positive(),
  heightCm: z.number().positive().optional(),
});