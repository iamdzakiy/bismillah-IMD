'use client';

import { useState } from 'react';

type RegistrationStatus =
  | 'PENDING_DOCS'
  | 'DOCUMENT_SUBMITTED'
  | 'DOCUMENT_APPROVED'
  | 'DOCUMENT_REJECTED'
  | 'REGISTERED';

type RegistrationRow = {
  id: string;
  status: RegistrationStatus;
  adminNote?: string | null;
  ktmUrl?: string | null;
  pdfMergeUrl?: string | null;
  team: {
    teamName: string;
    competitionType: string;
    captain: { email: string; name?: string | null };
    members: { id: string }[];
  } | null;
};

interface RegistrationsTableProps {
  registrations: RegistrationRow[];
}

const statusColors: Record<RegistrationStatus, string> = {
  PENDING_DOCS: 'bg-yellow-500/10 text-yellow-400',
  DOCUMENT_SUBMITTED: 'bg-blue-500/10 text-blue-400',
  DOCUMENT_APPROVED: 'bg-emerald-500/10 text-emerald-400',
  DOCUMENT_REJECTED: 'bg-red-500/10 text-red-400',
  REGISTERED: 'bg-green-500/10 text-green-400',
};

function formatStatus(status: string) {
  return status.replaceAll('_', ' ');
}

export function RegistrationsTable({ registrations }: RegistrationsTableProps) {
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this registration document?')) return;
    setLoadingId(id);

    try {
      const res = await fetch(`/api/admin/registrations/${id}/approve`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to approve registration');
      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to approve registration');
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (notes.trim().length < 10) {
      alert('Notes must be at least 10 characters.');
      return;
    }

    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notes.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to reject registration');

      setRejectingId(null);
      setNotes('');
      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to reject registration');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="glass-dark rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Team Name</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Competition</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Captain</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Members</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Docs</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Status</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => (
              <tr key={reg.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 text-white font-medium">{reg.team?.teamName || 'N/A'}</td>
                <td className="px-4 py-3 text-white/70">{reg.team?.competitionType || 'N/A'}</td>
                <td className="px-4 py-3 text-white/70">{reg.team?.captain?.email || 'N/A'}</td>
                <td className="px-4 py-3 text-white/70">{reg.team?.members?.length || 0}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {reg.ktmUrl && (
                      <a href={reg.ktmUrl} target="_blank" rel="noreferrer" className="text-xs text-bio-cyan hover:underline">
                        Student Card
                      </a>
                    )}
                    {reg.pdfMergeUrl && (
                      <a href={reg.pdfMergeUrl} target="_blank" rel="noreferrer" className="text-xs text-bio-cyan hover:underline">
                        Merged PDF
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded ${statusColors[reg.status]}`}>
                    {formatStatus(reg.status)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {reg.status === 'DOCUMENT_SUBMITTED' ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={loadingId === reg.id}
                        onClick={() => handleApprove(reg.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs rounded"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={loadingId === reg.id}
                        onClick={() => setRejectingId(reg.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs rounded"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-white/40">{reg.adminNote || '—'}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {registrations.length === 0 && (
        <p className="text-center py-8 text-white/40">No registrations yet.</p>
      )}

      {rejectingId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-strong rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Reject Registration</h3>
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
                onClick={() => handleReject(rejectingId)}
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
