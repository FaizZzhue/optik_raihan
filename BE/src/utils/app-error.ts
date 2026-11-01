import type { ErrorCode } from "../constants/error.constants.js";

export type ErrorDetail = {
  field?: string;
  message: string;
};

// Error yang sengaja dilempar service. error.middleware mengubahnya menjadi respons
// berformat PROJECT-CONTEXT.md bagian 6 (Konvensi). Error lain dianggap tak terduga (500).
export class AppError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode;
  readonly details: ErrorDetail[] | undefined;

  constructor(statusCode: number, code: ErrorCode, message: string, details?: ErrorDetail[]) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
