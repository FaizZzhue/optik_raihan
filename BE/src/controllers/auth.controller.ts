import type { CookieOptions, Request, Response } from "express";
import { env } from "../config/env.js";
import { AUTH_COOKIE_NAME, SESSION_DURATION_SECONDS } from "../constants/auth.constants.js";
import { ERROR_CODES } from "../constants/error.constants.js";
import * as authService from "../services/auth.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { AppError } from "../utils/app-error.js";
import type { LoginInput } from "../validators/auth.validator.js";

// API_CONTRACT.md bagian 9. Opsi yang sama dipakai saat menghapus cookie agar browser mencocokkannya.
const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export async function login(req: Request, res: Response): Promise<void> {
  const input: LoginInput = req.body; // sudah divalidasi dan dinormalisasi validateBody(loginSchema)
  const { user, token } = await authService.login(input, req.ip ?? "unknown");

  res.cookie(AUTH_COOKIE_NAME, token, { ...authCookieOptions, maxAge: SESSION_DURATION_SECONDS * 1000 });
  // Body hanya berisi data user. Token tidak pernah dikirim di body.
  sendSuccess(res, user);
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie(AUTH_COOKIE_NAME, authCookieOptions);
  res.status(204).end();
}

export function getMe(req: Request, res: Response): void {
  if (!req.user) {
    throw new AppError(401, ERROR_CODES.UNAUTHENTICATED, "Silakan login terlebih dahulu.");
  }
  sendSuccess(res, req.user);
}
