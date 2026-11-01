import type { AuditAction } from "../constants/audit.constants.js";
import type { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type { AuditLogDto } from "../types/audit.js";
import type { PaginationMeta } from "../types/pagination.js";
import type { AuditLogListQuery } from "../validators/audit-logs.validator.js";

type AuditEntry = {
  actorId: number | null;
  action: AuditAction;
  entityType?: string;
  entityId?: number;
  // Jangan memuat password, hash, token, atau isi resep (FR-15.2).
  details?: Prisma.InputJsonObject;
};

// Klien transaksi: entri audit ditulis dalam transaksi yang sama dengan perubahan yang diaudit,
// sehingga perubahan tanpa jejak (atau jejak tanpa perubahan) tidak mungkin terjadi.
type DbClient = Prisma.TransactionClient | typeof prisma;

export async function recordAudit(db: DbClient, entry: AuditEntry): Promise<void> {
  await db.auditLog.create({
    data: {
      actorId: entry.actorId,
      action: entry.action,
      entityType: entry.entityType ?? null,
      entityId: entry.entityId ?? null,
      ...(entry.details && { details: entry.details }),
    },
  });
}

const auditLogInclude = {
  actor: { select: { id: true, username: true, name: true } },
} satisfies Prisma.AuditLogInclude;

type AuditLogWithActor = Prisma.AuditLogGetPayload<{ include: typeof auditLogInclude }>;

function toAuditLogDto(log: AuditLogWithActor): AuditLogDto {
  return {
    id: log.id,
    action: log.action,
    actor: log.actor,
    entityType: log.entityType,
    entityId: log.entityId,
    details: log.details,
    createdAt: log.createdAt.toISOString(),
  };
}

export async function listAuditLogs(query: AuditLogListQuery): Promise<{ items: AuditLogDto[]; meta: PaginationMeta }> {
  const where: Prisma.AuditLogWhereInput = query.action === undefined ? {} : { action: query.action };
  const [logs, totalItems] = await prisma.$transaction([
    prisma.auditLog.findMany({
      where,
      include: auditLogInclude,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.auditLog.count({ where }),
  ]);
  return {
    items: logs.map(toAuditLogDto),
    meta: { page: query.page, pageSize: query.pageSize, totalItems, totalPages: Math.ceil(totalItems / query.pageSize) },
  };
}
