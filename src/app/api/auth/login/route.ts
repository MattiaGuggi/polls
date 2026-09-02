// src/app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromDb } from '@/lib/db';
import bcrypt from 'bcrypt';

// 1. GET method: Called on page refresh by UserContext to verify user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Missing userId' }, { status: 400 });
    }

    const user = await getUserFromDb({ _id: userId });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const safeUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    return NextResponse.json({ success: true, user: safeUser });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// 2. POST method: Called by Login form to authenticate user
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password required' }, { status: 400 });
    }

    const user = await getUserFromDb({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const safeUser = {
        _id: user._id,
        username: user.username,
        email: user.email,
      };

      return NextResponse.json({ success: true, user: safeUser }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}