'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      x.set(e.clientX);
      y.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', updatePosition);

    // Detect hoverable elements
    const hoverables = document.querySelectorAll('a, button, input, select, textarea, [role="button"], label');
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      hoverables.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [isVisible, x, y]);

  if (typeof window === 'undefined') return null;

  return (
    <>
      {/* Main Cursor - Magnifier */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: x.get() - 24,
          y: y.get() - 24,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          className={`transition-transform duration-200 ${isHovering ? 'scale-125' : 'scale-100'}`}
        >
          {/* Outer ring */}
          <circle
            cx="24"
            cy="24"
            r="22"
            stroke="rgba(168, 85, 247, 0.6)"
            strokeWidth="2"
            fill="rgba(168, 85, 247, 0.05)"
          />
          {/* Inner dot */}
          <circle cx="24" cy="24" r="4" fill="rgba(192, 132, 252, 0.8)" />
          {/* Scanning lines (magnifier effect) */}
          <line x1="4" y1="24" x2="12" y2="24" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="1" />
          <line x1="36" y1="24" x2="44" y2="24" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="1" />
          <line x1="24" y1="4" x2="24" y2="12" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="1" />
          <line x1="24" y1="36" x2="24" y2="44" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="1" />
        </svg>
      </motion.div>

      {/* Trail Effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: position.x - 2,
          y: position.y - 2,
          opacity: isVisible ? 0.3 : 0,
        }}
        animate={{
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
        }}
      >
        <div className="w-1 h-1 bg-purple-400 rounded-full" />
      </motion.div>
    </>
  );
}