'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const navItems = [
  { id: 'syllabus', label: 'SYSTEM SYLLABUS', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', href: '/competitions', sector: 'SYS-CORE', color: 'cyan' },
  { id: 'timeline', label: 'MISSION TIMELINE', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', href: '/events', sector: 'SYS-NAV', color: 'emerald' },
  { id: 'comms', label: 'COMMUNICATION FREQ', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', href: '/#contact', sector: 'SYS-COMM', color: 'purple' },
  { id: 'register', label: 'INITIATE BOARDING', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', href: '/register', sector: 'SYS-DOCK', color: 'fuchsia' },
];

const colorMap: Record<string, { border: string; glow: string; bg: string; dot: string }> = {
  cyan: { border: 'border-cyan-500/30', glow: 'rgba(34,211,238,0.1)', bg: 'from-cyan-500/5 to-blue-500/5', dot: 'bg-cyan-400' },
  emerald: { border: 'border-emerald-500/30', glow: 'rgba(52,211,153,0.1)', bg: 'from-emerald-500/5 to-teal-500/5', dot: 'bg-emerald-400' },
  purple: { border: 'border-purple-500/30', glow: 'rgba(168,85,247,0.1)', bg: 'from-purple-500/5 to-fuchsia-500/5', dot: 'bg-purple-400' },
  fuchsia: { border: 'border-fuchsia-500/30', glow: 'rgba(217,70,239,0.1)', bg: 'from-fuchsia-500/5 to-pink-500/5', dot: 'bg-fuchsia-400' },
};

function NavItemCard({ item, index }: { item: typeof navItems[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const colors = colorMap[item.color];

  return (
    <motion.a href={item.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 + 0.5 }}
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="group relative block">
      <div className={`relative px-4 py-3 rounded-lg bg-gradient-to-r ${colors.bg} border ${colors.border} backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300`} style={{ boxShadow: isHovered ? `0 0 20px ${colors.glow}` : 'none' }}>
        <motion.div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent" initial={{ x: '-100%' }} animate={{ x: isHovered ? '100%' : '-100%' }} transition={{ duration: 0.6 }} />
        <div className="relative flex items-center gap-3">
          <motion.div className={`w-2 h-2 rounded-full ${colors.dot} flex-shrink-0`} animate={{ opacity: isHovered ? [1, 0.3, 1] : [0.5], scale: isHovered ? [1, 1.3, 1] : 1 }} transition={{ duration: isHovered ? 1.5 : 0, repeat: isHovered ? Infinity : 0 }} />
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-mono text-white/20 tracking-[0.15em] mb-0.5">{item.sector}</p>
            <p className={`text-xs font-display font-semibold transition-colors duration-300 ${isHovered ? 'text-white' : 'text-white/70'}`}>{item.label}</p>
          </div>
          <svg className={`w-4 h-4 transition-colors duration-300 flex-shrink-0 ${isHovered ? 'text-white/60' : 'text-white/20'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
          </svg>
        </div>
      </div>
    </motion.a>
  );
}

export default function NavigationPanel() {
  return (
    <div className="w-full max-w-[220px] space-y-2">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-3 px-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
          <span className="text-[9px] font-mono text-cyan-400/40 tracking-[0.2em]">CONTROL</span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-cyan-500/30 to-transparent" />
        </div>
        <p className="text-[10px] font-mono text-white/10 tracking-[0.1em] text-center">NAVIGATION PANEL</p>
      </motion.div>
      <div className="space-y-1.5">
        {navItems.map((item, i) => <NavItemCard key={item.id} item={item} index={i} />)}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-3 px-1">
        <div className="flex items-center gap-2 text-[8px] font-mono text-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
          <span>ALL SYSTEMS NOMINAL</span>
        </div>
        <div className="flex items-center gap-2 text-[8px] font-mono text-white/10 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" />
          <span>POWER: 98.7%</span>
        </div>
      </motion.div>
    </div>
  );
}