import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { ERROR_CODES } from "../constants/error.constants.js";
import { AppError } from "../utils/app-error.js";

type RequestPart = "body" | "query" | "params";

// Mengganti bagian request dengan hasil parse, sehingga field yang tidak dikenal terbuang dan nilai sudah dinormalisasi.
function validate(part: RequestPart, schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      next(new AppError(400, ERROR_CODES.VALIDATION_ERROR, "Data yang dikirim tidak valid.", details));
      return;
    }
    // Express 5 menjadikan req.query getter tanpa setter, jadi hasil parse dipasang sebagai properti milik request.
    // Controller membaca req.query/req.params dengan tipe dari validator terkait.
    Object.defineProperty(req, part, { value: result.data, writable: true, configurable: true, enumerable: true });
    next();
  };
}

export function validateBody(schema: ZodType) {
  return validate("body", schema);
}

export function validateQuery(schema: ZodType) {
  return validate("query", schema);
}

export function validateParams(schema: ZodType) {
  return validate("params", schema);
}
