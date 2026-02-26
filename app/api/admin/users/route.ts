import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";
import { getAuthFromRequest, requireRole } from "../../../../lib/rbac";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const roleCheck = requireRole(auth, ["admin"]);
    if (!roleCheck.ok) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await connectDB();
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });

    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.error("ADMIN USERS ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}