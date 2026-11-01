import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { ERROR_CODES } from "../constants/error.constants.js";
import { AppError } from "../utils/app-error.js";

const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function getRequestOrigin(req: Request): string | null {
  const source = req.get("origin") ?? req.get("referer");
  if (!source) {
    return null;
  }
  try {
    return new URL(source).origin;
  } catch {
    // Header Origin/Referer yang bukan URL diperlakukan sama dengan origin asing.
    return null;
  }
}

// req.is() menganggap "Content-Length: 0" sebagai request ber-body, padahal browser mengirimnya
// untuk POST tanpa data (mis. logout). Yang dihitung hanya body yang benar-benar berisi.
function hasNonEmptyBody(req: Request): boolean {
  return req.get("transfer-encoding") !== undefined || Number(req.get("content-length") ?? 0) > 0;
}

// Mitigasi CSRF untuk autentikasi berbasis cookie (PROJECT-CONTEXT.md bagian 7, CSRF): request yang mengubah data
// harus berasal dari origin aplikasi dan, bila membawa body, berformat JSON.
export function requireSameOriginJson(req: Request, _res: Response, next: NextFunction): void {
  if (!STATE_CHANGING_METHODS.has(req.method)) {
    next();
    return;
  }

  if (getRequestOrigin(req) !== env.APP_ORIGIN) {
    next(new AppError(403, ERROR_CODES.FORBIDDEN, "Origin request tidak diizinkan."));
    return;
  }

  if (hasNonEmptyBody(req) && !req.is("application/json")) {
    next(new AppError(415, ERROR_CODES.UNSUPPORTED_MEDIA_TYPE, "Body request harus berformat JSON."));
    return;
  }

  next();
}
