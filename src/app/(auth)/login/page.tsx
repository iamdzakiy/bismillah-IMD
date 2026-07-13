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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      window.location.href = '/dashboard';
    }
  }, [status, session]);

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
          window.location.href = '/dashboard';
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

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error');
    if (oauthError) {
      setError('Google login failed. Please try again or use email login.');
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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.05]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-black px-3 text-xs text-white/30 uppercase tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white/[0.05] backdrop-blur-md border border-white/[0.1] rounded-full font-medium transition-all duration-500 hover:bg-white/[0.1] hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] text-sm w-full"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-white/90">Google</span>
          </button>

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