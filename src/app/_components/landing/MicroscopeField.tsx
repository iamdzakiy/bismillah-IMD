'use client';

import { useEffect, useRef } from 'react';

/**
 * A field of unresolved specimens. Outside the lens every organism is a faint
 * speck; inside the lens it resolves into its true morphology and gets a label.
 * Moving the pointer moves the lens. With no pointer (touch, idle) the lens
 * drifts on its own. Each morphotype counts as "decoded" once it has been held
 * in the lens briefly, and progress is reported through onDecode.
 *
 * Cost control: one 2D canvas, DPR capped at 1.75, only organisms inside the
 * lens are drawn in detail, rendering pauses off screen or in hidden tabs.
 */

export const MORPHOTYPES = [
  { id: 'strep', label: 'Streptococcus', note: 'cocci in chains' },
  { id: 'staph', label: 'Staphylococcus', note: 'cocci in grape-like clusters' },
  { id: 'bacillus', label: 'Bacillus', note: 'rods, often in chains' },
  { id: 'ecoli', label: 'Escherichia', note: 'rod, peritrichous flagella' },
  { id: 'vibrio', label: 'Vibrio', note: 'curved rod, single polar flagellum' },
  { id: 'spirillum', label: 'Spirillum', note: 'rigid helix' },
  { id: 'neisseria', label: 'Neisseria', note: 'kidney-bean diplococci' },
  { id: 'yeast', label: 'Saccharomyces', note: 'budding yeast, eukaryote' },
  { id: 'diatom', label: 'Pennate diatom', note: 'silica frustule with striae' },
  { id: 'haloq', label: 'Haloquadratum', note: 'square archaeon from salt ponds' },
] as const;

export type MorphotypeId = (typeof MORPHOTYPES)[number]['id'];

const MINT = '98,242,189';
const CREAM = '241,249,200';
const ROYAL = '132,151,230';

interface Org {
  x: number; // 0..1 of field width
  y: number; // 0..1 of field height
  type: number; // index into MORPHOTYPES
  rot: number;
  scale: number;
  vx: number;
  vy: number;
  vr: number;
  seed: number;
}

