import type { Request, Response } from "express";
import * as categoriesService from "../services/categories.service.js";
import { sendSuccess } from "../utils/api-response.js";
import type {
  CategoryListQuery,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../validators/categories.validator.js";
import type { IdParams } from "../validators/common.validator.js";

// req.query, req.params, dan req.body sudah diganti hasil parse oleh validate middleware pada route terkait.

export async function listCategories(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown as CategoryListQuery;
  sendSuccess(res, await categoriesService.listCategories(query));
}

export async function getCategory(req: Request, res: Response): Promise<void> {
  const { id } = req.params as unknown as IdParams;
  sendSuccess(res, await categoriesService.getCategoryById(id));
}

export async function createCategory(req: Request, res: Response): Promise<void> {
  const input: CreateCategoryInput = req.body;
  sendSuccess(res, await categoriesService.createCategory(input), 201);
}

export async function updateCategory(req: Request, res: Response): Promise<void> {
  const { id } = req.params as unknown as IdParams;
  const input: UpdateCategoryInput = req.body;
  sendSuccess(res, await categoriesService.updateCategory(id, input));
}

export async function deleteCategory(req: Request, res: Response): Promise<void> {
  const { id } = req.params as unknown as IdParams;
  await categoriesService.deleteCategory(id);
  res.status(204).end();
}
