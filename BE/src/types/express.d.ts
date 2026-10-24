import type { AuthUser } from "./auth.js";

// req.user diisi auth.middleware dari database, bukan dari body request atau klaim token.
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