function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function rodPath(ctx: CanvasRenderingContext2D, len: number, w: number) {
  const r = w / 2;
  ctx.beginPath();
  ctx.moveTo(-len / 2 + r, -r);
  ctx.lineTo(len / 2 - r, -r);
  ctx.arc(len / 2 - r, 0, r, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(-len / 2 + r, r);
  ctx.arc(-len / 2 + r, 0, r, Math.PI / 2, (Math.PI * 3) / 2);
  ctx.closePath();
}

function drawOrganism(ctx: CanvasRenderingContext2D, o: Org, t: number, alpha: number) {
  const id = MORPHOTYPES[o.type].id;
  const fill = (c: string, a: number) => `rgba(${c}, ${a * alpha})`;
  ctx.lineWidth = 1.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (id) {
    case 'strep': {
      for (let i = 0; i < 6; i++) {
        const x = (i - 2.5) * 9;
        const y = Math.sin(i * 0.9 + o.seed) * 3;
        ctx.beginPath();
        ctx.arc(x, y, 4.4, 0, Math.PI * 2);
        ctx.fillStyle = fill(MINT, 0.55);
        ctx.fill();
        ctx.strokeStyle = fill(MINT, 0.95);
        ctx.stroke();
      }
      break;
    }
    case 'staph': {
      for (let i = 0; i < 9; i++) {
        const a = rand(o.seed + i) * Math.PI * 2;
        const d = Math.sqrt(rand(o.seed + i + 20)) * 11;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * d, Math.sin(a) * d, 4.6, 0, Math.PI * 2);
        ctx.fillStyle = fill(CREAM, 0.45);
        ctx.fill();
        ctx.strokeStyle = fill(CREAM, 0.9);
        ctx.stroke();
      }
      break;
    }
    case 'bacillus': {
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.translate((i - 1) * 25, 0);
        rodPath(ctx, 23, 8);
        ctx.fillStyle = fill(ROYAL, 0.5);
        ctx.fill();
        ctx.strokeStyle = fill(ROYAL, 1);
        ctx.stroke();
        // endospore
        if (i === 1) {
          ctx.beginPath();
          ctx.ellipse(4, 0, 3.4, 2.4, 0, 0, Math.PI * 2);
          ctx.fillStyle = fill(CREAM, 0.9);
          ctx.fill();
        }
        ctx.restore();
      }
      break;
    }
    case 'ecoli': {
      ctx.strokeStyle = fill(CREAM, 0.55);
      ctx.lineWidth = 0.9;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + o.seed;
        const sx = Math.cos(a) * 10;
        const sy = Math.sin(a) * 5;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        for (let k = 1; k <= 12; k++) {
          const d = k * 2.2;
          const wave = Math.sin(k * 0.9 + t * 6 + i) * 2.2;
          ctx.lineTo(sx + Math.cos(a) * d - Math.sin(a) * wave, sy + Math.sin(a) * d + Math.cos(a) * wave);
        }
        ctx.stroke();
      }
      ctx.lineWidth = 1.2;
      rodPath(ctx, 26, 11);
      ctx.fillStyle = fill(MINT, 0.5);
      ctx.fill();
      ctx.strokeStyle = fill(MINT, 1);
      ctx.stroke();
      break;
    }
    case 'vibrio': {
      ctx.beginPath();
      ctx.arc(0, 14, 16, -Math.PI * 0.78, -Math.PI * 0.22);
      ctx.lineWidth = 7;
      ctx.strokeStyle = fill(CREAM, 0.75);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.strokeStyle = fill(CREAM, 0.6);
      ctx.beginPath();
      const sx = Math.cos(-Math.PI * 0.22) * 16;
      const sy = 14 + Math.sin(-Math.PI * 0.22) * 16;
      ctx.moveTo(sx, sy);
      for (let k = 1; k <= 14; k++) {
        ctx.lineTo(sx + k * 2.1, sy + Math.sin(k * 0.8 - t * 8) * 2.6);
      }
      ctx.stroke();
      break;
    }
    case 'spirillum': {
      ctx.beginPath();
      for (let k = 0; k <= 40; k++) {
        const x = (k - 20) * 1.4;
        const y = Math.sin(k * 0.42 + t * 2) * 5;
        if (k === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineWidth = 4;
      ctx.strokeStyle = fill(MINT, 0.85);
      ctx.stroke();
      break;
    }
    case 'neisseria': {
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(side * 5.6, 0, 5, 7, 0, 0, Math.PI * 2);
        ctx.fillStyle = fill(ROYAL, 0.55);
        ctx.fill();
        ctx.strokeStyle = fill(ROYAL, 1);
        ctx.stroke();
      }
      // flattened adjoining sides
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(0, 6);
      ctx.strokeStyle = fill(CREAM, 0.6);
      ctx.stroke();
      break;
    }
    case 'yeast': {
      ctx.beginPath();
      ctx.ellipse(0, 0, 12, 9.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = fill(CREAM, 0.35);
      ctx.fill();
      ctx.strokeStyle = fill(CREAM, 0.95);
      ctx.stroke();
      // vacuole and nucleus
      ctx.beginPath();
      ctx.arc(-3, -1, 3.6, 0, Math.PI * 2);
      ctx.strokeStyle = fill(CREAM, 0.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(4, 2, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = fill(MINT, 0.9);
      ctx.fill();
      // bud
      ctx.beginPath();
      ctx.ellipse(14.5, -6, 5, 4.2, -0.5, 0, Math.PI * 2);
      ctx.fillStyle = fill(CREAM, 0.35);
      ctx.fill();
      ctx.strokeStyle = fill(CREAM, 0.95);
      ctx.stroke();
      break;
    }
    case 'diatom': {
      ctx.beginPath();
      ctx.ellipse(0, 0, 26, 6.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = fill(MINT, 0.18);
      ctx.fill();
      ctx.strokeStyle = fill(MINT, 0.95);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-22, 0);
      ctx.lineTo(22, 0);
      ctx.stroke();
      ctx.strokeStyle = fill(MINT, 0.5);
      ctx.lineWidth = 0.8;
      for (let k = -9; k <= 9; k++) {
        const x = k * 2.4;
        const h = 6.5 * Math.sqrt(Math.max(0, 1 - (x / 26) ** 2));
        ctx.beginPath();
        ctx.moveTo(x, -h + 1);
        ctx.lineTo(x, h - 1);
        ctx.stroke();
      }
      break;
    }
    case 'haloq': {
      ctx.beginPath();
      ctx.rect(-12, -12, 24, 24);
      ctx.fillStyle = fill(CREAM, 0.22);
      ctx.fill();
      ctx.strokeStyle = fill(CREAM, 1);
      ctx.stroke();
      // gas vesicles
      for (let k = 0; k < 6; k++) {
        ctx.beginPath();
        ctx.ellipse(-7 + rand(o.seed + k) * 14, -7 + rand(o.seed + k + 9) * 14, 2.2, 1.1, rand(o.seed + k + 3) * 3, 0, Math.PI * 2);
        ctx.fillStyle = fill(MINT, 0.85);
        ctx.fill();
      }
      break;
    }
  }
}

export function MicroscopeField({
  className = '',
  onDecode,
  pointerTarget,
}: {
  className?: string;
  onDecode?: (id: MorphotypeId) => void;
  pointerTarget: React.RefObject<HTMLElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onDecodeRef = useRef(onDecode);
  useEffect(() => {
    onDecodeRef.current = onDecode;
  }, [onDecode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = pointerTarget.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rootStyle = getComputedStyle(document.documentElement);
    const fDisplay = rootStyle.getPropertyValue('--font-poppins').trim() || 'Poppins, sans-serif';
    const fBody = rootStyle.getPropertyValue('--font-lato').trim() || 'Lato, sans-serif';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmall = window.matchMedia('(max-width: 768px)').matches;
    const count = isSmall ? 46 : 90;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let running = false;
    let visible = true;
    let last = performance.now();
    let clock = 0;
    let lensR = 120;
    const lens = { x: 0, y: 0, tx: 0, ty: 0 };
    let pointerActive = false;
    let pointerIdleAt = 0;
    const dwell = new Map<number, number>();
    const decoded = new Set<number>();

    const orgs: Org[] = [];
    for (let i = 0; i < count; i++) {
      orgs.push({
        x: rand(i + 1),
        y: rand(i + 101),
        type: i % MORPHOTYPES.length,
        rot: rand(i + 201) * Math.PI * 2,
        scale: 0.85 + rand(i + 301) * 0.5,
        vx: (rand(i + 401) - 0.5) * 0.006,
        vy: (rand(i + 501) - 0.5) * 0.006,
        vr: (rand(i + 601) - 0.5) * 0.25,
        seed: i * 7 + 3,
      });
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lensR = Math.max(92, Math.min(170, Math.min(width, height) * 0.2));
      if (!lens.x) {
        lens.x = lens.tx = width * (isSmall ? 0.62 : 0.7);
        lens.y = lens.ty = height * (isSmall ? 0.72 : 0.48);
      }
      if (!running) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Unresolved specks
      for (const o of orgs) {
        const px = o.x * width;
        const py = o.y * height;
        ctx.beginPath();
        ctx.arc(px, py, 1.4 * o.scale, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(241,249,200,0.22)';
        ctx.fill();
      }

      // Lens interior
      ctx.save();
      ctx.beginPath();
      ctx.arc(lens.x, lens.y, lensR, 0, Math.PI * 2);
      ctx.clip();
      const bg = ctx.createRadialGradient(lens.x, lens.y, lensR * 0.1, lens.x, lens.y, lensR);
      bg.addColorStop(0, 'rgba(52,76,197,0.55)');
      bg.addColorStop(1, 'rgba(18,28,85,0.85)');
      ctx.fillStyle = bg;
      ctx.fillRect(lens.x - lensR, lens.y - lensR, lensR * 2, lensR * 2);

      let nearest: Org | null = null;
      let nearestD = Infinity;
      for (const o of orgs) {
        const px = o.x * width;
        const py = o.y * height;
        const d = Math.hypot(px - lens.x, py - lens.y);
        if (d > lensR + 40) continue;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(o.rot);
        ctx.scale(o.scale * 1.15, o.scale * 1.15);
        drawOrganism(ctx, o, clock, 1);
        ctx.restore();
        if (d < nearestD) {
          nearestD = d;
          nearest = o;
        }
      }

      // Reticle
      ctx.strokeStyle = 'rgba(241,249,200,0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(lens.x - lensR, lens.y);
      ctx.lineTo(lens.x + lensR, lens.y);
      ctx.moveTo(lens.x, lens.y - lensR);
      ctx.lineTo(lens.x, lens.y + lensR);
      ctx.stroke();
      for (let k = -8; k <= 8; k++) {
        const s = k % 4 === 0 ? 7 : 3.5;
        ctx.beginPath();
        ctx.moveTo(lens.x + k * (lensR / 9), lens.y - s);
        ctx.lineTo(lens.x + k * (lensR / 9), lens.y + s);
        ctx.stroke();
      }
      ctx.restore();

      // Lens rim
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(98,242,189,0.85)';
      ctx.beginPath();
      ctx.arc(lens.x, lens.y, lensR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(241,249,200,0.25)';
      ctx.beginPath();
      ctx.arc(lens.x, lens.y, lensR + 7, 0, Math.PI * 2);
      ctx.stroke();

      // Label the organism nearest the crosshair
      if (nearest && nearestD < lensR * 0.8) {
        const m = MORPHOTYPES[nearest.type];
        const lx = lens.x + lensR * 0.72;
        const ly = lens.y - lensR * 0.72;
        const tx = lx + 16;
        ctx.strokeStyle = 'rgba(98,242,189,0.8)';
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(tx, ly - 16);
        ctx.lineTo(tx + 10, ly - 16);
        ctx.stroke();
        const title = m.label;
        const note = m.note;
        ctx.font = `italic 600 14px ${fDisplay}`;
        const w1 = ctx.measureText(title).width;
        ctx.font = `500 11px ${fBody}`;
        const w2 = ctx.measureText(note).width;
        const boxW = Math.max(w1, w2) + 20;
        let bx = tx + 12;
        if (bx + boxW > width - 8) bx = lens.x - lensR * 0.72 - boxW - 24;
        const by = ly - 44;
        ctx.fillStyle = 'rgba(7,12,43,0.86)';
        ctx.strokeStyle = 'rgba(98,242,189,0.5)';
        ctx.beginPath();
        ctx.roundRect(bx, by, boxW, 46, 8);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'rgba(98,242,189,1)';
        ctx.font = `italic 600 14px ${fDisplay}`;
        ctx.fillText(title, bx + 10, by + 20);
        ctx.fillStyle = 'rgba(241,249,200,0.75)';
        ctx.font = `500 11px ${fBody}`;
        ctx.fillText(note, bx + 10, by + 36);
      }
      return nearestD < lensR * 0.8 ? nearest : null;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;

      for (const o of orgs) {
        o.x += o.vx * dt;
        o.y += o.vy * dt;
        o.rot += o.vr * dt;
        if (o.x < -0.03) o.x = 1.03;
        if (o.x > 1.03) o.x = -0.03;
        if (o.y < -0.03) o.y = 1.03;
        if (o.y > 1.03) o.y = -0.03;
      }

      if (!pointerActive || now - pointerIdleAt > 4000) {
        // Idle drift: a slow Lissajous sweep across the right side of the field
        const cxF = isSmall ? 0.55 : 0.68;
        lens.tx = width * (cxF + Math.sin(clock * 0.21) * (isSmall ? 0.25 : 0.2));
        lens.ty = height * (0.55 + Math.sin(clock * 0.33 + 1) * 0.25);
      }
      lens.x += (lens.tx - lens.x) * Math.min(1, dt * 7);
      lens.y += (lens.ty - lens.y) * Math.min(1, dt * 7);

      const focused = draw();
      if (focused) {
        const v = (dwell.get(focused.type) ?? 0) + dt;
        dwell.set(focused.type, v);
        if (v > 0.7 && !decoded.has(focused.type)) {
          decoded.add(focused.type);
          onDecodeRef.current?.(MORPHOTYPES[focused.type].id);
        }
      }
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

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      lens.tx = e.clientX - rect.left;
      lens.ty = e.clientY - rect.top;
      pointerActive = true;
      pointerIdleAt = performance.now();
      if (reduceMotion) {
        lens.x = lens.tx;
        lens.y = lens.ty;
        const focused = draw();
        if (focused && !decoded.has(focused.type)) {
          decoded.add(focused.type);
          onDecodeRef.current?.(MORPHOTYPES[focused.type].id);
        }
      }
    };
    const onLeave = () => {
      pointerActive = false;
    };
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);

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

    if (reduceMotion) draw();
    else start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [pointerTarget]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
