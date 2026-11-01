import { Prisma } from "../generated/prisma/client.js";

// Kode error Prisma yang ditangani service: https://www.prisma.io/docs/orm/reference/error-reference
export const PRISMA_ERROR_CODES = {
  UNIQUE_VIOLATION: "P2002",
  FOREIGN_KEY_VIOLATION: "P2003",
  RECORD_NOT_FOUND: "P2025",
} as const;

type PrismaErrorCode = (typeof PRISMA_ERROR_CODES)[keyof typeof PRISMA_ERROR_CODES];

export function isPrismaError(error: unknown, code: PrismaErrorCode): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
}
