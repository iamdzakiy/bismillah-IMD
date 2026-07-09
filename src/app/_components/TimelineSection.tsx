'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';

const TIMELINE = [
  {
    id: '1',
    phase: 'Registration',
    date: '1 - 31 July 2026',
    title: 'Open Registration',
    description: 'Register your team for Olympiad, SPC, or NEC.',
  },
  {
    id: '2',
    phase: 'Preliminary',
    date: '1 - 16 August 2026',
    title: 'Preliminary Phase',
    description: 'Submit initial documents and pass the first selection.',
  },
  {
    id: '3',
    phase: 'Semifinal',
    date: '17 - 31 August 2026',
    title: 'Semifinal Phase',
    description: 'Advanced submission for qualified teams.',
  },
  {
    id: '4',
    phase: 'Final',
    date: '14 - 15 November 2026',
    title: 'Final & Main Event',
    description: 'Final pitching, exhibition, symposium, and awarding night at ITB.',
  },
];

export function TimelineSection() {
  return (
    <section id="timeline" className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-space-900 via-space-800 to-space-900" />
      <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-bio-purple/10 rounded-full blur-[150px] -translate-x-1/2" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 glass rounded-full text-bio-cyan text-xs font-semibold uppercase tracking-widest mb-4">
            Mark Your Calendar
          </span>
          <h2 className="text-5xl md:text-7xl font-black mb-6">
            <span className="text-gradient-purple">Event Timeline</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Follow the journey from registration to the grand awarding night
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-1/2">
            <div className="absolute inset-0 bg-gradient-to-b from-bio-cyan via-bio-emerald to-bio-purple opacity-30" />
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-bio-cyan via-bio-emerald to-bio-purple"
            />
          </div>

          <div className="space-y-16">
            {TIMELINE.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-bio-cyan rounded-full blur-xl animate-pulse-glow" />
                    <div className="relative w-4 h-4 bg-bio-cyan rounded-full ring-4 ring-space-900" />
                  </div>
                </div>

                <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                  <GlassCard hover={true} className="p-6 group">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-bio-cyan/10 border border-bio-cyan/30 rounded-full text-bio-cyan text-xs font-bold uppercase tracking-wider">
                        {item.phase}
                      </span>
                      <span className="text-sm text-white/40 font-mono">{item.date}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gradient transition-all">
                      {item.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {item.description}
                    </p>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-bio-cyan/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </GlassCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}