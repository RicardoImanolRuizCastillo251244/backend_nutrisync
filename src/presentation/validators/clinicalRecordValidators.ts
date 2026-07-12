import { z } from "zod";

export const createClinicalRecordSchema = z.object({
  patientId: z.string().uuid(),
  date: z.string(),
  data: z.record(z.string(), z.unknown()),
});

export const updateClinicalRecordSchema = z.object({
  patientId: z.string().uuid().optional(),
  date: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const recalculateMetricsSchema = z.object({
  weightKg: z.number().positive().optional(),
  heightCm: z.number().positive().optional(),
  age: z.number().int().positive().optional(),
  gender: z.enum(["male", "female"]).optional(),
});