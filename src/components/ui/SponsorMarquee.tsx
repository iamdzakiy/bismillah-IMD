import Image from 'next/image';

interface SponsorItem {
  name: string;
  image?: string;
}

interface SponsorMarqueeProps {
  items: SponsorItem[];
  direction?: 'left' | 'right';
  /** Seconds for one full loop. */
  duration?: number;
}

/** Partner names/logos on a CSS-driven loop. Pauses on hover and focus. */
export function SponsorMarquee({ items, direction = 'left', duration = 40 }: SponsorMarqueeProps) {
  // Repeat short lists so the strip is always wider than the viewport.
  const base = items.length < 8 ? [...items, ...items, ...items] : items;
  const loop = [...base, ...base];

  return (
    <div className="marquee relative overflow-hidden" tabIndex={0}>
      <div
        className="marquee-track flex w-max items-center gap-10"
        data-direction={direction}
        style={{ ['--marquee-duration' as string]: `${duration}s` }}
      >
        {loop.map((item, i) => (
          <div key={i} aria-hidden={i >= base.length} className="flex flex-shrink-0 items-center gap-3">
            {item.image && (
              <Image src={item.image} alt="" width={40} height={40} className="h-10 w-10 object-contain" />
            )}
            <span className="font-display text-xl font-medium text-white/50 sm:text-2xl">@{item.name}</span>
            <span aria-hidden="true" className="text-agar/60">
              ✳
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
