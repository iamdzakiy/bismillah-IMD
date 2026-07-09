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

      if (result?.error) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (result?.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Purple Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '5s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md glass-strong rounded-3xl p-8 shadow-2xl border border-purple-500/20"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">
            Welcome Back
          </h1>
          <p className="text-white/60 text-sm">Continue your microbial odyssey</p>
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
            <label className="block text-xs font-medium text-white/50 mb-1 ml-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-glass"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1 ml-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-glass"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-glow w-full mt-2"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#0a0514]/50 px-3 text-xs text-white/30 uppercase tracking-wider">
              Or continue with
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="btn-glass w-full flex items-center justify-center gap-2 hover:bg-white/10"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="text-white/90">Google</span>
        </button>

        <div className="mt-6 text-center text-sm text-white/50">
          Don't have an account?{' '}
          <Link href="/register" className="text-purple-400 hover:text-fuchsia-400 font-medium transition-colors">
            Register here
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