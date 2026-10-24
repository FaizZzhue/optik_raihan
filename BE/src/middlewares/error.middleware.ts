import type { NextFunction, Request, Response } from "express";
import { ERROR_CODES } from "../constants/error.constants.js";
import { sendError } from "../utils/api-response.js";
import { AppError } from "../utils/app-error.js";

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, ERROR_CODES.NOT_FOUND, "Route tidak ditemukan."));
}

// Error dari express.json() membawa properti `type` (mis. "entity.parse.failed").
function hasBodyParserType(err: unknown): err is { type: string } {
  return typeof err === "object" && err !== null && "type" in err && typeof err.type === "string";
}

// Express 5 meneruskan promise yang ditolak dari handler async ke sini secara otomatis,
// jadi controller tidak perlu try/catch atau pembungkus async.
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.code, err.message, err.details);
    return;
  }

  if (hasBodyParserType(err) && err.type === "entity.parse.failed") {
    sendError(res, 400, ERROR_CODES.VALIDATION_ERROR, "Body request bukan JSON yang valid.");
    return;
  }

  if (hasBodyParserType(err) && err.type === "entity.too.large") {
    sendError(res, 413, ERROR_CODES.PAYLOAD_TOO_LARGE, "Ukuran body request melebihi batas.");
    return;
  }

  // Detail lengkap hanya di log server. Klien menerima pesan generik tanpa stack trace.
  console.error(`[${req.method} ${req.path}]`, err);
  sendError(res, 500, ERROR_CODES.INTERNAL_ERROR, "Terjadi kesalahan pada server.");
}
