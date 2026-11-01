import { z } from "zod";
import { AUDIT_ACTIONS } from "../constants/audit.constants.js";
import { paginationQuerySchema } from "./common.validator.js";

const auditActionValues = Object.values(AUDIT_ACTIONS) as [string, ...string[]];

export const auditLogListQuerySchema = paginationQuerySchema.extend({
  action: z.enum(auditActionValues, { error: "Jenis aksi tidak dikenal." }).optional(),
});

export type AuditLogListQuery = z.infer<typeof auditLogListQuerySchema>;
