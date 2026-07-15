'use client';

import { useState } from 'react';
import type { Session } from 'next-auth';
import { FileUpload } from '@/components/FileUpload';

type CompetitionType = 'OLYMPIAD' | 'SPC' | 'NEC';

interface TeamRegistrationFormProps {
  session: Session;
}

const competitionOptions: Record<CompetitionType, string> = {
  OLYMPIAD: 'Microbiology Olympiad (MO)',
  SPC: 'Science Project Competition (SPC)',
  NEC: 'National Essay Competition (NEC)',
};

export function TeamRegistrationForm({ session }: TeamRegistrationFormProps) {
  const educationLevel = session.user.educationLevel;
  
  const availableCompetitions: CompetitionType[] = (() => {
    if (educationLevel === 'SMA') return ['OLYMPIAD', 'SPC'];
    if (educationLevel === 'S1' || educationLevel?.startsWith('S1')) return ['NEC'];
    return [];
  })();

  const [competitionType, setCompetitionType] = useState<CompetitionType>(availableCompetitions[0] || 'OLYMPIAD');
  const [teamName, setTeamName] = useState('');
  const [mergedPdfUrl, setMergedPdfUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const templateLink = competitionType === 'SPC' 
    ? 'https://bit.ly/AbstrakSPCIMD'
    : competitionType === 'NEC'
    ? 'https://bit.ly/AbstrakNECIMD'
    : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    if (!mergedPdfUrl) {
      setMessage({ type: 'error', text: 'Please upload the merged registration document (PDF).' });
      setSubmitting(false);
      return;
    }

    try {
      // Untuk MO: individual, tidak ada members tambahan
      // Untuk SPC: team, tapi cukup 1 file PDF merged dari template
      // Untuk NEC: individual, tidak ada members tambahan
      const members = competitionType === 'SPC' ? [] : [];

      const res = await fetch('/api/competitions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName,
          competitionType,
          members,
          pdfMergeUrl: mergedPdfUrl,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setMessage({ type: 'success', text: data.message || 'Team registered successfully.' });
      setTimeout(() => window.location.reload(), 1500);
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
        <h2 className="text-2xl font-bold mb-2">Register</h2>
        <p className="text-white/60 text-sm">
          {competitionType === 'OLYMPIAD' && 'MO is individual. Upload 1 merged PDF from the registration template.'}
          {competitionType === 'SPC' && 'SPC is a team competition. Upload 1 merged PDF from the abstract template.'}
          {competitionType === 'NEC' && 'NEC is individual. Upload 1 merged PDF from the abstract template.'}
        </p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm ${
          message.type === 'success'
            ? 'bg-green-500/10 border border-green-500/50 text-green-400'
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
        <label className="block text-sm font-medium text-white/70 mb-2">
          {competitionType === 'OLYMPIAD' ? 'Full Name' : 'Team Name'}
        </label>
        <input
          type="text"
          required
          minLength={3}
          maxLength={50}
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="input-glass"
          placeholder={competitionType === 'OLYMPIAD' ? "Enter your full name" : "Enter your team name"}
        />
      </div>

      {/* Captain Info */}
      <div className="glass rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
          {competitionType === 'OLYMPIAD' ? 'Participant' : 'Chairman / Ketua Tim'}
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1">Name</label>
            <input type="text" value={session.user?.name || ''} disabled className="input-glass opacity-60" />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1">Email</label>
            <input type="email" value={session.user?.email || ''} disabled className="input-glass opacity-60" />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1">Institution</label>
            <input type="text" value={session.user?.institution || ''} disabled className="input-glass opacity-60" />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1">Education Level</label>
            <input type="text" value={educationLevel || ''} disabled className="input-glass opacity-60" />
          </div>
        </div>
      </div>

      {/* Upload 1 merged PDF */}
      <div className="glass rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">
          Registration Document (Merged PDF)
        </h3>
        <p className="text-xs text-white/40 mb-3">
          {competitionType === 'OLYMPIAD' && 'Gabungkan semua dokumen registrasi (KTA, bukti bayar, twibbon, dll) menjadi 1 file PDF.'}
          {competitionType === 'SPC' && 'Upload 1 file PDF abstrak menggunakan template resmi.'}
          {competitionType === 'NEC' && 'Upload 1 file PDF abstrak menggunakan template resmi.'}
        </p>
        {templateLink && (
          <a href={templateLink} target="_blank" rel="noopener noreferrer" 
             className="text-xs text-bio-emerald hover:text-emerald-300 underline mb-3 inline-block">
            Download Template →
          </a>
        )}
        <FileUpload 
          label="Upload Merged Registration PDF" 
          accept=".pdf" 
          onUpload={(url) => setMergedPdfUrl(url)} 
        />
      </div>

      <button
        type="submit"
        disabled={submitting || !teamName.trim() || !mergedPdfUrl}
        className="btn-glow w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}