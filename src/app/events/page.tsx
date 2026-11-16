'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { EVENTS, SYMPOSIUM_SPEAKERS } from '@/lib/constants';
import { useToday } from '@/lib/hooks/useToday';
import { GdvBloom, GdvStar } from '@/app/_components/landing/GdvShapes';

const DAY_TITLES: Record<string, string> = {
  '2026-11-07': 'Pre-event · Saturday 7 November',
  '2026-11-14': 'Day 1 · Saturday 14 November',
  '2026-11-15': 'Day 2 · Sunday 15 November',
};

export default function EventsPage() {
  const today = useToday();
  const days = Array.from(new Set(EVENTS.map((e) => e.iso)));

  return (
    <div className="min-h-screen bg-ink-900 px-4 pb-24 pt-28 text-paper sm:px-6">
      <div className="mx-auto max-w-5xl">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-16"
        >
          <GdvStar className="absolute -right-4 -top-6 h-20 w-20 text-mint/50 motion-safe:animate-spin-slow" />
          <p className="tag-mono mb-4 text-mint">IMD 2026 · Decode the Unknown!</p>
          <h1 className="font-display text-[clamp(2.6rem,7vw,5rem)] font-bold leading-[0.95] tracking-[-0.03em]">
            Events and schedule
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-paper/70">
            Everything that happened around the competitions: a hands-on workshop, two days of finals and ceremonies, a
            public exhibition and a symposium on the gut microbiome. Times are in WIB.
          </p>
        </motion.header>

        <div className="space-y-16">
          {days.map((iso) => (
            <section key={iso} aria-labelledby={`day-${iso}`}>
              <h2 id={`day-${iso}`} className="tag-mono mb-6 flex items-center gap-3 text-paper/60">
                <span className="h-px w-8 bg-mint" />
                {DAY_TITLES[iso]}
              </h2>
              <ol className="space-y-4">
                {EVENTS.filter((e) => e.iso === iso).map((ev, i) => {
                  const featured = ev.kind === 'symposium';
                  const past = !!today && today > ev.iso;
                  return (
                    <motion.li
                      key={ev.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.45, delay: i * 0.05 }}
                      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 ${
                        featured ? 'bg-paper text-ink-900' : 'bg-ink-800 ring-1 ring-paper/10'
                      }`}
                    >
                      {featured && (
                        <GdvBloom className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 text-royal/10" />
                      )}
                      <div className="relative grid gap-6 md:grid-cols-[1fr_16rem]">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <p className={`font-display text-sm font-semibold ${featured ? 'text-royal' : 'text-mint'}`}>
                              {ev.time}
                            </p>
                            {past && (
                              <span className={`tag-mono ${featured ? 'text-ink-900/45' : 'text-paper/40'}`}>Held</span>
                            )}
                          </div>
                          <h3 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">{ev.name}</h3>
                          <p className={`mt-3 leading-relaxed ${featured ? 'text-ink-900/70' : 'text-paper/70'}`}>{ev.desc}</p>
                          {featured && (
                            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                              {SYMPOSIUM_SPEAKERS.map((sp) => (
                                <li key={sp.name} className="flex items-center gap-3">
                                  <span
                                    aria-hidden="true"
                                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-display text-xs font-bold ${
                                      sp.role === 'Moderator' ? 'bg-mint text-ink-950' : 'bg-royal text-paper'
                                    }`}
                                  >
                                    {sp.initials}
                                  </span>
                                  <span className="text-sm">
                                    <span className="block font-semibold leading-snug">{sp.name}</span>
                                    <span className="text-xs uppercase tracking-wider text-ink-900/50">{sp.role}</span>
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <dl className={`space-y-3 text-sm md:border-l md:pl-6 ${featured ? 'md:border-ink-900/10' : 'md:border-paper/10'}`}>
                          <div>
                            <dt className={`tag-mono ${featured ? 'text-royal' : 'text-mint'}`}>Venue</dt>
                            <dd className="mt-1">{ev.venue}</dd>
                          </div>
                          <div>
                            <dt className={`tag-mono ${featured ? 'text-royal' : 'text-mint'}`}>Open to</dt>
                            <dd className="mt-1">{ev.open}</dd>
                          </div>
                        </dl>
                      </div>
                    </motion.li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>

        <div className="mt-20 flex flex-wrap gap-3">
          <Link href="/#competitions" className="btn-glow">
            See the competitions
          </Link>
          <Link href="/" className="btn-glass">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
