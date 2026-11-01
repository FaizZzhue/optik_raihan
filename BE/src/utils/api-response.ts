import type { Response } from "express";
import type { ErrorCode } from "../constants/error.constants.js";
import type { PaginationMeta } from "../types/pagination.js";
import type { ErrorDetail } from "./app-error.js";

export function sendSuccess(res: Response, data: unknown, statusCode = 200): void {
  res.status(statusCode).json({ data });
}

export function sendList(res: Response, data: unknown[], meta: PaginationMeta): void {
  res.status(200).json({ data, meta });
}

export function sendError(
  res: Response,
  statusCode: number,
  code: ErrorCode,
  message: string,
  details?: ErrorDetail[],
): void {
  res.status(statusCode).json({ error: details ? { code, message, details } : { code, message } });
}
