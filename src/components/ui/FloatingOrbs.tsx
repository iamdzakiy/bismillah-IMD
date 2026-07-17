'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

const authPaths = ['/login', '/register', '/verify-email', '/request-password-reset', '/reset-password'];

export function FloatingOrbs() {
  const pathname = usePathname();
  const [particles, setParticles] = useState<Array<Particle>>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Generate deterministic particles on mount to avoid hydration mismatch
    const generatedParticles = [...Array(20)].map((_, i) => ({
      id: i,
      x: (i * 5.1) % 100,
      y: (i * 7.3) % 100,
      size: ((i * 3.7) % 15) + 10,
      delay: (i * 0.25) % 5,
    }));
    setParticles(generatedParticles);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const isAuth = authPaths.includes(pathname);
    if (isAuth) {
      setParticles([]);
      return;
    }
    const generatedParticles = [...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(generatedParticles);
  }, [pathname, mounted]);

  // Always return null during SSR and first client render (before mounted)
  // This prevents hydration mismatch between server and client
  if (!mounted || authPaths.includes(pathname) || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle-dot animate-drift absolute rounded-full bg-purple-500/10 blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}