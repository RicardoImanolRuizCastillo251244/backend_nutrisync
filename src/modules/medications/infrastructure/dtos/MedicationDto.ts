import { z } from "zod";

export const createMedicationSchema = z.object({
  name: z.string().min(1),
  dosage: z.string().min(1),
  reminderEnabled: z.boolean().optional(),
  times: z.array(z.string()),
  days: z.array(z.string()),
  intervalHours: z.number().positive().optional(),
});

export const updateMedicationSchema = z.object({
  name: z.string().min(1).optional(),
  dosage: z.string().min(1).optional(),
  reminderEnabled: z.boolean().optional(),
  times: z.array(z.string()).optional(),
  days: z.array(z.string()).optional(),
  intervalHours: z.number().positive().nullable().optional(),
});

export type CreateMedicationDto = z.infer<typeof createMedicationSchema>;
export type UpdateMedicationDto = z.infer<typeof updateMedicationSchema>;