import { z } from "zod";

export const uploadVoiceMetaSchema = z.object({
  mealLogId: z.string().uuid(),
  durationSec: z.coerce.number().int().positive().optional(),
});
