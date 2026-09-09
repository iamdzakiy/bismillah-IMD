// src/components/ui/ConfettiCelebration.tsx
'use client';

import { useEffect, useRef } from 'react';

interface ConfettiCelebrationProps {
  /** Whether to play the confetti burst. Defaults to true (starts on mount). */
  active?: boolean;
  /** How long the burst runs before fully clearing, in ms. */
  duration?: number;
  /** Number of confetti pieces. */
  count?: number;
}

type Particle = {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rot: number;
  rotSpeed: number;
  color: string;
  sway: number;
  swaySpeed: number;
  shape: 'rect' | 'circle';
  delay: number;
};

const COLORS = ['#f43f5e', '#f97316', '#facc15', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7', '#ec4899', '#ffffff'];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * Lightweight, dependency-free canvas confetti used to celebrate a team
 * passing the preliminary phase. Spawns a celebratory burst that fades out
 * on its own (no React re-renders required).
 */
export function ConfettiCelebration({
  active = true,
  duration = 4200,
  count = 140,
}: ConfettiCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: rand(-w * 0.1, w * 1.1),
      y: rand(-h * 0.6, -20), // spawned above the top edge
      size: rand(6, 13),
      speedY: rand(2.5, 6),
      speedX: rand(-1.5, 1.5),
      rot: rand(0, Math.PI * 2),
      rotSpeed: rand(-0.15, 0.15),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      sway: rand(0.5, 1.5),
      swaySpeed: rand(0.02, 0.06),
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
      delay: rand(0, 700),
    }));

    const start = performance.now();
    let raf: number;

    const frame = (now: number) => {
      const elapsed = now - start;
      const t = elapsed / duration;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, w, h);

      let anyAlive = false;
      for (const p of particles) {
        if (elapsed < p.delay) {
          anyAlive = true;
          continue;
        }
        const age = (elapsed - p.delay) / duration;
        if (age > 1) continue;

        p.x += p.speedX + Math.sin((elapsed / 1000) * p.sway) * p.swaySpeed * 40;
        p.y += p.speedY;
        p.rot += p.rotSpeed;
        anyAlive = anyAlive || p.y < h + 60;

        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - age * age);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (t < 1 && anyAlive) {
        raf = requestAnimationFrame(frame);
      } else {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, duration, count]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}