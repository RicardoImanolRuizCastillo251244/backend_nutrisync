import { z } from "zod";

export const createClinicalRecordSchema = z.object({
  patientId: z.string().min(1),
  date: z.string().optional(),
  name: z.string().optional().nullable(),
  sex: z.string().optional().nullable(),
  age: z.number().optional().nullable(),
  occupation: z.string().optional().nullable(),
  bloodType: z.string().optional().nullable(),
  consultationReason: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  weightKg: z.number().optional().nullable(),
  heightCm: z.number().optional().nullable(),
});

export const updateClinicalRecordSchema = z.object({
  date: z.string().optional(),
}).passthrough();

export type CreateClinicalRecordDto = z.infer<typeof createClinicalRecordSchema>;
export type UpdateClinicalRecordDto = z.infer<typeof updateClinicalRecordSchema>;