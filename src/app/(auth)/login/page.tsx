'use client';
import { motion } from 'framer-motion';
import { useState, Suspense, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginContent() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const verified = searchParams.get('verified');
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect to callbackUrl if already logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      window.location.href = callbackUrl;
    }
  }, [status, session, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please check your credentials.');
        setLoading(false);
      } else if (result?.ok) {
        setTimeout(() => {
          window.location.href = callbackUrl;
        }, 500);
      } else {
        setError('Login failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error');
    if (oauthError) {
      setError('Login failed. Please check your credentials.');
    }
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Emerald Green Gradient Mesh */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-950">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500 rounded-full filter blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-8">Welcome Back</h1>
          <div className="w-64 h-64 relative">
            <div className="absolute inset-0 border-2 border-emerald-400/30 rounded-full flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-teal-400/40 rounded-full flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                  <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 11H15V19H9V11H5V7H11V3H13V7H19V11M19 13V19H15V13H19M9 13V19H5V13H9Z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 border border-emerald-400/20 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
            <div className="absolute inset-0 border border-teal-400/15 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          </div>
        </div>
      </div>

      {/* Right Side - Pitch Black Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 bg-black relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md space-y-6"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Log In Account</h2>
            <p className="text-white/40 text-sm">Access your microbial odyssey dashboard</p>
          </div>

          {verified && (
            <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm text-center">
              ✅ Email verified! You can now log in.
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 ml-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-xl text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-emerald-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(16,185,129,0.2)] text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-xl text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-emerald-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(16,185,129,0.2)] text-sm pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-9-8-9-10 0-1.31.263-2.57.743-3.707M6.22 6.22A10.02 10.02 0 0112 5c7 0 9 8 9 10 0 1.31-.263 2.57-.743 3.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 17.25l-4.5-4.5M9.75 9.75l-4.5-4.5M12 15l6 6" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/request-password-reset" className="text-xs text-emerald-400 hover:text-teal-400 font-medium transition-colors">
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-full transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm text-white/50 mt-4">
            Don't have an account?{' '}
            <Link href="/register" className="text-emerald-400 hover:text-teal-400 font-medium transition-colors">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}