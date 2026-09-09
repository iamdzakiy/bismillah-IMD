// src/components/ui/useConfettiBlast.ts
'use client';

import confetti from 'canvas-confetti';

/**
 * Signature golden-purple palette used across the semifinal celebration.
 * Warm champagne (#ffffff / #fbbf24) accents soften the regal violet tones.
 */
export const SEMIFINAL_CONFETTI_PALETTE = [
  '#a855f7', // purple-500
  '#d946ef', // fuchsia-400
  '#38bdf8', // sky-400
  '#fbbf24', // amber-400
  '#ffffff', // white
];

/**
 * A single center-origin firework explosion. `particleRatio` scales the
 * number of confetti pieces relative to the base `count`.
 */
export function fireCenterExplosion(
  particleRatio: number = 1,
  opts: confetti.Options = {},
) {
  const count = 220;
  const defaults: confetti.Options = {
    origin: { x: 0.5, y: 0.55 },
    colors: SEMIFINAL_CONFETTI_PALETTE,
    disableForReducedMotion: true,
  };
  confetti({
    ...defaults,
    ...opts,
    particleCount: Math.floor(count * particleRatio),
  });
}

/**
 * Fire a side confetti cannon from the left (x: 0) or right (x: 1) edge.
 * Used for the oscillating left/right cannons that follow the center burst.
 */
export function fireSideCannon(fromLeft: boolean, opts: confetti.Options = {}) {
  confetti({
    particleCount: 110,
    angle: fromLeft ? 65 : 115,
    spread: 55,
    startVelocity: 58,
    gravity: 0.95,
    ticks: 240,
    decay: 0.92,
    scalar: 1.08,
    origin: { x: fromLeft ? 0 : 1, y: 0.85 },
    colors: SEMIFINAL_CONFETTI_PALETTE,
    disableForReducedMotion: true,
    ...opts,
  });
}

function delaySideCannon(fromLeft: boolean, ms: number) {
  const timers: number[] = [];
  timers.push(
    window.setTimeout(() => {
      fireSideCannon(fromLeft);
    }, ms),
  );
  return timers;
}

/**
 * Multi-stage release used when a team qualifies for the semifinal:
 *  1. Initial center explosion.
 *  2. Left & right side cannons firing in an oscillating rhythm.
 * Returns an array of window timer ids so callers can cancel on unmount.
 */
export function triggerSemifinalCelebration(): number[] {
  const timers: number[] = [];

  // Stage 1 — dramatic center burst.
  fireCenterExplosion(0.25, { spread: 26, startVelocity: 55 });
  fireCenterExplosion(0.2, { spread: 60 });
  fireCenterExplosion(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fireCenterExplosion(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fireCenterExplosion(0.1, { spread: 120, startVelocity: 45 });

  // Stage 2 — oscillating side cannons (left ↔ right ↔ right ↔ left …).
  timers.push(...delaySideCannon(true, 500));
  timers.push(...delaySideCannon(false, 900));
  timers.push(...delaySideCannon(true, 1350));
  timers.push(...delaySideCannon(false, 1850));
  timers.push(...delaySideCannon(true, 2400));
  timers.push(...delaySideCannon(false, 3000));
  timers.push(...delaySideCannon(true, 3600));

  return timers;
}

/**
 * A compact single-shot blast, handy for the "Replay" button so it feels
 * snappy without repeating the full multi-second sequence every time.
 */
export function playReplayBurst() {
  fireCenterExplosion(0.35, { spread: 70, startVelocity: 38 });
  fireSideCannon(true, { particleCount: 70 });
  fireSideCannon(false, { particleCount: 70 });
}