// Nilai sama dengan enum UserRole di schema.prisma. Izin per role menunggu Q-03 (DEC-018).
export const USER_ROLES = {
  OWNER: "owner",
  STAFF: "staff",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const AUTH_COOKIE_NAME = "access_token";

// 8 jam, kira-kira satu shift kerja (keputusan developer, DEC-013). Tanpa refresh token.
export const SESSION_DURATION_SECONDS = 8 * 60 * 60;

export const PASSWORD_MIN_LENGTH = 12;
