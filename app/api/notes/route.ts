import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Note from '@/models/Note';
import { getAuthFromRequest } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const notes = await Note.find({ user: auth.userId });
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Fetch notes error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { title, content } = await req.json();
    if (!title || !content) {
      return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
    }

    await connectDB();

    const note = new Note({ title, content, user: auth.userId });
    await note.save();

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Create note error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
