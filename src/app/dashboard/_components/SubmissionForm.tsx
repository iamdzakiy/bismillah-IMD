'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/FileUpload';
import type { DashboardTeam, SubmissionPhase } from './types';

interface SubmissionFormProps {
  team: DashboardTeam;
}

export function SubmissionForm({ team }: SubmissionFormProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<SubmissionPhase>('PRELIMINARY');
  const [fileUrl, setFileUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentPhase = team.registration?.currentPhase;
  const existingSubmission = team.submissions?.find((submission) => submission.phase === phase);

  const handleSubmit = async () => {
    if (!team.id) {
      setMessage({ type: 'error', text: 'Team ID not found. Please try again.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const endpoint = `/api/submissions/${phase.toLowerCase()}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: team.id, fileUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setMessage({ type: 'success', text: data.message || 'Submission successful!' });
      setFileUrl('');
      router.refresh();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const getUploadConfig = () => {
    // NEC, SPC, MO: hanya 1 file submission sesuai template
    if (phase === 'PRELIMINARY') {
      if (team.competitionType === 'SPC') {
        return { label: 'Project Proposal (PDF) - Gunakan template resmi', accept: '.pdf' };
      }
      if (team.competitionType === 'NEC') {
        return { label: 'Full Paper Essay (PDF) - Gunakan template resmi', accept: '.pdf' };
      }
      if (team.competitionType === 'OLYMPIAD') {
        return null; // Exam-based, no file upload
      }
    }
    if (phase === 'SEMIFINAL') {
      return { label: 'Full Paper (PDF)', accept: '.pdf' };
    }
    if (phase === 'FINAL') {
      return { label: 'Pitch Deck / Final Submission (PDF)', accept: '.pdf' };
    }
    return null;
  };

  const uploadConfig = getUploadConfig();

  if (team.competitionType === 'OLYMPIAD' && phase === 'PRELIMINARY') {
    return (
      <div className="glass-dark rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-2">Preliminary Phase - MO</h3>
        <p className="text-white/60 text-sm">
          The Olympiad preliminary phase is exam-based. Please check your email for exam access details.
        </p>
      </div>
    );
  }

  // Cek status dokumen
  if (team.registration?.status !== 'DOCUMENT_APPROVED') {
    return (
      <div className="glass-dark rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-2">Submission Locked</h3>
        <p className="text-white/60 text-sm">
          Your documents have not been approved yet. Please wait for admin approval before submitting.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-dark rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Submit Your Work</h3>
        <select
          value={phase}
          onChange={(e) => { setPhase(e.target.value as SubmissionPhase); setFileUrl(''); }}
          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
        >
          <option value="PRELIMINARY">Preliminary</option>
          <option value="SEMIFINAL">Semifinal</option>
          <option value="FINAL">Final</option>
        </select>
      </div>

      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-bio-emerald/10 border border-bio-emerald/50 text-bio-emerald'
              : 'bg-red-500/10 border border-red-500/50 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {existingSubmission ? (
        <div className="bg-white/5 border border-white/5 rounded-lg p-4">
          <p className="text-sm text-white/70">
            ✅ You have already submitted for this phase.
          </p>
          <p className="text-xs text-white/40 mt-1">
            Status: <span className="font-semibold text-bio-emerald">{existingSubmission.status}</span>
          </p>
        </div>
      ) : !uploadConfig ? (
        <p className="text-white/60 text-sm">No submission required for this phase.</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            <p className="text-xs text-white/40">
              {team.competitionType === 'SPC' && phase === 'PRELIMINARY' && 'Upload 1 file PDF (Proposal) menggunakan template resmi yang disediakan panitia.'}
              {team.competitionType === 'NEC' && phase === 'PRELIMINARY' && 'Upload 1 file PDF (Full Paper/Essay) menggunakan template resmi yang disediakan panitia.'}
            </p>
            <FileUpload
              key={uploadConfig.label}
              label={uploadConfig.label}
              accept={uploadConfig.accept}
              onUpload={(url) => setFileUrl(url)}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || !fileUrl}
            className="btn-glow w-full"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </>
      )}
    </div>
  );
}