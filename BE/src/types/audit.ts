import type { Prisma } from "../generated/prisma/client.js";

export type AuditLogDto = {
  id: number;
  action: string;
  actor: { id: number; username: string; name: string } | null;
  entityType: string | null;
  entityId: number | null;
  details: Prisma.JsonValue;
  createdAt: string;
};
