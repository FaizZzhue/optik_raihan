import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { ERROR_CODES } from "../constants/error.constants.js";
import { AppError } from "../utils/app-error.js";

// Mengganti req.body dengan hasil parse, sehingga field yang tidak dikenal terbuang dan nilai sudah dinormalisasi.
// Validasi query/params ditambahkan saat route pertama yang membutuhkannya dibuat.
export function validateBody(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      next(new AppError(400, ERROR_CODES.VALIDATION_ERROR, "Data yang dikirim tidak valid.", details));
      return;
    }
    req.body = result.data;
    next();
  };
}
