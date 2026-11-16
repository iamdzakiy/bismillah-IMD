'use client';

import { useEffect, useRef } from 'react';

/**
 * A top-down petri dish where colonies seed, grow and fade on their own.
 * Clicking (or tapping) the dish inoculates a new colony at that spot.
 *
 * Cost control: one 2D canvas, a capped colony count, DPR capped at 1.75,
 * rendering pauses when the dish is off screen or the tab is hidden, and
 * prefers-reduced-motion gets a single static frame.
 */

const PALETTE = [
  { core: '255,147,39', rim: '255,190,120' }, // agar orange
  { core: '59,130,246', rim: '147,187,252' }, // MO blue
  { core: '236,72,153', rim: '249,168,212' }, // SPC pink
  { core: '16,185,129', rim: '110,231,183' }, // NEC green
  { core: '243,239,230', rim: '255,255,255' }, // paper
];

interface Colony {
  x: number; // 0..1 inside the dish, polar-sampled
  y: number;
  rMax: number;
  born: number;
  life: number;
  hue: number;
  lobes: number;
  wobble: number;
  seed: number;
}

function rand(seed: number) {
  // Small deterministic PRNG so colony shapes stay stable between frames.
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function PetriCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inoculateRef = useRef<(clientX: number, clientY: number) => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmall = window.matchMedia('(max-width: 768px)').matches;
    const maxColonies = isSmall ? 34 : 64;

    let width = 0;
    let height = 0;
    let radius = 0;
    let cx = 0;
    let cy = 0;
    let dpr = 1;
    let frame = 0;
    let running = false;
    let visible = true;
    let seedCounter = 1;
    let last = performance.now();
    let clock = 0;
    const colonies: Colony[] = [];
    let backdrop: HTMLCanvasElement | null = null;

    const spawn = (at?: { x: number; y: number }, bornOffset = 0): Colony => {
      const s = seedCounter++;
      let x: number;
      let y: number;
      if (at) {
        x = at.x;
        y = at.y;
      } else {
        // Uniform over the disc, kept away from the rim.
        const a = rand(s) * Math.PI * 2;
        const d = Math.sqrt(rand(s + 1)) * 0.86;
        x = Math.cos(a) * d;
        y = Math.sin(a) * d;
      }
      const big = rand(s + 2) > 0.82;
      return {
        x,
        y,
        rMax: big ? 0.05 + rand(s + 3) * 0.05 : 0.012 + rand(s + 3) * 0.03,
        born: clock - bornOffset,
        life: 14 + rand(s + 4) * 22,
        hue: Math.floor(rand(s + 5) * PALETTE.length),
        lobes: 5 + Math.floor(rand(s + 6) * 6),
        wobble: 0.06 + rand(s + 7) * 0.1,
        seed: s,
      };
    };

    const buildBackdrop = () => {
      backdrop = document.createElement('canvas');
      backdrop.width = Math.ceil(width * dpr);
      backdrop.height = Math.ceil(height * dpr);
      const b = backdrop.getContext('2d');
      if (!b) return;
      b.scale(dpr, dpr);

      // Agar body
      const fill = b.createRadialGradient(cx - radius * 0.3, cy - radius * 0.35, radius * 0.1, cx, cy, radius);
      fill.addColorStop(0, 'rgba(255, 196, 140, 0.10)');
      fill.addColorStop(0.6, 'rgba(255, 147, 39, 0.05)');
      fill.addColorStop(1, 'rgba(255, 147, 39, 0.02)');
      b.fillStyle = fill;
      b.beginPath();
      b.arc(cx, cy, radius, 0, Math.PI * 2);
      b.fill();

      // Speckle texture, drawn once
      const speckles = Math.floor(radius * 2.2);
      for (let i = 0; i < speckles; i++) {
        const a = rand(i + 5000) * Math.PI * 2;
        const d = Math.sqrt(rand(i + 7000)) * radius * 0.97;
        b.fillStyle = `rgba(243, 239, 230, ${0.02 + rand(i + 9000) * 0.05})`;
        b.fillRect(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1, 1);
      }

      // Glass rim: two thin rings and a soft highlight arc
      b.lineWidth = 1;
      b.strokeStyle = 'rgba(243, 239, 230, 0.22)';
      b.beginPath();
      b.arc(cx, cy, radius, 0, Math.PI * 2);
      b.stroke();
      b.strokeStyle = 'rgba(243, 239, 230, 0.08)';
      b.beginPath();
      b.arc(cx, cy, radius * 1.035, 0, Math.PI * 2);
      b.stroke();
      b.lineWidth = Math.max(2, radius * 0.012);
      b.strokeStyle = 'rgba(255, 255, 255, 0.10)';
      b.beginPath();
      b.arc(cx, cy, radius * 1.015, Math.PI * 1.08, Math.PI * 1.42);
      b.stroke();

      // Faint measuring ticks, like a counting grid etched on the lid
      b.strokeStyle = 'rgba(243, 239, 230, 0.06)';
      b.lineWidth = 1;
      for (let i = 0; i < 72; i++) {
        const a = (i / 72) * Math.PI * 2;
        const inner = radius * (i % 6 === 0 ? 0.94 : 0.965);
        b.beginPath();
        b.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
        b.lineTo(cx + Math.cos(a) * radius * 0.985, cy + Math.sin(a) * radius * 0.985);
        b.stroke();
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = Math.min(width, height) * 0.46;
      cx = width / 2;
      cy = height / 2;
      buildBackdrop();
      if (!running) draw();
    };

    const drawColony = (c: Colony, t: number) => {
      const age = t - c.born;
      if (age < 0) return;
      const grow = 1 - Math.exp(-age / 4);
      const fade = age > c.life ? Math.max(0, 1 - (age - c.life) / 4) : 1;
      if (fade <= 0) return;
      const r = c.rMax * radius * grow;
      if (r < 0.4) return;
      const px = cx + c.x * radius;
      const py = cy + c.y * radius;
      const col = PALETTE[c.hue];

      // Lobed outline so colonies read as organic, not as dots
      ctx.beginPath();
      const steps = 28;
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const k = 1 + c.wobble * Math.sin(a * c.lobes + c.seed) * grow;
        const rx = px + Math.cos(a) * r * k;
        const ry = py + Math.sin(a) * r * k;
        if (i === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.closePath();
      const g = ctx.createRadialGradient(px - r * 0.3, py - r * 0.3, r * 0.1, px, py, r * 1.1);
      g.addColorStop(0, `rgba(${col.rim}, ${0.55 * fade})`);
      g.addColorStop(0.55, `rgba(${col.core}, ${0.42 * fade})`);
      g.addColorStop(1, `rgba(${col.core}, ${0.12 * fade})`);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${col.rim}, ${0.35 * fade})`;
      ctx.stroke();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      if (backdrop) ctx.drawImage(backdrop, 0, 0, width, height);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.995, 0, Math.PI * 2);
      ctx.clip();
      for (const c of colonies) drawColony(c, clock);
      ctx.restore();
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;

      for (let i = colonies.length - 1; i >= 0; i--) {
        const c = colonies[i];
        if (clock - c.born > c.life + 4) colonies.splice(i, 1);
      }
      while (colonies.length < maxColonies) colonies.push(spawn());

      draw();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    // Seed a dish that already looks lived-in on first paint
    for (let i = 0; i < maxColonies; i++) colonies.push(spawn(undefined, rand(i + 300) * 18));

    inoculateRef.current = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left - cx) / radius;
      const y = (clientY - rect.top - cy) / radius;
      if (x * x + y * y > 0.9) return;
      for (let i = 0; i < 3; i++) {
        const jitter = 0.02 * i;
        colonies.push(spawn({ x: x + jitter * Math.cos(i * 2.1), y: y + jitter * Math.sin(i * 2.1) }));
      }
      if (colonies.length > maxColonies + 12) colonies.splice(0, colonies.length - maxColonies - 12);
      if (reduceMotion) {
        // Show the new colony fully grown, since we are not animating.
        clock += 12;
        draw();
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    if (reduceMotion) {
      clock = 12;
      draw();
    } else {
      start();
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      onPointerDown={(e) => inoculateRef.current(e.clientX, e.clientY)}
    />
  );
}
