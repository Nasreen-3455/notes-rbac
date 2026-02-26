import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";
import { getAuthFromRequest, requireRole } from "../../../../lib/rbac";

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const roleCheck = requireRole(auth, ["admin"]);
    if (!roleCheck.ok) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ message: "userId is required" }, { status: 400 });

    await connectDB();
    const updated = await User.findByIdAndUpdate(userId, { role: "admin" }, { new: true });

    if (!updated) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "User promoted to admin" }, { status: 200 });
  } catch (err) {
    console.error("PROMOTE ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}