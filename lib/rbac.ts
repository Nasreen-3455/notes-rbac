import { NextRequest } from 'next/server';
import { TokenPayload, verifyToken } from './auth';

export function getAuthFromRequest(req: NextRequest): TokenPayload | null {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function requireUser(req: NextRequest): TokenPayload {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    throw new Error('Unauthorized');
  }
  return auth;
}

export function requireAdmin(req: NextRequest): TokenPayload {
  const auth = requireUser(req);
  if (auth.role !== 'admin') {
    throw new Error('Forbidden');
  }
  return auth;
}
export type AuthPayload = {
  userId: string;
  role: "user" | "admin";
};

export function requireRole(auth: AuthPayload, roles: Array<AuthPayload["role"]>) {
  if (!auth) return { ok: false as const };
  if (!roles.includes(auth.role)) return { ok: false as const };
  return { ok: true as const };
}
