import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note";
import { getAuthFromRequest } from "@/lib/rbac";

type RouteContext = { params: Promise<{ id: string }> };

// ✅ UPDATE NOTE
export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params; // ✅ IMPORTANT: await params (Promise)

    const { title, content } = await req.json();
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { message: "Title + Content required" },
        { status: 400 }
      );
    }

    await connectDB();

    const updated = await Note.findOneAndUpdate(
      { _id: id, user: auth.userId },
      { title, content },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ note: updated }, { status: 200 });
  } catch (e: any) {
    console.error("NOTES PUT ERROR:", e);
    return NextResponse.json(
      { message: e?.message || "Server error", error: String(e) },
      { status: 500 }
    );
  }
}

// ✅ DELETE NOTE
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params; // ✅ IMPORTANT: await params (Promise)

    await connectDB();

    const deleted = await Note.findOneAndDelete({ _id: id, user: auth.userId });

    if (!deleted) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (e: any) {
    console.error("NOTES DELETE ERROR:", e);
    return NextResponse.json(
      { message: e?.message || "Server error", error: String(e) },
      { status: 500 }
    );
  }
}