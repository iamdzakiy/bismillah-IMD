'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, Suspense } from 'react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email';
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');

  const handleResend = async () => {
    setResending(true);
    setMessage('');
    try {
      const res = await fetch('/api/auth/resend-activation', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage('✅ Verification email sent! Please check your inbox.');
    } catch (err: any) {
      setMessage('❌ ' + err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-strong rounded-2xl p-8 text-center">
        <div className="w-20 h-20 mx-auto bg-bio-cyan/10 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-bio-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
        <p className="text-white/60 mb-6">
          We've sent a verification link to{' '}
          <span className="text-bio-emerald font-semibold break-all">{email}</span>.
          Please check your inbox and click the link to activate your account.
        </p>

        <div className="glass-dark rounded-lg p-4 mb-6 text-left">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2">What's next?</p>
          <ul className="text-sm text-white/70 space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-bio-emerald rounded-full mt-1.5 flex-shrink-0"></span>
              Check your email inbox (and spam folder)
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-bio-emerald rounded-full mt-1.5 flex-shrink-0"></span>
              Click the verification link in the email
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-bio-emerald rounded-full mt-1.5 flex-shrink-0"></span>
              Login and access your dashboard to register your team!
            </li>
          </ul>
        </div>

        {message && (
          <div className="mb-4 text-sm text-white/70 bg-white/5 px-4 py-2 rounded-lg">
            {message}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleResend}
            disabled={resending}
            className="btn-glass w-full"
          >
            {resending ? 'Sending...' : '📧 Resend Verification Email'}
          </button>

          <Link
            href="/register"
            className="text-sm text-white/40 hover:text-white/70 transition flex items-center justify-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-space-900 flex items-center justify-center text-white">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}