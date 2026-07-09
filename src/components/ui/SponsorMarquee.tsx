'use client';

import { useEffect, useRef } from 'react';

interface SponsorMarqueeProps {
  items: { name: string; icon: string }[];
  direction?: 'left' | 'right';
  speed?: number; // pixels per frame
}

export function SponsorMarquee({
  items,
  direction = 'left',
  speed = 1,
}: SponsorMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let pos = 0;
    const totalWidth = track.scrollWidth / 2;

    const animate = () => {
      pos += direction === 'left' ? speed : -speed;
      if (pos >= totalWidth) pos = 0;
      if (pos <= -totalWidth) pos = 0;
      track.style.transform = `translateX(${direction === 'left' ? -pos : pos}px)`;
      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    const handleMouseEnter = () => cancelAnimationFrame(animId);
    const handleMouseLeave = () => requestAnimationFrame(animate);

    track.addEventListener('mouseenter', handleMouseEnter);
    track.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      track.removeEventListener('mouseenter', handleMouseEnter);
      track.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [direction, speed]);

  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden mask-gradient">
      <div
        ref={trackRef}
        className="flex gap-8 whitespace-nowrap will-change-transform"
        style={{ width: 'max-content' }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-6 py-4 glass rounded-2xl border border-white/10 hover:border-bio-cyan/50 transition-all hover:-translate-y-1"
          >
            <i className={`fas ${item.icon} text-2xl text-bio-cyan`}></i>
            <span className="font-medium text-white/80">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}