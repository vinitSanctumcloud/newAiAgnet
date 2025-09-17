// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
