"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
(0, dotenv_1.config)();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z.coerce.number().default(3001),
    DATABASE_URL: zod_1.z.string().min(1),
    JWT_ACCESS_SECRET: zod_1.z.string().min(16),
    JWT_REFRESH_SECRET: zod_1.z.string().min(16),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default("15m"),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default("7d"),
    MEXINUTRI_BASE_URL: zod_1.z.string().url().default("https://mexinutri-backend.onrender.com/api"),
    SUPABASE_URL: zod_1.z.string().url().min(1),
    SUPABASE_SERVICE_ROLE_KEY: zod_1.z.string().min(1),
    SUPABASE_STORAGE_BUCKET: zod_1.z.string().min(1),
    RATE_LIMIT_WINDOW_MS: zod_1.z.coerce.number().default(60000),
    RATE_LIMIT_MAX: zod_1.z.coerce.number().default(120),
    CORS_ORIGIN: zod_1.z.string().default("*"),
});
const result = envSchema.safeParse(process.env);
if (!result.success) {
    const issues = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
    throw new Error(`Invalid environment variables:\n${issues}`);
}
exports.env = result.data;
//# sourceMappingURL=env.js.map