'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';

const FAQS = [
  {
    id: '1',
    question: 'Who can participate in IMD 2026?',
    answer:
      'Microbiology Olympiad and SPC are for SMA/sederajat students. NEC is for active S1 university students from all across Indonesia.',
  },
  {
    id: '2',
    question: 'How many members are in a team?',
    answer:
      'Each team consists of 2-4 members from the same or different institutions (depending on the competition rules).',
  },
  {
    id: '3',
    question: 'Is the event online or offline?',
    answer:
      'IMD 2026 is a hybrid event. Preliminary and semifinal phases are online, while the final phase and main event are offline at ITB Campus Ganesha.',
  },
  {
    id: '4',
    question: 'What is the registration fee?',
    answer:
      'Registration is FREE for all participants! Just follow our social media and complete the required documents.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-32 px-4">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-bio-emerald/10 rounded-full blur-[120px] translate-x-1/2" />

      <div className="relative max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 glass rounded-full text-bio-emerald text-xs font-semibold uppercase tracking-widest mb-4">
            Got Questions?
          </span>
          <h2 className="text-5xl md:text-7xl font-black mb-6">
            <span className="text-gradient">FAQ</span>
          </h2>
          <p className="text-white/60 text-lg">Everything you need to know about IMD 2026</p>
        </motion.div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <GlassCard hover={false} className="overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 group hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-white text-lg group-hover:text-gradient transition-all">
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full glass flex items-center justify-center transition-all duration-300 ${
                    openIndex === index ? 'bg-bio-cyan/20 rotate-180' : ''
                  }`}>
                    <svg className="w-4 h-4 text-bio-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-white/70 leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-white/60 mb-4">Still have questions?</p>
          <a href="mailto:imd.itb@gmail.com" className="btn-glass inline-flex items-center gap-2">
            <svg className="w-5 h-5 text-bio-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  );
}