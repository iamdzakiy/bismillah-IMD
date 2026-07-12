'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const competitions = [
  { name: 'Microbiology Olympiad', slug: 'olympiad', desc: 'Individual SMA competition' },
  { name: 'Science Project Competition', slug: 'spc', desc: 'Team-based SMA project' },
  { name: 'National Essay Competition', slug: 'nec', desc: 'University essay contest' },
];

const events = [
  { name: 'Grand Opening', date: 'July 2026' },
  { name: 'Workshops', date: 'TBA' },
  { name: 'Awarding Night', date: 'TBA' },
];

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [compDropdown, setCompDropdown] = useState(false);
  const [eventDropdown, setEventDropdown] = useState(false);
  const compRef = useRef<HTMLDivElement>(null);
  const eventRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (compRef.current && !compRef.current.contains(e.target as Node)) setCompDropdown(false);
      if (eventRef.current && !eventRef.current.contains(e.target as Node)) setEventDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#0a0514]/80 backdrop-blur-2xl border-b border-white/10 shadow-2xl' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-lg group-hover:bg-purple-500/50 transition-all" />
            <div className="relative w-10 h-10 glass-strong rounded-full flex items-center justify-center">
              <span className="text-xl">🧬</span>
            </div>
          </div>
          <span className="text-xl font-black text-gradient hidden sm:block">
            IMD 2026
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {/* Competitions Dropdown */}
          <div ref={compRef} className="relative">
            <button
              onClick={() => { setCompDropdown(!compDropdown); setEventDropdown(false); }}
              className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all flex items-center gap-1"
            >
              Competitions
              <svg className={`w-3 h-3 transition-transform ${compDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <AnimatePresence>
              {compDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 left-0 w-72 glass-strong rounded-2xl p-2 shadow-2xl border border-purple-500/20"
                >
                  {competitions.map((comp) => (
                    <Link
                      key={comp.slug}
                      href={`/competitions/${comp.slug}`}
                      onClick={() => setCompDropdown(false)}
                      className="block p-3 rounded-xl hover:bg-white/5 transition-all group"
                    >
                      <div className="text-sm font-medium text-white/80 group-hover:text-white">{comp.name}</div>
                      <div className="text-xs text-white/40">{comp.desc}</div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Events Dropdown */}
          <div ref={eventRef} className="relative">
            <button
              onClick={() => { setEventDropdown(!eventDropdown); setCompDropdown(false); }}
              className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all flex items-center gap-1"
            >
              Events
              <svg className={`w-3 h-3 transition-transform ${eventDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <AnimatePresence>
              {eventDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 left-0 w-64 glass-strong rounded-2xl p-2 shadow-2xl border border-purple-500/20"
                >
                  <Link
                    href="/events"
                    onClick={() => setEventDropdown(false)}
                    className="block p-3 rounded-xl hover:bg-white/5 transition-all group border-b border-white/5 mb-1"
                  >
                    <div className="text-sm font-medium text-white/80 group-hover:text-white">All Events</div>
                    <div className="text-xs text-white/40">View all IMD 2026 events</div>
                  </Link>
                  {events.map((event, i) => (
                    <div key={i} className="p-3 rounded-xl hover:bg-white/5 transition-all">
                      <div className="text-sm font-medium text-white/80">{event.name}</div>
                      <div className="text-xs text-white/40">{event.date}</div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/#timeline" className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all">
            Timeline
          </Link>
          <Link href="/#faq" className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all">
            FAQ
          </Link>

          {session ? (
            <div className="flex flex-col items-end ml-4">
              <Link
                href="/dashboard"
                className="px-5 py-2 text-sm glass rounded-full hover:bg-white/10 transition-all font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-5 py-1 text-xs text-white/50 hover:text-red-400 transition-colors"
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
            className="md:hidden bg-[#0a0514]/95 backdrop-blur-2xl border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-2">
              <div className="px-4 py-2 text-xs text-white/30 uppercase tracking-wider">Competitions</div>
              {competitions.map((comp) => (
                <Link key={comp.slug} href={`/competitions/${comp.slug}`} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-white/70 hover:bg-white/5 rounded-xl">
                  {comp.name}
                </Link>
              ))}
              <div className="px-4 py-2 text-xs text-white/30 uppercase tracking-wider mt-2">Events</div>
              <Link href="/events" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-white/70 hover:bg-white/5 rounded-xl">
                All Events →
              </Link>
              {events.map((event, i) => (
                <div key={i} className="block px-4 py-3 text-white/70 rounded-xl">
                  {event.name} <span className="text-white/30 text-xs">({event.date})</span>
                </div>
              ))}
              <div className="border-t border-white/5 my-2" />
              <Link href="/#timeline" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-white/70 hover:bg-white/5 rounded-xl">
                Timeline
              </Link>
              <Link href="/#faq" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-white/70 hover:bg-white/5 rounded-xl">
                FAQ
              </Link>
              {session ? (
                <div className="space-y-1">
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-purple-400 hover:bg-white/5 rounded-xl">
                    Dashboard
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="block w-full text-left px-4 py-2 text-xs text-white/40 hover:text-red-400 hover:bg-white/5 rounded-xl">
                    Logout
                  </button>
                </div>
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