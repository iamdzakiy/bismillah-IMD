'use client';

import { useMemo, useState } from 'react';
import type { Session } from 'next-auth';
import { FileUpload } from '@/components/FileUpload';

type CompetitionType = 'OLYMPIAD' | 'SPC' | 'NEC';

interface TeamRegistrationFormProps {
  session: Session;
}

const competitionOptions: Record<CompetitionType, string> = {
  OLYMPIAD: 'Microbiology Olympiad',
  SPC: 'Science Project Competition',
  NEC: 'National Essay Competition',
};

function splitEmails(value: string) {
  return value
    .split(/[\n,;]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function TeamRegistrationForm({ session }: TeamRegistrationFormProps) {
  const educationLevel = session.user.educationLevel;
  const availableCompetitions = useMemo<CompetitionType[]>(() => {
    if (educationLevel === 'SMA') return ['OLYMPIAD', 'SPC'];
    if (educationLevel === 'S1') return ['NEC'];
    return [];
  }, [educationLevel]);

  const [competitionType, setCompetitionType] = useState<CompetitionType>(availableCompetitions[0] || 'OLYMPIAD');
  const [teamName, setTeamName] = useState('');
  const [memberEmails, setMemberEmails] = useState('');
  const [ktmUrl, setKtmUrl] = useState('');
  const [pdfMergeUrl, setPdfMergeUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isTeamCompetition = competitionType === 'SPC' || competitionType === 'NEC';
  const helperText = competitionType === 'SPC'
    ? 'Enter 1-3 additional registered and verified SMA member emails. Total team size must be 2-4.'
    : competitionType === 'NEC'
      ? 'Optional: enter 1 additional registered and verified S1 author email. Total authors must be 1-2.'
      : 'Olympiad is individual. Do not add member emails.';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/competitions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName,
          competitionType,
          memberEmails: splitEmails(memberEmails),
          ktmUrl: ktmUrl || undefined,
          pdfMergeUrl: pdfMergeUrl || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setMessage({ type: 'success', text: data.message || 'Team registered successfully.' });
      window.location.reload();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Registration failed' });
    } finally {
      setSubmitting(false);
    }
  };

  if (availableCompetitions.length === 0) {
    return (
      <div className="glass-dark rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">No Eligible Competition</h2>
        <p className="text-white/60 text-sm">
          Your account education level is not eligible for the currently configured competitions.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-dark rounded-2xl p-8 space-y-5 text-left">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold mb-2">Register a Team</h2>
        <p className="text-white/60 text-sm">Create your competition team and upload the required registration documents.</p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm ${
          message.type === 'success'
            ? 'bg-bio-emerald/10 border border-bio-emerald/50 text-bio-emerald'
            : 'bg-red-500/10 border border-red-500/50 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">Competition</label>
        <select
          value={competitionType}
          onChange={(e) => setCompetitionType(e.target.value as CompetitionType)}
          className="input-glass"
        >
          {availableCompetitions.map((option) => (
            <option key={option} value={option}>{competitionOptions[option]}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">Team Name</label>
        <input
          type="text"
          required
          minLength={3}
          maxLength={50}
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="input-glass"
          placeholder="Enter your team name"
        />
      </div>

      {isTeamCompetition && (
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Member Emails</label>
          <textarea
            value={memberEmails}
            onChange={(e) => setMemberEmails(e.target.value)}
            className="input-glass min-h-[100px]"
            placeholder="member1@example.com, member2@example.com"
          />
          <p className="text-xs text-white/40 mt-2">{helperText}</p>
        </div>
      )}

      {!isTeamCompetition && (
        <p className="text-xs text-white/40">{helperText}</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <FileUpload label="Student Card / KTM" accept=".pdf,.png,.jpg,.jpeg" onUpload={setKtmUrl} />
        <FileUpload label="Merged Registration PDF" accept=".pdf" onUpload={setPdfMergeUrl} />
      </div>

      <button type="submit" disabled={submitting || !teamName.trim()} className="btn-glow w-full disabled:opacity-50 disabled:cursor-not-allowed">
        {submitting ? 'Registering...' : 'Register Team'}
      </button>
    </form>
  );
}
