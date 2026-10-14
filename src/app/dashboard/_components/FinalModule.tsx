// src/app/dashboard/_components/FinalModule.tsx
// Rendered when a team has reached the FINAL phase (registration.currentPhase
// === 'FINAL', or its semifinal submission was already APPROVED). This is the
// only module that talks to /api/submissions/final (pitch deck + video pitch).
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
  isSubmissionOpen,
  type CompetitionCode,
} from '@/lib/phase-utils';
import {
  SEMIFINAL_WHATSAPP_LINK,
  SEMIFINAL_WHATSAPP_LABEL,
} from '@/lib/semifinal';
import type { DashboardTeam, DashboardSubmission } from './types';

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

function isValidHttpUrl(url: string): boolean {
  try {
    const u = new URL(url.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function FinalModule({ team }: { team: DashboardTeam }) {
  const router = useRouter();
  const [celebrate, setCelebrate] = useState(false);
  const [pitchDeckUrl, setPitchDeckUrl] = useState('');
  const [videoPitchUrl, setVideoPitchUrl] = useState('');
  const [videoMode, setVideoMode] = useState<'upload' | 'link'>('upload');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Final submission window comes from the shared timeline so the UI matches
  // the server-side gate in /api/submissions/final.
  const code = team.competitionType as CompetitionCode;
  const timeline = COMPETITION_TIMELINE[code];
  const submissionOpen = isSubmissionOpen(code, 'final');

  const existing: DashboardSubmission | undefined = team.submissions?.find(
    (s) => s.phase === 'FINAL'
  );
  const needsResubmission = existing?.status === 'REJECTED';

  const track = TRACK_LABEL[team.competitionType] || TRACK_LABEL.OLYMPIAD;

  useEffect(() => {
    const t = setTimeout(() => setCelebrate(true), 350);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async () => {
    setMessage(null);

    if (!pitchDeckUrl) {
      setMessage({ type: 'error', text: 'Please upload your pitch deck (PDF) before submitting.' });
      return;
    }
    if (!videoPitchUrl) {
      setMessage({
        type: 'error',
        text: 'Please provide your final pitch video (upload or link) before submitting.',
      });
      return;
    }
    if (videoMode === 'link' && !isValidHttpUrl(videoPitchUrl)) {
      setMessage({
        type: 'error',
        text: 'Video pitch link is not valid. Use a full https:// URL (YouTube / Google Drive unlisted recommended).',
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/submissions/final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: team.id,
          pitchDeckUrl,
          videoPitchUrl: videoPitchUrl.trim(),
        }),
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

  const statusCard = existing && !needsResubmission && (
    <div className="rounded-xl bg-white/5 border border-white/10 p-5">
      <p className="text-white/70 text-sm">✅ You already submitted your final materials.</p>
      <p className="text-xs text-white/40 mt-1">
        Status:{' '}
        <span
          className={`font-semibold ${
            existing.status === 'APPROVED' ? 'text-bio-emerald' : 'text-yellow-400'
          }`}
        >
          {existing.status}
        </span>
      </p>
      {existing.notes && (
        <p className="text-xs text-white/50 mt-1">Admin notes: {existing.notes}</p>
      )}
    </div>
  );

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
                Your semifinal submission has been approved. Submit your final materials below —
                pitch deck and final pitch video — then get ready for the final round on{' '}
                {timeline
                  ? `${DATE_FMT.format(timeline.finalStart)} – ${DATE_FMT.format(timeline.finalEnd)}`
                  : 'the announced date'}
                .
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
                  The final submission window opens{' '}
                  <strong>
                    {timeline
                      ? `${DATE_FMT.format(timeline.finalStart)} – ${DATE_FMT.format(timeline.finalEnd)}`
                      : 'on the announced date'}
                  </strong>
                  . You can prepare your files now — submitting is only possible during that
                  window.
                </span>
              </p>
            </div>
          )}

          {existing && !needsResubmission && statusCard}

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


          {/* The actual final submission form */}
          {(!existing || needsResubmission) && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">📤 Submit Final Materials</h3>
                <p className="text-sm text-white/60">
                  Both the pitch deck (PDF) and the final pitch video are mandatory for all
                  tracks.
                </p>
              </div>

              <FileUpload
                label="Pitch Deck (PDF)"
                accept=".pdf"
                allowedExtensions={['.pdf']}
                allowedMimeTypes={['application/pdf']}
                maxSizeMB={10}
                hint="PDF only (max 10MB)"
                onUpload={setPitchDeckUrl}
              />
              {pitchDeckUrl && (
                <p className="text-xs text-emerald-300 break-all -mt-2">
                  ✅ Pitch deck ready:{' '}
                  <a href={pitchDeckUrl} target="_blank" rel="noreferrer" className="underline">
                    {pitchDeckUrl}
                  </a>
                </p>
              )}

              <div>
                <p className="text-sm font-medium text-white/70 mb-2">Final Pitch Video</p>
                <div className="flex gap-2 mb-3">
                  {(
                    [
                      ['upload', 'Upload video'],
                      ['link', 'Paste link'],
                    ] as const
                  ).map(([mode, label]) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setVideoMode(mode)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        videoMode === mode
                          ? 'bg-amber-500/20 border border-amber-400/50 text-amber-200'
                          : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {videoMode === 'upload' ? (
                  <FileUpload
                    label="Pitch Video (MP4/MOV/WEBM, max 50MB)"
                    accept=".mp4,.mov,.webm,video/mp4,video/webm,video/quicktime"
                    allowedExtensions={['.mp4', '.mov', '.webm']}
                    allowedMimeTypes={[
                      'video/mp4',
                      'video/webm',
                      'video/quicktime',
                      'application/octet-stream',
                    ]}
                    maxSizeMB={50}
                    onUpload={setVideoPitchUrl}
                  />
                ) : (
                  <>
                    <input
                      type="url"
                      value={videoPitchUrl}
                      onChange={(e) => setVideoPitchUrl(e.target.value)}
                      placeholder="https://youtube.com/... or https://drive.google.com/..."
                      className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-amber-400/60 focus:outline-none"
                    />
                    <p className="mt-1 text-[11px] text-white/35">
                      YouTube / Google Drive (unlisted) links recommended.
                    </p>
                  </>
                )}
                {videoMode === 'upload' && videoPitchUrl && (
                  <p className="text-xs text-emerald-300 break-all mt-2">
                    ✅ Video ready:{' '}
                    <a href={videoPitchUrl} target="_blank" rel="noreferrer" className="underline">
                      {videoPitchUrl}
                    </a>
                  </p>
                )}
              </div>


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
                disabled={submitting || !pitchDeckUrl || !videoPitchUrl || !submissionOpen}
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

        {/* Always-visible WA Group link */}
        <div className="px-4 py-3 text-xs text-white/50">
          Have questions or need updates? Join us in{' '}
          <a
            href={SEMIFINAL_WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-green-400 hover:underline"
          >
            {SEMIFINAL_WHATSAPP_LABEL}
          </a>
        </div>
      </div>

      {/* Finalist info card */}
      <div className="glass-dark rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-300" /> What happens next?
        </h3>
        <ol className="space-y-2 text-sm text-white/70 list-decimal list-inside">
          <li>Upload your pitch deck and final pitch video before the window closes.</li>
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

