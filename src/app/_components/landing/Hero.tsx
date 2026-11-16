'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { PetriCanvas } from './PetriCanvas';
import { getEventPhase, useToday, type EventPhase } from '@/lib/hooks/useToday';

const STATUS: Record<EventPhase, string> = {
  registration: 'Registration open until 31 August 2026',
  running: 'Competition rounds in progress',
  'finals-week': 'Finals week: 14–15 November at ITB Ganesha',
  finished: 'IMD 2026 has wrapped. Thank you for coming.',
};

const EASE = [0.22, 1, 0.36, 1] as const;

function RevealLine({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={{ y: '105%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const today = useToday();
  const phase = today ? getEventPhase(today) : null;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const dishScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.35]);
  const dishOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const dishRotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 25]);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-30%']);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const primary =
    phase === 'registration'
      ? { href: '/register', label: 'Register' }
      : { href: '/dashboard', label: 'Participant dashboard' };

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden px-4 pt-28 pb-16 sm:px-6"
      aria-labelledby="hero-title"
    >
      {/* The dish */}
      <motion.div
        style={{ scale: dishScale, opacity: dishOpacity, rotate: dishRotate }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center lg:justify-end"
      >
        <div className="pointer-events-auto relative aspect-square w-[118vw] max-w-[760px] opacity-55 sm:w-[90vw] lg:mr-[-6vw] lg:w-[58vw] lg:opacity-100">
          <PetriCanvas className="h-full w-full cursor-crosshair touch-manipulation" />
        </div>
      </motion.div>

      {/* Fade the dish into the page edge so text keeps contrast */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(11,10,16,0.92)_20%,rgba(11,10,16,0.35)_60%,transparent_80%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-900" />

      <motion.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="relative z-10 mx-auto flex min-h-[calc(100svh-11rem)] max-w-7xl flex-col justify-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="tag-mono mb-6 flex items-center gap-3"
        >
          <span className="inline-block h-px w-8 bg-agar" />
          International Microorganism Day 2026 · ITB
        </motion.p>

        <h1
          id="hero-title"
          className="max-w-4xl text-[clamp(2.9rem,9vw,7.5rem)] font-bold leading-[0.92] tracking-[-0.035em] text-paper"
        >
          <RevealLine delay={0.1}>The Great</RevealLine>
          <RevealLine delay={0.22}>
            Microbial <span className="text-agar">Odyssey</span>
          </RevealLine>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl"
        >
          Decoding the Earth&apos;s dark matter to orchestrate a sustainable future. Three national
          competitions for high school and undergraduate students, run by HIMAMIKRO
          &ldquo;Archaea&rdquo; ITB.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Link href={primary.href} className="btn-glow">
            {primary.label}
          </Link>
          <Link href="/#competitions" className="btn-glass">
            See the competitions
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: phase ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8 flex items-center gap-2 text-sm text-white/60"
          aria-live="polite"
        >
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              phase === 'finished' ? 'bg-white/40' : 'bg-agar animate-pulse'
            }`}
          />
          {phase ? STATUS[phase] : ' '}
        </motion.p>
      </motion.div>

      <motion.dl
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-6 sm:grid-cols-4"
      >
        {[
          ['Competitions', 'MO · SPC · NEC'],
          ['Open to', 'SMA/MA/SMK & S1/D4'],
          ['Finals', '14–15 Nov 2026'],
          ['Venue', 'ITB Ganesha, Bandung'],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="tag-mono">{k}</dt>
            <dd className="mt-1 text-sm text-paper sm:text-base">{v}</dd>
          </div>
        ))}
      </motion.dl>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        aria-hidden="true"
        className="tag-mono pointer-events-none absolute right-8 top-28 z-10 hidden text-white/35 lg:block"
      >
        Click the dish to inoculate
      </motion.p>
    </section>
  );
}
