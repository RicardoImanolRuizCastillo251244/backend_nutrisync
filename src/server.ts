import { execSync } from "child_process";
import app from "./app";
import { env } from "./shared/config/env";

// Auto-sync database schema
if (env.NODE_ENV === "production") {
  // Producción: aplicar migraciones existentes
  try {
    console.log("Running database migrations...");
    execSync("npx prisma migrate deploy", {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    console.log("Migrations completed.");

    console.log("Running seed...");
    execSync("npx prisma db seed", {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    console.log("Seed completed.");
  } catch (err) {
    console.error("Database bootstrap error:", (err as Error).message);
    process.exit(1);
  }
} else {
  // Desarrollo: sincronizar schema directamente + seed
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