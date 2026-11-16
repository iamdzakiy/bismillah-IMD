'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';

const LINE =
  'Roughly 99% of microorganisms have never been grown in a lab. Biologists call them microbial dark matter: a library of genes we have barely opened. IMD 2026 asks students what that library could do for medicine, food, energy and cleaner industry.';

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {word}
    </motion.span>
  );
}

export function DarkMatter() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.6'] });
  const pct = useTransform(scrollYProgress, [0, 0.45], [0, 99]);
  const pctText = useTransform(pct, (v) => `${Math.round(v)}%`);
  const mascotY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 80, reduce ? 0 : -80]);
  const mascotRotate = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -8, reduce ? 0 : 8]);
  const words = LINE.split(' ');

  return (
    <section ref={ref} className="relative px-4 py-28 sm:px-6 md:py-40" aria-labelledby="dark-matter-title">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2 id="dark-matter-title" className="tag-mono mb-4">
            The theme
          </h2>
          <motion.p
            aria-label="99 percent"
            className="font-display text-[clamp(6rem,20vw,15rem)] font-bold leading-none tracking-[-0.05em] text-agar"
          >
            {reduce ? '99%' : <motion.span>{pctText}</motion.span>}
          </motion.p>
          <p className="mt-4 max-w-xs text-sm text-white/50">
            of microbial species are still uncultured. Source: IMD 2026 Handbook.
          </p>
          <motion.div style={{ y: mascotY, rotate: mascotRotate }} className="mt-10 hidden w-36 lg:block">
            <Image src="/mascot-archaea.webp" alt="The Archaea ITB mascot" width={482} height={608} className="h-auto w-full" />
          </motion.div>
        </div>

        <p className="font-display text-[clamp(1.6rem,3.4vw,2.9rem)] font-medium leading-[1.2] tracking-[-0.01em] text-paper">
          {reduce
            ? LINE
            : words.map((w, i) => {
                const start = 0.15 + (i / words.length) * 0.7;
                return <Word key={i} word={w} progress={scrollYProgress} range={[start, start + 0.08]} />;
              })}
        </p>
      </div>
    </section>
  );
}
