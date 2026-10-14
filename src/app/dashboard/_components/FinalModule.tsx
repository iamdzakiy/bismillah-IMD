// src/app/dashboard/_components/FinalModule.tsx
// Rendered when a team has reached the FINAL phase (registration.currentPhase
// === 'FINAL', or its semifinal submission was already APPROVED).
// Final materials differ per track:
// - NEC: pitch deck + digital poster.
// - SPC: mockup, surat pernyataan, infografis, logbook, pitch deck.
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BadgeCheck, CheckCircle2, Clock3, Sparkles, Trophy } from 'lucide-react';
import { ConfettiCelebration } from '@/components/ui/ConfettiCelebration';
import { SuccessPopup } from '@/components/ui/SuccessPopup';
import { FileUpload } from '@/components/FileUpload';
import { parseJsonSafe } from '@/lib/fetch-json';
import {
  COMPETITION_TIMELINE,
  FINAL_SUBMISSION_WINDOW,
  isFinalSubmissionOpen,
  type CompetitionCode,
} from '@/lib/phase-utils';
import {
  FINAL_WHATSAPP_LINKS,
  FINAL_WHATSAPP_LABELS,
  SPC_FINAL_GUIDEBOOK_EMBED_URL,
  SPC_FINAL_GUIDEBOOK_VIEW_URL,
} from '@/lib/final';
import type { DashboardTeam, DashboardSubmission } from './types';

type FieldKey =
  | 'pitchDeckUrl'
  | 'posterUrl'
  | 'mockupUrl'
  | 'statementUrl'
  | 'infographicUrl'
  | 'logbookUrl';

interface FinalField {
  key: FieldKey;
  label: string;
  hint: string;
  accept: string;
  extensions: string[];
  mimes: string[];
  maxSizeMB: number;
}

const PDF: Pick<FinalField, 'accept' | 'extensions' | 'mimes' | 'maxSizeMB'> = {
  accept: '.pdf',
  extensions: ['.pdf'],
  mimes: ['application/pdf'],
  maxSizeMB: 10,
};

const PDF_OR_IMAGE: Pick<FinalField, 'accept' | 'extensions' | 'mimes' | 'maxSizeMB'> = {
  accept: '.pdf,.png,.jpg,.jpeg',
  extensions: ['.pdf', '.png', '.jpg', '.jpeg'],
  mimes: ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'],
  maxSizeMB: 15,
};

const NEC_FINAL_FIELDS: FinalField[] = [
  { key: 'pitchDeckUrl', label: 'Pitch Deck (PDF)', hint: 'PDF only (max 10MB)', ...PDF },
  {
    key: 'posterUrl',
    label: 'Poster Digital (PDF/JPG/PNG)',
    hint: 'PDF or image (max 15MB)',
    ...PDF_OR_IMAGE,
  },
];

const SPC_FINAL_FIELDS: FinalField[] = [
  { key: 'pitchDeckUrl', label: 'Pitch Deck (PDF)', hint: 'PDF only (max 10MB)', ...PDF },
  {
    key: 'mockupUrl',
    label: 'Mockup (PDF/JPG/PNG)',
    hint: 'PDF or image (max 15MB)',
    ...PDF_OR_IMAGE,
  },
  {
    key: 'statementUrl',
    label: 'Surat Pernyataan (PDF, sudah ditandatangani)',
    hint: 'Scanned signed letter, PDF only (max 10MB)',
    ...PDF,
  },
  {
    key: 'infographicUrl',
    label: 'Infografis (PDF/JPG/PNG)',
    hint: 'PDF or image (max 15MB)',
    ...PDF_OR_IMAGE,
  },
  { key: 'logbookUrl', label: 'Logbook (PDF)', hint: 'PDF only (max 10MB)', ...PDF },
];

const FIELD_TITLES: Record<FieldKey, string> = {
  pitchDeckUrl: 'Pitch Deck',
  posterUrl: 'Poster',
  mockupUrl: 'Mockup',
  statementUrl: 'Surat Pernyataan',
  infographicUrl: 'Infografis',
  logbookUrl: 'Logbook',
};

const TRACK_LABEL: Record<string, { label: string; emoji: string }> = {
  OLYMPIAD: { label: 'Microbiology Olympiad', emoji: '🏅' },
  SPC: { label: 'Science Project Competition', emoji: '🚀' },
  NEC: { label: 'National Essay Competition', emoji: '⚙️' },
};

const DATE_FMT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
});

