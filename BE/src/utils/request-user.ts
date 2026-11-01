import type { Request } from "express";
import { ERROR_CODES } from "../constants/error.constants.js";
import type { AuthUser } from "../types/auth.js";
import { AppError } from "./app-error.js";

// Pelaku aksi selalu dari sesi (requireAuth), bukan dari body. Route tanpa requireAuth membalas 401.
export function getRequestUser(req: Request): AuthUser {
  if (!req.user) {
    throw new AppError(401, ERROR_CODES.UNAUTHENTICATED, "Silakan login terlebih dahulu.");
  }
  return req.user;
}
