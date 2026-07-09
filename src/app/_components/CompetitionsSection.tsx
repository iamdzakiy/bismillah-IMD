'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { COMPETITIONS } from '@/lib/competitions-data';

export function CompetitionsSection() {
  return (
    <section id="competitions" className="relative py-32 px-4">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-bio-purple/10 rounded-full blur-[120px] -translate-x-1/2" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-bio-cyan/10 rounded-full blur-[120px] translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 glass rounded-full text-bio-emerald text-xs font-semibold uppercase tracking-widest mb-4">
            Join the Odyssey
          </span>
          <h2 className="text-5xl md:text-7xl font-black mb-6">
            <span className="text-gradient">Our Competitions</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Three national-level competitions designed to unlock the mysteries of microbial dark matter
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {COMPETITIONS.map((comp, index) => (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <GlassCard glow="cyan" className="p-8 h-full group">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 bg-bio-cyan/20 rounded-2xl blur-xl group-hover:bg-bio-cyan/40 transition-all" />
                  <div className="relative w-full h-full glass-strong rounded-2xl flex items-center justify-center text-5xl">
                    {comp.icon}
                  </div>
                </div>

                <span className="inline-block px-3 py-1 bg-bio-emerald/10 border border-bio-emerald/30 rounded-full text-bio-emerald text-xs font-bold uppercase tracking-wider mb-4">
                  {comp.category}
                </span>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gradient transition-all">
                  {comp.title}
                </h3>

                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  {comp.description}
                </p>

                <Link href={`/competitions/${comp.id}`} className="btn-glass inline-block">
                  Explore {comp.shortName}
                </Link>

                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-bio-cyan/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}