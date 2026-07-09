'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'cyan' | 'emerald' | 'purple' | 'pink' | 'none';
}

export function GlassCard({ 
  children, 
  className, 
  hover = true,
  glow = 'none',
}: GlassCardProps) {
  const glowColors = {
    cyan: 'hover:shadow-bio-cyan/30 hover:border-bio-cyan/50',
    emerald: 'hover:shadow-bio-emerald/30 hover:border-bio-emerald/50',
    purple: 'hover:shadow-bio-purple/30 hover:border-bio-purple/50',
    pink: 'hover:shadow-bio-pink/30 hover:border-bio-pink/50',
    none: '',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -5 } : undefined}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500',
        hover && glowColors[glow],
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}