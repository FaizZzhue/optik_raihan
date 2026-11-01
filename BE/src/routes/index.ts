import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { authRouter } from "./auth.routes.js";
import { categoriesRouter } from "./categories.routes.js";
import { healthRouter } from "./health.routes.js";
import { productsRouter } from "./products.routes.js";

export const apiRouter = Router();

// Route publik (pengecualian eksplisit, PROJECT-CONTEXT.md bagian 7, Authorization).
apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);

// Deny by default: semua router yang dipasang setelah baris ini wajib login.
apiRouter.use(requireAuth);

// Setiap route di bawah ini menyebut role yang diizinkan secara eksplisit (requireRole).
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/products", productsRouter);
