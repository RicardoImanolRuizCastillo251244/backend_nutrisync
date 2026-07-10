import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  EDAMAM_RECIPE_APP_ID: z.string().min(1),
  EDAMAM_RECIPE_APP_KEY: z.string().min(1),
  EDAMAM_FOOD_APP_ID: z.string().min(1),
  EDAMAM_FOOD_APP_KEY: z.string().min(1),
  EDAMAM_BASE_URL: z.string().url().default("https://api.edamam.com"),
  EDAMAM_MEAL_PLANNER_ACCOUNT_USER: z.string().default("TheJimmynt"),
  SUPABASE_URL: z.string().url().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_STORAGE_BUCKET: z.string().min(1),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().default(120),
  CORS_ORIGIN: z.string().default("*"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const issues = result.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment variables:\n${issues}`);
}

export const env = result.data;