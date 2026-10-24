import { argon2id, hash, verify } from "argon2";

// Parameter biaya memakai default paket argon2 (m=64 MiB, t=3, p=4). Belum di-benchmark di server produksi.
export function hashPassword(password: string): Promise<string> {
  return hash(password, { type: argon2id });
}

export function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  return verify(passwordHash, password);
}
