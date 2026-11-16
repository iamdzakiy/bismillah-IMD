'use client';

import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { MicroscopeField, MORPHOTYPES, type MorphotypeId } from './MicroscopeField';
import { DecodeText } from './DecodeText';
import { GdvStar } from './GdvShapes';
import { getEventPhase, useToday, type EventPhase } from '@/lib/hooks/useToday';

const STATUS: Record<EventPhase, string> = {
  registration: 'Registration open until 31 August 2026',
  running: 'Competition rounds in progress',
  'finals-week': 'Finals week: 14–15 November at ITB Ganesha',
  finished: 'IMD 2026 has wrapped. Thank you to every finalist, speaker and visitor.',
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const today = useToday();
  const phase = today ? getEventPhase(today) : null;
  const [found, setFound] = useState<MorphotypeId[]>([]);
  const [toast, setToast] = useState<MorphotypeId | null>(null);

  const onDecode = useCallback((id: MorphotypeId) => {
    setFound((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setToast(id);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-25%']);
  const fieldOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.2]);

  const primary =
    phase === 'registration'
      ? { href: '/register', label: 'Register now' }
      : phase === 'finished'
        ? { href: '/#events', label: 'Relive the main events' }
        : { href: '/dashboard', label: 'Participant dashboard' };

  const total = MORPHOTYPES.length;
  const done = found.length === total;
  const toastMeta = toast ? MORPHOTYPES.find((m) => m.id === toast) : null;

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden bg-ink-900 px-4 pt-28 pb-14 sm:px-6"
      aria-labelledby="hero-title"
    >
      {/* Specimen field with the microscope lens */}
      <motion.div style={{ opacity: fieldOpacity }} className="absolute inset-0">
        <MicroscopeField pointerTarget={ref} onDecode={onDecode} className="h-full w-full" />
      </motion.div>

      {/* Keep the copy side readable */}
      <div className="pointer-events-none absolute inset-0 bg-ink-900/45 lg:bg-transparent lg:bg-[linear-gradient(90deg,rgba(12,20,64,0.95)_0%,rgba(12,20,64,0.75)_38%,rgba(12,20,64,0)_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ink-900" />

      {/* GDV asterisk, slowly turning */}
      <GdvStar
        className="pointer-events-none absolute -left-16 top-24 h-56 w-56 text-royal/40 motion-safe:animate-spin-slow sm:h-72 sm:w-72"
      />

      <motion.div style={{ y: copyY }} className="relative z-10 mx-auto flex min-h-[calc(100svh-12rem)] max-w-7xl flex-col justify-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="tag-mono mb-6 flex items-center gap-3 text-mint"
        >
          <GdvStar className="h-3.5 w-3.5" />
          <span className="sm:hidden">IMD 2026 · SITH ITB</span>
          <span className="hidden sm:inline">International Microorganism Day 2026 · SITH ITB</span>
        </motion.p>

        <h1
          id="hero-title"
          className="max-w-4xl font-display text-[clamp(3rem,10vw,8.25rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-paper"
        >
          <span className="block">
            <DecodeText text="Decode" delay={250} />{' '}
            <DecodeText text="the" delay={420} />
          </span>
          <span className="block text-mint">
            <DecodeText text="Unknown!" delay={560} />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          className="mt-8 max-w-xl text-base leading-relaxed text-paper/80 sm:text-xl"
        >
          <span className="font-display font-semibold text-paper">The Great Microbial Odyssey.</span>{' '}
          Decoding the
          Earth&apos;s microbial dark matter to orchestrate a sustainable future. Three national competitions, a
          symposium and an exhibition, run by HIMAMIKRO &ldquo;Archaea&rdquo; ITB.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
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
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8 flex items-center gap-2 text-sm text-paper/65"
          aria-live="polite"
        >
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${phase === 'finished' ? 'bg-paper/50' : 'animate-pulse bg-mint'}`}
          />
          {phase ? STATUS[phase] : ' '}
        </motion.p>
      </motion.div>

      {/* Specimen counter: the hero doubles as a small game */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="relative z-20 mx-auto mb-6 max-w-7xl rounded-2xl border border-paper/10 bg-ink-950/70 p-4 backdrop-blur-md lg:absolute lg:right-6 lg:top-28 lg:mb-0 lg:w-72"
      >
        <div className="flex items-baseline justify-between gap-3">
          <p className="tag-mono text-paper/60">Specimens decoded</p>
          <p className="font-display text-sm font-semibold tabular-nums text-mint">
            {found.length}/{total}
          </p>
        </div>
        <div className="mt-2 flex gap-1" aria-hidden="true">
          {MORPHOTYPES.map((m) => (
            <span
              key={m.id}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${found.includes(m.id) ? 'bg-mint' : 'bg-paper/15'}`}
            />
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-paper/60" aria-live="polite">
          {done ? (
            <span className="text-mint">All ten morphotypes identified. You would make a fine microbiologist.</span>
          ) : toastMeta ? (
            <>
              Found <i className="text-paper">{toastMeta.label}</i>: {toastMeta.note}.
            </>
          ) : (
            <>Move the lens over the field. Hold it on a cell to identify it.</>
          )}
        </p>
      </motion.div>

      <motion.dl
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-4 border-t border-paper/10 pt-6 sm:grid-cols-4"
      >
        {[
          ['Competitions', 'MO · SPC · NEC'],
          ['Open to', 'SMA/MA/SMK & S1/D4'],
          ['Main event', '14–15 Nov 2026'],
          ['Venue', 'ITB Ganesha, Bandung'],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="tag-mono">{k}</dt>
            <dd className="mt-1 font-display text-sm font-medium text-paper sm:text-base">{v}</dd>
          </div>
        ))}
      </motion.dl>

      <AnimatePresence>
        {done && !reduce && (
          <motion.div
            key="burst"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2.4, ease: 'easeOut' }}
            className="pointer-events-none absolute inset-0 z-30"
            aria-hidden="true"
          >
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ x: '70vw', y: '40vh', scale: 0.2, rotate: 0 }}
                animate={{
                  x: `${50 + Math.cos((i / 14) * Math.PI * 2) * 40}vw`,
                  y: `${45 + Math.sin((i / 14) * Math.PI * 2) * 35}vh`,
                  scale: 1,
                  rotate: 180,
                }}
                transition={{ duration: 1.6, ease: EASE }}
                className="absolute left-0 top-0 block h-8 w-8 text-mint"
              >
                <GdvStar className="h-full w-full" />
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
