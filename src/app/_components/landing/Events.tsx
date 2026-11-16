'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EVENTS, SYMPOSIUM_SPEAKERS, type EventKind, type ImdEvent } from '@/lib/constants';
import { useToday } from '@/lib/hooks/useToday';
import { GdvBloom, GdvHands, GdvStar } from './GdvShapes';

const DAYS = [
  { iso: '2026-11-07', label: '7 Nov', title: 'Pre-event' },
  { iso: '2026-11-14', label: '14 Nov', title: 'Day 1' },
  { iso: '2026-11-15', label: '15 Nov', title: 'Day 2' },
];

const KIND_LABEL: Record<EventKind, string> = {
  workshop: 'Workshop',
  ceremony: 'Ceremony',
  finals: 'Competition',
  exhibition: 'Public exhibition',
  symposium: 'Symposium',
  gala: 'Closing night',
};

function EventCard({ ev, past }: { ev: ImdEvent; past: boolean }) {
  const featured = ev.kind === 'symposium';
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 ${
        featured ? 'bg-paper text-ink-900 lg:col-span-2' : 'bg-ink-900/40 text-paper ring-1 ring-paper/15'
      }`}
    >
      {featured && <GdvBloom className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 text-royal/10" />}
      <div className="relative flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-wider ${
            featured ? 'bg-royal text-paper' : 'bg-mint text-ink-950'
          }`}
        >
          {KIND_LABEL[ev.kind]}
        </span>
        {past && (
          <span className={`tag-mono ${featured ? 'text-ink-900/45' : 'text-paper/45'}`}>Held · {ev.day}</span>
        )}
      </div>

      <h3 className={`relative mt-4 font-display font-bold leading-tight tracking-tight ${featured ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>
        {ev.name}
      </h3>
      <p className={`relative mt-3 max-w-2xl leading-relaxed ${featured ? 'text-ink-900/70' : 'text-paper/70'}`}>{ev.desc}</p>

      <dl className={`relative mt-6 grid gap-3 text-sm ${featured ? 'sm:grid-cols-3' : 'sm:grid-cols-1'}`}>
        {[
          ['When', `${ev.day}, ${ev.time}`],
          ['Where', ev.venue],
          ['Who', ev.open],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className={`tag-mono ${featured ? 'text-royal' : 'text-mint'}`}>{k}</dt>
            <dd className={`mt-1 ${featured ? 'text-ink-900' : 'text-paper/90'}`}>{v}</dd>
          </div>
        ))}
      </dl>

      {featured && (
        <div className="relative mt-8 border-t border-ink-900/10 pt-6">
          <p className="tag-mono mb-4 text-royal">Speakers and moderator</p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {SYMPOSIUM_SPEAKERS.map((sp, i) => (
              <motion.li
                key={sp.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex items-center gap-4"
              >
                <span
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full font-display text-sm font-bold ${
                    sp.role === 'Moderator' ? 'bg-mint text-ink-950' : 'bg-royal text-paper'
                  }`}
                  aria-hidden="true"
                >
                  {sp.initials}
                </span>
                <span>
                  <span className="block font-display text-[15px] font-semibold leading-snug">{sp.name}</span>
                  <span className="text-xs uppercase tracking-wider text-ink-900/50">{sp.role}</span>
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </motion.article>
  );
}

export function Events() {
  const today = useToday();
  const [day, setDay] = useState(DAYS[2].iso);
  const list = EVENTS.filter((e) => e.iso === day);

  return (
    <section
      id="events"
      className="relative scroll-mt-20 overflow-hidden bg-royal px-4 py-24 text-paper sm:px-6 md:py-32"
      aria-labelledby="events-title"
    >
      <GdvHands className="pointer-events-none absolute -left-20 bottom-10 hidden h-72 w-72 text-ink-900/20 lg:block" />
      <GdvStar className="pointer-events-none absolute right-10 top-16 h-24 w-24 text-mint/60 motion-safe:animate-spin-slow" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="tag-mono mb-4 text-mint">Main events</p>
            <h2 id="events-title" className="text-[clamp(2.4rem,6vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.03em]">
              More than a competition.
            </h2>
          </div>
          <p className="max-w-md text-paper/75">
            A petri dish art workshop, two days of finals and ceremonies, a public exhibition and a symposium on the gut
            microbiome, all at ITB Ganesha.
          </p>
        </div>

        <div role="tablist" aria-label="Event days" className="mb-8 inline-flex rounded-full bg-ink-900/30 p-1">
          {DAYS.map((d) => {
            const active = d.iso === day;
            return (
              <button
                key={d.iso}
                role="tab"
                aria-selected={active}
                onClick={() => setDay(d.iso)}
                className={`relative rounded-full px-4 py-2 font-display text-sm font-semibold transition-colors sm:px-6 ${
                  active ? 'text-ink-950' : 'text-paper/75 hover:text-paper'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="day-pill"
                    className="absolute inset-0 rounded-full bg-mint"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">
                  <span className="hidden sm:inline">{d.title} </span>
                  <span className="sm:opacity-60">
                    <span className="hidden sm:inline">· </span>
                    {d.label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div role="tabpanel" className="grid gap-4 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {list
              .slice()
              .sort((a, b) => (a.kind === 'symposium' ? -1 : b.kind === 'symposium' ? 1 : 0))
              .map((ev) => (
                <EventCard key={ev.id} ev={ev} past={!!today && today > ev.iso} />
              ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
