import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./tests/setup.ts"],
    // Semua file test memakai satu database test, jadi dijalankan berurutan agar data tidak saling menimpa.
    fileParallelism: false,
  },
});
