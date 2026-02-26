import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note";
import { getAuthFromRequest } from "@/lib/rbac";
import mongoose from "mongoose";

type Ctx = { params: { id: string } };

export async function GET(req: Request, { params }: Ctx) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid note id" }, { status: 400 });
    }

    await connectDB();
    const note = await Note.findOne({ _id: id, userId: auth.userId });

    if (!note) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ note });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid note id" }, { status: 400 });
    }

    await connectDB();
    const deleted = await Note.findOneAndDelete({ _id: id, userId: auth.userId });

    if (!deleted) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}