"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const app_1 = __importDefault(require("@/app"));
const env_1 = require("@/shared/config/env");
// Auto-sync database schema (migrations only, no seeds)
if (env_1.env.NODE_ENV === "production") {
    try {
        console.log("Running database migrations...");
        (0, child_process_1.execSync)("npx prisma migrate deploy", {
            stdio: "inherit",
            cwd: process.cwd(),
        });
        console.log("Migrations completed.");
    }
    catch (err) {
        console.error("Database bootstrap error:", err.message);
        process.exit(1);
    }
}
else {
    try {
        console.log("Syncing database schema...");
        (0, child_process_1.execSync)("npx prisma db push", {
            stdio: "inherit",
            cwd: process.cwd(),
        });
        console.log("Schema synced.");
    }
    catch (err) {
        console.warn("Database sync warning:", err.message);
    }
}
app_1.default.listen(env_1.env.PORT, () => {
    console.log(`NutriSync backend running on port ${env_1.env.PORT}`);
});
//# sourceMappingURL=server.js.map