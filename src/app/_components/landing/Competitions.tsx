'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { COMPETITIONS } from '@/lib/competitions-data';

// Presentation details that are not in the competition data file.
// Fees and stages follow the official guidebook.
const META: Record<
  string,
  { accent: string; ring: string; mascot: string; who: string; fee: string; stages: string[] }
> = {
  olympiad: {
    accent: 'text-mint',
    ring: 'border-mint/40',
    mascot: '/4.svg',
    who: 'SMA/MA · individual',
    fee: 'IDR 75,000 early bird, IDR 85,000 normal',
    stages: ['Online elimination: 35 true/false questions', 'Final at ITB: theory paper + lab practical'],
  },
  spc: {
    accent: 'text-cream',
    ring: 'border-cream/40',
    mascot: '/2.svg',
    who: 'SMA/SMK/MA · 3 students + 1 teacher',
    fee: 'Free abstract round, IDR 150,000 semifinal',
    stages: ['Abstract', 'Proposal + 2.5-minute elevator pitch video', 'Prototype pitch and exhibition at ITB'],
  },
  nec: {
    accent: 'text-royal-300',
    ring: 'border-royal-300/50',
    mascot: '/5.svg',
    who: 'S1/D4 · teams of 2–3',
    fee: 'Free abstract round, IDR 150,000 semifinal (includes paper coaching)',
    stages: ['Abstract', 'Full paper in Indonesian, max 10 pages', 'Top 10 pitch and poster exhibition at ITB'],
  },
};

export function Competitions() {
  return (
    <section id="competitions" className="relative scroll-mt-20 px-4 py-24 sm:px-6 md:py-32" aria-labelledby="competitions-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="tag-mono mb-4">Competitions</p>
            <h2 id="competitions-title" className="text-[clamp(2.4rem,6vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.03em]">
              Three ways in.
            </h2>
          </div>
          <p className="max-w-md text-white/60">
            Two for high school students, one for undergraduates. Every competition ends at ITB Ganesha on 14–15
            November 2026, and the awards below are exactly what the guidebook lists.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {COMPETITIONS.map((comp, i) => {
            const meta = META[comp.id];
            const name = comp.title.replace(/\s*\(.*\)$/, '');
            return (
              <motion.article
                key={comp.id}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ top: `${6 + i * 1.5}rem` }}
                className={`group relative overflow-hidden rounded-3xl border bg-ink-800 p-6 sm:p-10 lg:sticky ${meta.ring}`}
              >
                <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
                  <div className="flex flex-col">
                    <div className="flex items-start justify-between gap-6">
                      <p className={`font-mono text-sm tracking-[0.2em] ${meta.accent}`}>
                        {String(i + 1).padStart(2, '0')} / {comp.shortName}
                      </p>
                      <Image
                        src={meta.mascot}
                        alt=""
                        width={88}
                        height={88}
                        className="h-16 w-16 object-contain transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 sm:h-20 sm:w-20"
                      />
                    </div>
                    <h3 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">{name}</h3>
                    <p className="tag-mono mt-3">{meta.who}</p>
                    <p className="mt-6 max-w-xl leading-relaxed text-white/70">{comp.description}</p>

                    <ol className="mt-8 space-y-3">
                      {meta.stages.map((s, si) => (
                        <li key={s} className="flex gap-4 text-sm text-white/80">
                          <span className={`font-mono ${meta.accent}`}>{si + 1}</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>

                    <div className="mt-auto pt-10">
                      <Link
                        href={`/competitions/${comp.id}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-paper underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-mint"
                      >
                        Full rules and guidebook
                        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6">
                    <p className="tag-mono mb-4">Awards</p>
                    <ul className="divide-y divide-white/10">
                      {(comp.awards ?? []).map((a) => (
                        <li key={a.prize} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                          <span className="whitespace-nowrap font-medium text-paper">{a.prize.replace('Honorable Mention (Best Practical)', 'Best Practical')}</span>
                          <span className="text-sm text-white/55 sm:text-right">{a.reward.replace(/ \+ /g, ', ').toLowerCase().replace(/^./, (c) => c.toUpperCase())}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-xs leading-relaxed text-white/40">
                      Cash amounts are not published in the guidebook.
                    </p>
                    <p className="tag-mono mt-8 mb-2">Fee</p>
                    <p className="text-sm text-white/75">{meta.fee}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
