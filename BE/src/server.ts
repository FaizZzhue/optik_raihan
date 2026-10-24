// Harus menjadi import pertama agar .env sudah dimuat sebelum config/env.ts divalidasi.
import "dotenv/config";
import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`BE berjalan di http://localhost:${env.PORT} (${env.NODE_ENV})`);
});
