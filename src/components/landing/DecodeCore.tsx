'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DecodeCoreProps {
  onDecodeComplete: () => void;
}

export default function DecodeCore({ onDecodeComplete }: DecodeCoreProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDecoded, setIsDecoded] = useState(false);
  const [showPayload, setShowPayload] = useState(false);
  const [glitchText, setGlitchText] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const holdStartRef = useRef<number>(0);

  const glitchMessages = ['DECODING...', 'ANALYZING GENOME...', 'MAPPING PROTEOME...', 'IDENTIFYING SEQUENCE...', 'UNLOCKING DATABASE...'];

  const handleMouseDown = useCallback(() => {
    if (isDecoded) return;
    setIsHolding(true);
    holdStartRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setProgress(() => {
        const elapsed = Date.now() - holdStartRef.current;
        const newProgress = Math.min(elapsed / 4000, 1);
        setGlitchText(glitchMessages[Math.min(Math.floor(newProgress * glitchMessages.length), glitchMessages.length - 1)]);
        if (newProgress >= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsDecoded(true);
          setTimeout(() => { setShowPayload(true); onDecodeComplete(); }, 500);
          return 1;
        }
        return newProgress;
      });
    }, 50);
  }, [isDecoded, onDecodeComplete]);

  const handleMouseUp = useCallback(() => {
    if (isDecoded) return;
    setIsHolding(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(0);
    setGlitchText('');
  }, [isDecoded]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <motion.div className="relative cursor-pointer select-none" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp}
        animate={isDecoded ? { scale: [1, 1.2, 0], opacity: [1, 1, 0] } : {}} transition={{ duration: 1.5, times: [0, 0.3, 1] }}>
        <div className="relative w-48 h-48 md:w-56 md:h-56">
          <motion.div className="absolute inset-0 rounded-full" animate={{ boxShadow: isHolding ? ['0 0 30px rgba(34,211,238,0.2)', '0 0 60px rgba(34,211,238,0.4)', '0 0 30px rgba(34,211,238,0.2)'] : ['0 0 20px rgba(34,211,238,0.1)', '0 0 40px rgba(34,211,238,0.15)', '0 0 20px rgba(34,211,238,0.1)'] }} transition={{ duration: 2, repeat: Infinity }} />
          <motion.div className="absolute inset-4 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-cyan-500/30" animate={{ scale: isHolding ? [1, 1.05, 0.98, 1.03] : 1, borderColor: isHolding ? ['rgba(34,211,238,0.3)', 'rgba(34,211,238,0.6)', 'rgba(34,211,238,0.3)'] : 'rgba(34,211,238,0.3)' }} transition={{ duration: 0.5, repeat: isHolding ? Infinity : 0 }}>
            <div className="absolute inset-4 rounded-full bg-cyan-500/5 blur-xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-16 h-16 opacity-40">
                <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" className="text-cyan-400/30" strokeWidth="1" />
                <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" className="text-cyan-400/20" strokeWidth="0.5" />
                <path d="M30 50 Q40 30 50 50 Q60 70 70 50" fill="none" stroke="currentColor" className="text-cyan-400/40" strokeWidth="0.5" />
                <path d="M50 30 Q50 40 50 50 Q50 60 50 70" fill="none" stroke="currentColor" className="text-cyan-400/40" strokeWidth="0.5" />
                <circle cx="35" cy="40" r="2" fill="currentColor" className="text-cyan-400/50" />
                <circle cx="65" cy="40" r="2" fill="currentColor" className="text-cyan-400/50" />
                <circle cx="50" cy="60" r="2" fill="currentColor" className="text-cyan-400/50" />
              </svg>
            </div>
          </motion.div>
          <div className="absolute -inset-4">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(34,211,238,0.15)" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(34,211,238,0.1)" strokeWidth="0.3" />
              <line x1="100" y1="5" x2="100" y2="35" stroke="rgba(34,211,238,0.4)" strokeWidth="0.5" />
              <line x1="100" y1="165" x2="100" y2="195" stroke="rgba(34,211,238,0.4)" strokeWidth="0.5" />
              <line x1="5" y1="100" x2="35" y2="100" stroke="rgba(34,211,238,0.4)" strokeWidth="0.5" />
              <line x1="165" y1="100" x2="195" y2="100" stroke="rgba(34,211,238,0.4)" strokeWidth="0.5" />
              <path d="M15 40 L15 15 L40 15" fill="none" stroke="rgba(34,211,238,0.6)" strokeWidth="1" />
              <path d="M185 40 L185 15 L160 15" fill="none" stroke="rgba(34,211,238,0.6)" strokeWidth="1" />
              <path d="M15 160 L15 185 L40 185" fill="none" stroke="rgba(34,211,238,0.6)" strokeWidth="1" />
              <path d="M185 160 L185 185 L160 185" fill="none" stroke="rgba(34,211,238,0.6)" strokeWidth="1" />
            </svg>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {!isDecoded ? (
          <motion.div key="unknown" className="mt-6 text-center" exit={{ opacity: 0, y: -10 }}>
            <p className="text-xs font-mono text-cyan-400/60 tracking-[0.15em] mb-1">UNKNOWN TAXONOMIC UNIT</p>
            <p className="text-[10px] font-mono text-cyan-400/30 tracking-[0.1em]">99% UNEXPLORED</p>
          </motion.div>
        ) : (
          <motion.div key="decoded" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
            <p className="text-xs font-mono text-emerald-400/80 tracking-[0.15em]">SEQUENCE DECODED</p>
            <p className="text-[10px] font-mono text-emerald-400/40 tracking-[0.1em]">CLASSIFICATION: UNLOCKED</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isHolding && !isDecoded && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-4 w-64">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-cyan-400/60 tracking-wider">{glitchText || 'INITIATING...'}</span>
              <span className="text-[10px] font-mono text-cyan-400/60">{Math.round(progress * 100)}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-cyan-500/20">
              <motion.div className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-300 rounded-full" style={{ width: `${progress * 100}%` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isHolding && !isDecoded && (
        <motion.p className="mt-4 text-[11px] font-mono text-white/20 tracking-wider" animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 3, repeat: Infinity }}>
          CLICK & HOLD TO DECODE
        </motion.p>
      )}

      <AnimatePresence>
        {showPayload && (
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="mt-8 w-full max-w-lg">
            <div className="text-center mb-4">
              <p className="text-[10px] font-mono text-emerald-400/50 tracking-[0.2em]">— DATABASE SECTORS UNLOCKED —</p>
            </div>
            <div className="grid gap-3">
              {[
                { id: 'olympiad', label: 'MICROBIOLOGY OLYMPIAD', sector: 'SECTOR-ALPHA', color: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30', glow: 'rgba(34,211,238,0.1)' },
                { id: 'project', label: 'SCIENCE PROJECT', sector: 'SECTOR-BETA', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30', glow: 'rgba(52,211,153,0.1)' },
                { id: 'essay', label: 'NATIONAL ESSAY', sector: 'SECTOR-GAMMA', color: 'from-purple-500/20 to-fuchsia-500/20', border: 'border-purple-500/30', glow: 'rgba(168,85,247,0.1)' },
              ].map((item, i) => (
                <motion.a key={item.id} href={`/competitions/${item.id}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.15 }}
                  className={`group relative px-5 py-4 rounded-lg bg-gradient-to-r ${item.color} border ${item.border} backdrop-blur-sm overflow-hidden cursor-pointer`} style={{ boxShadow: `0 0 20px ${item.glow}` }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-white/5 to-transparent" />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-mono text-white/30 tracking-[0.15em] mb-1">{item.sector}</p>
                      <p className="text-sm font-display font-semibold text-white/90 group-hover:text-white transition-colors">{item.label}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-current opacity-40 group-hover:opacity-80 transition-opacity" />
                      <svg className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}