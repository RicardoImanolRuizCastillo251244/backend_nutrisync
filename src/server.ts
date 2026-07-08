import { execSync } from "child_process";
import app from "./app";
import { env } from "./shared/config/env";

// Auto-sync database schema + run seed in development
if (env.NODE_ENV === "development") {
  try {
    console.log("Syncing database schema...");
    execSync("npx prisma db push", {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    console.log("Schema synced. Running seed...");
    execSync("npx prisma db seed", {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    console.log("Seed completed.");
  } catch (err) {
    console.warn("Database sync warning:", (err as Error).message);
  }
}

app.listen(env.PORT, () => {
  console.log(`NutriSync backend running on port ${env.PORT}`);
});
