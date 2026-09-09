// src/app/dashboard/_components/SemifinalModule.tsx
'use client';

import { useState, useEffect } from 'react';
import { ConfettiCelebration } from '@/components/ui/ConfettiCelebration';
import { SEMIFINAL_HERO_COPY, SEMIFINAL_WHATSAPP_LINK, SEMIFINAL_WHATSAPP_LABEL } from '@/lib/semifinal';
import { SemifinalRegistrationForm, SemifinalMascots } from './SemifinalRegistrationForm';
import { FullPaperSubmissionForm } from './FullPaperSubmissionForm';
import type { DashboardTeam } from './types';

type Status = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';

interface Rereg {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string | null;
  paymentProofUrl?: string | null;
}

const STEPS = [
  { key: 'rereg', label: 'Re-registration' },
  { key: 'approval', label: 'Admin Approval' },
  { key: 'paper', label: 'Full Paper' },
];

function stepIndex(status: Status) {
  if (status === 'NONE') return 0;
  if (status === 'PENDING') return 1;
  if (status === 'REJECTED') return 0;
  return 2; // APPROVED
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
      if (!cancelled) setTimeout(() => setCelebrate(true), 250);
    })();
    return () => {
      cancelled = true;
    };
  }, [team.id]);

  const activeStep = status === 'LOADING' ? 0 : stepIndex(status as Status);

  return (
    <>
      {celebrate && status !== 'LOADING' && <ConfettiCelebration active={celebrate} count={160} />}

      <div
        id="semifinal-module"
        className="rounded-3xl overflow-hidden border border-emerald-500/40 shadow-[0_0_45px_rgba(16,185,129,0.25)] relative mb-2"
      >
        {/* Congratulations hero — always prominent on this screen */}
        <div className="bg-gradient-to-r from-emerald-600/25 via-teal-500/15 to-cyan-500/20 px-6 py-8 sm:px-10">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
            <SemifinalMascots />
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center text-4xl mb-4">🏆</div>
          <h2 className="text-2xl sm:text-4xl font-black text-center text-bio-emerald drop-shadow-[0_0_18px_rgba(16,185,129,0.5)]">
            🎉 {SEMIFINAL_HERO_COPY.headline}
          </h2>
          <p className="text-white/75 text-center mt-3 text-sm sm:text-base max-w-2xl mx-auto">
            {SEMIFINAL_HERO_COPY.sub}
          </p>
        </div>

        {/* Progress tracker */}
        <div className="flex items-center gap-2 sm:gap-3 px-4 py-3 flex-wrap">
          {STEPS.map((step, idx) => (
            <div
              key={step.key}
              className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition ${
                idx < activeStep
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : idx === activeStep
                    ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/50'
                    : 'bg-white/5 text-white/40 border border-white/10'
              }`}
            >
              <span>{idx < activeStep ? '✓' : idx === activeStep ? '●' : '○'}</span> {step.label}
            </div>
          ))}
        </div>

        {/* State content */}
        <div className="px-4 py-6 sm:px-6">
          {status === 'LOADING' ? (
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-10 h-10 mx-auto border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
              <p className="text-white/60 mt-4 text-sm">Checking your semifinal status…</p>
            </div>
          ) : status === 'NONE' ? (
            <SemifinalRegistrationForm team={team} />
          ) : status === 'PENDING' ? (
            <PendingApprovalCard rereg={rereg} />
          ) : status === 'REJECTED' ? (
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                <h4 className="text-lg font-bold text-red-400">⚠️ Re-registration requires a revision</h4>
                {rereg?.adminNote && (
                  <div className="mt-2 bg-black/30 rounded-lg p-3">
                    <p className="text-red-400 text-xs font-medium">Admin note:</p>
                    <p className="text-white/80 text-sm mt-1">{rereg.adminNote}</p>
                  </div>
                )}
                <p className="text-white/70 text-sm mt-3">
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
        <div className="px-4 py-3 border-t border-white/10 text-xs text-white/50">
          Have questions or need updates? Join us in{' '}
          <a href={SEMIFINAL_WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline font-medium">
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
    <div className="glass rounded-2xl p-6 sm:p-8 text-center space-y-5">
      <div className="relative mx-auto">
        <div className="w-20 h-20 mx-auto rounded-full bg-yellow-500/15 flex items-center justify-center text-3xl">⏳</div>
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 animate-pulse-glow" />
      </div>
      <h4 className="text-xl font-bold text-yellow-300">Re-registration Under Review</h4>
      <p className="text-white/70 text-sm max-w-xl mx-auto">
        Thank you! Your <strong>mandatory semifinal re-registration</strong> has been submitted and is now
        pending administrative approval. Once an admin approves it, you will be able to submit your
        <strong>full paper</strong> from this page. This usually takes 1–3 business days.
      </p>
      <div className="bg-black/30 rounded-xl p-4 text-left text-sm space-y-2">
        <p className="text-white/60">
          <span className="text-white/40">Status:</span>{' '}
          <span className="text-yellow-300 font-semibold">PENDING APPROVAL</span>
        </p>
      </div>
    </div>
  );
}