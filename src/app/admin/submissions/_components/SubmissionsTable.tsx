'use client';

import { useState } from 'react';

interface SubmissionsTableProps {
  submissions: any[];
}

export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this submission?')) return;
    const res = await fetch(`/api/admin/submissions/${id}/approve`, { method: 'POST' });
    if (res.ok) {
      window.location.reload();
    } else {
      alert('Failed to approve');
    }
  };

  const handleReject = async (id: string) => {
    if (!notes || notes.length < 10) {
      alert('Notes must be at least 10 characters');
      return;
    }
    const res = await fetch(`/api/admin/submissions/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    if (res.ok) {
      setRejectingId(null);
      setNotes('');
      window.location.reload();
    } else {
      alert('Failed to reject');
    }
  };

  const statusColors = {
    PENDING: 'bg-yellow-500/10 text-yellow-400',
    APPROVED: 'bg-emerald-500/10 text-emerald-400',
    REJECTED: 'bg-red-500/10 text-red-400',
  };

  return (
    <div className="glass-dark rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-white/5">
          <tr>
            <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Team</th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Competition</th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Files</th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Status</th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <tr key={sub.id} className="border-t border-white/5 hover:bg-white/5">
              <td className="px-4 py-3">
                <div>
                  <p className="text-white font-medium">{sub.team.teamName}</p>
                  <p className="text-xs text-white/40">{sub.team.captain.email}</p>
                </div>
              </td>
              <td className="px-4 py-3 text-white/70">{sub.team.competitionType}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {sub.proposalUrl && (
                    <a href={sub.proposalUrl} target="_blank" className="text-xs text-bio-cyan hover:underline">
                      Proposal
                    </a>
                  )}
                  {sub.fullPaperUrl && (
                    <a href={sub.fullPaperUrl} target="_blank" className="text-xs text-bio-cyan hover:underline">
                      Paper
                    </a>
                  )}
                  {sub.videoPitchUrl && (
                    <a href={sub.videoPitchUrl} target="_blank" className="text-xs text-bio-cyan hover:underline">
                      Video
                    </a>
                  )}
                  {sub.posterUrl && (
                    <a href={sub.posterUrl} target="_blank" className="text-xs text-bio-cyan hover:underline">
                      Poster
                    </a>
                  )}
                  {sub.pitchDeckUrl && (
                    <a href={sub.pitchDeckUrl} target="_blank" className="text-xs text-bio-cyan hover:underline">
                      Deck
                    </a>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded ${statusColors[sub.status as keyof typeof statusColors]}`}>
                  {sub.status}
                </span>
              </td>
              <td className="px-4 py-3">
                {sub.status === 'PENDING' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(sub.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setRejectingId(sub.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-white/40">{sub.notes || '—'}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {submissions.length === 0 && (
        <p className="text-center py-8 text-white/40">No submissions yet.</p>
      )}

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-strong rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Reject Submission</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide detailed feedback (min 10 characters)..."
              className="w-full px-4 py-2.5 glass rounded-lg text-white mb-4"
              rows={4}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setRejectingId(null)}
                className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectingId)}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}