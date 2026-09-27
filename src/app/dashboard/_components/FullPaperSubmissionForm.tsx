// src/app/dashboard/_components/FullPaperSubmissionForm.tsx
'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { SuccessPopup } from '@/components/ui/SuccessPopup';
import { triggerDoubleCelebration } from '@/components/ui/useConfettiBlast';
import { useRouter } from 'next/navigation';
import { SEMIFINAL_WHATSAPP_LINK, SEMIFINAL_WHATSAPP_LABEL, SEMIFINAL_TEMPLATE_LINK } from '@/lib/semifinal';
import type { DashboardTeam } from './types';

interface FullPaperSubmissionFormProps {
  team: DashboardTeam;
}

export function FullPaperSubmissionForm({ team }: FullPaperSubmissionFormProps) {
  const router = useRouter();
  const isSPC = team.competitionType === 'SPC';
  const [fullPaperUrl, setFullPaperUrl] = useState('');
  const [elevatorPitchUrl, setElevatorPitchUrl] = useState('');
  const [pitchMode, setPitchMode] = useState<'link' | 'upload'>('link');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const existing = team.submissions?.find((s) => s.phase === 'SEMIFINAL');

  // Elevator Pitch hanya untuk SPC: terima URL YouTube / Drive (unlisted ok) atau file video.
  const isValidPitchUrl = (url: string) => {
    try {
      const u = new URL(url.trim());
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
      const host = u.hostname.toLowerCase();
      const allowedHosts = [
        'youtube.com',
        'www.youtube.com',
        'youtu.be',
        'm.youtube.com',
        'drive.google.com',
        'docs.google.com',
      ];
      // Izinkan host video umum + link file storage (mis. supabase) hasil upload.
      if (allowedHosts.some((h) => host === h || host.endsWith('.' + h))) return true;
      // Fallback: izinkan URL https apapun yang tampak seperti file video / public link storage.
      return /\.(mp4|mov|webm)(\?|#|$)/i.test(u.pathname) || host.includes('supabase');
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    setMessage(null);
    if (!fullPaperUrl) {
      setMessage({ type: 'error', text: 'Please upload your full paper (PDF/DOCX) before submitting.' });
      return;
    }
    if (isSPC) {
      if (!elevatorPitchUrl) {
        setMessage({ type: 'error', text: 'SPC teams must also provide an Elevator Pitch (video link or uploaded video).' });
        return;
      }
      if (!isValidPitchUrl(elevatorPitchUrl)) {
        setMessage({
          type: 'error',
          text: 'Elevator Pitch link is not valid. Use a YouTube / Google Drive (unlisted) link or upload an MP4/MOV/WEBM video (max 50MB).',
        });
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/semifinal/submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: team.id,
          fullPaperUrl,
          // Elevator Pitch hanya dikirim untuk SPC; NEC/tim lain tidak mengirim field ini.
          ...(isSPC ? { videoPitchUrl: elevatorPitchUrl.trim() } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      // 🎉🎉 2 confetti volleys on successful full-paper (akhir) submit.
      triggerDoubleCelebration(2, 4500);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.refresh();
      }, 2200);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-dark rounded-2xl p-6 sm:p-8 space-y-6">
      <SuccessPopup isOpen={showSuccess} onClose={() => setShowSuccess(false)} message="Full paper submitted! Our team will review it soon." />

      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-5">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🔓</span>
          <h4 className="text-lg font-bold text-emerald-400">Full Paper Submission — Now Unlocked</h4>
        </div>
        <p className="text-sm text-white/70">
          Your semifinal re-registration was approved. You may now submit your full paper for the semifinal phase.
        </p>
      </div>

      <div className="rounded-xl glass p-5 space-y-5">
        <p className="text-xs text-white/40">
          {isSPC
            ? 'SPC Semifinal: upload your Full Paper (PDF/DOCX, max 10MB) + Elevator Pitch video (link or file upload).'
            : 'Upload your complete full paper as a single PDF/DOCX (max 10MB) using the official template.'}
        </p>
        {SEMIFINAL_TEMPLATE_LINK && (
          <p className="text-xs text-white/50">
            Template:{' '}
            <a href={SEMIFINAL_TEMPLATE_LINK} target="_blank" rel="noopener noreferrer" className="text-bio-emerald hover:underline">
              {SEMIFINAL_TEMPLATE_LINK}
            </a>
          </p>
        )}

        <FileUpload
          label="Full Paper (PDF/DOCX, max 10MB)"
          accept=".pdf,.doc,.docx"
          allowedExtensions={['.pdf', '.doc', '.docx']}
          allowedMimeTypes={[
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/zip',
            'application/octet-stream',
          ]}
          maxSizeMB={10}
          onUpload={(url) => setFullPaperUrl(url)}
        />
        {fullPaperUrl && (
          <p className="text-xs text-emerald-300 break-all">
            ✅ Full Paper uploaded: <a href={fullPaperUrl} target="_blank" rel="noopener noreferrer" className="underline">{fullPaperUrl}</a>
          </p>
        )}

        {/* === Elevator Pitch: HANYA untuk SPC (kondisional) === */}
        {isSPC && (
          <div className="rounded-xl border border-fuchsia-400/25 bg-fuchsia-500/5 p-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎤</span>
              <h5 className="text-sm font-bold text-fuchsia-300">Elevator Pitch (SPC only — required)</h5>
            </div>
            <p className="text-xs text-white/50">
              3–5 minute pitch. Choose one: paste an <strong>unlisted YouTube / Google Drive link</strong>, or upload{' '}
              <strong>MP4 / MOV / WEBM (max 50MB)</strong>.
            </p>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPitchMode('link')}
                className={`flex-1 rounded-lg px-3 py-2 font-semibold transition ${pitchMode === 'link' ? 'bg-fuchsia-500/30 text-fuchsia-200 border border-fuchsia-400/40' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'}`}
              >
                🔗 Video Link
              </button>
              <button
                type="button"
                onClick={() => setPitchMode('upload')}
                className={`flex-1 rounded-lg px-3 py-2 font-semibold transition ${pitchMode === 'upload' ? 'bg-fuchsia-500/30 text-fuchsia-200 border border-fuchsia-400/40' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'}`}
              >
                📤 Upload Video
              </button>
            </div>
            {pitchMode === 'link' ? (
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Elevator Pitch URL</label>
                <input
                  type="url"
                  value={elevatorPitchUrl}
                  onChange={(e) => setElevatorPitchUrl(e.target.value)}
                  placeholder="https://youtu.be/... atau https://drive.google.com/..."
                  className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-fuchsia-400/60 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-white/35">Accepted: youtube.com / youtu.be / drive.google.com (unlisted OK).</p>
              </div>
            ) : (
              <FileUpload
                label="Elevator Pitch Video (MP4/MOV/WEBM, max 50MB)"
                accept=".mp4,.mov,.webm,video/mp4,video/webm,video/quicktime"
                allowedExtensions={['.mp4', '.mov', '.webm']}
                allowedMimeTypes={['video/mp4', 'video/webm', 'video/quicktime', 'application/octet-stream']}
                maxSizeMB={50}
                hint="MP4, MOV, WEBM (Max 50MB) — larger? use YouTube/Drive link above"
                onUpload={(url) => setElevatorPitchUrl(url)}
              />
            )}
            {elevatorPitchUrl && (
              <p className="text-xs text-emerald-300 break-all">
                ✅ Elevator Pitch ready: <a href={elevatorPitchUrl} target="_blank" rel="noopener noreferrer" className="underline">{elevatorPitchUrl}</a>
              </p>
            )}
          </div>
        )}

        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-bio-emerald/10 border border-bio-emerald/50 text-bio-emerald' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>
            {message.text}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting || !fullPaperUrl || (isSPC && !elevatorPitchUrl)}
          className="btn-glow w-full disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-transform"
        >
          {submitting ? 'Submitting...' : isSPC ? 'Submit Full Paper + Elevator Pitch' : 'Submit Full Paper'}
        </button>
      </div>

      {/* Already-submitted state */}
      {existing && (
        <div className="rounded-xl bg-white/5 border border-white/10 p-5">
          <p className="text-white/70 text-sm">✅ You already submitted your full paper for this phase.</p>
          <p className="text-xs text-white/40 mt-1">
            Status:{' '}
            <span className={`font-semibold ${existing.status === 'APPROVED' ? 'text-bio-emerald' : existing.status === 'REJECTED' ? 'text-red-400' : 'text-yellow-400'}`}>
              {existing.status}
            </span>
          </p>
          {existing.notes && <p className="text-xs text-white/50 mt-1">Admin notes: {existing.notes}</p>}
        </div>
      )}

      <a
        href={SEMIFINAL_WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-xl bg-green-500/10 border border-green-500/30 p-4 hover:bg-green-500/15 transition"
      >
        <span className="text-2xl">💬</span>
        <span className="flex-1 min-w-0">
          <span className="block text-green-400 font-semibold">Questions? Join {SEMIFINAL_WHATSAPP_LABEL}</span>
          <span className="block text-xs text-white/60">Official invitation link for participant queries & updates.</span>
        </span>
        <span className="text-green-400 text-lg">→</span>
      </a>
    </div>
  );
}