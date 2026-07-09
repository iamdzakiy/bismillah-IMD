'use client';

import { motion } from 'framer-motion';
import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

      // NextAuth returns shape: { ok, error, status, url, ... }
      if (!result) {
        setError('Login failed. Please try again.');
        return;
      }

      if (result.error) {
        setError(result.error === 'CredentialsSignin'
          ? 'Invalid email or password (or email not verified).'
          : result.error);
        return;
      }

      if (result.ok) {
        router.push('/dashboard');
        router.refresh();
        return;
      }

      setError('Login failed. Please try again.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-bio-cyan/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-bio-purple/20 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '3s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md glass-strong rounded-3xl p-8 shadow-2xl"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-bio-cyan/30 rounded-full blur-xl animate-pulse-glow" />
            <div className="relative w-16 h-16 glass-strong rounded-full flex items-center justify-center text-3xl">
              🧬
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2">
            <span className="text-gradient">Welcome Back</span>
          </h1>
          <p className="text-white/60 text-sm">Continue your microbial odyssey</p>
        </div>

        {verified && (
          <div className="mb-6 bg-bio-emerald/10 border border-bio-emerald/50 text-bio-emerald px-4 py-3 rounded-lg text-sm">
            ✅ Email verified successfully! You can now login.
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-glass"
            placeholder="you@example.com"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-glass"
            placeholder="••••••••"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-glow w-full"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-space-900/50 px-3 text-xs text-white/40 uppercase tracking-wider">
              Or
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="btn-glass w-full flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </button>

        <div className="flex items-center justify-between mt-6 gap-4">
          <p className="text-white/60 text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-bio-cyan hover:text-bio-emerald font-medium transition-colors">
              Register here
            </Link>
          </p>
          <Link href="/request-password-reset" className="text-bio-cyan hover:text-bio-emerald font-medium text-sm transition-colors">
            Forgot password?
          </Link>
        </div>
      </motion.div>
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