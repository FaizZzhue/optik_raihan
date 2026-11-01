import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
} from "../controllers/categories.controller.js";
import { CATALOG_PERMISSIONS } from "../constants/catalog.constants.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validateBody, validateParams, validateQuery } from "../middlewares/validate.middleware.js";
import {
  categoryListQuerySchema,
  createCategorySchema,
  updateCategorySchema,
} from "../validators/categories.validator.js";
import { idParamSchema } from "../validators/common.validator.js";

export const categoriesRouter = Router();

const canRead = requireRole(...CATALOG_PERMISSIONS.READ);
const canManage = requireRole(...CATALOG_PERMISSIONS.MANAGE_CATEGORIES);

categoriesRouter.get("/", canRead, validateQuery(categoryListQuerySchema), listCategories);
categoriesRouter.get("/:id", canRead, validateParams(idParamSchema), getCategory);
categoriesRouter.post("/", canManage, validateBody(createCategorySchema), createCategory);
categoriesRouter.patch(
  "/:id",
  canManage,
  validateParams(idParamSchema),
  validateBody(updateCategorySchema),
  updateCategory,
);
categoriesRouter.delete("/:id", canManage, validateParams(idParamSchema), deleteCategory);
