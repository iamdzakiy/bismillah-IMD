// src/app/admin/semifinal/_components/SemifinalRegistrationsTable.tsx
'use client';

import { useState } from 'react';

type Status = 'PENDING' | 'APPROVED' | 'REJECTED';

type Row = {
  id: string;
  status: Status;
  adminNote?: string | null;
  paymentProofUrl?: string | null;
  agreedToTerms?: boolean;
  team: {
    teamName: string;
    competitionType: string;
    captain: { email: string; name?: string | null; institution?: string | null };
    registration?: { currentPhase?: string | null } | null;
  } | null;
};

interface Props {
  registrations: Row[];
}

const statusColors: Record<Status, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-400',
  APPROVED: 'bg-emerald-500/10 text-emerald-400',
  REJECTED: 'bg-red-500/10 text-red-400',
};

export function SemifinalRegistrationsTable({ registrations }: Props) {
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this semifinal re-registration? This unlocks the full paper submission.')) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/semifinal/registration/${id}/approve`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to approve');
      if (!data.emailSent) {
        alert('Approved, but the confirmation email failed to send. Please check SMTP config.');
      }
      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to approve');
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectingId) return;
    if (notes.trim().length < 10) {
      alert('Notes must be at least 10 characters.');
      return;
    }
    setLoadingId(rejectingId);
    try {
      const res = await fetch(`/api/semifinal/registration/${rejectingId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notes.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to reject');
      if (!data.emailSent) {
        alert('Rejected, but the notification email failed to send. Please check SMTP config.');
      }
      setRejectingId(null);
      setNotes('');
      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to reject');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="glass-dark rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px]">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Team</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Competition</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Captain</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Payment Proof</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Status</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((row) => (
              <tr key={row.id} className={`border-t border-white/5 hover:bg-white/5 ${row.status === 'PENDING' ? 'bg-yellow-500/5' : ''}`}>
                <td className="px-4 py-3">
                  <div className="text-white/90 font-medium">{row.team?.teamName || '-'}</div>
                  <div className="text-xs text-white/40">Phase: {row.team?.registration?.currentPhase || '—'}</div>
                </td>
                <td className="px-4 py-3">{row.team?.competitionType || '-'}</td>
                <td className="px-4 py-3">
                  <div className="text-white/80 text-sm">{row.team?.captain.name || row.team?.captain.email}</div>
                  <div className="text-xs text-white/40">{row.team?.captain.email}</div>
                </td>
                <td className="px-4 py-3">
                  {row.paymentProofUrl ? (
                    <a href={row.paymentProofUrl} target="_blank" rel="noreferrer" className="text-xs text-purple-400 hover:underline">
                      View Proof
                    </a>
                  ) : (
                    <span className="text-xs text-white/30">None</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded ${statusColors[row.status]}`}>{row.status}</span>
                </td>
                <td className="px-4 py-3">
                  {row.status === 'PENDING' ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={loadingId === row.id}
                        onClick={() => handleApprove(row.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs rounded"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={loadingId === row.id}
                        onClick={() => setRejectingId(row.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs rounded"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-white/40">{row.adminNote || '—'}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {registrations.length === 0 && (
        <p className="text-center py-8 text-white/40">No semifinal re-registrations yet.</p>
      )}
{rejectingId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-strong rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Reject Re-registration</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide clear rejection notes (min 10 characters)..."
              className="w-full px-4 py-2.5 glass rounded-lg text-white mb-4"
              rows={4}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setRejectingId(null);
                  setNotes('');
                }}
                className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loadingId === rejectingId}
                onClick={handleReject}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg"
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