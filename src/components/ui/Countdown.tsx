'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownProps {
  targetDate: string; // ISO string
  onComplete?: () => void;
}

export function Countdown({ targetDate, onComplete }: CountdownProps) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExtended, setIsExtended] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const update = () => {
      const now = Date.now();
      let diff = target - now;

      if (diff <= 0) {
        diff = 0;
        setIsExtended(true);
        if (onComplete) onComplete();
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTime({ days, hours, minutes, seconds });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  const unitClass = "text-center p-3 glass rounded-xl min-w-[70px] md:min-w-[80px]";
  const valueClass = "font-display text-3xl md:text-4xl font-bold text-gradient";
  const labelClass = "text-xs text-white/50 uppercase tracking-wider mt-1";

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
      <div className="flex items-center gap-4">
        <div className="text-4xl md:text-5xl animate-pulse">⏳</div>
        <div>
          <p className="font-bold text-lg">Registration Closes In</p>
          <p className="text-sm text-white/50">Don't miss your chance!</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-center">
        <div className={unitClass}>
          <div className={valueClass}>{String(time.days).padStart(2, '0')}</div>
          <div className={labelClass}>Days</div>
        </div>
        <span className="text-2xl text-bio-cyan animate-pulse">:</span>
        <div className={unitClass}>
          <div className={valueClass}>{String(time.hours).padStart(2, '0')}</div>
          <div className={labelClass}>Hours</div>
        </div>
        <span className="text-2xl text-bio-cyan animate-pulse">:</span>
        <div className={unitClass}>
          <div className={valueClass}>{String(time.minutes).padStart(2, '0')}</div>
          <div className={labelClass}>Minutes</div>
        </div>
        <span className="text-2xl text-bio-cyan animate-pulse">:</span>
        <div className={unitClass}>
          <div className={valueClass}>{String(time.seconds).padStart(2, '0')}</div>
          <div className={labelClass}>Seconds</div>
        </div>
      </div>

      {isExtended && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-4 py-2 bg-bio-pink/20 border border-bio-pink/30 rounded-full text-bio-pink font-semibold text-sm"
        >
          <span>📅</span>
          <span>Extended until <strong>31 July 2026</strong></span>
        </motion.div>
      )}
    </div>
  );
}