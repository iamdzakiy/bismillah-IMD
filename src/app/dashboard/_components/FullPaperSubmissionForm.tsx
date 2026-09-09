// src/app/dashboard/_components/FullPaperSubmissionForm.tsx
'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { SuccessPopup } from '@/components/ui/SuccessPopup';
import { useRouter } from 'next/navigation';
import { SEMIFINAL_WHATSAPP_LINK, SEMIFINAL_WHATSAPP_LABEL, SEMIFINAL_TEMPLATE_LINK } from '@/lib/semifinal';
import type { DashboardTeam } from './types';

interface FullPaperSubmissionFormProps {
  team: DashboardTeam;
}

export function FullPaperSubmissionForm({ team }: FullPaperSubmissionFormProps) {
  const router = useRouter();
  const [fullPaperUrl, setFullPaperUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const existing = team.submissions?.find((s) => s.phase === 'SEMIFINAL');

  const handleSubmit = async () => {
    setMessage(null);
    if (!fullPaperUrl) {
      setMessage({ type: 'error', text: 'Please upload your full paper (PDF) before submitting.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/semifinal/submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: team.id, fullPaperUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

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
          Upload your complete full paper as a single PDF using the official template.
        </p>
        {SEMIFINAL_TEMPLATE_LINK && (
          <p className="text-xs text-white/50">
            Template:{' '}
            <a href={SEMIFINAL_TEMPLATE_LINK} target="_blank" rel="noopener noreferrer" className="text-bio-emerald hover:underline">
              {SEMIFINAL_TEMPLATE_LINK}
            </a>
          </p>
        )}

        <FileUpload label="Full Paper (PDF, max 5MB)" accept=".pdf" onUpload={(url) => setFullPaperUrl(url)} />

        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-bio-emerald/10 border border-bio-emerald/50 text-bio-emerald' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>
            {message.text}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting || !fullPaperUrl}
          className="btn-glow w-full disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-transform"
        >
          {submitting ? 'Submitting...' : 'Submit Full Paper'}
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