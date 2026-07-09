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
    <div className="min-h-screen bg-space-900 text-white">
      <nav className="border-b border-space-700 bg-space-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gradient">
            IMD 2026
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60 hidden sm:block">{session.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <StatusBanner active={session.user.active} />

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome, {session.user?.name || 'Participant'}!
          </h1>
          <p className="text-white/60">Manage your team and track your competition progress.</p>
        </div>

        {teams.length === 0 ? (
          <div className="glass-dark rounded-2xl p-12 text-center">
            <div className="w-20 h-20 mx-auto bg-bio-emerald/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-bio-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">No Team Yet</h2>
            <p className="text-white/60 mb-6">
              Register for a competition to start your microbial odyssey!
            </p>
            <TeamRegistrationForm session={session} />
          </div>
        ) : (
          <div className="space-y-8">
            {teams.map((team) => (
              <div key={team.id} className="space-y-6">
                <TeamProfileCard team={team} />
                <SubmissionForm team={team} />
              </div>
            ))}

            <details className="glass-dark rounded-2xl p-6">
              <summary className="cursor-pointer text-lg font-semibold text-white">
                Register for another eligible competition
              </summary>
              <div className="mt-6">
                <TeamRegistrationForm session={session} />
              </div>
            </details>
          </div>
        )}
      </main>
    </div>
  );
}