import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  // Baca session token dari cookie next-auth
  // Di HTTPS: __Secure-next-auth.session-token
  // Di HTTP: next-auth.session-token
  const sessionCookie =
    request.cookies.get('__Secure-next-auth.session-token') ||
    request.cookies.get('next-auth.session-token');

  if (!sessionCookie?.value) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

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
