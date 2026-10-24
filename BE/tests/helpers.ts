import type { UserRole } from "../src/constants/auth.constants.js";
import { prisma } from "../src/lib/prisma.js";
import { hashPassword } from "../src/utils/password.js";

export const TEST_PASSWORD = "password-uji-coba-123";

type TestUserOptions = {
  username: string;
  role: UserRole;
  isActive?: boolean;
};

export async function createTestUser({ username, role, isActive = true }: TestUserOptions) {
  return prisma.user.create({
    data: {
      username,
      name: `Pengguna Uji ${username}`,
      passwordHash: await hashPassword(TEST_PASSWORD),
      role,
      isActive,
    },
  });
}

export async function deleteAllUsers(): Promise<void> {
  await prisma.user.deleteMany();
}
