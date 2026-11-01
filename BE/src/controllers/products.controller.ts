import type { Request, Response } from "express";
import * as productsService from "../services/products.service.js";
import * as stockMovementsService from "../services/stock-movements.service.js";
import { sendList, sendSuccess } from "../utils/api-response.js";
import { getRequestUser } from "../utils/request-user.js";
import type { IdParams, PaginationQuery } from "../validators/common.validator.js";
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
  const input: CreateProductInput = req.body;
  sendSuccess(res, await productsService.createProduct(input, getRequestUser(req).id), 201);
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params as unknown as IdParams;
  const input: UpdateProductInput = req.body;
  sendSuccess(res, await productsService.updateProduct(id, input, getRequestUser(req).id));
}

export async function listProductStockMovements(req: Request, res: Response): Promise<void> {
  const { id } = req.params as unknown as IdParams;
  const pagination = req.query as unknown as PaginationQuery;
  const { items, meta } = await stockMovementsService.listProductStockMovements(id, pagination);
  sendList(res, items, meta);
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params as unknown as IdParams;
  await productsService.deleteProduct(id);
  res.status(204).end();
}
