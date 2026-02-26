import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note";
import { getAuthFromRequest } from "@/lib/rbac";

// ✅ UPDATE NOTE
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // ✅ handle invalid mongo id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid note id" }, { status: 400 });
    }

    const { title, content } = await req.json();
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { message: "Title + Content required" },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ IMPORTANT: your Note schema field is "user" (based on your working GET/POST)
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
      { message: e?.message || "Server error" },
      { status: 500 }
    );
  }
}

// ✅ DELETE NOTE
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid note id" }, { status: 400 });
    }

    await connectDB();

    const deleted = await Note.findOneAndDelete({ _id: id, user: auth.userId });

    if (!deleted) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (e: any) {
    console.error("NOTES DELETE ERROR:", e);
    return NextResponse.json(
      { message: e?.message || "Server error" },
      { status: 500 }
    );
  }
}