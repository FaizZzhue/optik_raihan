import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "../controllers/products.controller.js";
import { CATALOG_PERMISSIONS } from "../constants/catalog.constants.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validateBody, validateParams, validateQuery } from "../middlewares/validate.middleware.js";
import { idParamSchema } from "../validators/common.validator.js";
import { createProductSchema, productListQuerySchema, updateProductSchema } from "../validators/products.validator.js";

export const productsRouter = Router();

const canRead = requireRole(...CATALOG_PERMISSIONS.READ);
const canWrite = requireRole(...CATALOG_PERMISSIONS.WRITE_PRODUCTS);
const canDelete = requireRole(...CATALOG_PERMISSIONS.DELETE_PRODUCTS);

productsRouter.get("/", canRead, validateQuery(productListQuerySchema), listProducts);
productsRouter.get("/:id", canRead, validateParams(idParamSchema), getProduct);
productsRouter.post("/", canWrite, validateBody(createProductSchema), createProduct);
productsRouter.patch("/:id", canWrite, validateParams(idParamSchema), validateBody(updateProductSchema), updateProduct);
productsRouter.delete("/:id", canDelete, validateParams(idParamSchema), deleteProduct);
