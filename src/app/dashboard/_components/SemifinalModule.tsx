// src/app/dashboard/_components/SemifinalModule.tsx
'use client';

import { useEffect, useState } from 'react';
import { BadgeCheck, CheckCircle2, Clock3, Sparkles, Trophy } from 'lucide-react';
import { ConfettiCelebration } from '@/components/ui/ConfettiCelebration';
import {
  SEMIFINAL_HERO_COPY,
  SEMIFINAL_WHATSAPP_LINK,
  SEMIFINAL_WHATSAPP_LABEL,
} from '@/lib/semifinal';
import { SemifinalRegistrationForm, SemifinalMascots } from './SemifinalRegistrationForm';
import { FullPaperSubmissionForm } from './FullPaperSubmissionForm';
import type { CompetitionType, DashboardTeam } from './types';

type Status = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';

interface Rereg {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string | null;
  paymentProofUrl?: string | null;
}

const TRACK_LABEL: Record<CompetitionType, { label: string; emoji: string }> = {
  OLYMPIAD: { label: 'Olympiad', emoji: '🏅' },
  SPC: { label: 'Startup Pitch Competition', emoji: '🚀' },
  NEC: { label: 'National Engineering Competition', emoji: '⚙️' },
};

type StepState = 'done' | 'current' | 'upcoming';

const TIMELINE = [
  { key: 'qualified', label: 'Qualification Confirmed', sub: 'You made it through' },
  { key: 're-reg', label: 'Re-Registration & Verification', sub: 'Fee + proof review' },
  { key: 'present', label: 'Semifinal Battle / Presentation', sub: 'Submit your full paper' },
] as const;

function resolveTimeline(status: Status): StepState[] {
  if (status === 'APPROVED') return ['done', 'done', 'current'];
  return ['done', 'current', 'upcoming'];
}

export function SemifinalModule({ team }: { team: DashboardTeam }) {
  const [status, setStatus] = useState<Status | 'LOADING'>('LOADING');
  const [rereg, setRereg] = useState<Rereg | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/semifinal/registration?teamId=${team.id}`);
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data.registration) {
          setRereg(data.registration);
          setStatus(data.registration.status);
        } else {
          setStatus('NONE');
        }
      } catch {
        if (!cancelled) setStatus('NONE');
      }
      if (!cancelled) setTimeout(() => setCelebrate(true), 350);
    })();
    return () => {
      cancelled = true;
    };
  }, [team.id]);

  const states = status === 'LOADING' ? ['current', 'upcoming', 'upcoming'] : resolveTimeline(status as Status);
  const track = TRACK_LABEL[team.competitionType] || TRACK_LABEL.OLYMPIAD;

return (
    <>
      {celebrate && status !== 'LOADING' && (
        <ConfettiCelebration active={celebrate} encore encoreDelay={4500} />
      )}

      <div
        id="semifinal-module"
        className="relative mb-2 overflow-hidden rounded-3xl border border-purple-400/25 border-t-white/15 bg-white/5 backdrop-blur-2xl shadow-[0_20px_50px_rgba(168,85,247,0.15)]"
      >
        <div className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-56 w-56 rounded-full bg-fuchsia-500/12 blur-3xl" />

        {/* Warm, prestigious hero banner */}
        <div className="relative bg-gradient-to-r from-purple-600/20 via-fuchsia-500/10 to-sky-500/15 px-6 py-9 sm:px-10">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <SemifinalMascots />
          </div>

          <div className="mb-3 flex justify-center">
            <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full border border-purple-400/40 bg-gradient-to-br from-purple-500/25 to-fuchsia-500/20 shadow-[0_0_30px_rgba(168,85,247,0.35)] backdrop-blur-xl">
              <span className="relative z-10 text-4xl drop-shadow-[0_0_18px_rgba(217,70,239,0.4)]">🏆</span>
              <Sparkles className="absolute -right-1 -top-1 h-5 w-5 animate-twinkle text-amber-400" />
            </span>
          </div>

          {/* Animated shimmering gradient headline */}
          <h2
            className="mx-auto max-w-3xl animate-gradient text-center text-2xl font-black leading-tight text-transparent sm:text-4xl"
            style={{
              background:
                'linear-gradient(100deg, #fbbf24 0%, #ffffff 25%, #a855f7 50%, #d946ef 70%, #38bdf8 100%)',
              backgroundSize: '300% 100%',
            }}
          >
            Congratulations, Semifinalists! ✨
          </h2>
          <p className="relative mx-auto mt-3 max-w-2xl text-center text-sm text-white/75 sm:text-base">
            {SEMIFINAL_HERO_COPY.sub}
          </p>

          {/* Team identity + track badge */}
          <div className="relative mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 text-sm font-bold text-white backdrop-blur-xl">
              <Trophy className="h-4 w-4 text-amber-400" />
              {team.teamName}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1.5 text-xs font-semibold text-fuchsia-300">
              {track.emoji} {track.label} Track
            </span>
          </div>
        </div>

        {/* Step-by-step progress timeline */}
        <div className="relative flex flex-wrap items-center gap-2 px-4 py-3 sm:gap-3">
          {TIMELINE.map((step, idx) => {
            const s = states[idx];
            return (
              <div key={step.key} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-xl transition-all duration-300 ${
                    s === 'done'
                      ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200 shadow-[0_0_16px_rgba(16,185,129,0.25)]'
                      : s === 'current'
                        ? 'border-purple-400/50 bg-purple-500/15 text-white shadow-[0_0_16px_rgba(168,85,247,0.4)]'
                        : 'border-white/10 bg-white/5 text-white/40'
                  }`}
                >
                  <span className="relative flex items-center justify-center">
                    {s === 'done' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                    ) : s === 'current' ? (
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute h-full w-full animate-ping rounded-full bg-white/60" />
                        <span className="relative h-2 w-2 rounded-full bg-white" />
                      </span>
                    ) : (
                      <span className="h-2 w-2 rounded-full border border-white/30 bg-white/10" />
                    )}
                  </span>
                  <span>{step.label}</span>
                </div>
                {idx < TIMELINE.length - 1 && <span className="text-white/25">→</span>}
              </div>
            );
          })}
        </div>

