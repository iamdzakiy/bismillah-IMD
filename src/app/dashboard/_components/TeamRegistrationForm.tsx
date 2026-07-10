'use client';

import { useState } from 'react';
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

interface MemberEntry {
  name: string;
  email: string;
  institution: string;
  phone: string;
  age: string;
  studentProof: string;
}

function emptyMember(): MemberEntry {
  return { name: '', email: '', institution: '', phone: '', age: '', studentProof: '' };
}

export function TeamRegistrationForm({ session }: TeamRegistrationFormProps) {
  const educationLevel = session.user.educationLevel;
  const availableCompetitions: CompetitionType[] = (() => {
    if (educationLevel === 'SMA') return ['OLYMPIAD', 'SPC'];
    if (educationLevel === 'S1') return ['NEC'];
    return [];
  })();

  const [competitionType, setCompetitionType] = useState<CompetitionType>(availableCompetitions[0] || 'OLYMPIAD');
  const [teamName, setTeamName] = useState('');
  const [paymentProof, setPaymentProof] = useState('');
  const [ktmUrl, setKtmUrl] = useState('');
  const [pdfMergeUrl, setPdfMergeUrl] = useState('');
  const [members, setMembers] = useState<MemberEntry[]>([emptyMember()]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isTeamCompetition = competitionType === 'SPC' || competitionType === 'NEC';
  const needsPaymentProof = competitionType === 'OLYMPIAD';

  const getMaxMembers = () => {
    if (competitionType === 'OLYMPIAD') return 1;
    if (competitionType === 'SPC') return 4;
    if (competitionType === 'NEC') return 2;
    return 1;
  };

  const maxMembers = getMaxMembers();

  const updateMember = (index: number, field: keyof MemberEntry, value: string) => {
    const updated = members.map((m, i) => (i === index ? { ...m, [field]: value } : m));
    setMembers(updated);
  };

  const addMember = () => {
    if (members.length < maxMembers) {
      setMembers([...members, emptyMember()]);
    }
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

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
          members: members.slice(0, maxMembers).map((m) => ({
            name: m.name,
            email: m.email,
            institution: m.institution,
            phone: m.phone,
            age: m.age ? parseInt(m.age) : null,
            studentProofUrl: m.studentProof || undefined,
          })),
          ktmUrl: ktmUrl || undefined,
          pdfMergeUrl: pdfMergeUrl || undefined,
          paymentProofUrl: paymentProof || undefined,
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
        <p className="text-white/60 text-sm">Create your competition team and upload required documents.</p>
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
          onChange={(e) => {
            const newType = e.target.value as CompetitionType;
            setCompetitionType(newType);
            // Reset members for new competition type
            const newMax = newType === 'OLYMPIAD' ? 1 : newType === 'SPC' ? 4 : 2;
            setMembers(Array(newMax).fill(null).map(() => emptyMember()).slice(0, newMax));
          }}
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

      {/* Captain Info (auto-filled from session) */}
      <div className="glass rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Chairman / Ketua Tim</h3>
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

      {/* Members */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
          Team Members ({members.length}/{maxMembers})
        </h3>

        {members.map((member, index) => (
          <div key={index} className="glass rounded-xl p-4 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40 uppercase">Member {index + 1}</span>
              {members.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMember(index)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={member.name}
                  onChange={(e) => updateMember(index, 'name', e.target.value)}
                  className="input-glass text-sm"
                  placeholder="Member name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={member.email}
                  onChange={(e) => updateMember(index, 'email', e.target.value)}
                  className="input-glass text-sm"
                  placeholder="member@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Institution *</label>
                <input
                  type="text"
                  required
                  value={member.institution}
                  onChange={(e) => updateMember(index, 'institution', e.target.value)}
                  className="input-glass text-sm"
                  placeholder="e.g. SMA N 1 Bandung"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={member.phone}
                  onChange={(e) => updateMember(index, 'phone', e.target.value)}
                  className="input-glass text-sm"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Age *</label>
                <input
                  type="number"
                  required
                  min={10}
                  max={99}
                  value={member.age}
                  onChange={(e) => updateMember(index, 'age', e.target.value)}
                  className="input-glass text-sm"
                  placeholder="18"
                />
              </div>
              <div className="md:col-span-2">
                <FileUpload label={`Student Proof / KTM (Member ${index + 1})`} accept=".pdf,.png,.jpg,.jpeg" onUpload={(url) => updateMember(index, 'studentProof', url)} />
              </div>
            </div>
          </div>
        ))}

        {members.length < maxMembers && (
          <button
            type="button"
            onClick={addMember}
            className="btn-glass w-full text-sm"
          >
            + Add Member
          </button>
        )}
      </div>

      {/* Payment Proof (only for Olympiad) */}
      {needsPaymentProof && (
        <div className="glass rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">Payment Proof</h3>
          <p className="text-xs text-white/40 mb-3">Required for Olympiad registration</p>
          <FileUpload label="Upload Payment Proof" accept=".pdf,.png,.jpg,.jpeg" onUpload={setPaymentProof} />
        </div>
      )}

      {/* Additional Documents */}
      <div className="grid md:grid-cols-2 gap-4">
        <FileUpload label="Chairman Student Card / KTM" accept=".pdf,.png,.jpg,.jpeg" onUpload={setKtmUrl} />
        <FileUpload label="Merged Registration PDF" accept=".pdf" onUpload={setPdfMergeUrl} />
      </div>

      <button
        type="submit"
        disabled={submitting || !teamName.trim()}
        className="btn-glow w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Registering...' : 'Register Team'}
      </button>
    </form>
  );
}