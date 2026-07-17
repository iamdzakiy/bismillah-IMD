'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientText } from '@/components/ui/GradientText';
import { MascotDecoration } from '@/components/ui/MascotDecoration';

const events = [
  {
    name: 'Workshop',
    date: '19 September 2026',
    time: 'TBA',
    venue: 'ITB',
    description: 'Expert-led workshops covering cutting-edge topics in microbiology, biotechnology, and scientific communication.',
    icon: '🔬',
    type: 'workshop',
  },
  {
    name: 'PetriDish Art',
    date: '7 November 2026',
    time: 'TBA',
    venue: 'ITB',
    description: 'Creative art competition showcasing microbial-themed artworks.',
    icon: '🎨',
    type: 'competition',
  },
  {
    name: 'Opening Ceremony',
    date: '14 November 2026',
    time: 'TBA',
    venue: 'Institut Teknologi Bandung',
    description: 'The grand opening ceremony of IMD 2026, part of the Celebration series.',
    icon: '🎉',
    type: 'celebration',
  },
  {
    name: 'Exhibition',
    date: '15 November 2026',
    time: 'TBA',
    venue: 'Institut Teknologi Bandung',
    description: 'Showcase of innovative projects from all competition branches, including scientific posters and demonstrations.',
    icon: '🖼️',
    type: 'exhibition',
  },
  {
    name: 'Symposium',
    date: '15 November 2026',
    time: 'TBA',
    venue: 'Institut Teknologi Bandung',
    description: 'Scientific symposium featuring keynote speakers, research presentations, and academic discussions.',
    icon: '🎤',
    type: 'symposium',
  },
  {
    name: 'ITB Day',
    date: '15 November 2026',
    time: 'TBA',
    venue: 'Institut Teknologi Bandung',
    description: 'Special ITB Day celebration with campus activities and institutional showcases.',
    icon: '🏛️',
    type: 'itb',
  },
  {
    name: 'Closing Ceremony',
    date: '15 November 2026',
    time: 'TBA',
    venue: 'Institut Teknologi Bandung',
    description: 'The closing ceremony of IMD 2026, part of the Celebration series. Winners of all competitions are announced and celebrated.',
    icon: '🏅',
    type: 'celebration',
  },
];

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-space-900 text-white pt-28 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* ===== HERO ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 glass rounded-full text-bio-purple text-xs font-semibold uppercase tracking-widest mb-4">
            IMD 2026
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <GradientText>Events & Schedule</GradientText>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Mark your calendar for these key dates and events throughout the IMD 2026 journey
          </p>
        </motion.div>

        {/* Mascots around hero */}
        <div className="mb-8">
          <MascotDecoration count={4} size="md" className="justify-center" />
        </div>

        {events.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <GlassCard
              glow={
                event.type === 'celebration' ? 'pink' as any :
                event.type === 'exhibition' ? 'blue' as any :
                event.type === 'symposium' ? 'green' as any :
                event.type === 'itb' ? 'purple' as any :
                event.type === 'workshop' ? 'amber' as any : 'purple' as any
              }
              className="p-6 sm:p-8 hover:scale-[1.01] transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                {/* Icon */}
                <div className="w-16 h-16 glass-strong rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                  {event.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {event.name}
                  </h3>
                  <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-3">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
                    <span className="px-3 py-1 glass rounded-full text-bio-cyan">
                      📅 {event.date}
                    </span>
                    <span className="px-3 py-1 glass rounded-full text-bio-purple">
                      📍 {event.venue}
                    </span>
                    <span className={`px-3 py-1 rounded-full font-medium ${
                      event.type === 'celebration'
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                        : event.type === 'exhibition'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : event.type === 'symposium'
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : event.type === 'itb'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : event.type === 'workshop'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {event.type === 'celebration' ? 'Celebration' :
                       event.type === 'exhibition' ? 'Exhibition' :
                       event.type === 'symposium' ? 'Symposium' :
                       event.type === 'itb' ? 'ITB Day' :
                       event.type === 'workshop' ? 'Workshop' : 'Competition'}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}

        {/* ===== CTA ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <GlassCard glow="purple" className="p-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Don't Miss Out!</h2>
            <p className="text-white/60 mb-6">
              Register now to secure your spot in IMD 2026 competitions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register" className="btn-glow">
                Register Now
              </a>
              <a href="/" className="btn-glass">
                Back to Home
              </a>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}