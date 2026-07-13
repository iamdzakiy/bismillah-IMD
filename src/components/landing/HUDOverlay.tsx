'use client';

import { motion } from 'framer-motion';

export default function HUDOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(34,211,238,0.015)_2px,rgba(34,211,238,0.015)_4px)]" />

      <div className="absolute top-0 left-0 right-0 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400/60 tracking-wider">SYS-ACTIVE</span>
            </div>
            <div className="h-3 w-[1px] bg-white/10" />
            <span className="text-[10px] font-mono text-white/30 tracking-[0.15em]">VESSEL: ARCHAEA-1</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="hidden md:block text-center">
            <p className="text-[9px] font-mono text-cyan-400/30 tracking-[0.3em] uppercase">The Great Microbial Odyssey</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-right">
            <p className="text-[10px] font-mono text-white/30 tracking-wider"><TimeDisplay /></p>
            <p className="text-[8px] font-mono text-white/10 tracking-[0.15em]">MISSION TIME</p>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-center gap-4">
            <div><p className="text-[9px] font-mono text-cyan-400/40 tracking-wider">DEPTH: <span className="text-cyan-400/70">0.1μm</span></p></div>
            <div className="h-3 w-[1px] bg-white/10" />
            <div><p className="text-[9px] font-mono text-cyan-400/40 tracking-wider">COORD: <span className="text-cyan-400/70">N 6° 14' 4.8" E 106° 47' 33.4"</span></p></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden border border-cyan-500/20">
                <motion.div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full" animate={{ width: ['60%', '75%', '55%', '70%', '60%'] }} transition={{ duration: 4, repeat: Infinity }} />
              </div>
              <span className="text-[8px] font-mono text-cyan-400/40">BIO-SIG</span>
            </div>
            <div className="h-3 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[8px] font-mono text-emerald-400/40">SCAN-READY</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden lg:block">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex flex-col items-center gap-6">
          <div className="h-32 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent relative">
            <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-[1px] bg-cyan-400/40" animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 4, repeat: Infinity }} />
          </div>
          <span className="text-[8px] font-mono text-cyan-400/20 tracking-[0.2em] writing-mode-vertical">BIO-SCANNER</span>
        </motion.div>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:block">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-col items-center gap-6">
          <span className="text-[8px] font-mono text-cyan-400/20 tracking-[0.2em] writing-mode-vertical">MICROBIAL DENSITY</span>
          <div className="h-32 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent relative">
            <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-[1px] bg-cyan-400/40" animate={{ bottom: ['0%', '100%', '0%'] }} transition={{ duration: 3, repeat: Infinity }} />
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
    </div>
  );
}

function TimeDisplay() {
  const now = new Date();
  return <span>{now.getHours().toString().padStart(2, '0')}:{now.getMinutes().toString().padStart(2, '0')}:{now.getSeconds().toString().padStart(2, '0')} UTC+7</span>;
}