'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MEMORIES_DATA } from '@/lib/constants';

export function MemoriesGallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !trackRef.current) return;

    const track = trackRef.current;
    const items = track.querySelectorAll('.memory-item');
    if (items.length === 0) return;

    const totalWidth = track.scrollWidth / 2;

    const animate = () => {
      if (!isPaused) {
        setScrollPos((prev) => {
          let newPos = prev + 0.5;
          if (newPos >= totalWidth) newPos = 0;
          return newPos;
        });
      }
      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, isClient]);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${scrollPos}px)`;
    }
  }, [scrollPos]);

  const items = [...MEMORIES_DATA, ...MEMORIES_DATA]; // duplicate for seamless

  return (
    <div className="relative w-full">
      <div
        className="overflow-hidden rounded-2xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          ref={trackRef}
          className="flex gap-4 transition-none will-change-transform"
          style={{ width: 'max-content' }}
        >
          {items.map((mem, i) => (
            <div
              key={i}
              className="memory-item relative w-[260px] md:w-[300px] aspect-[4/3] flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group"
              style={{
                background: `linear-gradient(135deg, ${mem.color}22, ${mem.color}44)`,
              }}
            >
              {mem.image ? (
                <img
                  src={mem.image}
                  alt={mem.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.querySelector('.fallback')?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className="fallback hidden absolute inset-0 flex items-center justify-center text-7xl filter drop-shadow-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                📸
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="font-bold text-white text-lg">{mem.title}</p>
                <p className="text-white/60 text-sm">{mem.date}</p>
              </div>
              <div className="absolute top-3 right-3 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs font-bold text-bio-cyan">
                {mem.year}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}