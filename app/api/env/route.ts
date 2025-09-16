
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set (hidden for security)' : undefined,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  });
}
