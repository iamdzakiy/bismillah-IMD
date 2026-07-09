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
  const [files, setFiles] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentPhase = team.registration?.currentPhase;
  const existingSubmission = team.submissions?.find((submission) => submission.phase === phase);

  const handleFileUpload = (key: string, url: string) => {
    setFiles((prev) => ({ ...prev, [key]: url }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage(null);

    try {
      const endpoint = `/api/submissions/${phase.toLowerCase()}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: team.id, ...files }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setMessage({ type: 'success', text: data.message || 'Submission successful!' });
      setFiles({});
      router.refresh();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const getRequiredFields = () => {
    if (phase === 'PRELIMINARY') {
      if (team.competitionType === 'SPC') {
        return [
          { key: 'proposalUrl', label: 'Project Proposal (PDF)', accept: '.pdf' },
          { key: 'videoPitchUrl', label: 'Video Pitch (MP4)', accept: '.mp4' },
        ];
      }
      if (team.competitionType === 'NEC') {
        return [
          { key: 'fullPaperUrl', label: 'Full Paper Essay (PDF)', accept: '.pdf' },
          { key: 'posterUrl', label: 'Infographic Poster (PDF/PNG)', accept: '.pdf,.png,.jpg' },
        ];
      }
      return [];
    }
    if (phase === 'SEMIFINAL') {
      return [
        { key: 'fullPaperUrl', label: 'Full Paper (PDF)', accept: '.pdf' },
        { key: 'videoPitchUrl', label: 'Video Pitch (MP4)', accept: '.mp4' },
      ];
    }
    if (phase === 'FINAL') {
      return [
        { key: 'pitchDeckUrl', label: 'Pitch Deck (PDF)', accept: '.pdf' },
        { key: 'videoPitchUrl', label: 'Final Video (MP4)', accept: '.mp4' },
      ];
    }
    return [];
  };

  const fields = getRequiredFields();

  if (team.competitionType === 'OLYMPIAD' && phase === 'PRELIMINARY') {
    return (
      <div className="glass-dark rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-2">Preliminary Phase</h3>
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
          onChange={(e) => setPhase(e.target.value as SubmissionPhase)}
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
      ) : fields.length === 0 ? (
        <p className="text-white/60 text-sm">No submission required for this phase.</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {fields.map((field) => (
              <FileUpload
                key={field.key}
                label={field.label}
                accept={field.accept}
                onUpload={(url) => handleFileUpload(field.key, url)}
              />
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || Object.keys(files).length < fields.length}
            className="btn-glow w-full"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </>
      )}
    </div>
  );
}