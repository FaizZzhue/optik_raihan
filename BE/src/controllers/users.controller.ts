import type { Request, Response } from "express";
import * as usersService from "../services/users.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { getRequestUser } from "../utils/request-user.js";
import type { IdParams } from "../validators/common.validator.js";
import type {
  CreateUserInput,
  ResetPasswordInput,
  UpdateUserInput,
  UserListQuery,
} from "../validators/users.validator.js";

// req.query, req.params, dan req.body sudah diganti hasil parse oleh validate middleware pada route terkait.

export async function listUsers(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown as UserListQuery;
  sendSuccess(res, await usersService.listUsers(query));
}

export async function createUser(req: Request, res: Response): Promise<void> {
  const input: CreateUserInput = req.body;
  sendSuccess(res, await usersService.createStaffUser(input, getRequestUser(req).id), 201);
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params as unknown as IdParams;
  const input: UpdateUserInput = req.body;
  sendSuccess(res, await usersService.updateStaffUser(id, input, getRequestUser(req).id));
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const { id } = req.params as unknown as IdParams;
  const input: ResetPasswordInput = req.body;
  await usersService.resetStaffPassword(id, input, getRequestUser(req).id);
  res.status(204).end();
}
