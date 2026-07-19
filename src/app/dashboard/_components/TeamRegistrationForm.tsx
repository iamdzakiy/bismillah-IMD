'use client';

import { useState } from 'react';
import type { Session } from 'next-auth';
import { FileUpload } from '@/components/FileUpload';
import { SuccessPopup } from '@/components/ui/SuccessPopup';

type CompetitionType = 'OLYMPIAD' | 'SPC' | 'NEC';

interface TeamMember {
  name: string;
  email: string;
  institution: string;
  phone: string;
}

interface TeamRegistrationFormProps {
  session: Session;
}

const competitionOptions: Record<CompetitionType, string> = {
  OLYMPIAD: 'Microbiology Olympiad (MO)',
  SPC: 'Science Project Competition (SPC)',
  NEC: 'National Essay Competition (NEC)',
};

// Template links for each competition
const TEMPLATE_LINKS: Record<CompetitionType, string> = {
  OLYMPIAD: 'https://bit.ly/CompeIMD2026',
  SPC: 'https://bit.ly/CompeIMD2026',
  NEC: 'https://bit.ly/CompeIMD2026',
};

export function TeamRegistrationForm({ session }: TeamRegistrationFormProps) {
  const educationLevel = session.user.educationLevel;
  
  const availableCompetitions: CompetitionType[] = (() => {
    if (educationLevel === 'SMA') return ['OLYMPIAD', 'SPC'];
    if (educationLevel === 'S1 / Diploma' || educationLevel?.startsWith('S1')) return ['NEC'];
    return [];
  })();

  const [competitionType, setCompetitionType] = useState<CompetitionType>(availableCompetitions[0] || 'OLYMPIAD');
  const [teamName, setTeamName] = useState('');
  const [captainPhone, setCaptainPhone] = useState('');
  const [captainAge, setCaptainAge] = useState<number | ''>('');
  const [mergedPdfUrl, setMergedPdfUrl] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Teacher Advisor fields (SPC only)
  const [teacherName, setTeacherName] = useState('');
  const [teacherInstitution, setTeacherInstitution] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPhone, setTeacherPhone] = useState('');

  // SPC Members (1-2 additional members, total 3 including chairman)
  const [members, setMembers] = useState<TeamMember[]>([{
    name: '',
    email: '',
    institution: '',
    phone: '',
  }]);

  const templateLink = TEMPLATE_LINKS[competitionType];
  const isChairmanMode = competitionType === 'SPC' || competitionType === 'NEC'; // Chairman only for SPC and NEC
  const isSPC = competitionType === 'SPC';

  const addMember = () => {
    if (members.length < 2) {
      setMembers([...members, { name: '', email: '', institution: '', phone: '' }]);
    }
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setMembers(updatedMembers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    if (!mergedPdfUrl) {
      setMessage({ type: 'error', text: 'Please upload the merged registration document (PDF).' });
      setSubmitting(false);
      return;
    }

    // Validate age/phone for chairman (SPC/NEC only)
    if (isChairmanMode && (!captainPhone.trim() || !captainAge)) {
      setMessage({ type: 'error', text: 'Nomor telepon dan usia ketua tim wajib diisi untuk SPC/NEC.' });
      setSubmitting(false);
      return;
    }

    // Validate SPC members (need at least 1 member, max 3)
    if (isSPC && members.length < 1) {
      setMessage({ type: 'error', text: 'SPC membutuhkan minimal 1 anggota tim (total 2 orang dengan ketua).' });
      setSubmitting(false);
      return;
    }

    // Validate all SPC members have required fields
    if (isSPC) {
      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        if (!m.name.trim() || !m.email.trim() || !m.institution.trim() || !m.phone.trim()) {
          setMessage({ type: 'error', text: `Data anggota tim #${i + 1} belum lengkap. Harap isi semua field.` });
          setSubmitting(false);
          return;
        }
      }
    }

    try {
      const res = await fetch('/api/competitions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName,
          competitionType,
          members: isSPC ? members.map(m => ({
            name: m.name,
            email: m.email,
            institution: m.institution,
            phone: m.phone,
            age: null,
          })) : [],
          captainPhone: isChairmanMode ? captainPhone : undefined,
          captainAge: isChairmanMode ? captainAge : undefined,
          pdfMergeUrl: mergedPdfUrl,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setSuccessMessage(data.message || 'Team registered successfully!');
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        window.location.reload();
      }, 2500);
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
    <>
      <SuccessPopup 
        isOpen={showSuccess} 
        onClose={() => setShowSuccess(false)} 
        message={successMessage}
      />
      
      <form onSubmit={handleSubmit} className="glass-dark rounded-2xl p-8 space-y-5 text-left">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold mb-2">Register</h2>
          <p className="text-white/60 text-sm">
            {competitionType === 'OLYMPIAD' && 'MO is individual. Upload 1 merged PDF from registration template.'}
            {competitionType === 'SPC' && 'SPC is a team competition (3 members, including chairman). Upload 1 file PDF (max 5MB) dari template Registration Proof.'}
            {competitionType === 'NEC' && 'NEC is individual. Upload 1 file PDF (max 5MB) dari template abstrak.'}
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

        {/* Captain Info - with age/phone for SPC/NEC only */}
        <div className="glass rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
            Chairman / Ketua Tim
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
              <label className="block text-xs font-medium text-white/50 mb-1">Institution / School</label>
              <input type="text" value={session.user?.institution || ''} disabled className="input-glass opacity-60" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1">Education Level</label>
              <input type="text" value={educationLevel || ''} disabled className="input-glass opacity-60" />
            </div>
            
            {/* Phone and Age - Only for SPC/NEC (chairman) */}
            {isChairmanMode && (
              <>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">
                    Nomor Telepon <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={captainPhone}
                    onChange={(e) => setCaptainPhone(e.target.value)}
                    className="input-glass"
                    placeholder="Contoh: 081234567890"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">
                    Usia <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={15}
                    max={30}
                    value={captainAge}
                    onChange={(e) => setCaptainAge(Number(e.target.value) || '')}
                    className="input-glass"
                    placeholder="Contoh: 20"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* SPC Team Members */}
        {isSPC && (
          <div className="glass rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                Anggota Tim ({members.length + 1}/3)
              </h3>
              <button
                type="button"
                onClick={addMember}
                disabled={members.length >= 2}
                className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs rounded-lg transition disabled:opacity-50"
              >
                + Tambah Anggota
              </button>
            </div>
            
            {members.map((member, index) => (
              <div key={index} className="glass rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/60">Anggota #{index + 1}</span>
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="px-2 py-1 text-red-400 hover:text-red-300 text-xs"
                    >
                      Hapus
                    </button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Nama</label>
                    <input
                      type="text"
                      required
                      value={member.name}
                      onChange={(e) => updateMember(index, 'name', e.target.value)}
                      className="input-glass"
                      placeholder="Nama lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={member.email}
                      onChange={(e) => updateMember(index, 'email', e.target.value)}
                      className="input-glass"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Institusi</label>
                    <input
                      type="text"
                      required
                      value={member.institution}
                      onChange={(e) => updateMember(index, 'institution', e.target.value)}
                      className="input-glass"
                      placeholder="Nama sekolah/kampus"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">No. Telepon</label>
                    <input
                      type="tel"
                      required
                      value={member.phone}
                      onChange={(e) => updateMember(index, 'phone', e.target.value)}
                      className="input-glass"
                      placeholder="081234567890"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Teacher Advisor Section - SPC only */}
        {isSPC && (
          <div className="glass rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Guru Pendamping
            </h3>
            <p className="text-xs text-white/40">Data guru pendamping untuk tim SPC Anda.</p>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Nama <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="input-glass"
                  placeholder="Nama lengkap guru"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Institusi <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  value={teacherInstitution}
                  onChange={(e) => setTeacherInstitution(e.target.value)}
                  className="input-glass"
                  placeholder="Nama sekolah"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Email <span className="text-red-400">*</span></label>
                <input
                  type="email"
                  required
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                  className="input-glass"
                  placeholder="guru@sekolah.sch.id"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">No. Telepon <span className="text-red-400">*</span></label>
                <input
                  type="tel"
                  required
                  value={teacherPhone}
                  onChange={(e) => setTeacherPhone(e.target.value)}
                  className="input-glass"
                  placeholder="081234567890"
                />
              </div>
            </div>
          </div>
        )}

        {/* Upload 1 merged PDF */}
        <div className="glass rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">
            Registration Document (Merged PDF)
          </h3>
          <p className="text-xs text-white/40 mb-3">
            {competitionType === 'OLYMPIAD' && 'Gabungkan semua dokumen registrasi (KTA, bukti bayar, twibbon, dll) menjadi 1 file PDF.'}
            {competitionType === 'SPC' && 'Upload 1 file PDF abstrak menggunakan template resmi. Maksimal 5MB.'}
            {competitionType === 'NEC' && 'Upload 1 file PDF abstrak menggunakan template resmi. Maksimal 5MB.'}
          </p>
          {templateLink && (
            <a href={templateLink} target="_blank" rel="noopener noreferrer" 
               className="text-xs text-bio-emerald hover:text-emerald-300 underline mb-3 inline-block">
              📋 Buat salinan dari template: {templateLink}
            </a>
          )}
          <FileUpload 
            label="Upload Merged Registration PDF (Max 5MB)" 
            accept=".pdf" 
            onUpload={(url) => setMergedPdfUrl(url)} 
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !teamName.trim() || !mergedPdfUrl || (isChairmanMode && (!captainPhone.trim() || !captainAge)) || (isSPC && members.some(m => !m.name || !m.email || !m.institution || !m.phone))}
          className="btn-glow w-full disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-transform"
        >
          {submitting ? 'Registering...' : 'Register Team'}
        </button>
      </form>
    </>
  );
}