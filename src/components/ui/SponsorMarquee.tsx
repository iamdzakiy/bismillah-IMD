'use client';

import { useEffect, useRef, useState } from 'react';

interface SponsorItem {
  name: string;
  image?: string;
  icon?: string;
}

interface SponsorMarqueeProps {
  items: SponsorItem[];
  direction?: 'left' | 'right';
  speed?: number;
}

export function SponsorMarquee({ items, direction = 'left', speed = 0.5 }: SponsorMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 2;

    const animate = () => {
      if (!isPaused) {
        setScrollPos((prev) => {
          let newPos = direction === 'left' ? prev + speed : prev - speed;
          if (newPos >= totalWidth) newPos = 0;
          if (newPos <= -totalWidth) newPos = 0;
          return newPos;
        });
      }
      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [direction, speed, isPaused]);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-scrollPos}px)`;
    }
  }, [scrollPos]);

  const duplicated = [...items, ...items];

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex gap-8 items-center transition-none will-change-transform"
        style={{ width: 'max-content' }}
      >
        {duplicated.map((item, i) => (
          <div
            key={i}
            className="flex-shrink-0 flex items-center gap-3 px-6 py-3 glass rounded-xl hover:bg-white/5 transition-all"
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-10 h-10 object-contain rounded-lg"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center text-2xl text-white/30">
                <i className={`fas ${item.icon || 'fa-building'}`}></i>
              </div>
            )}
            <span className="text-sm font-medium text-white/70 whitespace-nowrap">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}