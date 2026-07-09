'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TIMELINE_DATA } from '@/lib/constants';

export function TimelineSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);

  useEffect(() => {
    const updateMax = () => {
      if (!trackRef.current || !containerRef.current) return;
      const items = trackRef.current.querySelectorAll('.timeline-item');
      if (items.length === 0) return;
      const itemWidth = items[0].getBoundingClientRect().width + 20; // + gap
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      const visible = Math.floor(containerWidth / itemWidth);
      setMaxIndex(Math.max(0, items.length - visible));
    };

    updateMax();
    window.addEventListener('resize', updateMax);
    return () => window.removeEventListener('resize', updateMax);
  }, []);

  useEffect(() => {
    if (!trackRef.current) return;
    const items = trackRef.current.querySelectorAll('.timeline-item');
    if (items.length === 0) return;
    const itemWidth = items[0].getBoundingClientRect().width + 20;
    trackRef.current.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const progress = maxIndex > 0 ? (currentIndex / maxIndex) * 100 : 0;

  return (
    <div className="w-full">
      <div ref={containerRef} className="overflow-hidden rounded-2xl">
        <div
          ref={trackRef}
          className="flex gap-5 transition-transform duration-500 ease-out will-change-transform"
          style={{ width: 'max-content' }}
        >
          {TIMELINE_DATA.map((item) => (
            <div
              key={item.id}
              className="timeline-item w-[240px] md:w-[280px] flex-shrink-0 p-6 glass rounded-2xl border border-white/10 hover:border-bio-cyan/50 transition-all hover:-translate-y-2"
            >
              <div className="text-sm text-bio-cyan font-semibold uppercase tracking-wider mb-2">
                {item.phase}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{item.title}</div>
              <div className="text-sm text-white/50">{item.date}</div>
              <div className="text-sm text-white/60 mt-2">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-bio-cyan/20 disabled:opacity-30 transition-all"
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-bio-cyan to-bio-emerald rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === maxIndex}
          className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-bio-cyan/20 disabled:opacity-30 transition-all"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}