import type { Request, Response } from "express";
import * as auditLogService from "../services/audit-log.service.js";
import { sendList } from "../utils/api-response.js";
import type { AuditLogListQuery } from "../validators/audit-logs.validator.js";

export async function listAuditLogs(req: Request, res: Response): Promise<void> {
  // Sudah diganti hasil parse oleh validateQuery pada route.
  const query = req.query as unknown as AuditLogListQuery;
  const { items, meta } = await auditLogService.listAuditLogs(query);
  sendList(res, items, meta);
}
