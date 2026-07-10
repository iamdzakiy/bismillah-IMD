import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  const publicPaths = [
    '/',
    '/login',
    '/register',
    '/verify-email',
    '/request-password-reset',
    '/reset-password',
    '/api/auth',
    '/api/auth/',
    '/api/auth/callback',
    '/api/auth/providers',
    '/api/auth/session',
    '/api/auth/csrf',
    '/api/auth/error',
    '/api/webhooks',
    '/_next',
    '/favicon.ico',
    '/competitions',
  ];

  // Always allow NextAuth internal endpoints
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!token.active && pathname !== '/verify-email') {
    return NextResponse.redirect(new URL('/verify-email', request.url));
  }

  if (pathname.startsWith('/admin') && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};