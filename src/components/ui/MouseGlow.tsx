'use client';

import { useEffect, useState } from 'react';

export function MouseGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-50 w-96 h-96 rounded-full opacity-20 blur-3xl transition-transform duration-300 ease-out"
      style={{
        background: 'radial-gradient(circle, rgba(0,245,255,0.4) 0%, transparent 70%)',
        transform: `translate(${position.x - 192}px, ${position.y - 192}px)`,
      }}
    />
  );
}