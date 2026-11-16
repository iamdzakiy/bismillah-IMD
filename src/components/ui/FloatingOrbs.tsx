'use client';

import { usePathname } from 'next/navigation';

const hiddenOn = ['/', '/login', '/register', '/verify-email', '/request-password-reset', '/reset-password'];

// Fixed positions so server and client render the same markup.
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: (i * 7.1 + 3) % 100,
  y: (i * 13.7 + 11) % 100,
  size: ((i * 3.7) % 10) + 6,
  delay: (i * 0.6) % 5,
}));

/** Faint drifting specks behind inner pages. The landing page has its own backdrop. */
export function FloatingOrbs() {
  const pathname = usePathname();
  if (hiddenOn.includes(pathname)) return null;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="animate-drift absolute rounded-full bg-white/[0.04]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
