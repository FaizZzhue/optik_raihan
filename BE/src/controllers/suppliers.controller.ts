import type { Request, Response } from "express";
import * as suppliersService from "../services/suppliers.service.js";
import { sendSuccess } from "../utils/api-response.js";
import type { IdParams } from "../validators/common.validator.js";
import type {
  CreateSupplierInput,
  SupplierListQuery,
  UpdateSupplierInput,
} from "../validators/suppliers.validator.js";

// req.query, req.params, dan req.body sudah diganti hasil parse oleh validate middleware pada route terkait.

export async function listSuppliers(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown as SupplierListQuery;
  sendSuccess(res, await suppliersService.listSuppliers(query));
}

export async function getSupplier(req: Request, res: Response): Promise<void> {
  const { id } = req.params as unknown as IdParams;
  sendSuccess(res, await suppliersService.getSupplierById(id));
}

export async function createSupplier(req: Request, res: Response): Promise<void> {
  const input: CreateSupplierInput = req.body;
  sendSuccess(res, await suppliersService.createSupplier(input), 201);
}

export async function updateSupplier(req: Request, res: Response): Promise<void> {
  const { id } = req.params as unknown as IdParams;
  const input: UpdateSupplierInput = req.body;
  sendSuccess(res, await suppliersService.updateSupplier(id, input));
}

export async function deleteSupplier(req: Request, res: Response): Promise<void> {
  const { id } = req.params as unknown as IdParams;
  await suppliersService.deleteSupplier(id);
  res.status(204).end();
}
