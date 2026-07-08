import { z } from "zod";

export const createPatientSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
});

export const updatePatientSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
});
