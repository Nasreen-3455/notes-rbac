import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note";
import { getAuthFromRequest } from "@/lib/rbac";

type Ctx = { params: Promise<{ id: string }> };

// ✅ UPDATE NOTE
export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const { title, content } = await req.json();
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ message: "Title + Content required" }, { status: 400 });
    }

    await connectDB();

    const note = await Note.findOneAndUpdate(
      {
        _id: id,
        $or: [{ user: auth.userId }, { userId: auth.userId }], // ✅ IMPORTANT
      },
      { title, content },
      { new: true }
    );

    if (!note) return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({ note }, { status: 200 });
  } catch (e: any) {
    console.error("NOTES PUT ERROR:", e);
    return NextResponse.json(
      { message: e?.message || "Server error", error: String(e) },
      { status: 500 }
    );
  }
}

// ✅ DELETE NOTE
export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    await connectDB();

    const deleted = await Note.findOneAndDelete({
      _id: id,
      $or: [{ user: auth.userId }, { userId: auth.userId }], // ✅ IMPORTANT
    });

    if (!deleted) return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (e: any) {
    console.error("NOTES DELETE ERROR:", e);
    return NextResponse.json(
      { message: e?.message || "Server error", error: String(e) },
      { status: 500 }
    );
  }
}