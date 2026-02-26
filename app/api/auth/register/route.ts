import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { signToken, setTokenCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email and password are required' }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role: 'user' });
    await user.save();

    const token = signToken({ userId: user._id.toString(), role: user.role });
    const res = NextResponse.json({ message: 'Registered' }, { status: 201 });
    setTokenCookie(res, token);
    return res;
  } catch (error) {
    console.error('Register error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
