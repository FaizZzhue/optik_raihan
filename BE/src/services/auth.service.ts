import { randomUUID } from "node:crypto";
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from "../constants/audit.constants.js";
import { ERROR_CODES } from "../constants/error.constants.js";
import type { User } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type { AuthUser } from "../types/auth.js";
import { AppError } from "../utils/app-error.js";
import { signAccessToken } from "../utils/jwt.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import type { LoginInput } from "../validators/auth.validator.js";
import { recordAudit } from "./audit-log.service.js";
import { assertLoginAllowed, recordLoginFailure, resetLoginFailures } from "./login-rate-limit.service.js";

// Satu pesan untuk semua kegagalan login agar tidak membocorkan apakah username ada (AC-01.1).
const INVALID_CREDENTIALS_MESSAGE = "Username atau password salah.";

let dummyPasswordHash: Promise<string> | undefined;

// Saat username tidak ada, password tetap diverifikasi terhadap hash palsu agar waktu respons
// tidak jauh berbeda dengan kasus password salah (mengurangi enumerasi akun lewat waktu).
function getDummyPasswordHash(): Promise<string> {
  dummyPasswordHash ??= hashPassword(randomUUID());
  return dummyPasswordHash;
}

function toAuthUser(user: User): AuthUser {
  return { id: user.id, username: user.username, name: user.name, role: user.role };
}

export async function login(input: LoginInput, clientIp: string): Promise<{ user: AuthUser; token: string }> {
  const attemptKey = `${clientIp}|${input.username}`;
  assertLoginAllowed(attemptKey);

  const user = await prisma.user.findUnique({ where: { username: input.username } });
  const isPasswordValid = user
    ? await verifyPassword(user.passwordHash, input.password)
    : await verifyPassword(await getDummyPasswordHash(), input.password);

  if (!user || !isPasswordValid || !user.isActive) {
    recordLoginFailure(attemptKey);
    throw new AppError(401, ERROR_CODES.UNAUTHENTICATED, INVALID_CREDENTIALS_MESSAGE);
  }

  resetLoginFailures(attemptKey);
  // Hanya login berhasil yang dicatat (FR-15.1); kegagalan sudah ditangani rate limit.
  await recordAudit(prisma, {
    actorId: user.id,
    action: AUDIT_ACTIONS.LOGIN,
    entityType: AUDIT_ENTITY_TYPES.USER,
    entityId: user.id,
  });
  const token = await signAccessToken(user.id);
  return { user: toAuthUser(user), token };
}

// Dipanggil auth.middleware di setiap request: user nonaktif atau terhapus langsung kehilangan akses,
// dan perubahan role langsung berlaku (PROJECT-CONTEXT.md bagian 7, Authorization).
export async function findActiveUserById(userId: number): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user && user.isActive ? toAuthUser(user) : null;
}
