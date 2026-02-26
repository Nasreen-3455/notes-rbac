import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note";
import { getAuthFromRequest } from "@/lib/rbac";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = getAuthFromRequest(req);
    console.log("PUT /api/notes/:id auth =>", auth);

    if (!auth?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { title, content } = await req.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { message: "Title + Content required" },
        { status: 400 }
      );
    }

    await connectDB();

    // 1) Check note exists
    const existing = await Note.findById(id);
    console.log("Existing note =>", existing?._id, "owner:", existing?.user, existing?.userId);

    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // 2) Check ownership (support BOTH possible schema fields: user OR userId)
    const owner =
      (existing as any).user ?? (existing as any).userId ?? null;

    if (!owner || String(owner) !== String(auth.userId)) {
      return NextResponse.json(
        { message: "Forbidden: not your note" },
        { status: 403 }
      );
    }

    // 3) Update
    existing.title = title;
    existing.content = content;
    await existing.save();

    return NextResponse.json({ note: existing }, { status: 200 });
  } catch (e: any) {
    console.error("NOTES PUT ERROR:", e);
    return NextResponse.json(
      { message: e?.message || "Server error", error: String(e) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = getAuthFromRequest(req);
    console.log("DELETE /api/notes/:id auth =>", auth);

    if (!auth?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await connectDB();

    const existing = await Note.findById(id);
    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const owner =
      (existing as any).user ?? (existing as any).userId ?? null;

    if (!owner || String(owner) !== String(auth.userId)) {
      return NextResponse.json(
        { message: "Forbidden: not your note" },
        { status: 403 }
      );
    }

    await Note.deleteOne({ _id: id });

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (e: any) {
    console.error("NOTES DELETE ERROR:", e);
    return NextResponse.json(
      { message: e?.message || "Server error", error: String(e) },
      { status: 500 }
    );
  }
}