'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  color: string;
  glowIntensity: number;
  phase: number;
  speed: number;
}

const COLOR_PALETTE = [
  '#f7e9d7', '#ffd9b3', '#ffe5b4', '#d4e1f5', '#b5d3e7',
  '#c8d9e6', '#f2dcd3', '#e8d5c4', '#c9d4c5', '#d4c9d4',
  '#fce4d6', '#e2dce8', '#d9e0e8', '#f5e6d3', '#cfe0e8',
  '#f0e6d0', '#e8dcc8', '#d4dce8', '#c8d4e0', '#e0d8c8'
];

const STAR_COUNT = 100;
const STAR_MIN_RADIUS = 0.8;
const STAR_MAX_RADIUS = 2;

export function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cvs = canvas;
    let stars: Star[] = [];
    let animationId: number;
    let time = 0;
    let targetScrollY = 0;
    let currentScrollY = 0;

    function generateStars(count: number): Star[] {
      const w = cvs.width;
      const h = cvs.height;
      const newStars: Star[] = [];

      for (let i = 0; i < count; i++) {
        newStars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: STAR_MIN_RADIUS + Math.random() * (STAR_MAX_RADIUS - STAR_MIN_RADIUS),
          color: COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)],
          glowIntensity: 0.3 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.05
        });
      }
      return newStars;
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      currentScrollY += (targetScrollY - currentScrollY) * 0.05;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const nebulaGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(canvas.width, canvas.height) * 0.8);
      nebulaGrad.addColorStop(0, 'rgba(10, 20, 50, 0.03)');
      nebulaGrad.addColorStop(0.5, 'rgba(15, 30, 60, 0.02)');
      nebulaGrad.addColorStop(1, 'rgba(7, 11, 23, 0)');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const twinkle = Math.sin(time * s.speed + s.phase) * 0.3;
        const parallax = currentScrollY * 0.02;
        const drawY = s.y + twinkle + parallax;

        const glowGrad = ctx.createRadialGradient(s.x, drawY, 0, s.x, drawY, s.radius * 2);
        const alpha = 0.15 * s.glowIntensity;
        glowGrad.addColorStop(0, s.color + Math.round(alpha * 255).toString(16).padStart(2, '0'));
        glowGrad.addColorStop(1, s.color + '00');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(s.x, drawY, s.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(s.x, drawY, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();
      }

      time += 16;
      animationId = requestAnimationFrame(draw);
    }

    function onScroll() {
      targetScrollY = window.scrollY * 0.3;
    }

    let resizeTimer: number;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const rect = cvs.getBoundingClientRect();
        cvs.width = rect.width * window.devicePixelRatio;
        cvs.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        stars = generateStars(STAR_COUNT);
      }, 100);
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    resizeObserver.observe(cvs);
    stars = generateStars(STAR_COUNT);
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('scroll', onScroll);
      resizeObserver.disconnect();
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}