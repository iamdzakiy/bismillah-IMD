'use client';

import { usePathname } from 'next/navigation';

const authPaths = ['/login', '/register', '/verify-email', '/reset-password', '/request-password-reset'];

export function FloatingOrbs() {
  const pathname = usePathname();
  const shouldHide = authPaths.some(path => pathname.startsWith(path));
  
  if (shouldHide) return null;
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="orb w-96 h-96 bg-bio-cyan/20 top-1/4 -left-20 animate-blob" />
      <div className="orb w-80 h-80 bg-bio-purple/20 top-1/2 right-10 animate-blob" style={{ animationDelay: '2s' }} />
      <div className="orb w-72 h-72 bg-bio-emerald/20 bottom-1/4 left-1/3 animate-blob" style={{ animationDelay: '4s' }} />
      <div className="orb w-64 h-64 bg-bio-pink/15 top-3/4 right-1/4 animate-blob" style={{ animationDelay: '6s' }} />
    </div>
  );
}
