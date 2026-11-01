import { ERROR_CODES } from "../constants/error.constants.js";
import { AppError } from "../utils/app-error.js";

// Backoff bertahap per kombinasi IP + username (PROJECT-CONTEXT.md bagian 7, Rate limit login). Penyimpanan in-memory
// cukup untuk satu instance BE; hilang saat server restart.
const FREE_ATTEMPTS = 5;
const BASE_LOCK_MS = 30 * 1000;
const MAX_LOCK_MS = 15 * 60 * 1000;
const FORGET_AFTER_MS = 15 * 60 * 1000;
const SWEEP_THRESHOLD = 1000;

type AttemptState = {
  failures: number;
  lastFailureAt: number;
  lockedUntil: number;
};

const attempts = new Map<string, AttemptState>();

function isForgotten(state: AttemptState, now: number): boolean {
  return now >= state.lockedUntil && now - state.lastFailureAt > FORGET_AFTER_MS;
}

function getActiveState(key: string, now: number): AttemptState | undefined {
  const state = attempts.get(key);
  if (state && isForgotten(state, now)) {
    attempts.delete(key);
    return undefined;
  }
  return state;
}

// Kunci yang tidak pernah dipakai lagi (mis. percobaan dengan banyak username acak) hanya terhapus
// lewat sapuan ini, sehingga Map tidak tumbuh tanpa batas.
function removeForgottenStates(now: number): void {
  for (const [key, state] of attempts) {
    if (isForgotten(state, now)) {
      attempts.delete(key);
    }
  }
}

export function assertLoginAllowed(key: string): void {
  const now = Date.now();
  const state = getActiveState(key, now);
  if (state && now < state.lockedUntil) {
    const retryAfterSeconds = Math.ceil((state.lockedUntil - now) / 1000);
    throw new AppError(
      429,
      ERROR_CODES.TOO_MANY_REQUESTS,
      `Terlalu banyak percobaan login. Coba lagi dalam ${retryAfterSeconds} detik.`,
    );
  }
}

export function recordLoginFailure(key: string): void {
  const now = Date.now();
  if (attempts.size >= SWEEP_THRESHOLD) {
    removeForgottenStates(now);
  }
  const failures = (getActiveState(key, now)?.failures ?? 0) + 1;
  // Kegagalan ke-6 mengunci 30 detik, ke-7 60 detik, dan seterusnya berlipat dua sampai 15 menit.
  const lockMs =
    failures > FREE_ATTEMPTS ? Math.min(BASE_LOCK_MS * 2 ** (failures - FREE_ATTEMPTS - 1), MAX_LOCK_MS) : 0;
  attempts.set(key, { failures, lastFailureAt: now, lockedUntil: now + lockMs });
}

export function resetLoginFailures(key: string): void {
  attempts.delete(key);
}
