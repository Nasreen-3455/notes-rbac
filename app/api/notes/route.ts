import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note";
import { getAuthFromRequest } from "@/lib/rbac";

// ✅ GET all notes for logged-in user
export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    console.log("AUTH ===>", auth);

    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // ✅ FIXED: use userId (not user)
    const notes = await Note.find({ userId: auth.userId })
      .sort({ createdAt: -1 });

    return NextResponse.json({ notes }, { status: 200 });

  } catch (e: any) {
    console.error("NOTES GET ERROR:", e);
    return NextResponse.json(
      { message: e?.message || "Server error", error: String(e) },
      { status: 500 }
    );
  }
}


// ✅ POST create new note
export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    console.log("AUTH ===>", auth);

    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await req.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { message: "Title + Content required" },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ FIXED: use userId (not user)
    const note = await Note.create({
      title,
      content,
      userId: auth.userId,
    });

    return NextResponse.json({ note }, { status: 201 });

  } catch (e: any) {
    console.error("NOTES POST ERROR:", e);
    return NextResponse.json(
      { message: e?.message || "Server error", error: String(e) },
      { status: 500 }
    );
  }
}