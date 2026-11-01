import type { Request, Response } from "express";
import * as purchasesService from "../services/purchases.service.js";
import { sendList, sendSuccess } from "../utils/api-response.js";
import { getRequestUser } from "../utils/request-user.js";
import type { IdParams } from "../validators/common.validator.js";
import type { CreatePurchaseInput, PurchaseListQuery } from "../validators/purchases.validator.js";

// req.query, req.params, dan req.body sudah diganti hasil parse oleh validate middleware pada route terkait.

export async function listPurchases(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown as PurchaseListQuery;
  const { items, meta } = await purchasesService.listPurchases(query);
  sendList(res, items, meta);
}

export async function getPurchase(req: Request, res: Response): Promise<void> {
  const { id } = req.params as unknown as IdParams;
  sendSuccess(res, await purchasesService.getPurchaseById(id));
}

export async function createPurchase(req: Request, res: Response): Promise<void> {
  const input: CreatePurchaseInput = req.body;
  sendSuccess(res, await purchasesService.createPurchase(input, getRequestUser(req).id), 201);
}
