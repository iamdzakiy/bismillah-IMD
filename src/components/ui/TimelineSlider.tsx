'use client';

import { motion } from 'framer-motion';
import { TIMELINE_DATA } from '@/lib/constants';

export function TimelineSlider() {
  return (
    <div className="w-full">
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-bio-cyan via-bio-purple to-bio-emerald md:-translate-x-0.5" />
        
        <div className="space-y-8 md:space-y-12 relative">
          {TIMELINE_DATA.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-bio-cyan to-bio-emerald border-4 border-[#0a0514] shadow-lg shadow-bio-cyan/20 -translate-x-1/2 mt-6 z-10" />
              
              {/* Content */}
              <div className={`ml-10 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                <div className="glass rounded-2xl p-6 border border-white/10 hover:border-bio-cyan/50 transition-all hover:-translate-y-1">
                  <div className="text-xs text-bio-cyan font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span>{item.phase}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-white/50 mb-1">{item.date}</p>
                  <p className="text-sm text-white/60">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}