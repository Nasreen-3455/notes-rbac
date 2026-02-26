import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export type Role = "user" | "admin";

export type AuthPayload = {
  userId: string;
  role: Role;
  email?: string;
};

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export function getAuthFromRequest(req: NextRequest): AuthPayload | null {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export function requireRole(auth: AuthPayload, allowed: Role[]) {
  if (!allowed.includes(auth.role)) {
    return { ok: false, message: "Forbidden" as const };
  }
  return { ok: true as const };
}