import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Note from '@/models/Note';
import { getAuthFromRequest } from '@/lib/rbac';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid note ID' }, { status: 400 });
    }

    await connectDB();

    const note = await Note.findById(id);
    if (!note) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }

    if (note.user.toString() !== auth.userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Fetch single note error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid note ID' }, { status: 400 });
    }

    const { title, content } = await req.json();
    if (!title && !content) {
      return NextResponse.json({ message: 'Nothing to update' }, { status: 400 });
    }

    await connectDB();

    const note = await Note.findById(id);
    if (!note) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }

    if (note.user.toString() !== auth.userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    if (title) note.title = title;
    if (content) note.content = content;

    await note.save();

    return NextResponse.json(note);
  } catch (error) {
    console.error('Update note error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid note ID' }, { status: 400 });
    }

    await connectDB();

    const note = await Note.findById(id);
    if (!note) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }

    if (note.user.toString() !== auth.userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await note.deleteOne();
    return NextResponse.json({ message: 'Note deleted' });
  } catch (error) {
    console.error('Delete note error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
