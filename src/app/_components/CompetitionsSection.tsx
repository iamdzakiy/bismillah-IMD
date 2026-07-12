'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { COMPETITIONS } from '@/lib/competitions-data';

export function CompetitionsSection() {
  return (
    <section id="competitions" className="relative py-32 px-4">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-bio-purple/10 rounded-full blur-[120px] -translate-x-1/2" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-bio-blue/10 rounded-full blur-[120px] translate-x-1/2" />

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
          <p className="text-white/40 max-w-2xl mx-auto text-sm mt-2 italic">
            Grand Theme: &ldquo;The Great Microbial Odyssey: Decoding the Earth's Dark Matter to Orchestrate a Sustainable Future&rdquo;
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
              <GlassCard glow={comp.glowColor as any} className="p-8 h-full group">
                <div className="relative w-20 h-20 mb-6">
                  <div className={`absolute inset-0 rounded-2xl blur-xl transition-all ${
                    comp.id === 'olympiad' ? 'bg-bio-blue/20 group-hover:bg-bio-blue/40' :
                    comp.id === 'spc' ? 'bg-bio-pink/20 group-hover:bg-bio-pink/40' :
                    'bg-bio-green/20 group-hover:bg-bio-green/40'
                  }`} />
                  <div className="relative w-full h-full glass-strong rounded-2xl flex items-center justify-center text-5xl">
                    {comp.icon}
                  </div>
                </div>

                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border ${
                  comp.id === 'olympiad' ? 'bg-bio-blue/10 text-bio-blue border-bio-blue/30' :
                  comp.id === 'spc' ? 'bg-bio-pink/10 text-bio-pink border-bio-pink/30' :
                  'bg-bio-green/10 text-bio-green border-bio-green/30'
                }`}>
                  {comp.category}
                </span>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gradient transition-all">
                  {comp.title}
                </h3>

                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  {comp.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    comp.id === 'olympiad' ? 'bg-bio-blue/10 text-bio-blue border border-bio-blue/30' :
                    comp.id === 'spc' ? 'bg-bio-pink/10 text-bio-pink border border-bio-pink/30' :
                    'bg-bio-green/10 text-bio-green border border-bio-green/30'
                  }`}>
                    {comp.teamSize}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white/60 border border-white/20">
                    {comp.format.split('->')[0].trim()}
                  </span>
                </div>

                <Link
                  href={`/competitions/${comp.id}`}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                    comp.id === 'olympiad'
                      ? 'bg-bio-blue/20 text-bio-blue border border-bio-blue/30 hover:bg-bio-blue/30'
                      : comp.id === 'spc'
                      ? 'bg-bio-pink/20 text-bio-pink border border-bio-pink/30 hover:bg-bio-pink/30'
                      : 'bg-bio-green/20 text-bio-green border border-bio-green/30 hover:bg-bio-green/30'
                  }`}
                >
                  View Full Details →
                </Link>

                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity ${
                  comp.id === 'olympiad' ? 'bg-gradient-to-br from-bio-blue/10 to-transparent' :
                  comp.id === 'spc' ? 'bg-gradient-to-br from-bio-pink/10 to-transparent' :
                  'bg-gradient-to-br from-bio-green/10 to-transparent'
                }`} />
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-white/50 text-sm mb-4">
            Organized by School of Life Sciences and Technology - Science Program (SITH-S), Institut Teknologi Bandung
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 glass rounded-full text-white/60 text-sm">📸 @imd.itb</span>
            <span className="px-4 py-2 glass rounded-full text-white/60 text-sm">🦠 @archaea_itb</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}