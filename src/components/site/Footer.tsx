'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const authPaths = ['/login', '/register', '/verify-email', '/reset-password', '/request-password-reset'];

export function Footer() {
  const pathname = usePathname();
  const isAuthPage = authPaths.includes(pathname);

  if (isAuthPage) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-[#0a0514]/80 backdrop-blur-xl">
      {/* Top decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🧬</span>
              <span className="text-xl font-black text-gradient">IMD 2026</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              International Microorganism Day 2026<br />
              Organized by HIMAMIKRO "Archaea" - School of Life Sciences and Technology - Science Program (SITH-S), Institut Teknologi Bandung<br />
            
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://www.instagram.com/imd.itb/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-purple-500/20 transition-all group">
                <svg className="w-4 h-4 text-white/60 group-hover:text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://www.instagram.com/archaea_itb/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-purple-500/20 transition-all group">
                <svg className="w-4 h-4 text-white/60 group-hover:text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="mailto:imd@itb.ac.id" className="w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-purple-500/20 transition-all group">
                <svg className="w-4 h-4 text-white/60 group-hover:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">Competitions</h4>
            <ul className="space-y-2">
              <li><Link href="/competitions/olympiad" className="text-sm text-white/50 hover:text-purple-400 transition-colors">Microbiology Olympiad (MO)</Link></li>
              <li><Link href="/competitions/spc" className="text-sm text-white/50 hover:text-purple-400 transition-colors">Science Project Competition (SPC)</Link></li>
              <li><Link href="/competitions/nec" className="text-sm text-white/50 hover:text-purple-400 transition-colors">National Essay Competition (NEC)</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="/#faq" className="text-sm text-white/50 hover:text-purple-400 transition-colors">FAQ</a></li>
              <li><a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-purple-400 transition-colors">Contact via WhatsApp</a></li>
              <li><a href="mailto:imd@itb.ac.id" className="text-sm text-white/50 hover:text-purple-400 transition-colors">Email Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>Archaea ITB</li>
              <li>Institut Teknologi Bandung</li>
              <li>Ganesha 10, Bandung</li>
              <li className="pt-2">
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
                  WA: +62 812-3456-7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            © {currentYear} IMD 2026 — International Microorganism Day
          </p>
          <div className="flex gap-4 text-xs text-white/30">
            <span>Built by Mikrobiologi 2023 ITB</span>
          </div>
        </div>
      </div>
    </footer>
  );
}