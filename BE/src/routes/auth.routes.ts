import { Router } from "express";
import { getMe, login, logout } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { loginSchema } from "../validators/auth.validator.js";

export const authRouter = Router();

authRouter.post("/login", validateBody(loginSchema), login);
// Logout tidak butuh sesi valid: cookie selalu dihapus, termasuk saat sesi sudah kedaluwarsa.
authRouter.post("/logout", logout);
authRouter.get("/me", requireAuth, getMe);
