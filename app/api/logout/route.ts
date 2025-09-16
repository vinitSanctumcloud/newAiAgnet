// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { signOut } from 'next-auth/react';

export async function POST() {
  try {
    // Since this is an API route, we can't use signOut directly (it's a client-side function).
    // Instead, clear the next-auth session cookie and redirect to the login page.
    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.cookies.set('next-auth.session-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
    });
    // Optionally, clear other next-auth cookies
    response.cookies.set('next-auth.csrf-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log out' }, { status: 500 });
  }
}