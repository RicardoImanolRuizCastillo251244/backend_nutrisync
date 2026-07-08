import { z } from "zod";

export const voiceNoteQuerySchema = z.object({
  expiresInSeconds: z.number().int().positive().optional(),
});