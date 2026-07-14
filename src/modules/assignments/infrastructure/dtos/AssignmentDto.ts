import { z } from "zod";

export const assignPlanSchema = z.object({
  planId: z.string().min(1),
});

export const unassignPlanSchema = z.object({
  patientId: z.string().min(1),
});

export type AssignPlanDto = z.infer<typeof assignPlanSchema>;
export type UnassignPlanDto = z.infer<typeof unassignPlanSchema>;