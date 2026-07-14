'use client';

import { motion } from 'framer-motion';
import { MASCOTS } from '@/lib/constants';

interface MascotDecorationProps {
  count?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function MascotDecoration({ count = 4, className = '', size = 'md' }: MascotDecorationProps) {
  const mascots = MASCOTS.slice(0, count);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const imgSize = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 md:gap-4 ${className}`}>
      {mascots.map((mascot, index) => (
        <motion.div
          key={mascot.id}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="group"
        >
          <div
            className={`${sizeClasses[size]} rounded-full glass-strong flex items-center justify-center border border-white/10 hover:border-bio-cyan/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-bio-cyan/20`}
            title={mascot.name}
          >
            <img
              src={mascot.image}
              alt={mascot.name}
              className={`${imgSize[size]} object-contain animate-float`}
              style={{ animationDelay: `${index * 0.3}s` }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}