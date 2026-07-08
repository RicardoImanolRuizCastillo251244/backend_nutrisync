import { z } from "zod";

export const createMedicationSchema = z.object({
  name: z.string().min(1),
  dosage: z.string().min(1),
  reminderEnabled: z.boolean().optional(),
  times: z.array(z.string()).min(1),
  days: z.array(z.string()).min(1),
  intervalHours: z.number().int().positive().optional(),
});

export const updateMedicationSchema = z.object({
  name: z.string().min(1).optional(),
  dosage: z.string().min(1).optional(),
  reminderEnabled: z.boolean().optional(),
  times: z.array(z.string()).optional(),
  days: z.array(z.string()).optional(),
  intervalHours: z.number().int().positive().nullable().optional(),
});