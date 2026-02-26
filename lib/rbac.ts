import jwt from "jsonwebtoken";

export type Role = "user" | "admin";

export type AuthPayload = {
  userId: string;
  role: Role;
  email?: string;
};

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// ✅ Works with both NextRequest + Request
function readCookie(req: any, name: string) {
  // NextRequest has req.cookies.get()
  if (req?.cookies?.get) {
    return req.cookies.get(name)?.value || null;
  }

  // Standard Request: read Cookie header
  const cookieHeader = req?.headers?.get?.("cookie") || "";
  const cookies = cookieHeader.split(";").map((c: string) => c.trim());
  const found = cookies.find((c: string) => c.startsWith(name + "="));
  return found ? decodeURIComponent(found.split("=").slice(1).join("=")) : null;
}

export function getAuthFromRequest(req: any): AuthPayload | null {
  try {
    const token = readCookie(req, "token");
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