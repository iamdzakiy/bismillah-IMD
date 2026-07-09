'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-space-900/70 backdrop-blur-2xl border-b border-white/10 shadow-2xl' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-bio-cyan/30 rounded-full blur-lg group-hover:bg-bio-cyan/50 transition-all" />
            <div className="relative w-10 h-10 glass-strong rounded-full flex items-center justify-center">
              <span className="text-xl">🧬</span>
            </div>
          </div>
          <span className="text-xl font-black text-gradient hidden sm:block">
            IMD 2026
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <Link href="/#competitions" className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all">
            Competitions
          </Link>
          <Link href="/#timeline" className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all">
            Timeline
          </Link>
          <Link href="/#faq" className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all">
            FAQ
          </Link>

          {session ? (
            <div className="flex items-center gap-2 ml-4">
              <Link
                href="/dashboard"
                className="px-5 py-2 text-sm glass rounded-full hover:bg-white/10 transition-all font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-4">
              <Link href="/login" className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/register" className="btn-glow text-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-10 h-10 glass rounded-full flex items-center justify-center"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-space-900/95 backdrop-blur-2xl border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-2">
              <Link href="/#competitions" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-white/70 hover:bg-white/5 rounded-xl">
                Competitions
              </Link>
              <Link href="/#timeline" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-white/70 hover:bg-white/5 rounded-xl">
                Timeline
              </Link>
              <Link href="/#faq" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-white/70 hover:bg-white/5 rounded-xl">
                FAQ
              </Link>
              {session ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-bio-cyan hover:bg-white/5 rounded-xl">
                    Dashboard
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="block w-full text-left px-4 py-3 text-white/60 hover:bg-white/5 rounded-xl">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-white/70 hover:bg-white/5 rounded-xl">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-3 btn-glow text-center">
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}