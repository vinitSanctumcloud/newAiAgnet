import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from '../../db';

interface User {
  _id: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<User>({
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model<User>('User', userSchema);

export async function POST(request: Request): Promise<NextResponse> {
  try {
    await connectDB();
    const { email, password }: Partial<User> = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Password length validation
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    // Ensure DB consistency
    await new Promise((resolve) => setTimeout(resolve, 100));

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: { id: user._id.toString(), email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}