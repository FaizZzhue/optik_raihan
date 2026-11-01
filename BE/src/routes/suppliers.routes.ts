import { Router } from "express";
import {
  createSupplier,
  deleteSupplier,
  getSupplier,
  listSuppliers,
  updateSupplier,
} from "../controllers/suppliers.controller.js";
import { PURCHASING_PERMISSIONS } from "../constants/purchasing.constants.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validateBody, validateParams, validateQuery } from "../middlewares/validate.middleware.js";
import { idParamSchema } from "../validators/common.validator.js";
import {
  createSupplierSchema,
  supplierListQuerySchema,
  updateSupplierSchema,
} from "../validators/suppliers.validator.js";

export const suppliersRouter = Router();

// Semua route supplier hanya owner (DEC-037 USULAN).
suppliersRouter.use(requireRole(...PURCHASING_PERMISSIONS.MANAGE));

suppliersRouter.get("/", validateQuery(supplierListQuerySchema), listSuppliers);
suppliersRouter.get("/:id", validateParams(idParamSchema), getSupplier);
suppliersRouter.post("/", validateBody(createSupplierSchema), createSupplier);
suppliersRouter.patch("/:id", validateParams(idParamSchema), validateBody(updateSupplierSchema), updateSupplier);
suppliersRouter.delete("/:id", validateParams(idParamSchema), deleteSupplier);