{/* State content */}
        <div className="px-4 py-6 sm:px-6">
          {status === 'LOADING' ? (
            <div className="glass rounded-2xl p-8 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-purple-400/30 border-t-fuchsia-400" />
              <p className="mt-4 text-sm text-white/60">Checking your semifinal status…</p>
            </div>
          ) : status === 'NONE' ? (
            <SemifinalRegistrationForm team={team} />
          ) : status === 'PENDING' ? (
            <PendingApprovalCard rereg={rereg} />
          ) : status === 'REJECTED' ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
                <h4 className="text-lg font-bold text-red-400">⚠️ Re-registration requires a revision</h4>
                {rereg?.adminNote && (
                  <div className="mt-2 rounded-lg border border-white/10 bg-black/30 p-3">
                    <p className="text-xs font-medium text-red-400">Admin note:</p>
                    <p className="mt-1 text-sm text-white/80">{rereg.adminNote}</p>
                  </div>
                )}
                <p className="mt-3 text-sm text-white/70">
                  Please review the note above, fix the issue, and resubmit your re-registration below.
                </p>
              </div>
              <SemifinalRegistrationForm team={team} />
            </div>
          ) : (
            <FullPaperSubmissionForm team={team} />
          )}
        </div>

        {/* Always-visible WA Group link */}
        <div className="px-4 py-3 text-xs text-white/50">
          Have questions or need updates? Join us in{' '}
          <a href={SEMIFINAL_WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="font-medium text-green-400 hover:underline">
            {SEMIFINAL_WHATSAPP_LABEL}
          </a>
          .
        </div>
      </div>
    </>
  );
}

function PendingApprovalCard({ rereg }: { rereg: Rereg | null }) {
  return (
    <div className="glass rounded-2xl p-6 text-center sm:p-8 space-y-5">
      <div className="relative mx-auto">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-400/30 bg-amber-500/15 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
          <Clock3 className="h-9 w-9 text-amber-300" />
        </div>
        <span className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-amber-400" />
      </div>
      <h4 className="text-xl font-bold text-amber-300">Re-Registration Under Review</h4>
      <p className="mx-auto max-w-xl text-sm text-white/70">
        Thank you! Your <strong>mandatory semifinal re-registration</strong> has been submitted and is now
        pending administrative approval. Once approved, you will be able to submit your <strong>full paper</strong>{' '}
        from this page — usually within <strong>1×24 hours</strong>.
      </p>
      <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-left text-sm">
        <p className="text-white/60">
          <span className="text-white/40">Status:</span>{' '}
          <span className="inline-flex items-center gap-1.5 font-semibold text-amber-300">
            <BadgeCheck className="h-4 w-4 animate-pulse" /> PENDING APPROVAL
          </span>
        </p>
      </div>
    </div>
  );
}