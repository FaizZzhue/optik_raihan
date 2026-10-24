import cookieParser from "cookie-parser";
import express from "express";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import { requireSameOriginJson } from "./middlewares/origin.middleware.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.disable("x-powered-by");
app.use(cookieParser());
app.use("/api", requireSameOriginJson);
// Batas eksplisit ukuran body (SECURITY.md bagian 9). Melebihi batas = 413 PAYLOAD_TOO_LARGE.
app.use(express.json({ limit: "100kb" }));

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
