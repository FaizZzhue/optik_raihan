import type { NextFunction, Request, Response } from "express";
import { AUTH_COOKIE_NAME } from "../constants/auth.constants.js";
import { ERROR_CODES } from "../constants/error.constants.js";
import { findActiveUserById } from "../services/auth.service.js";
import { AppError } from "../utils/app-error.js";
import { verifyAccessToken } from "../utils/jwt.js";

const SESSION_INVALID_MESSAGE = "Sesi tidak valid atau sudah berakhir. Silakan login kembali.";

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token: unknown = req.cookies?.[AUTH_COOKIE_NAME];
  const userId = typeof token === "string" ? await verifyAccessToken(token) : null;
  const user = userId === null ? null : await findActiveUserById(userId);

  if (!user) {
    next(new AppError(401, ERROR_CODES.UNAUTHENTICATED, SESSION_INVALID_MESSAGE));
    return;
  }

  req.user = user;
  next();
}
