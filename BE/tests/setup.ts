import { config } from "dotenv";

// Test hanya membaca .env.test, tidak pernah .env, agar tidak menyentuh database development/produksi.
config({ path: ".env.test", override: true, quiet: true });

const databaseUrl = process.env["DATABASE_URL"];
if (databaseUrl && !new URL(databaseUrl).pathname.endsWith("_test")) {
  throw new Error("DATABASE_URL untuk test harus menunjuk database terpisah yang namanya berakhiran _test.");
}
