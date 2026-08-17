'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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

  const unitClass = "text-center px-3 py-2 glass rounded-lg border border-white/5";
  const valueClass = "font-display text-xl md:text-2xl font-bold text-bio-cyan";
  const labelClass = "text-[10px] text-white/40 uppercase tracking-wider mt-1 block font-medium";

  return (
    <div className="w-full text-center">
      <div className="text-center mb-3">
        <p className="text-white/80 font-semibold text-sm md:text-base">Registration Closes In</p>
      </div>
      
      <div className="flex items-center justify-center gap-2 md:gap-3">
        <div className={unitClass}>
          <div className={valueClass}>{String(time.days).padStart(2, '0')}</div>
          <div className={labelClass}>Days</div>
        </div>
        <span className="text-lg text-bio-cyan/60 font-bold">:</span>
        <div className={unitClass}>
          <div className={valueClass}>{String(time.hours).padStart(2, '0')}</div>
          <div className={labelClass}>Hours</div>
        </div>
        <span className="text-lg text-bio-cyan/60 font-bold">:</span>
        <div className={unitClass}>
          <div className={valueClass}>{String(time.minutes).padStart(2, '0')}</div>
          <div className={labelClass}>Minutes</div>
        </div>
        <span className="text-lg text-bio-cyan/60 font-bold">:</span>
        <div className={unitClass}>
          <div className={valueClass}>{String(time.seconds).padStart(2, '0')}</div>
          <div className={labelClass}>Seconds</div>
        </div>
      </div>

      {/* Registration CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4"
      >
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-bio-cyan to-bio-emerald text-white font-semibold rounded-full hover:shadow-lg hover:shadow-bio-cyan/30 transition-all text-sm"
        >
          <span>🚀</span>
          <span>Register Now - Don't Miss Out!</span>
        </Link>
      </motion.div>

      {isExtended && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-bio-emerald/10 border border-bio-emerald/30 rounded-full text-bio-emerald font-semibold text-sm">
            <span>📅</span>
            <span>Extended until <strong>31 August 2026</strong></span>
          </span>
        </motion.div>
      )}
    </div>
  );
}