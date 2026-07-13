'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface BioScannerLensProps {
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
}

export default function BioScannerLens({ mousePosition }: BioScannerLensProps) {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringScale = useMotionValue(1);

  const springX = useSpring(cursorX, { stiffness: 150, damping: 15 });
  const springY = useSpring(cursorY, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    const handleMouseDown = () => ringScale.set(0.95);
    const handleMouseUp = () => ringScale.set(1);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY, ringScale, mousePosition]);

  return (
    <>
      <motion.div className="fixed pointer-events-none z-50" style={{ left: springX, top: springY, x: '-50%', y: '-50%', scale: ringScale }}>
        <div className="w-[200px] h-[200px] rounded-full border border-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.15)] relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 border border-cyan-400/60 rounded-full" />
          </div>
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent" />
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400/70 rounded-tl" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400/70 rounded-tr" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400/70 rounded-bl" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400/70 rounded-br" />
          <div className="absolute inset-0">
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent absolute top-1/2 -translate-y-1/2 animate-[spin_3s_linear_infinite] origin-center" />
          </div>
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="text-[10px] font-mono text-cyan-400/70 tracking-[0.2em]">BIOLUMINESCENT SCAN</span>
          </div>
          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="text-[10px] font-mono text-cyan-400/50 tracking-[0.15em]">RANGE: 0.1μm - 10.0μm</span>
          </div>
        </div>
      </motion.div>
      <motion.div className="fixed pointer-events-none z-50" style={{ left: springX, top: springY, x: '-50%', y: '-50%' }}>
        <div className="w-1 h-1 bg-cyan-300 rounded-full shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
      </motion.div>
    </>
  );
}