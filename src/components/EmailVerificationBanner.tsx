'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const authPaths = ['/login', '/register', '/verify-email', '/reset-password', '/request-password-reset'];

export function EmailVerificationBanner() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Hide on auth pages
  if (authPaths.includes(pathname)) return null;

  if (!session || session.user.active) return null;

  return (
    <div className="bg-yellow-500/10 border-l-4 border-yellow-500 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <p className="text-yellow-200 text-sm">
          ⚠️ Please verify your email to access all features.
        </p>
        <Link
          href={`/verify-email?email=${encodeURIComponent(session.user.email || '')}`}
          className="text-yellow-400 hover:text-yellow-300 text-sm font-medium underline"
        >
          Verify Now
        </Link>
      </div>
    </div>
  );
}