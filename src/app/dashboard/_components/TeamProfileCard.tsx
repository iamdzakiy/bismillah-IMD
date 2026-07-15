'use client';

import { useState } from 'react';
import type { DashboardTeam } from './types';

interface TeamProfileCardProps {
  team: DashboardTeam;
}

export function TeamProfileCard({ team }: TeamProfileCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const competitionLabels = {
    OLYMPIAD: 'Microbiology Olympiad',
    SPC: 'Science Project Competition',
    NEC: 'National Essay Competition',
  };

  const phaseColors = {
    PRELIMINARY: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    SEMIFINAL: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    FINAL: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  };

  const statusLabels = {
    PENDING_DOCS: 'Pending Documents',
    DOCUMENT_SUBMITTED: 'Documents Submitted',
    DOCUMENT_APPROVED: 'Approved',
    DOCUMENT_REJECTED: 'Rejected',
    REGISTERED: 'Registered',
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus akun? Semua data tim dan submission akan dihapus secara permanen.')) {
      return;
    }
    
    setDeleting(true);
    try {
      const res = await fetch('/api/account/delete', { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus akun');
      
      alert('Akun berhasil dihapus. Anda akan dialihkan ke halaman utama.');
      window.location.href = '/';
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal menghapus akun');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="glass-dark rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">{team.teamName}</h2>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${phaseColors[team.registration?.currentPhase as keyof typeof phaseColors]}`}>
                {team.registration?.currentPhase}
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/5 border border-white/10">
                {statusLabels[team.registration?.status as keyof typeof statusLabels] || team.registration?.status}
              </span>
            </div>
            <p className="text-white/60 text-sm">
              {competitionLabels[team.competitionType as keyof typeof competitionLabels]}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40 uppercase tracking-wider">Team Captain</p>
            <p className="text-white/70 font-medium">{team.captain.name}</p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Team Members</p>
          <div className="space-y-3">
            {team.members.map((member) => (
              <div
                key={member.id}
                className="glass rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white/80">
                      {member.user.name || member.user.email}
                    </span>
                    {member.user.role === 'CHAIRMAN' && (
                      <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">
                        Chairman
                      </span>
                    )}
                    {member.user.role === 'MEMBER' && (
                      <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        Member
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-white/50">
                  <div>
                    <span className="block text-white/30">Email</span>
                    {member.user.email}
                  </div>
                  <div>
                    <span className="block text-white/30">Institution</span>
                    {member.user.institution || '-'}
                  </div>
                  <div>
                    <span className="block text-white/30">Phone</span>
                    {member.user.phone || '-'}
                  </div>
                  <div>
                    <span className="block text-white/30">Age</span>
                    {member.user.age ?? '-'}
                  </div>
                </div>
                {member.user.studentProofUrl && (
                  <div className="mt-2">
                    <a
                      href={member.user.studentProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-purple-400 hover:text-purple-300 underline"
                    >
                      View Student Proof / KTM
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Delete Account Button */}
        <div className="mt-6 pt-4 border-t border-white/5">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition"
          >
            🗑️ Hapus Akun
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-strong rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">⚠️ Konfirmasi Hapus Akun</h3>
            <p className="text-white/70 mb-6">
              Menghapus akun akan menghapus semua data tim, submission, dan registrasi Anda secara permanen. 
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg"
              >
                {deleting ? 'Menghapus...' : 'Hapus Akun'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}