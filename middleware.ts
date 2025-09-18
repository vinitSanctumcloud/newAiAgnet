import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname === '/auth/login' && req.nextauth?.token) {
      console.log(req.nextauth?.token , "dataaaaaa")
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    // Redirect /aiagnet to /ai-agent
    if (req.nextUrl.pathname === '/aiagnet') {
      return NextResponse.redirect(new URL('/ai-agent', req.url));
    }
    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/auth/login',
    },
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/ai-agent',
    '/auth/login',
    '/api/agent-step1',
    '/api/agent-step2',
    '/api/agent-step3',
    '/api/getAgent',
  ],
};