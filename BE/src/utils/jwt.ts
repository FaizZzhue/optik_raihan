import { SignJWT, jwtVerify } from "jose";
import { env } from "../config/env.js";
import { SESSION_DURATION_SECONDS } from "../constants/auth.constants.js";

const secret = new TextEncoder().encode(env.JWT_SECRET);

// Klaim minimal: hanya id user (sub). Role dan status aktif selalu dibaca ulang dari database.
export function signAccessToken(userId: number): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secret);
}

// Mengembalikan id user, atau null bila token rusak, kedaluwarsa, atau ditandatangani rahasia lain.
export async function verifyAccessToken(token: string): Promise<number | null> {
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    const userId = Number(payload.sub);
    return Number.isInteger(userId) && userId > 0 ? userId : null;
  } catch {
    // Token tidak valid adalah kondisi normal (bukan error server); pemanggil membalas 401.
    return null;
  }
}
