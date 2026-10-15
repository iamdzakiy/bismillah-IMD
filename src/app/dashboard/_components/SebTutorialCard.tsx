'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fireCenterExplosion } from '@/components/ui/useConfettiBlast';

const EXAM_DATE = 'Sabtu, 17 Oktober 2026';
const WA_NUMBER = '085156417355';
const WA_LINK = 'https://wa.me/6285156417355';

interface SebTutorialCardProps {
  email: string;
  credential: { password: string; fileUrl: string | null };
}

/** Small numbered section header used across the tutorial. */
function SectionHeader({ number, title, icon }: { number: number; title: string; icon: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-sm font-black shadow-[0_0_15px_rgba(168,85,247,0.35)]">
        {number}
      </div>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-lg shrink-0">{icon}</span>
        <h4 className="text-base sm:text-lg font-bold text-white truncate">{title}</h4>
      </div>
    </div>
  );
}

/** Ordered step list with purple bullet markers. */
function StepList({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-white/75 leading-relaxed">
          <span className="mt-1.5 w-2 h-2 shrink-0 rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-400" />
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

export function SebTutorialCard({ email, credential }: SebTutorialCardProps) {
  const [copied, setCopied] = useState<'email' | 'password' | 'all' | null>(null);

  const fullInfoText = `Halo,

Berikut informasi akun ujian SEB kamu:

Email    : ${email}
Password : ${credential.password}
Link     : ${credential.fileUrl ?? '-'}

Hari H : ${EXAM_DATE}

Jangan bagikan ke siapa pun.`;

  const handleCopy = async (text: string, key: 'email' | 'password' | 'all') => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for browsers/contexts without clipboard permissions.
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    // Little burst so the success feedback feels rewarding.
    fireCenterExplosion(0.3, {
      spread: 75,
      startVelocity: 38,
      origin: { x: 0.5, y: 0.65 },
    });
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      className="glass p-5 sm:p-7 rounded-2xl mb-6 sm:mb-8 relative overflow-hidden border-purple-500/20 glow-purple"
    >
      {/* Decorative accents */}
      <div
        aria-hidden
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl animate-pulse-glow"
      />
      <div
        aria-hidden
        className="absolute -bottom-20 -left-12 w-40 h-40 rounded-full bg-fuchsia-500/10 blur-3xl animate-float"
      />

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="relative mb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full text-purple-300 text-[11px] font-bold uppercase tracking-wider mb-3">
          <span>📌</span>
          Tutorial Ujian SEB
        </div>
        <h3 className="text-lg sm:text-2xl font-black leading-tight mb-3">
          Tutorial Persiapan &amp; Pelaksanaan Ujian <span className="text-gradient">Menggunakan SEB</span>
        </h3>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/15 to-fuchsia-500/15 border border-purple-400/30">
          <span className="text-sm">🗓️</span>
          <span className="text-sm text-white/80">
            Hari H: <span className="font-bold text-white">{EXAM_DATE}</span>
          </span>
        </div>
      </div>

      <div className="relative space-y-4">
        {/* ── 1. Sebelum Hari H ──────────────────────────────── */}
        <div className="glass-dark rounded-2xl p-5 border border-purple-500/15">
          <SectionHeader number={1} title="Sebelum Hari H" icon="📥" />
          <StepList
            items={[
              <>Siapkan perangkat masing-masing dan pastikan kondisi perangkat normal (laptop/PC, charger, baterai).</>,
              <>
                Unduh file konfigurasi SEB melalui link Google Drive di bawah ini. Di dalamnya terdapat{' '}
                <span className="text-purple-300 font-semibold">2 file konfigurasi</span>:{' '}
                <span className="text-white font-semibold">Config Utama</span> dan{' '}
                <span className="text-white font-semibold">Config Backup</span>.
              </>,
              <>Simpan file config di folder yang mudah ditemukan.</>,
              <>Pastikan aplikasi <span className="text-white font-semibold">SEB (Safe Exam Browser)</span> sudah terinstall di perangkat.</>,
              <>Catat akun dan password yang akan digunakan saat hari H (lihat bagian &ldquo;Akun &amp; Password&rdquo; di bawah).</>,
              <>Jangan membuka quiz terlebih dahulu, karena laman quiz masih terkunci.</>,
            ]}
          />

          {/* Config download */}
          {credential.fileUrl ? (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-indigo-500/10 border border-purple-400/25">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white mb-0.5">🗂️ Link Unduh Config SEB (Google Drive)</p>
                <p className="text-xs text-white/60">Berisi Config Utama &amp; Config Backup — unduh sekarang, jangan tunggu hari H.</p>
              </div>
              <a
                href={credential.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glow !px-5 !py-2.5 text-sm shrink-0 text-center"
              >
                Unduh Config →
              </a>
            </div>
          ) : (
            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-400/25 text-sm text-amber-200">
              Link unduh config SEB akan dibagikan oleh panitia melalui email / grup WhatsApp.
            </div>
          )}
        </div>

        {/* ── 2. Akun & Password ─────────────────────────────── */}
        <div className="glass-dark rounded-2xl p-5 border border-purple-500/15">
          <SectionHeader number={2} title="Akun & Password" icon="🔐" />
          <p className="text-sm text-white/60 mb-4">
            Digunakan saat hari H, {EXAM_DATE}. Rahasiakan — jangan dibagikan kepada siapa pun.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {/* Email */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-black/20">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">📧 Email / Akun</span>
                <button
                  type="button"
                  onClick={() => handleCopy(email, 'email')}
                  className="text-xs px-2.5 py-1 rounded-lg glass hover:bg-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer"
                >
                  {copied === 'email' ? 'Tersalin ✓' : 'Copy'}
                </button>
              </div>
              <p className="text-sm font-mono text-white break-all">{email}</p>
            </div>

            {/* Password */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-black/20">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">🔑 Password</span>
                <button
                  type="button"
                  onClick={() => handleCopy(credential.password, 'password')}
                  className="text-xs px-2.5 py-1 rounded-lg glass hover:bg-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer"
                >
                  {copied === 'password' ? 'Tersalin ✓' : 'Copy'}
                </button>
              </div>
              <p className="text-sm font-mono text-white break-all">{credential.password}</p>
            </div>
          </div>

          <div className="mt-3 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-400/25">
            <span className="text-base leading-none">⚠️</span>
            <p className="text-sm text-red-200">
              Jangan membagikan akun dan password kepada orang lain. Akun hanya untuk kamu sendiri.
            </p>
          </div>
        </div>

        {/* ── 3. Saat Hari H ─────────────────────────────────── */}
        <div className="glass-dark rounded-2xl p-5 border border-purple-500/15">
          <SectionHeader number={3} title={`Saat Hari H — ${EXAM_DATE}`} icon="💻" />
          <StepList
            items={[
              <>Nyalakan perangkat dan pastikan koneksi internet stabil.</>,
              <>Buka aplikasi <span className="text-white font-semibold">SEB (Safe Exam Browser)</span>.</>,
              <>
                Gunakan <span className="text-purple-300 font-semibold">Config Utama</span> terlebih dahulu. Jika Config Utama bermasalah, gunakan{' '}
                <span className="text-purple-300 font-semibold">Config Backup</span>.
              </>,
              <>Masuk menggunakan akun dan password yang telah diberikan (bagian 2).</>,
              <>Kerjakan quiz sesuai instruksi.</>,
              <>
                <span className="text-white font-semibold">Jangan keluar dari SEB</span> selama ujian berlangsung. Password untuk keluar/quit SEB{' '}
                <span className="text-white font-semibold">tidak diberikan sekarang</span> — password quit akan diberikan setelah pengerjaan selesai.
              </>,
              <>
                Jika SEB sudah terlanjur terbuka sebelum waktunya atau kamu tidak sengaja keluar dari alur SEB,{' '}
                <span className="text-white font-semibold">restart perangkat</span> masing-masing.
              </>,
              <>Laman quiz/SEB masih terkunci karena quiz memang belum dibuka. Quiz akan dibuka saat hari H.</>,
            ]}
          />
        </div>

        {/* ── 4. Setelah Ujian Selesai ───────────────────────── */}
        <div className="glass-dark rounded-2xl p-5 border border-purple-500/15">
          <SectionHeader number={4} title="Setelah Ujian Selesai" icon="✅" />
          <StepList
            items={[
              <>Tunggu instruksi dari pengawas.</>,
              <>Password quit SEB akan diberikan setelah pengerjaan selesai.</>,
              <>Setelah mendapat password, barulah keluar dari SEB.</>,
            ]}
          />
        </div>

        {/* ── 5. Jika Ada Kendala ────────────────────────────── */}
        <div className="glass-dark rounded-2xl p-5 border border-purple-500/15">
          <SectionHeader number={5} title="Jika Ada Kendala" icon="🆘" />
          <StepList items={[<>Pastikan koneksi internet stabil terlebih dahulu.</>]} />
          <p className="text-sm text-white/70 mt-3">Jika masih bermasalah, hubungi panitia:</p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-full text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp: {WA_NUMBER}
          </a>
        </div>

        {/* ── Catatan Penting ────────────────────────────────── */}
        <div className="rounded-2xl p-5 border border-amber-400/30 bg-gradient-to-br from-amber-500/10 to-red-500/10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⚠️</span>
            <h4 className="text-base sm:text-lg font-bold text-amber-300">Catatan Penting</h4>
          </div>
          <ul className="space-y-2.5">
            {[
              'Jangan keluar dari SEB sebelum ujian selesai.',
              'Jangan membuka aplikasi lain saat SEB aktif.',
              'Jangan membagikan akun / password kepada siapa pun.',
              'Ikuti arahan pengawas dengan tertib.',
            ].map((note) => (
              <li key={note} className="flex items-start gap-3 text-sm text-amber-100/90 leading-relaxed">
                <span className="mt-1.5 w-2 h-2 shrink-0 rounded-full bg-amber-400" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Footer actions ─────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 pt-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCopy(fullInfoText, 'all')}
            className="btn-glass !px-5 !py-2.5 text-sm rounded-xl"
          >
            {copied === 'all' ? 'Tersalin ✓' : 'Copy Info Akun'}
          </motion.button>
          {credential.fileUrl && (
            <motion.a
              whileTap={{ scale: 0.95 }}
              href={credential.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow !px-5 !py-2.5 text-sm"
            >
              Buka Link Config
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
