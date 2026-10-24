import type { Request, Response } from "express";
import { getHealthStatus } from "../services/health.service.js";
import { sendSuccess } from "../utils/api-response.js";

export async function getHealth(_req: Request, res: Response): Promise<void> {
  const health = await getHealthStatus();
  sendSuccess(res, health);
}
