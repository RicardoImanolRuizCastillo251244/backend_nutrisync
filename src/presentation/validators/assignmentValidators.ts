import { z } from "zod";

export const assignPlanSchema = z.object({
  patientId: z.string().uuid(),
});

export const unassignPlanSchema = z.object({
  patientId: z.string().uuid(),
});