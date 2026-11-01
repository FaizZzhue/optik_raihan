import { Router } from "express";
import { createPurchase, getPurchase, listPurchases } from "../controllers/purchases.controller.js";
import { PURCHASING_PERMISSIONS } from "../constants/purchasing.constants.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validateBody, validateParams, validateQuery } from "../middlewares/validate.middleware.js";
import { idParamSchema } from "../validators/common.validator.js";
import { createPurchaseSchema, purchaseListQuerySchema } from "../validators/purchases.validator.js";

export const purchasesRouter = Router();

// Pembelian hanya owner (PRD bagian 3). Tidak ada ubah atau hapus: pembelian tidak dibatalkan (FR-06.5).
purchasesRouter.use(requireRole(...PURCHASING_PERMISSIONS.MANAGE));

purchasesRouter.get("/", validateQuery(purchaseListQuerySchema), listPurchases);
purchasesRouter.get("/:id", validateParams(idParamSchema), getPurchase);
purchasesRouter.post("/", validateBody(createPurchaseSchema), createPurchase);
