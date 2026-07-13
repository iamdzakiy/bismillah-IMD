'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, Suspense } from 'react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const displayEmail = email || 'your email';
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');

  const handleResend = async () => {
    setResending(true);
    setMessage('');
    try {
      const res = await fetch('/api/auth/resend-activation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage('✅ Verification email sent! Please check your inbox.');
    } catch (err) {
      setMessage('❌ ' + (err instanceof Error ? err.message : 'Failed to resend email'));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Emerald Green Gradient Mesh with Process Steps */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-950">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-cyan-500 rounded-full filter blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-12">Get Started with Us</h1>
          
          {/* Process Steps */}
          <div className="flex flex-col gap-4 w-full max-w-xs">
            {/* Step 1 - Completed */}
            <div className="flex items-center gap-4 bg-transparent border-2 border-white/20 rounded-2xl px-6 py-4">
              <div className="w-10 h-10 border-2 border-white/40 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white/60 font-bold">1</span>
              </div>
              <span className="text-white/60 font-medium">Sign up your account</span>
            </div>
            
            {/* Step 2 - Active */}
            <div className="flex items-center gap-4 bg-white rounded-2xl px-6 py-4 shadow-2xl">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">2</span>
              </div>
              <span className="text-black font-medium">Verify your email</span>
            </div>
            
            {/* Step 3 - Outline */}
            <div className="flex items-center gap-4 bg-transparent border-2 border-white/20 rounded-2xl px-6 py-4">
              <div className="w-10 h-10 border-2 border-white/40 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white/60 font-bold">3</span>
              </div>
              <span className="text-white/60 font-medium">Create your team</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Pitch Black Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 bg-black relative overflow-hidden">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Verify Your Email</h2>
            <p className="text-white/40 text-sm">Complete your registration</p>
          </div>

          <div className="w-20 h-20 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <p className="text-white/60 mb-6 text-center">
            We've sent a verification link to{' '}
            <span className="text-emerald-400 font-semibold break-all">{displayEmail}</span>.
            Please check your inbox and click the link to activate your account.
          </p>

          <div className="glass-dark rounded-lg p-4 mb-6 text-left">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">What's next?</p>
            <ul className="text-sm text-white/70 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></span>
                Check your email inbox (and spam folder)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></span>
                Click the verification link in the email
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></span>
                Login and access your dashboard to register your team!
              </li>
            </ul>
          </div>

          {message && (
            <div className="mb-4 text-sm text-white/70 bg-white/5 px-4 py-2 rounded-lg text-center">
              {message}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={handleResend}
              disabled={resending || !email}
              className="w-full px-4 py-3 bg-white/[0.05] backdrop-blur-md border border-white/[0.1] rounded-full font-medium transition-all duration-500 hover:bg-white/[0.1] hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {resending ? 'Sending...' : email ? '📧 Resend Verification Email' : 'Email address missing'}
            </button>

            <Link
              href="/login"
              className="text-sm text-white/40 hover:text-white/70 transition flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}