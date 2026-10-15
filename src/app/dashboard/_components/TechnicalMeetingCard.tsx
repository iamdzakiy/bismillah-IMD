'use client';

import { motion } from 'framer-motion';

// Technical Meeting Preliminary MO — held 3–4 October 2026.
// Recordings live in a shared Google Drive folder; the slide deck is a
// separate Drive file. Both links are opened in a new tab.
const TECHNICAL_MEETING_RECORD_URL =
  'https://drive.google.com/drive/folders/1iQh8Ow7na4jSpO677QbxOMfJu3RPQBid?usp=sharing';
const TECHNICAL_MEETING_PPT_URL =
  'https://drive.google.com/file/d/1UsxOnySzMyKZxKdywFSIoiEqGWZnLwG7/view?usp=drive_link';

const RESOURCES = [
  {
    key: 'record',
    icon: '🎬',
    title: 'Rekaman Technical Meeting',
    desc: 'Folder Google Drive berisi rekaman seluruh sesi Technical Meeting Preliminary MO.',
    cta: 'Buka Rekaman',
    href: TECHNICAL_MEETING_RECORD_URL,
  },
  {
    key: 'ppt',
    icon: '📊',
    title: 'PPT Technical Meeting',
    desc: 'Slide presentasi berisi panduan sistem, alur ujian, dan aturan teknis babak penyisihan.',
    cta: 'Buka PPT',
    href: TECHNICAL_MEETING_PPT_URL,
  },
];

export function TechnicalMeetingCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      className="glass p-5 sm:p-7 rounded-2xl mb-6 sm:mb-8 relative overflow-hidden border-sky-500/20"
    >
      {/* Decorative accents */}
      <div
        aria-hidden
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-sky-500/10 blur-3xl animate-pulse-glow"
      />
      <div
        aria-hidden
        className="absolute -bottom-20 -left-12 w-40 h-40 rounded-full bg-bio-blue/10 blur-3xl animate-float"
      />

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="relative mb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full text-sky-300 text-[11px] font-bold uppercase tracking-wider mb-3">
          <span>🎙️</span>
          Technical Meeting Preliminary
        </div>
        <h3 className="text-lg sm:text-2xl font-black leading-tight mb-3">
          Rekaman &amp; Materi <span className="text-gradient">Technical Meeting</span>
        </h3>
        <p className="text-sm text-white/70 max-w-3xl">
          Technical Meeting Preliminary MO telah digelar pada{' '}
          <span className="text-white font-semibold">3 – 4 Oktober 2026</span>. Tonton rekaman
          dan pelajari slide presentasinya agar kamu siap mengikuti babak penyisihan pada{' '}
          <span className="text-white font-semibold">17 Oktober 2026</span>.
        </p>
      </div>

      {/* ── Resources ──────────────────────────────────────────── */}
      <div className="relative grid gap-4 sm:grid-cols-2">
        {RESOURCES.map((resource) => (
          <div
            key={resource.key}
            className="glass-dark rounded-2xl p-5 border border-sky-500/15 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-sm shadow-[0_0_15px_rgba(56,189,248,0.35)]">
                {resource.icon}
              </div>
              <h4 className="text-base font-bold text-white">{resource.title}</h4>
            </div>
            <p className="text-sm text-white/65 leading-relaxed flex-1">{resource.desc}</p>
            <a
              href={resource.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow !px-5 !py-2.5 text-sm mt-4 text-center"
            >
              {resource.cta} →
            </a>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
