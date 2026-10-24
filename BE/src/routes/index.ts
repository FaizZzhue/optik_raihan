import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { authRouter } from "./auth.routes.js";
import { healthRouter } from "./health.routes.js";

export const apiRouter = Router();

// Route publik (pengecualian eksplisit, SECURITY.md bagian 2).
apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);

// Deny by default: semua router yang dipasang setelah baris ini wajib login.
apiRouter.use(requireAuth);
