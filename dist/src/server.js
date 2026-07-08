"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const app_1 = __importDefault(require("./app"));
const env_1 = require("./shared/config/env");
// Auto-sync database schema + run seed in development
if (env_1.env.NODE_ENV === "development") {
    try {
        console.log("Syncing database schema...");
        (0, child_process_1.execSync)("npx prisma db push", {
            stdio: "inherit",
            cwd: process.cwd(),
        });
        console.log("Schema synced. Running seed...");
        (0, child_process_1.execSync)("npx prisma db seed", {
            stdio: "inherit",
            cwd: process.cwd(),
        });
        console.log("Seed completed.");
    }
    catch (err) {
        console.warn("Database sync warning:", err.message);
    }
}
app_1.default.listen(env_1.env.PORT, () => {
    console.log(`NutriSync backend running on port ${env_1.env.PORT}`);
});
//# sourceMappingURL=server.js.map