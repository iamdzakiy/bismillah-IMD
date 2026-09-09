// src/app/dashboard/_components/SemifinalRegistrationForm.tsx
'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { SuccessPopup } from '@/components/ui/SuccessPopup';
import { MascotDecoration } from '@/components/ui/MascotDecoration';
import { useRouter } from 'next/navigation';
import {
  SEMIFINAL_PAYMENT,
  SEMIFINAL_WHATSAPP_LINK,
  SEMIFINAL_WHATSAPP_LABEL,
  SEMIFINAL_TEMPLATE_LINK,
} from '@/lib/semifinal';
import type { DashboardTeam } from './types';

interface SemifinalRegistrationFormProps {
  team: DashboardTeam;
}

export function SemifinalRegistrationForm({ team }: SemifinalRegistrationFormProps) {
  const router = useRouter();
  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    setMessage(null);

    if (!paymentProofUrl) {
      setMessage({ type: 'error', text: 'Please upload your payment receipt before submitting.' });
      return;
    }
    if (!agreed) {
      setMessage({ type: 'error', text: 'You must confirm that the payment details are correct.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/semifinal/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: team.id,
          paymentProofUrl,
          agreedToTerms: agreed,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Re-registration failed');

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.refresh();
      }, 1800);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Re-registration failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-dark rounded-2xl p-6 sm:p-8 space-y-6">
      <SuccessPopup
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="Re-registration submitted! The committee will review it soon."
      />

      {/* Payment details — static info */}
      <div className="rounded-2xl bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10 border border-emerald-500/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center text-2xl">💳</div>
          <div>
            <h4 className="text-lg font-bold text-emerald-400">Semifinal Re-registration Fee</h4>
            <p className="text-xs text-white/50">One-time payment to unlock the full paper submission form</p>
          </div>
        </div>

        <div className="bg-black/30 rounded-xl p-5 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-white/60">Amount</span>
            <span className="text-2xl font-bold text-bio-emerald font-mono">IDR {SEMIFINAL_PAYMENT.amount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60">Recipient / Bank</span>
            <span className="text-white/90 font-semibold">{SEMIFINAL_PAYMENT.bank}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60">Account Number</span>
            <span className="text-white/90 font-mono">{SEMIFINAL_PAYMENT.accountNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60">Account Holder</span>
            <span className="text-white/90 font-semibold">{SEMIFINAL_PAYMENT.accountHolder}</span>
          </div>
          <p className="text-xs text-white/40 leading-relaxed mt-2">{SEMIFINAL_PAYMENT.notes}</p>
        </div>

        <ol className="list-decimal list-inside text-xs text-white/50 space-y-1.5 mt-4">
          {SEMIFINAL_PAYMENT.procedure.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </div>
{/* WA Group invitation */}
      <a
        href={SEMIFINAL_WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-xl bg-green-500/10 border border-green-500/30 p-4 hover:bg-green-500/15 transition"
      >
        <span className="text-2xl">💬</span>
        <span className="flex-1 min-w-0">
          <span className="block text-green-400 font-semibold">Join {SEMIFINAL_WHATSAPP_LABEL}</span>
          <span className="block text-xs text-white/60">
            Official invitation link for participant queries & competition updates.
          </span>
        </span>
        <span className="text-green-400 text-lg">→</span>
      </a>

      {/* Submission area */}
      <div className="rounded-xl glass p-5 space-y-4">
        <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
          Upload Payment Receipt (required)
        </h4>
        <p className="text-xs text-white/40">
          Upload a clear screenshot / PDF of your transfer to <strong>{SEMIFINAL_PAYMENT.bank}</strong>
          (IDR {SEMIFINAL_PAYMENT.amount}). It must show the payer&apos;s name, the exact amount and the date.
        </p>

        <FileUpload
          label="Payment Receipt (PDF / image, max 5MB)"
          accept=".pdf,.png,.jpg,.jpeg"
          onUpload={(url) => setPaymentProofUrl(url)}
        />

        {SEMIFINAL_TEMPLATE_LINK && (
          <p className="text-xs text-white/50">
            Official template:{' '}
            <a href={SEMIFINAL_TEMPLATE_LINK} target="_blank" rel="noopener noreferrer" className="text-bio-emerald hover:underline">
              {SEMIFINAL_TEMPLATE_LINK}
            </a>
          </p>
        )}

        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 accent-emerald-500"
          />
          <span className="text-sm text-white/70">
            I confirm I have transferred <strong className="text-bio-emerald">IDR {SEMIFINAL_PAYMENT.amount}</strong>{' '}
            to <strong>{SEMIFINAL_PAYMENT.bank}</strong> ({SEMIFINAL_PAYMENT.accountHolder}) and the receipt above is accurate.
          </span>
        </label>

        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-bio-emerald/10 border border-bio-emerald/50 text-bio-emerald' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>
            {message.text}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting || !paymentProofUrl || !agreed}
          className="btn-glow w-full disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-transform"
        >
          {submitting ? 'Submitting...' : 'Submit Re-registration'}
        </button>
      </div>
    </div>
  );
}

// Shared mascot/decoration helper used by the parent module screen.
export function SemifinalMascots() {
  return <MascotDecoration count={4} size="md" />;
}