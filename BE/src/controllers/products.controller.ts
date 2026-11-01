import type { Request, Response } from "express";
import { ERROR_CODES } from "../constants/error.constants.js";
import * as productsService from "../services/products.service.js";
import { sendList, sendSuccess } from "../utils/api-response.js";
import { AppError } from "../utils/app-error.js";
import type { IdParams } from "../validators/common.validator.js";
import type { CreateProductInput, ProductListQuery, UpdateProductInput } from "../validators/products.validator.js";

// req.query, req.params, dan req.body sudah diganti hasil parse oleh validate middleware pada route terkait.

export async function listProducts(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown as ProductListQuery;
  const { items, meta } = await productsService.listProducts(query);
  sendList(res, items, meta);
}

export async function getProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params as unknown as IdParams;
  sendSuccess(res, await productsService.getProductById(id));
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError(401, ERROR_CODES.UNAUTHENTICATED, "Silakan login terlebih dahulu.");
  }
  const input: CreateProductInput = req.body;
  sendSuccess(res, await productsService.createProduct(input, req.user.id), 201);
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params as unknown as IdParams;
  const input: UpdateProductInput = req.body;
  sendSuccess(res, await productsService.updateProduct(id, input));
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params as unknown as IdParams;
  await productsService.deleteProduct(id);
  res.status(204).end();
}
