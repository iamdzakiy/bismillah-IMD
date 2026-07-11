'use client';

import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { TeamProfileCard } from './TeamProfileCard';
import { SubmissionForm } from './SubmissionForm';
import { StatusBanner } from './StatusBanner';
import { TeamRegistrationForm } from './TeamRegistrationForm';
import type { DashboardTeam } from './types';

interface DashboardClientProps {
  session: Session;
  teams: DashboardTeam[];
}

export function DashboardClient({ session, teams }: DashboardClientProps) {
  return (
    <div className="min-h-screen bg-[#0a0514] text-white">
      <nav className="border-b border-purple-500/10 bg-[#130c24]/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-lg sm:text-xl font-bold text-gradient">
            IMD 2026
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-xs sm:text-sm text-white/60 hidden md:block">{session.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-3 sm:px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs sm:text-sm font-medium rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <StatusBanner active={session.user.active} />

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">
            Welcome, {session.user?.name || 'Participant'}!
          </h1>
          <p className="text-white/60 text-sm sm:text-base">Manage your team and track your competition progress.</p>
        </div>

        {teams.length === 0 ? (
          <div className="glass-dark rounded-2xl p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl sm:text-4xl">🧬</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">No Team Yet</h2>
            <p className="text-white/60 mb-6 text-sm sm:text-base">
              Register for a competition to start your microbial odyssey!
            </p>
            <TeamRegistrationForm session={session} />
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {teams.map((team) => (
              <div key={team.id} className="space-y-4 sm:space-y-6">
                <TeamProfileCard team={team} />
                <SubmissionForm team={team} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
