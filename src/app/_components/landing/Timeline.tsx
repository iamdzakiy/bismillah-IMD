'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { TIMELINE_DATA, type TimelineEntry } from '@/lib/constants';
import { useToday } from '@/lib/hooks/useToday';

const BRANCH_STYLE: Record<TimelineEntry['branch'], string> = {
  MO: 'text-mint',
  SPC: 'text-cream',
  NEC: 'text-royal-300',
  'SPC & NEC': 'text-cream',
  All: 'text-mint',
};

function statusOf(entry: TimelineEntry, today: string | null) {
  if (!today) return 'unknown' as const;
  if (today > entry.end) return 'done' as const;
  if (today >= entry.start) return 'now' as const;
  return 'next' as const;
}

export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const today = useToday();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.5'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <section id="timeline" className="relative scroll-mt-20 px-4 py-24 sm:px-6 md:py-32" aria-labelledby="timeline-title">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="tag-mono mb-4">Timeline</p>
          <h2 id="timeline-title" className="text-[clamp(2.4rem,6vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.03em]">
            July to November.
          </h2>
          <p className="mt-6 max-w-sm text-white/60">
            Dates from the competition guidebook. Each competition page has its own detailed schedule.
          </p>
        </div>

        <div ref={ref} className="relative pl-8 sm:pl-10">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10 sm:left-[9px]" aria-hidden="true" />
          <motion.div
            className="absolute left-[7px] top-2 bottom-2 w-px origin-top bg-mint sm:left-[9px]"
            style={{ scaleY: fill }}
            aria-hidden="true"
          />
          <ol className="space-y-10">
            {TIMELINE_DATA.map((item) => {
              const status = statusOf(item, today);
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute -left-8 top-1.5 h-3.5 w-3.5 rounded-full border-2 sm:-left-10 sm:h-[18px] sm:w-[18px] ${
                      status === 'done'
                        ? 'border-mint bg-mint'
                        : status === 'now'
                          ? 'border-mint bg-ink-900 ring-4 ring-mint/25'
                          : 'border-white/30 bg-ink-900'
                    }`}
                  />
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <p className="font-mono text-sm text-white/55">{item.date}</p>
                    <p className={`tag-mono ${BRANCH_STYLE[item.branch]}`}>{item.branch}</p>
                    {status === 'now' && <p className="tag-mono text-mint">Happening now</p>}
                  </div>
                  <h3
                    className={`mt-1 text-xl font-semibold tracking-tight sm:text-2xl ${
                      status === 'done' ? 'text-white/60' : 'text-paper'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/55">{item.desc}</p>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
