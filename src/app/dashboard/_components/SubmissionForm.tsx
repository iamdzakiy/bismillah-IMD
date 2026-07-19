'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/FileUpload';
import { SuccessPopup } from '@/components/ui/SuccessPopup';
import { MascotDecoration } from '@/components/ui/MascotDecoration';
import type { DashboardTeam, SubmissionPhase } from './types';

interface SubmissionFormProps {
  team: DashboardTeam;
}

const TEMPLATE_LINKS: Record<string, string> = {
  'SPC_PRELIMINARY': 'https://bit.ly/AbstrakSPCIMD',
  'NEC_PRELIMINARY': 'https://bit.ly/CompeIMD2026',
};

export function SubmissionForm({ team }: SubmissionFormProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<SubmissionPhase>('PRELIMINARY');
  const [fileUrl, setFileUrl] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check if preliminary submission is approved (needed for semifinal re-registration)
  const preliminarySubmission = team.submissions?.find((s) => s.phase === 'PRELIMINARY');
  const isPreliminaryApproved = preliminarySubmission?.status === 'APPROVED';
  
  // Check if registration is rejected (allow re-upload)
  const isRejected = team.registration?.status === 'DOCUMENT_REJECTED';
  const isPendingOrRejected = team.registration?.status === 'PENDING_DOCS' || isRejected;
  
  // Re-registration form state (for SPC/NEC semifinal)
  const [reregTeamName, setReregTeamName] = useState(team.teamName);
  const [reregPdfUrl, setReregPdfUrl] = useState('');
  const [showReregForm, setShowReregForm] = useState(false);

  const existingSubmission = team.submissions?.find((submission) => submission.phase === phase);

  const handleSubmit = async () => {
    if (!team.id) {
      setMessage({ type: 'error', text: 'Team ID not found. Please try again.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const endpoint = `/api/submissions/${phase.toLowerCase()}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: team.id, fileUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setSuccessMessage(data.message || 'Submission successful! 🎉');
      setShowSuccess(true);
      setFileUrl('');
      
      setTimeout(() => {
        setShowSuccess(false);
        router.refresh();
      }, 2500);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle re-registration submission for semifinal
  const handleReregSubmit = async () => {
    if (!team.registration?.id) return;
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/registrations/${team.registration.id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfMergeUrl: reregPdfUrl,
          status: 'DOCUMENT_SUBMITTED',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Re-registration failed');

      setSuccessMessage('Re-registration successful! Please wait for approval. 🎉');
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        router.refresh();
      }, 2500);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Re-registration failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const getUploadConfig = () => {
    if (phase === 'PRELIMINARY') {
      if (team.competitionType === 'SPC') {
        return { label: 'Project Proposal (PDF) - Gunakan template resmi', accept: '.pdf' };
      }
      if (team.competitionType === 'NEC') {
        return { label: 'Full Paper Essay (PDF) - Gunakan template resmi', accept: '.pdf' };
      }
      if (team.competitionType === 'OLYMPIAD') {
        return null; // Exam-based, no file upload
      }
    }
    if (phase === 'SEMIFINAL') {
      return { label: 'Full Paper (PDF)', accept: '.pdf' };
    }
    if (phase === 'FINAL') {
      return { label: 'Pitch Deck / Final Submission (PDF)', accept: '.pdf' };
    }
    return null;
  };

  const getTemplateLink = () => {
    if (phase === 'PRELIMINARY' && team.competitionType === 'SPC') {
      return TEMPLATE_LINKS['SPC_PRELIMINARY'];
    }
    if (phase === 'PRELIMINARY' && team.competitionType === 'NEC') {
      return TEMPLATE_LINKS['NEC_PRELIMINARY'];
    }
    return '';
  };

  const uploadConfig = getUploadConfig();
  const templateLink = getTemplateLink();

  // MO - show Edmodo info after approval instead of file upload
  if (team.competitionType === 'OLYMPIAD') {
    if (team.registration?.status !== 'DOCUMENT_APPROVED') {
      return (
        <div className="glass-dark rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-2">🔬 Microbiology Olympiad (MO)</h3>
          <p className="text-white/60 text-sm mb-4">
            {isRejected 
              ? 'Your registration was rejected. Please re-upload your documents below.' 
              : 'Your documents have not been approved yet. Please wait for admin approval.'}
          </p>
          
          {isRejected && (
            <div className="glass rounded-xl p-4 space-y-3">
              <p className="text-xs text-white/40 mb-2">
                Buat salinan dari template: <a href="https://bit.ly/CompeIMD2026" target="_blank" rel="noopener noreferrer" className="text-bio-emerald hover:underline">https://bit.ly/CompeIMD2026</a>
              </p>
              <FileUpload
                label="Re-upload Registration PDF (Max 5MB)"
                accept=".pdf"
                onUpload={(url) => setFileUrl(url)}
              />
              <button
                onClick={async () => {
                  if (team.registration?.id && fileUrl) {
                    setSubmitting(true);
                    try {
                      const res = await fetch(`/api/registrations/${team.registration.id}/update`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ pdfMergeUrl: fileUrl, status: 'DOCUMENT_SUBMITTED' }),
                      });
                      if (res.ok) {
                        setSuccessMessage('Dokumen berhasil diupload ulang! Menunggu persetujuan admin.');
                        setShowSuccess(true);
                        setTimeout(() => {
                          setShowSuccess(false);
                          router.refresh();
                        }, 2500);
                      }
                    } catch (err) {
                      setMessage({ type: 'error', text: 'Gagal mengupload dokumen' });
                    } finally {
                      setSubmitting(false);
                    }
                  }
                }}
                disabled={submitting || !fileUrl}
                className="btn-glow w-full disabled:opacity-50"
              >
                {submitting ? 'Mengirim...' : 'Kirim Ulang Dokumen'}
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="glass-dark rounded-2xl p-6 space-y-4">
        <h3 className="text-xl font-bold mb-2">✅ Registrasi Disetujui - MO</h3>
        
        <SuccessPopup isOpen={showSuccess} onClose={() => setShowSuccess(false)} message={successMessage} />
        
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <h4 className="text-emerald-400 font-semibold mb-2">📋 Informasi Akses Edmodo</h4>
          <p className="text-white/70 text-sm mb-3">
            Babak penyisihan MO dilakukan melalui <strong>Edmodo</strong>. 
            Kredensial akun Anda akan dikirim ke email terdaftar.
          </p>
          <div className="bg-black/30 rounded-lg p-3 space-y-2 text-sm">
            <p className="text-white/60">
              <span className="text-white/80 font-medium">Platform:</span> Edmodo
            </p>
            <p className="text-white/60">
              <span className="text-white/80 font-medium">Tanggal Exam:</span> 17 Oktober 2026
            </p>
            <p className="text-white/60">
              <span className="text-white/80 font-medium">Durasi:</span> 120 menit
            </p>
            <p className="text-white/60">
              <span className="text-white/80 font-medium">Format:</span> 35 soal True/False
            </p>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <h4 className="text-blue-400 font-semibold mb-2">📖 Panduan Edmodo 101</h4>
          <ol className="text-white/70 text-sm space-y-2 list-decimal list-inside">
            <li>Periksa email untuk kredensial login Edmodo (username & password)</li>
            <li>Kunjungi <a href="https://edmodo.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">edmodo.com</a> dan masuk</li>
            <li>Gabungkan grup MO 2026 menggunakan kode yang diberikan di email</li>
            <li>Ujian akan tersedia di bagian "Assignments"</li>
            <li>Kirim jawaban sebelum waktu habis</li>
            <li>Hubungi panitia jika belum menerima email dalam 24 jam</li>
          </ol>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Catatan Penting</h4>
          <ul className="text-white/70 text-sm space-y-1 list-disc list-inside">
            <li>Ikuti Technical Meeting pada 3-4 Oktober 2026</li>
            <li>Uji akses Edmodo sebelum hari exam</li>
            <li>Gunakan koneksi internet yang stabil saat exam</li>
            <li>Untuk masalah teknis, hubungi grup WhatsApp panitia</li>
          </ul>
        </div>
      </div>
    );
  }

  // Check if registration is rejected - show re-upload option
  if (isRejected) {
    return (
      <div className="glass-dark rounded-2xl p-6 space-y-4">
        <SuccessPopup isOpen={showSuccess} onClose={() => setShowSuccess(false)} message={successMessage} />
        
        <h3 className="text-xl font-bold mb-2">📝 Registrasi Ditolak - Upload Ulang</h3>
        <p className="text-white/60 text-sm mb-4">
          Registrasi tim Anda ditolak. Silakan perbaiki dan upload dokumen kembali.
        </p>
        
        {team.registration?.adminNote && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-xs font-medium">Catatan Admin:</p>
            <p className="text-white/70 text-sm mt-1">{team.registration.adminNote}</p>
          </div>
        )}
        
        <div className="glass rounded-xl p-4 space-y-3">
          <p className="text-xs text-white/40 mb-2">
            Buat salinan dari template: <a href={templateLink || 'https://bit.ly/CompeIMD2026'} target="_blank" rel="noopener noreferrer" className="text-bio-emerald hover:underline">Template Registration</a>
          </p>
          <FileUpload
            label="Upload Registration PDF (Max 5MB)"
            accept=".pdf"
            onUpload={(url) => setReregPdfUrl(url)}
          />
          <button
            onClick={handleReregSubmit}
            disabled={submitting || !reregPdfUrl}
            className="btn-glow w-full disabled:opacity-50 transform hover:scale-105 transition-transform"
          >
            {submitting ? 'Mengirim...' : 'Kirim Ulang Registrasi'}
          </button>
        </div>
      </div>
    );
  }

  // Check if registration is still pending
  if (isPendingOrRejected && !isRejected) {
    return (
      <div className="glass-dark rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-2">⏳ Menunggu Persetujuan</h3>
        <p className="text-white/60 text-sm">
          Dokumen registrasi tim belum disetujui oleh admin. Silakan tunggu persetujuan sebelum mengumpulkan submission.
        </p>
      </div>
    );
  }

  // Re-registration form for semifinal (only for SPC/NEC teams that passed preliminary)
  if (showReregForm) {
    return (
      <>
        <SuccessPopup isOpen={showSuccess} onClose={() => setShowSuccess(false)} message={successMessage} />
        
        <div className="glass-dark rounded-2xl p-6 space-y-4">
          <h3 className="text-xl font-bold mb-2">🔄 Re-registrasi Semifinal</h3>
          <p className="text-white/60 text-sm mb-4">
            Selamat! Tim Anda lolos ke babak semifinal. Silakan melakukan re-registrasi.
          </p>
          
          <div className="glass rounded-xl p-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1">Team Name</label>
              <input
                type="text"
                value={reregTeamName}
                onChange={(e) => setReregTeamName(e.target.value)}
                disabled
                className="input-glass opacity-60"
              />
            </div>
            
            <p className="text-xs text-white/40">
              Template: <a href="https://bit.ly/CompeIMD2026" target="_blank" rel="noopener noreferrer" className="text-bio-emerald hover:underline">bit.ly/CompeIMD2026</a>
            </p>
            
            <FileUpload
              label="Upload Re-registration PDF (Max 5MB)"
              accept=".pdf"
              onUpload={(url) => setReregPdfUrl(url)}
            />
            
            <button
              onClick={handleReregSubmit}
              disabled={submitting || !reregPdfUrl}
              className="btn-glow w-full disabled:opacity-50 transform hover:scale-105 transition-transform"
            >
              {submitting ? 'Mengirim...' : 'Kirim Re-registrasi'}
            </button>
            
            <button
              onClick={() => setShowReregForm(false)}
              className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm"
            >
              Batal
            </button>
          </div>
        </div>
      </>
    );
  }

  // Show success message after preliminary approval for SPC/NEC
  if (isPreliminaryApproved && (team.competitionType === 'SPC' || team.competitionType === 'NEC')) {
    return (
      <div className="glass-dark rounded-2xl p-6 space-y-4">
        <SuccessPopup isOpen={showSuccess} onClose={() => setShowSuccess(false)} message={successMessage} />
        
        <div className="text-center">
          <MascotDecoration count={1} size="lg" />
          <h3 className="text-2xl font-bold text-bio-emerald mb-2">🎉 Selamat! Lolos ke Semifinal!</h3>
          <p className="text-white/70">Tim Anda berhasil lolos ke babak semifinal.</p>
        </div>
        
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 space-y-3">
          <h4 className="text-emerald-400 font-semibold">📋 Langkah Selanjutnya</h4>
          <ol className="text-white/70 text-sm space-y-2 list-decimal list-inside">
            <li>Lakukan re-registrasi untuk babak semifinal</li>
            <li>Siap untuk pengumpulan full paper/submission semifinal</li>
            <li>Ikuti technical meeting babak semifinal</li>
          </ol>
        </div>
        
        <button
          onClick={() => setShowReregForm(true)}
          className="btn-glow w-full transform hover:scale-105 transition-transform"
        >
          Mulai Re-registrasi Semifinal
        </button>
      </div>
    );
  }

  return (
    <div className="glass-dark rounded-2xl p-6">
      <SuccessPopup isOpen={showSuccess} onClose={() => setShowSuccess(false)} message={successMessage} />
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">📤 Kumpulkan Karya</h3>
        <select
          value={phase}
          onChange={(e) => { setPhase(e.target.value as SubmissionPhase); setFileUrl(''); }}
          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
        >
          <option value="PRELIMINARY">Preliminary</option>
          <option value="SEMIFINAL">Semifinal</option>
          <option value="FINAL">Final</option>
        </select>
      </div>

      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-bio-emerald/10 border border-bio-emerald/50 text-bio-emerald'
              : 'bg-red-500/10 border border-red-500/50 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {existingSubmission ? (
        <div className="bg-white/5 border border-white/5 rounded-lg p-4">
          <p className="text-sm text-white/70">
            ✅ Anda sudah mengumpulkan untuk fase ini.
          </p>
          <p className="text-xs text-white/40 mt-1">
            Status: <span className="font-semibold text-bio-emerald">{existingSubmission.status}</span>
          </p>
          {existingSubmission.status === 'REJECTED' && (
            <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
              {existingSubmission.notes && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-xs font-medium">Catatan Admin:</p>
                  <p className="text-white/70 text-sm mt-1">{existingSubmission.notes}</p>
                </div>
              )}
              <p className="text-xs text-yellow-400">Submission ditolak - Anda dapat mengupload ulang:</p>
              <FileUpload
                label="Upload Ulang (Max 5MB)"
                accept=".pdf"
                onUpload={(url) => {
                  setFileUrl(url);
                  handleSubmit();
                }}
              />
            </div>
          )}
        </div>
      ) : !uploadConfig ? (
        <p className="text-white/60 text-sm">Tidak ada submission yang diperlukan untuk fase ini.</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            <p className="text-xs text-white/40">
              {team.competitionType === 'SPC' && phase === 'PRELIMINARY' && 'Upload 1 file PDF (Proposal) menggunakan template resmi yang disediakan panitia.'}
              {team.competitionType === 'NEC' && phase === 'PRELIMINARY' && 'Upload 1 file PDF (Full Paper/Essay) menggunakan template resmi yang disediakan panitia.'}
              {team.competitionType === 'SPC' && phase === 'SEMIFINAL' && 'Upload 1 file PDF (Full Paper) untuk babak semifinal.'}
              {team.competitionType === 'NEC' && phase === 'SEMIFINAL' && 'Upload 1 file PDF (Full Paper) untuk babak semifinal.'}
              {phase === 'FINAL' && 'Upload 1 file PDF untuk babak final.'}
            </p>
            
            {templateLink && (
              <a href={templateLink} target="_blank" rel="noopener noreferrer" 
                 className="text-xs text-bio-emerald hover:text-emerald-300 underline mb-3 inline-block">
                📋 Buat salinan dari template →
              </a>
            )}
            
            <FileUpload
              key={uploadConfig.label}
              label={uploadConfig.label}
              accept={uploadConfig.accept}
              onUpload={(url) => setFileUrl(url)}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || !fileUrl}
            className="btn-glow w-full disabled:opacity-50 transform hover:scale-105 transition-transform"
          >
            {submitting ? 'Mengirim...' : 'Kirim Submission'}
          </button>
        </>
      )}
    </div>
  );
}