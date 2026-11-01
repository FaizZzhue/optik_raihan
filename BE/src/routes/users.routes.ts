import { Router } from "express";
import { createUser, listUsers, resetPassword, updateUser } from "../controllers/users.controller.js";
import { USER_ROLES } from "../constants/auth.constants.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validateBody, validateParams, validateQuery } from "../middlewares/validate.middleware.js";
import { idParamSchema } from "../validators/common.validator.js";
import {
  createUserSchema,
  resetPasswordSchema,
  updateUserSchema,
  userListQuerySchema,
} from "../validators/users.validator.js";

export const usersRouter = Router();

// Kelola akun hanya owner (PRD bagian 3, FR-01.6 dan FR-01.7). Tidak ada hapus akun: akun dinonaktifkan.
usersRouter.use(requireRole(USER_ROLES.OWNER));

usersRouter.get("/", validateQuery(userListQuerySchema), listUsers);
usersRouter.post("/", validateBody(createUserSchema), createUser);
usersRouter.patch("/:id", validateParams(idParamSchema), validateBody(updateUserSchema), updateUser);
usersRouter.post("/:id/reset-password", validateParams(idParamSchema), validateBody(resetPasswordSchema), resetPassword);
