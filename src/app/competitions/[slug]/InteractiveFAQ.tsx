'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FAQItem } from '@/lib/competitions-data';

interface InteractiveFAQProps {
  faqs: FAQItem[];
  glowColor?: string;
}

export function InteractiveFAQ({ faqs, glowColor = 'blue' }: InteractiveFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const glowColors: Record<string, string> = {
    blue: 'text-bio-blue border-bio-blue/30 bg-bio-blue/10',
    pink: 'text-bio-pink border-bio-pink/30 bg-bio-pink/10',
    green: 'text-bio-green border-bio-green/30 bg-bio-green/10',
    purple: 'text-bio-purple border-bio-purple/30 bg-bio-purple/10',
  };

  const accentColor = glowColors[glowColor] || glowColors.blue;

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
          className="glass-dark rounded-xl overflow-hidden transition-all duration-300 hover:border-purple-500/20"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <span className="text-white/80 font-medium pr-4">{faq.q}</span>
            <svg
              className={`w-5 h-5 text-purple-400 flex-shrink-0 transition-transform duration-300 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
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
                <div className="px-6 pb-4 text-white/50 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}