export function FinalModule({ team }: { team: DashboardTeam }) {
  const router = useRouter();
  const [celebrate, setCelebrate] = useState(false);
  const [values, setValues] = useState<Record<FieldKey, string>>({
    pitchDeckUrl: '',
    posterUrl: '',
    mockupUrl: '',
    statementUrl: '',
    infographicUrl: '',
    logbookUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const code = team.competitionType as CompetitionCode;
  const timeline = COMPETITION_TIMELINE[code];
  const finalWindow = FINAL_SUBMISSION_WINDOW[code];
  const submissionOpen = isFinalSubmissionOpen(code);
  // Only SPC/NEC ever reach this module (see DashboardClient.reachedFinal).
  const fields = team.competitionType === 'SPC' ? SPC_FINAL_FIELDS : NEC_FINAL_FIELDS;

  const existing: DashboardSubmission | undefined = team.submissions?.find(
    (s) => s.phase === 'FINAL'
  );
  const needsResubmission = existing?.status === 'REJECTED';
  const track = TRACK_LABEL[team.competitionType] || TRACK_LABEL.OLYMPIAD;
  // Final WA group + guidebook are per-track (SPC/NEC only reach this module).
  const waLink =
    FINAL_WHATSAPP_LINKS[team.competitionType as 'SPC' | 'NEC'] ??
    FINAL_WHATSAPP_LINKS.SPC;
  const waLabel =
    FINAL_WHATSAPP_LABELS[team.competitionType as 'SPC' | 'NEC'] ??
    FINAL_WHATSAPP_LABELS.SPC;
  const isSPC = team.competitionType === 'SPC';

  useEffect(() => {
    const t = setTimeout(() => setCelebrate(true), 350);
    return () => clearTimeout(t);
  }, []);

  const setField = (key: FieldKey, url: string) => setValues((v) => ({ ...v, [key]: url }));

  const handleSubmit = async () => {
    setMessage(null);

    const missing = fields.filter((f) => !values[f.key]).map((f) => f.label);
    if (missing.length > 0) {
      setMessage({
        type: 'error',
        text: `Please upload the following before submitting: ${missing.join(', ')}.`,
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload: Record<string, string> = { teamId: team.id };
      for (const f of fields) payload[f.key] = values[f.key].trim();
      const res = await fetch('/api/submissions/final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data: any = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.refresh();
      }, 2500);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Submission failed',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const allFilled = fields.every((f) => !!values[f.key]);

  // Links of already-submitted final files (for the status card).
  const submittedFiles = existing
    ? fields
        .map((f) => ({ title: FIELD_TITLES[f.key], url: (existing as any)[f.key] as string | null }))
        .filter((x): x is { title: string; url: string } => !!x.url)
    : [];

  return (
    <>
      {celebrate && <ConfettiCelebration active={celebrate} />}
      <SuccessPopup
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="Final submission received! Our team will review it soon."
      />

      <div
        id="final-module"
        className="relative mb-2 overflow-hidden rounded-3xl border border-amber-400/25 border-t-white/15 bg-white/5 backdrop-blur-2xl shadow-[0_20px_50px_rgba(251,191,36,0.12)]"
      >
        <div className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-56 w-56 rounded-full bg-purple-500/12 blur-3xl" />

        {/* Hero */}
        <div className="relative bg-gradient-to-r from-amber-600/25 via-fuchsia-500/10 to-purple-500/15 px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 border border-amber-300/30">
              <Trophy className="h-7 w-7 text-amber-300" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-300/80">
                {track.emoji} {track.label} — Final Stage
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-white">
                🏆 Congratulations, Finalist!
              </h2>
              <p className="mt-2 text-sm text-white/70 max-w-2xl">
                Your semifinal submission has been approved. Upload your final materials below,
                then get ready for the final round on{' '}
                {timeline
                  ? DATE_FMT.format(timeline.finalStart)
                  : 'the announced date'}
                {' '}at ITB Ganesha.
              </p>
            </div>
          </div>
        </div>

        {/* Progress steps */}
        <div className="px-4 pt-6 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
            {[
              { label: 'Semifinal Approved', sub: 'You made the cut', done: true },
              {
                label: 'Final Submission',
                sub: needsResubmission ? 'Needs revision' : existing ? 'Under review' : 'Upload now',
                done: false,
                current: true,
              },
              {
                label: 'Final Pitching Day',
                sub: timeline ? DATE_FMT.format(timeline.finalStart) : 'TBA',
                done: false,
              },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-3 sm:flex-1">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                    step.done
                      ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                      : step.current
                        ? 'bg-amber-500/20 border-amber-400/60 text-amber-300'
                        : 'bg-white/5 border-white/20 text-white/50'
                  }`}
                >
                  {step.done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white/90">{step.label}</p>
                  <p className="text-xs text-white/45">{step.sub}</p>
                </div>
                {i < arr.length - 1 && (
                  <span className="hidden sm:block flex-1 border-t border-white/10 ml-2" />
                )}
              </div>
            ))}
          </div>
        </div>


        {/* State content */}
        <div className="px-4 py-6 sm:px-6 space-y-4">
          {/* Submission window notice (mirrors the server-side gate) */}
          {!submissionOpen && (
            <div className="rounded-xl border border-sky-400/30 bg-sky-500/10 p-4">
              <p className="text-sm text-sky-200 flex items-start gap-2">
                <Clock3 className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  The final submission window is{' '}
                  <strong>
                    {DATE_FMT.format(finalWindow.start)} – {DATE_FMT.format(finalWindow.end)}
                  </strong>
                  . You can prepare your files now — submitting is only possible during that
                  window.
                </span>
              </p>
            </div>
          )}

          {/* Already-submitted state */}
          {existing && !needsResubmission && (
            <div className="rounded-xl bg-white/5 border border-white/10 p-5 space-y-3">
              <p className="text-white/70 text-sm">✅ You already submitted your final materials.</p>
              <p className="text-xs text-white/40">
                Status:{' '}
                <span
                  className={`font-semibold ${
                    existing.status === 'APPROVED' ? 'text-bio-emerald' : 'text-yellow-400'
                  }`}
                >
                  {existing.status}
                </span>
              </p>
              {submittedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {submittedFiles.map((f) => (
                    <a
                      key={f.title}
                      href={f.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-bio-cyan hover:bg-white/10"
                    >
                      {f.title} ↗
                    </a>
                  ))}
                </div>
              )}
              {existing.notes && (
                <p className="text-xs text-white/50">Admin notes: {existing.notes}</p>
              )}
            </div>
          )}

          {existing && needsResubmission && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
              <h4 className="text-lg font-bold text-red-300 mb-1">
                ⚠️ Final submission requires a revision
              </h4>
              {existing.notes && (
                <div className="mt-2 rounded-lg border border-white/10 bg-black/30 p-3">
                  <p className="text-xs font-medium text-white/50">Admin note:</p>
                  <p className="mt-1 text-sm text-white/80">{existing.notes}</p>
                </div>
              )}
              <p className="mt-3 text-sm text-white/70">
                Please review the note above, fix the issue, and resubmit below.
              </p>
            </div>
          )}


          {/* The final submission form — fields depend on the track */}
          {(!existing || needsResubmission) && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">📤 Submit Final Materials</h3>
                <p className="text-sm text-white/60">
                  {team.competitionType === 'SPC'
                    ? 'SPC final requires all five files: pitch deck, mockup, surat pernyataan, infografis, and logbook.'
                    : 'NEC final requires both files: pitch deck and digital poster.'}
                </p>
              </div>

              {fields.map((f) => (
                <div key={f.key}>
                  <FileUpload
                    label={f.label}
                    accept={f.accept}
                    allowedExtensions={f.extensions}
                    allowedMimeTypes={f.mimes}
                    maxSizeMB={f.maxSizeMB}
                    hint={f.hint}
                    onUpload={(url) => setField(f.key, url)}
                  />
                  {values[f.key] && (
                    <p className="text-xs text-emerald-300 break-all mt-2">
                      ✅ {FIELD_TITLES[f.key]} ready:{' '}
                      <a
                        href={values[f.key]}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        {values[f.key]}
                      </a>
                    </p>
                  )}
                </div>
              ))}

              {message && (
                <div
                  className={`px-4 py-3 rounded-lg text-sm ${
                    message.type === 'success'
                      ? 'bg-bio-emerald/10 border border-bio-emerald/50 text-bio-emerald'
                      : 'bg-red-500/10 border border-red-500/40 text-red-400'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting || !allFilled || !submissionOpen}
                className="btn-glow w-full disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-transform"
              >
                {submitting
                  ? 'Submitting...'
                  : needsResubmission
                    ? 'Resubmit Final Materials'
                    : 'Submit Final Materials'}
              </button>
              {!submissionOpen && (
                <p className="text-xs text-white/40 text-center">
                  Submits are disabled until the final submission window opens.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Always-visible per-track WA Group link */}
        <div className="px-4 py-3 text-xs text-white/50">
          Have questions or need updates? Join us in{' '}
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-green-400 hover:underline"
          >
            {waLabel}
          </a>
        </div>
      </div>

      {/* Official guidebook (SPC only) */}
      {isSPC && (
        <div className="glass-dark rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-lg font-bold">📘 SPC Final Guidebook</h3>
            <a
              href={SPC_FINAL_GUIDEBOOK_VIEW_URL}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-bio-cyan hover:underline"
            >
              Open in Google Drive ↗
            </a>
          </div>
          <p className="text-sm text-white/60 mb-4">
            Read the official guidebook for the SPC final stage — deliverable specs, judging
            criteria, exhibition rules, and schedule.
          </p>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
            <iframe
              src={SPC_FINAL_GUIDEBOOK_EMBED_URL}
              title="SPC Final Guidebook"
              className="w-full h-[600px]"
              allow="autoplay"
            />
          </div>
        </div>
      )}


      {/* Finalist info card */}
      <div className="glass-dark rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-300" /> What happens next?
        </h3>
        <ol className="space-y-2 text-sm text-white/70 list-decimal list-inside">
          <li>
            Upload {team.competitionType === 'SPC' ? 'all five required files' : 'the pitch deck and poster'}{' '}
            before {DATE_FMT.format(finalWindow.end)}.
          </li>
          <li>Wait for the committee to review your submission (usually within 1×24 hours).</li>
          <li>
            Attend the final technical meeting and the final pitching day{' '}
            {timeline
              ? `on ${DATE_FMT.format(timeline.finalStart)} at ITB Ganesha`
              : 'at ITB Ganesha'}
            .
          </li>
        </ol>
        <p className="mt-4 text-xs text-white/40 flex items-center gap-1.5">
          <BadgeCheck className="h-4 w-4 text-emerald-400" />
          Your current phase: <strong className="text-emerald-300">FINAL</strong>
        </p>
      </div>
    </>
  );
}

