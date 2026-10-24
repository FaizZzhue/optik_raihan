import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const beRoot = fileURLToPath(new URL("..", import.meta.url));

describe("Validasi environment saat startup", () => {
  it("server gagal start (exit code 1) bila DATABASE_URL tidak valid", () => {
    const result = spawnSync(process.execPath, ["--import", "tsx", "src/server.ts"], {
      cwd: beRoot,
      env: { ...process.env, DATABASE_URL: "bukan-url" },
      encoding: "utf8",
      timeout: 20_000,
    });

    // signal null memastikan proses berhenti sendiri, bukan dihentikan karena timeout.
    expect(result.signal).toBeNull();
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Konfigurasi environment tidak valid");
    expect(result.stderr).toContain("DATABASE_URL");
  });
});
