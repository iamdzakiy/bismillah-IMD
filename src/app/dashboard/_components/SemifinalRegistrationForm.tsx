// src/app/dashboard/_components/SemifinalRegistrationForm.tsx
'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Check, FileText, LoaderCircle, Trash2, UploadCloud } from 'lucide-react';
import { PaymentInstructionCard } from '@/components/ui/PaymentInstructionCard';
import { MascotDecoration } from '@/components/ui/MascotDecoration';
import { triggerDoubleCelebration } from '@/components/ui/useConfettiBlast';
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

/** Submission state machine per spec: IDLE → UPLOADING → SUBMITTED / PENDING_VERIFICATION. */
type Stage = 'IDLE' | 'UPLOADING' | 'SUBMITTED';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const IS_IMAGE = (name: string) => /\.(png|jpe?g)$/i.test(name);
const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.pdf'];

function formatBytes(bytes = 0): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface ReceiptFile {
  name: string;
  size: number;
  url: string;
  previewUrl?: string;
}

export function SemifinalRegistrationForm({ team }: SemifinalRegistrationFormProps) {
  const router = useRouter();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [stage, setStage] = useState<Stage>('IDLE');
  const [receipt, setReceipt] = useState<ReceiptFile | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const progressTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (progressTimer.current) window.clearInterval(progressTimer.current);
    };
  }, []);

  const startProgress = () => {
    setProgress(0);
    if (progressTimer.current) window.clearInterval(progressTimer.current);
    progressTimer.current = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 14, 90);
        return next >= 90 ? 90 : next;
      });
    }, 90);
  };

  const stopProgress = () => {
    if (progressTimer.current) {
      window.clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
    setProgress(100);
    window.setTimeout(() => setProgress(0), 400);
  };

  const validateAndSet = (file: File | undefined): boolean => {
    if (!file) return false;
    setMessage(null);
    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      setMessage({ type: 'error', text: 'Only JPG, PNG or PDF receipts are allowed.' });
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setMessage({ type: 'error', text: `"${file.name}" exceeds the 5MB limit.` });
      return false;
    }
    return true;
  };

  const uploadFile = async (file: File) => {
    if (!validateAndSet(file)) return;
    setStage('UPLOADING');
    startProgress();

    let previewUrl: string | undefined;
    if (IS_IMAGE(file.name)) {
      previewUrl = URL.createObjectURL(file);
    }

    try {
      const filename = encodeURIComponent(file.name);
      // file.type can be '' for renamed/odd files — fall back to extension MIME
      // so the server's allowlist check doesn't reject with "Only PDF..." .
      const extMime =
        /\.pdf$/i.test(file.name)
          ? 'application/pdf'
          : /\.png$/i.test(file.name)
            ? 'image/png'
            : 'image/jpeg';
      const res = await fetch(`/api/upload/presign?filename=${filename}`, {
        method: 'POST',
        headers: { 'Content-Type': file.type || extMime },
        body: await file.arrayBuffer(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setReceipt({ name: file.name, size: file.size, url: data.publicUrl, previewUrl });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Upload failed. Please retry.' });
    } finally {
      stopProgress();
      setStage('IDLE');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void uploadFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void uploadFile(file);
  };

  const removeReceipt = () => {
    if (receipt?.previewUrl) URL.revokeObjectURL(receipt.previewUrl);
    setReceipt(null);
    setAgreed(false);
    setMessage(null);
  };

  const handleSubmit = async () => {
    setMessage(null);
    if (!receipt || !receipt.url) {
      setMessage({ type: 'error', text: 'Please upload your payment receipt before submitting.' });
      return;
    }
    if (!agreed) {
      setMessage({ type: 'error', text: 'Please confirm the payment & integrity consent first.' });
      return;
    }

    setStage('SUBMITTED');
    try {
      const res = await fetch('/api/semifinal/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: team.id,
          paymentProofUrl: receipt.url,
          agreedToTerms: agreed,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Re-registration failed');

      // 🎉🎉 2 confetti volleys on successful akhir submit: immediate + encore.
      setMessage({ type: 'success', text: 'Re-registration submitted! Verification in progress.' });
      triggerDoubleCelebration(2, 4500);

      setTimeout(() => {
        router.refresh();
      }, 1600);
    } catch (err) {
      setStage('IDLE');
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Re-registration failed' });
    }
  };

return (
    <div className="glass relative overflow-hidden rounded-3xl border border-white/12 border-t-white/20 bg-gradient-to-br from-white/8 via-white/4 to-purple-500/5 p-6 backdrop-blur-2xl shadow-[0_20px_50px_rgba(168,85,247,0.15)] sm:p-8 space-y-6">
      <div className="pointer-events-none absolute -left-8 -top-8 h-44 w-44 rounded-full bg-purple-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-44 w-44 rounded-full bg-fuchsia-500/15 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-purple-400/30 bg-purple-500/15 text-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)] backdrop-blur-xl">
            💳
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-gradient-glow">Semifinal Re-Registration</h4>
            <p className="text-xs text-white/55">
              One-time verification to unlock your <strong className="text-white/80">full paper submission</strong>.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <Check className="h-3.5 w-3.5" /> Fee: {SEMIFINAL_PAYMENT.amountLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
            Receipt required
          </span>
        </div>
      </div>

      <PaymentInstructionCard />

      <div className="relative">
        <p className="text-[11px] uppercase tracking-wider text-white/40">Step 1 — Pay the exact fee</p>
        <p className="mt-1 text-xs leading-relaxed text-white/60">
          Transfer <strong className="text-emerald-300">{SEMIFINAL_PAYMENT.amountLabel}</strong> to{' '}
          <strong className="text-white/90">{SEMIFINAL_PAYMENT.bank}</strong> ({SEMIFINAL_PAYMENT.accountHolder}).
          Use your <strong>team name as the reference</strong> so we can match your payment.
        </p>
      </div>

<ol className="relative list-decimal list-inside space-y-1.5 border-l border-purple-400/20 pl-4 text-xs text-white/55">
        {SEMIFINAL_PAYMENT.procedure.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      {/* Upload dropzone */}
      <div className="relative">
        <p className="text-[11px] uppercase tracking-wider text-white/40">Step 2 — Upload payment receipt</p>
        {receipt ? (
          <div className="mt-2 overflow-hidden rounded-2xl border border-emerald-400/30 bg-black/25 p-4">
            <div className="flex items-center gap-3">
              {receipt.previewUrl ? (
                <img
                  src={receipt.previewUrl}
                  alt="Receipt preview"
                  className="h-16 w-16 shrink-0 rounded-xl border border-white/10 object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-purple-500/15">
                  <FileText className="h-7 w-7 text-purple-300" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white/90">{receipt.name}</p>
                <p className="text-xs text-white/50">{formatBytes(receipt.size)} · ready to submit</p>
              </div>
              <button
                type="button"
                onClick={removeReceipt}
                aria-label="Remove receipt"
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-red-400/30 bg-red-500/10 text-red-400 transition-all duration-200 hover:bg-red-500/20 active:scale-95"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
              dragging
                ? 'border-purple-400/70 bg-purple-500/15 shadow-[0_0_25px_rgba(168,85,247,0.35)] scale-[1.02]'
                : 'border-white/15 bg-white/5 hover:border-purple-400/40 hover:bg-purple-500/10'
            }`}
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 ${dragging ? 'animate-bounce text-purple-300' : 'text-purple-300'}`}>
              {stage === 'UPLOADING' ? <LoaderCircle className="h-7 w-7 animate-spin" /> : <UploadCloud className="h-7 w-7" />}
            </div>
            {stage === 'UPLOADING' ? (
              <p className="text-sm font-semibold text-purple-200">Uploading receipt…</p>
            ) : (
              <p className="text-sm font-semibold text-white/80">
                <span className="text-purple-300">Drag &amp; drop</span> your receipt here, or{' '}
                <span className="text-purple-300 underline">browse</span>
              </p>
            )}
            <p className="text-xs text-white/45">JPG · PNG · PDF — max 5MB</p>
            <input
              ref={inputRef}
              id={inputId}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileInput}
              disabled={stage === 'UPLOADING'}
              className="hidden"
            />
          </div>
        )}

        {stage === 'UPLOADING' && (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-400 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="w-10 text-right text-[11px] font-semibold text-purple-200">{progress}%</span>
          </div>
        )}
      </div>

{/* Integrity consent */}
      <div className="relative">
        <p className="text-[11px] uppercase tracking-wider text-white/40">Step 3 — Confirm &amp; submit</p>
        <label className="mt-2 flex cursor-pointer select-none items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 transition-colors hover:border-purple-400/30">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="peer sr-only"
          />
          {/* Custom fluid checkbox */}
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-300 ${
              agreed
                ? 'border-emerald-400 bg-gradient-to-br from-emerald-400 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'border-white/30 bg-white/5'
            }`}
          >
            {agreed && <Check className="h-4 w-4 text-black" strokeWidth={3} />}
          </span>
          <span className="text-[13px] leading-snug text-white/75">
            I confirm I have transferred <strong className="text-emerald-300">{SEMIFINAL_PAYMENT.amountLabel}</strong> to{' '}
            <strong className="text-white">{SEMIFINAL_PAYMENT.bank}</strong> ({SEMIFINAL_PAYMENT.accountHolder}), that the
            receipt above is accurate, and I agree to abide by the <strong>competition rules &amp; timeline schedule</strong>.
          </span>
        </label>
      </div>

      {message && (
        <div
          className={`flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'border border-emerald-400/40 bg-emerald-500/10 text-emerald-300'
              : 'border border-red-400/40 bg-red-500/10 text-red-300'
          }`}
        >
          <span className="text-base">{message.type === 'success' ? '✅' : '⚠️'}</span>
          <span className="flex-1">{message.text}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!receipt || !agreed || stage === 'SUBMITTED'}
        className="btn-glow w-full disabled:cursor-not-allowed disabled:opacity-50 disabled:brightness-90"
      >
        {stage === 'SUBMITTED' ? 'Submitting…' : 'Submit Re-Registration'}
      </button>

      {/* PENDING_VERIFICATION state (shown after a successful POST, pre-refresh). */}
      {stage === 'SUBMITTED' && (
        <div className="relative flex items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4">
          <span className="relative flex h-3 w-3">
            <span className="absolute h-full w-full animate-ping rounded-full bg-amber-400/70" />
            <span className="relative h-3 w-3 rounded-full bg-amber-400" />
          </span>
          <p className="text-sm text-amber-200">
            <span className="font-semibold">Verification in Progress by Admin</span>
            <span className="mt-0.5 block text-xs text-amber-200/80">est. 1×24 hours — we&apos;ll notify you by email.</span>
          </p>
        </div>
      )}

      <a
        href={SEMIFINAL_WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-4 transition hover:bg-emerald-500/15"
      >
        <span className="text-2xl">💬</span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-emerald-300">Join {SEMIFINAL_WHATSAPP_LABEL}</span>
          <span className="block text-xs text-white/60">Official invitation for participant queries &amp; updates.</span>
        </span>
        <span className="text-emerald-300">→</span>
      </a>

      {SEMIFINAL_TEMPLATE_LINK && (
        <p className="text-xs text-white/50">
          Official full-paper template:{' '}
          <a href={SEMIFINAL_TEMPLATE_LINK} target="_blank" rel="noopener noreferrer" className="text-bio-emerald hover:underline">
            {SEMIFINAL_TEMPLATE_LINK}
          </a>
        </p>
      )}
    </div>
  );
}

// Shared mascot/decoration helper used by the parent module screen.
export function SemifinalMascots() {
  return <MascotDecoration count={4} size="md" />;
}