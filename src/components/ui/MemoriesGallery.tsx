import Image from 'next/image';
import { MEMORIES_DATA } from '@/lib/constants';

/**
 * Photo strip from earlier IMD editions. The scroll is a CSS animation
 * (see .marquee-track in globals.css), so React does not re-render per frame,
 * and next/image serves resized copies instead of the 5-8 MB originals.
 */
export function MemoriesGallery() {
  const items = [...MEMORIES_DATA, ...MEMORIES_DATA];

  return (
    <div className="marquee relative w-full overflow-hidden" tabIndex={0} aria-label="Photos from previous IMD events">
      <div
        className="marquee-track flex w-max gap-4"
        style={{ ['--marquee-duration' as string]: '80s' }}
      >
        {items.map((mem, i) => (
          <figure
            key={i}
            aria-hidden={i >= MEMORIES_DATA.length}
            className="group relative aspect-[4/5] w-[220px] flex-shrink-0 overflow-hidden rounded-2xl bg-ink-800 sm:w-[280px]"
          >
            <Image
              src={mem.image}
              alt={i < MEMORIES_DATA.length ? `${mem.title}, ${mem.date}` : ''}
              fill
              sizes="(max-width: 640px) 220px, 280px"
              className="object-cover grayscale-[35%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
              <p className="text-sm font-semibold text-paper">{mem.title}</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">{mem.date}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink-900 to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink-900 to-transparent sm:w-32" />
    </div>
  );
}
