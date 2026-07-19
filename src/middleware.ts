import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

// Halaman publik yang tidak perlu autentikasi
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/verify-email',
  '/request-password-reset',
  '/reset-password',
  '/events',
  '/competitions',
];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // BYPASS ABSOLUTE untuk semua rute API — jangan sentuh sama sekali
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // BYPASS untuk Next.js internal
  if (pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  // Cek apakah ini halaman publik
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || (path !== '/' && pathname.startsWith(path))
  );

  // Cek apakah ini file statis (images, favicon, dll di folder public/)
  const isStaticFile = /\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/i.test(pathname);

  if (isPublicPath || isStaticFile) {
    return NextResponse.next();
  }

  // Gunakan auth() dari NextAuth v5 untuk validasi session
  if (req.auth?.user?.id) {
    // User terautentikasi, lanjutkan
    return NextResponse.next();
  }

  // Tidak terautentikasi — redirect ke login
  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('callbackUrl', pathname);
  return NextResponse.redirect(loginUrl);
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes
     * - Next.js static files and internals
     * - Next.js image optimization
     */
    '/((?!api|_next/static|_next/image|_next/data).*)',
  ],
};