import { z } from "zod";

export const generateDietPlanSchema = z.object({
  caloriesTarget: z.number().int().min(800).max(5000),
});
