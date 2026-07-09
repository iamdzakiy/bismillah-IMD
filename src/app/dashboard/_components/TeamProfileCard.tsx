'use client';

import type { DashboardTeam } from './types';

interface TeamProfileCardProps {
  team: DashboardTeam;
}

export function TeamProfileCard({ team }: TeamProfileCardProps) {
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

  return (
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
        <div className="flex flex-wrap gap-2">
          {team.members.map((member) => (
            <div
              key={member.id}
              className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-sm text-white/70"
            >
              {member.user.name || member.user.email}
              {member.userId === team.captainId && (
                <span className="ml-2 text-xs text-bio-emerald">(Captain)</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}