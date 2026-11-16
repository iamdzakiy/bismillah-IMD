'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Answers follow the official IMD 2026 competition guidebook and handbook.
const faqs = [
  {
    q: 'What is IMD?',
    a: 'International Microorganism Day is marked every 17 September, the date in 1683 when Antonie van Leeuwenhoek wrote to the Royal Society describing single-celled organisms. IMD 2026 at ITB is run by HIMAMIKRO "Archaea" ITB with SITH ITB: three national competitions, a petri dish art workshop, an exhibition, a symposium and an awarding night.',
  },
  {
    q: 'Who can enter which competition?',
    a: 'Microbiology Olympiad: active SMA/MA students, individually (current or former OSN Biology gold medalists and IBO Pelatnas Stage III participants are not eligible). Science Project Competition: teams of 3 SMA/SMK/MA students plus 1 supervising teacher from the same school. National Essay Competition: teams of 2–3 S1/D4 students from the same university, any major.',
  },
  {
    q: 'How much does it cost?',
    a: 'MO: IDR 75,000 early bird (19 July – 8 August 2026) or IDR 85,000 normal (9 – 31 August 2026). SPC and NEC: the abstract round is free; teams that reach the semifinal pay IDR 150,000. Fees are non-refundable.',
  },
  {
    q: 'What are the prizes?',
    a: 'MO: Winners 1–3 and Best Practical, each with a cash prize, certificate and medal. SPC: Winners 1–3, each with a cash prize, certificate and medal. NEC: Winners 1–3 and Best Poster, each with a cash prize, certificate and award plaque. The guidebook does not publish the cash amounts.',
  },
  {
    q: 'How do I pay and how long is verification?',
    a: 'Transfer to Bank Jago 104614051845 (Aditya Ramadhani) and upload the receipt on this website. The receipt must show the payer name, exact amount and date. Checking usually takes 1–3 business days, and you get an email once you are approved.',
  },
  {
    q: 'Can I withdraw or hand my place to someone else?',
    a: 'For the Olympiad, no: once a registration is verified it cannot be withdrawn or transferred to another person. For SPC and NEC team questions, contact the committee using the numbers below.',
  },
  {
    q: 'When and where are the finals?',
    a: 'All finals are at ITB Ganesha, Bandung. MO final, SPC final pitching and NEC pitching day are on 14 November 2026; the exhibition and awarding are on 15 November 2026. Lodging and transport are not covered by the committee.',
  },
];

const CONTACTS = [
  { name: 'Sitha', role: 'Internal Affairs Manager', wa: '628135837623' },
  { name: 'Cahya', role: 'Internal Affairs Staff', wa: '62881080713104' },
];

const FAQ_SHEET =
  'https://docs.google.com/spreadsheets/d/1WRGHkBPQw12YpXxbFsX_AxPuOVwgFgTiBUP7eImx3XQ/edit?usp=sharing';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative scroll-mt-20 px-4 py-24 sm:px-6 md:py-32" aria-labelledby="faq-title">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="tag-mono mb-4">FAQ</p>
          <h2 id="faq-title" className="text-[clamp(2.4rem,6vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.03em]">
            Questions we get a lot.
          </h2>
          <p className="mt-6 max-w-sm text-white/60">
            More answers, per competition, are in the{' '}
            <a href={FAQ_SHEET} target="_blank" rel="noopener noreferrer" className="text-paper underline decoration-agar underline-offset-4">
              FAQ sheet
            </a>
            . If it is not there, message us on WhatsApp.
          </p>
          <ul className="mt-8 space-y-3">
            {CONTACTS.map((c) => (
              <li key={c.wa}>
                <a
                  href={`https://wa.me/${c.wa}?text=${encodeURIComponent('Halo IMD 2026, saya ingin bertanya...')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-baseline gap-3"
                >
                  <span className="font-medium text-paper group-hover:text-agar">{c.name}</span>
                  <span className="tag-mono">{c.role}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            return (
              <div key={faq.q}>
                <h3>
                  <button
                    onClick={() => setOpenIndex(open ? null : index)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${index}`}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-lg font-medium text-paper sm:text-xl">{faq.q}</span>
                    <span
                      aria-hidden="true"
                      className={`relative h-4 w-4 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
                    >
                      <span className="absolute left-0 top-1/2 h-px w-4 bg-agar" />
                      <span className="absolute left-1/2 top-0 h-4 w-px bg-agar" />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={`faq-panel-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 leading-relaxed text-white/65">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
