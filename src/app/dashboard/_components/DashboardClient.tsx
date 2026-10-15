'use client';

import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ConfettiCelebration } from '@/components/ui/ConfettiCelebration';
import { fireCenterExplosion } from '@/components/ui/useConfettiBlast';
import { TeamProfileCard } from './TeamProfileCard';
import { SubmissionForm } from './SubmissionForm';
import { SemifinalModule } from './SemifinalModule';
import { FinalModule } from './FinalModule';
import { StatusBanner } from './StatusBanner';
import { TeamRegistrationForm } from './TeamRegistrationForm';
import type { DashboardTeam } from './types';

const WHATSAPP_COMMUNITY_LINK = 'https://chat.whatsapp.com/ClwIbQfe86BILn7WBp9bEn';

// A team is routed into the independent post-preliminary (semifinal) module when
// it is an SPC or NEC team whose preliminary submission was APPROVED.
// NOTE: we intentionally do NOT require registration.currentPhase === 'SEMIFINAL'
// here — older rows approved before the phase-sync code (or rows where admin
// forgot to flip the phase) would otherwise never see the re-registration form,
// which looks like "can't upload re-regist / card has no effect".
function passedPreliminary(team: DashboardTeam): boolean {
  if (team.competitionType !== 'SPC' && team.competitionType !== 'NEC') return false;
  const prelim = team.submissions?.find((s) => s.phase === 'PRELIMINARY');
  if (prelim?.status === 'APPROVED') return true;
  // Fallback: phase already advanced (e.g. re-reg submitted) even if the
  // submission row is missing from the payload.
  if (team.registration?.currentPhase === 'SEMIFINAL') return true;
  return false;
}

// A team reaches the FINAL module once the admin approved its SEMIFINAL
// submission — the approve endpoint promotes registration.currentPhase to
// FINAL. We accept either signal so teams approved before the phase-sync code
// (or where the phase flip was missed) still see the final page instead of
// being stuck on the semifinal module forever.
// NOTE: only SPC/NEC submit final materials online; OLYMPIAD finals are an
// onsite exam, so it keeps the legacy SubmissionForm flow.
function reachedFinal(team: DashboardTeam): boolean {
  if (team.competitionType !== 'SPC' && team.competitionType !== 'NEC') return false;
  if (team.registration?.currentPhase === 'FINAL') return true;
  return (team.submissions ?? []).some(
    (s) => s.phase === 'SEMIFINAL' && s.status === 'APPROVED'
  );
}

interface DashboardClientProps {
  session: Session;
  teams: DashboardTeam[];
  user: {
    email: string;
    credential: {
      password: string;
      fileUrl: string | null;
    } | null;
  };
  /** True only for participants whose team is OLYMPIAD (see dashboard/page.tsx). */
  showCredential: boolean;
}

export function DashboardClient({ session, teams, user, showCredential }: DashboardClientProps) {
  const [copied, setCopied] = useState(false);

  // The card only ever renders for OLYMPIAD teams WITH a stored credential.
  const canShow = showCredential && !!user.credential;

  const text = canShow
    ? `Halo,

Berikut informasi akun kamu:

Email    : ${user.email}
Password : ${user.credential!.password}
Link     : ${user.credential!.fileUrl ?? '-'}

Jangan bagikan ke siapa pun.`
    : '';

  const handleCopy = async () => {
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0514] text-white">
      <nav className="border-b border-purple-500/10 bg-[#130c24]/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-lg sm:text-xl font-bold text-gradient">
            IMD 2026
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-xs sm:text-sm text-white/60 hidden md:block">{session.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-3 sm:px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs sm:text-sm font-medium rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {canShow && (
          <>
            {/* Welcome celebration: fires once when the OLYMPIAD participant
                opens the dashboard (single volley + floating replay pill). */}
            <ConfettiCelebration active={canShow} encore={false} />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 16 }}
              whileHover={{ y: -2 }}
              className="glass p-6 rounded-2xl mb-6 sm:mb-8 relative overflow-hidden border-purple-500/20 glow-purple"
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

              <div className="relative flex items-center gap-2 mb-1">
                <span className="text-xl">🔐</span>
                <h3 className="text-lg font-semibold">Informasi Akun Kamu</h3>
              </div>
              <p className="relative text-sm text-white/60 mb-4">
                Berikut informasi akun kamu — rahasia, jangan dibagikan ke siapa pun.
              </p>

              <motion.pre
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="relative text-sm font-mono whitespace-pre-wrap leading-relaxed rounded-xl border border-white/[0.08] bg-black/20 p-4 text-white/90"
              >
                {text}
              </motion.pre>

              <div className="relative flex flex-wrap gap-3 mt-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="btn-glass !px-5 !py-2.5 text-sm rounded-xl"
                >
                  {copied ? 'Tersalin ✓' : 'Copy Info'}
                </motion.button>

                {user.credential!.fileUrl && (
                  <motion.a
                    whileTap={{ scale: 0.95 }}
                    href={user.credential!.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glow !px-5 !py-2.5 text-sm"
                  >
                    Buka Link
                  </motion.a>
                )}
              </div>
            </motion.div>
          </>
        )}

        <StatusBanner active={session.user.active} />

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">
            Welcome, {session.user?.name || 'Participant'}!
          </h1>
          <p className="text-white/60 text-sm sm:text-base">Manage your team and track your competition progress.</p>
        </div>

        {teams.length === 0 ? (
          <div className="glass-dark rounded-2xl p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center mb-6">
              <img src="/favicon.svg" alt="IMD 2026" className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">No Team Yet</h2>
            <p className="text-white/60 mb-6 text-sm sm:text-base">
              Register for a competition to start your microbial odyssey!
            </p>
            <TeamRegistrationForm session={session} />
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {teams.map((team) => {
              const inFinal = reachedFinal(team);
              const isSemifinalEligible = !inFinal && passedPreliminary(team);
              return (
                <div key={team.id} className="space-y-4 sm:space-y-6">
                  <TeamProfileCard team={team} />

                  {inFinal ? (
                    <FinalModule team={team} />
                  ) : isSemifinalEligible ? (
                    <SemifinalModule team={team} />
                  ) : (
                    <SubmissionForm team={team} />
                  )}

                  {/* WhatsApp Community Section — shown when documents are approved (non-semifinal teams) */}
                  {!inFinal && !isSemifinalEligible && (team.registration?.status === 'DOCUMENT_APPROVED' || team.registration?.status === 'REGISTERED') && (
                  <div className="glass-dark rounded-2xl p-6 border border-green-500/20">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-green-400 mb-1">📱 Join the WhatsApp Community!</h3>
                        <p className="text-white/70 text-sm mb-4">
                          Join the Community Compe IMD 2026 on WhatsApp, then join each group according to the competition you registered for. Stay connected with fellow participants and get the latest updates!
                        </p>
                        <a
                          href={WHATSAPP_COMMUNITY_LINK}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] text-sm"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          Join WhatsApp Community →
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}