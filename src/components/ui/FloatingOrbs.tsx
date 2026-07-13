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

export function FloatingOrbs() {
  const pathname = usePathname();
  const [particles, setParticles] = useState<Particle[]>([]);

  // Hide on auth pages
  const isAuthPage = ['/login', '/register', '/verify-email', '/request-password-reset', '/reset-password'].includes(pathname);

  useEffect(() => {
    // Generate particles only on client side to avoid hydration mismatch
    const generatedParticles = [...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(generatedParticles);
  }, []);

  if (isAuthPage || particles.length === 0) return null;

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