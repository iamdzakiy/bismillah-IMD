// src/components/ui/PaymentInstructionCard.tsx
'use client';

import { useState } from 'react';
import { Check, Copy, CreditCard, Download, QrCode, ShieldCheck } from 'lucide-react';
import { SEMIFINAL_PAYMENT } from '@/lib/semifinal';

interface PaymentInstructionCardProps {
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  amount?: string;
  amountLabel?: string;
}

/** Format a raw account number into grouped pairs, e.g. `1046-1405-1845`. */
function formatAccount(num?: string): string {
  const digits = (num || '').replace(/\D/g, '');
  return digits.match(/.{1,4}/g)?.join('-') || digits || '—';
}

export function PaymentInstructionCard({
  bankName = SEMIFINAL_PAYMENT.bank,
  accountNumber = SEMIFINAL_PAYMENT.accountNumber,
  accountHolder = SEMIFINAL_PAYMENT.accountHolder,
  // `amount` (raw) is intentionally folded into `amountLabel` for display.
  amountLabel = SEMIFINAL_PAYMENT.amountLabel,
}: PaymentInstructionCardProps) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const handleCopy = async () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
    // navigator.clipboard requires a secure context (https/localhost) and a
    // user gesture; user asked "copy does nothing" — add silent fallback chain
    // so it works over plain http / in-app webviews too.
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(accountNumber);
        return;
      }
      throw new Error('no-clipboard-api');
    } catch {
      try {
        const el = document.createElement('textarea');
        el.value = accountNumber;
        el.setAttribute('readonly', '');
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        el.setSelectionRange(0, el.value.length);
        document.execCommand('copy');
        document.body.removeChild(el);
      } catch {
        // Last resort: prompt so the user can copy manually.
        window.prompt('Copy account number:', accountNumber);
      }
    }
  };

  const handleDownload = () => {
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 2000);
    const lines = [
      'PAYMENT INSTRUCTIONS — IMD 2026 SEMIFINAL RE-REGISTRATION',
      '------------------------------------------------------',
      `Bank destination  : ${bankName}`,
      `Account number    : ${accountNumber}`,
      `Account holder    : ${accountHolder}`,
      `Registration fee  : ${amountLabel}`,
      '',
      SEMIFINAL_PAYMENT.notes,
      '',
      ...SEMIFINAL_PAYMENT.procedure.map((p) => `- ${p}`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'IMD-2026-payment-instructions.txt';
    // The anchor must be in the DOM for the click to trigger a download in
    // Safari/Firefox (previously it wasn't appended, so "no effect").
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div
      onMouseMove={(e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--gleam-x', `${x}px`);
        card.style.setProperty('--gleam-y', `${y}px`);
      }}
      className="group relative overflow-hidden rounded-3xl border border-white/15 border-t-white/25 bg-gradient-to-br from-white/10 via-white/5 to-purple-500/10 p-6 shadow-[0_8px_32px_0_rgba(168,85,247,0.2)] backdrop-blur-2xl"
    >
      {/* Specular liquid highlights */}
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-purple-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-6 top-10 h-24 w-24 rounded-full bg-sky-500/20 blur-2xl" />

      {/* Cursor-following micro-gleam */}
      <div
        style={{
          background:
            'radial-gradient(circle 120px at var(--gleam-x, 0) var(--gleam-y, 0), rgba(255,255,255,0.14), transparent 70%)',
        }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Header row */}
      <div className="relative flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-purple-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-200">
            Official Payment Channel
          </span>
        </div>
        <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" /> Verified Committee
        </span>
      </div>

      <div className="relative mt-4">
        <p className="text-[11px] uppercase tracking-wider text-white/40">Bank Destination</p>
        <h4 className="mt-0.5 text-lg font-bold tracking-wide text-white">{bankName}</h4>
      </div>

{/* Main ATM-style card face */}
      <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1040]/90 via-[#0f0720]/95 to-[#2d1b69]/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <div className="pointer-events-none absolute -left-8 top-0 h-full w-24 -skew-x-12 bg-gradient-to-r from-white/0 via-white/15 to-white/0 transition-all duration-700 group-hover:translate-x-[260%]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(217,70,239,0.22),transparent_55%)]" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-11 rounded-md border border-white/25 bg-gradient-to-br from-amber-200/80 via-amber-300/50 to-yellow-500/70">
              <div className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-amber-800/30" />
              <div className="absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-amber-800/30" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">IMD</span>
          </div>
          <ShieldCheck className="h-5 w-5 text-purple-400/70" />
        </div>

        <div className="relative mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/40">Account Number</p>
            <p className="mt-1 font-mono text-xl font-bold tracking-[0.12em] text-purple-200">
              {formatAccount(accountNumber)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-purple-400/40 bg-purple-600/30 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-purple-600/50 active:scale-95"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="relative mt-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/40">Account Holder</p>
            <p className="text-sm font-semibold text-white">{accountHolder}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-white/40">Registration Fee</p>
            <p className="text-lg font-bold text-emerald-300">
              {amountLabel}
              <span className="ml-1 align-middle text-[10px] font-normal text-white/40">(exact)</span>
            </p>
          </div>
        </div>
      </div>

{/* Actions */}
      <div className="relative mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleDownload}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-95"
        >
          {downloaded ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Download className="h-3.5 w-3.5" />}
          {downloaded ? 'Downloaded' : 'Payment Instructions'}
        </button>
        <button
          type="button"
          onClick={() => setShowQr((v) => !v)}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-95"
        >
          <QrCode className="h-3.5 w-3.5" /> QRIS
        </button>
      </div>

      {/* QRIS reference reveal */}
      {showQr && (
        <div className="relative mt-3 flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 p-3">
          <div className="grid h-16 w-16 shrink-0 grid-cols-3 gap-0.5 rounded-lg bg-white/5 p-1.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={i % 5 === 0 ? 'bg-purple-500' : i % 3 === 0 ? 'bg-white/70' : 'bg-white/25'}
              />
            ))}
          </div>
          <p className="text-xs text-white/60">
            Present this QR reference at the payment kiosk, or dial-in the bank reference{' '}
            <strong className="text-purple-300">IMD-{accountNumber}</strong> to match your payment automatically.
          </p>
        </div>
      )}

      {/* Copied toast */}
      <div
        aria-live="polite"
        className={`pointer-events-none fixed bottom-8 left-1/2 z-[9999] -translate-x-1/2 transition-all duration-300 ${
          copied ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        }`}
      >
        <div className="flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 shadow-[0_10px_30px_rgba(16,185,129,0.3)] backdrop-blur-xl">
          <Check className="h-4 w-4" /> Account number copied! ✓
        </div>
      </div>
    </div>
  );
}