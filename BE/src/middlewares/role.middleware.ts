import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../constants/auth.constants.js";
import { ERROR_CODES } from "../constants/error.constants.js";
import { AppError } from "../utils/app-error.js";

// Dipasang setelah requireAuth. Deny by default: hanya role yang disebut eksplisit yang lolos,
// tanpa argumen berarti tidak ada yang lolos.
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, ERROR_CODES.UNAUTHENTICATED, "Silakan login terlebih dahulu."));
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError(403, ERROR_CODES.FORBIDDEN, "Anda tidak berhak mengakses resource ini."));
      return;
    }
    next();
  };
}
