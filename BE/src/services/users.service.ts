import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from "../constants/audit.constants.js";
import { USER_ROLES } from "../constants/auth.constants.js";
import { ERROR_CODES } from "../constants/error.constants.js";
import type { User } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type { UserAccountDto } from "../types/auth.js";
import { AppError } from "../utils/app-error.js";
import { omitUndefined } from "../utils/omit-undefined.js";
import { hashPassword } from "../utils/password.js";
import { PRISMA_ERROR_CODES, isPrismaError } from "../utils/prisma-error.js";
import { statusToIsActive } from "../utils/status-filter.js";
import type {
  CreateUserInput,
  ResetPasswordInput,
  UpdateUserInput,
  UserListQuery,
} from "../validators/users.validator.js";
import { recordAudit } from "./audit-log.service.js";

const NOT_FOUND_MESSAGE = "Akun tidak ditemukan.";

// Tidak pernah memuat passwordHash.
function toUserAccountDto(user: User): UserAccountDto {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

// Owner hanya mengelola akun pegawai (PRD FR-01.6). Akun owner tidak diubah lewat API ini, sehingga owner
// tidak bisa menonaktifkan dirinya sendiri atau owner lain dan terkunci dari aplikasi.
async function findStaffAccount(id: number): Promise<User> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError(404, ERROR_CODES.NOT_FOUND, NOT_FOUND_MESSAGE);
  }
  if (user.role !== USER_ROLES.STAFF) {
    throw new AppError(403, ERROR_CODES.FORBIDDEN, "Akun owner tidak dapat diubah lewat menu ini.");
  }
  return user;
}

export async function listUsers(query: UserListQuery): Promise<UserAccountDto[]> {
  const isActive = statusToIsActive(query.status);
  const users = await prisma.user.findMany({
    where: isActive === undefined ? {} : { isActive },
    orderBy: [{ role: "asc" }, { name: "asc" }, { id: "asc" }],
  });
  return users.map(toUserAccountDto);
}

export async function createStaffUser(input: CreateUserInput, actorId: number): Promise<UserAccountDto> {
  const passwordHash = await hashPassword(input.password);
  try {
    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: { username: input.username, name: input.name, passwordHash, role: USER_ROLES.STAFF },
      });
      await recordAudit(tx, {
        actorId,
        action: AUDIT_ACTIONS.USER_CREATE,
        entityType: AUDIT_ENTITY_TYPES.USER,
        entityId: created.id,
        details: { username: created.username, role: created.role },
      });
      return created;
    });
    return toUserAccountDto(user);
  } catch (error) {
    if (isPrismaError(error, PRISMA_ERROR_CODES.UNIQUE_VIOLATION)) {
      throw new AppError(409, ERROR_CODES.CONFLICT, "Username sudah dipakai.", [
        { field: "username", message: "Username sudah dipakai." },
      ]);
    }
    throw error;
  }
}

export async function updateStaffUser(id: number, input: UpdateUserInput, actorId: number): Promise<UserAccountDto> {
  const current = await findStaffAccount(id);
  const statusChanged = input.isActive !== undefined && input.isActive !== current.isActive;

  const user = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({ where: { id }, data: omitUndefined(input) });
    if (statusChanged) {
      await recordAudit(tx, {
        actorId,
        action: updated.isActive ? AUDIT_ACTIONS.USER_ACTIVATE : AUDIT_ACTIONS.USER_DEACTIVATE,
        entityType: AUDIT_ENTITY_TYPES.USER,
        entityId: id,
        details: { username: updated.username },
      });
    }
    return updated;
  });
  return toUserAccountDto(user);
}

// Password baru ditentukan owner (FR-01.9, USULAN). Sesi pegawai yang sudah ada tetap berlaku sampai
// kedaluwarsa (keterbatasan DEC-013, TASK-014); nonaktifkan akun bila sesi harus langsung diputus.
export async function resetStaffPassword(id: number, input: ResetPasswordInput, actorId: number): Promise<void> {
  const current = await findStaffAccount(id);
  const passwordHash = await hashPassword(input.password);
  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id }, data: { passwordHash } });
    await recordAudit(tx, {
      actorId,
      action: AUDIT_ACTIONS.PASSWORD_RESET,
      entityType: AUDIT_ENTITY_TYPES.USER,
      entityId: id,
      details: { username: current.username },
    });
  });
}
