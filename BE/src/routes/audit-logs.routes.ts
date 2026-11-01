import { Router } from "express";
import { listAuditLogs } from "../controllers/audit-logs.controller.js";
import { AUDIT_PERMISSIONS } from "../constants/audit.constants.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validateQuery } from "../middlewares/validate.middleware.js";
import { auditLogListQuerySchema } from "../validators/audit-logs.validator.js";

export const auditLogsRouter = Router();

// Hanya baca. Tidak ada route ubah atau hapus: audit log tambah-saja.
auditLogsRouter.get("/", requireRole(...AUDIT_PERMISSIONS.READ), validateQuery(auditLogListQuerySchema), listAuditLogs);
