'use client';

import { useState } from 'react';
import Link from 'next/link';

const TUTORIAL_LINK = 'https://www.instagram.com/p/DbnpFRaGppZ/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==';

interface RegisterButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function RegisterButton({ className = 'btn-glow', children = 'Register Now' }: RegisterButtonProps) {
  const [showTutorial, setShowTutorial] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTutorial(true);
  };

  return (
    <>
      <button type="button" onClick={handleClick} className={className}>
        {children}
      </button>

      {showTutorial && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
          onClick={(e) => e.target === e.currentTarget && setShowTutorial(false)}
        >
          <div className="relative w-full max-w-lg glass-strong rounded-3xl p-6 md:p-8 overflow-y-auto max-h-[90vh]">
            <button
              type="button"
              onClick={() => setShowTutorial(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-red-500/20 transition-all cursor-pointer"
            >
              <span className="text-white text-lg">×</span>
            </button>

            <div className="text-center">
              <div className="inline-block px-4 py-1.5 glass rounded-full text-purple-400 text-xs font-bold uppercase tracking-wider mb-4">
                📖 TUTORIAL
              </div>

              <h3 className="text-2xl md:text-3xl font-black mb-3">
                New to IMD 2026? <span className="text-gradient">Watch Our Tutorial!</span>
              </h3>

              <p className="text-white/60 text-sm mb-6">
                Learn how to use our website — from registration to submission. Follow our step-by-step tutorial on Instagram before you register!
              </p>

              <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-bio-blue/10 via-bio-purple/10 to-bio-pink/10 border border-bio-purple/30">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-3xl">📱</span>
                </div>
                <p className="text-white/70 text-sm mb-4">
                  Watch the tutorial to understand the full registration process, document requirements, and submission steps.
                </p>
                <a
                  href={TUTORIAL_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  Watch Tutorial on Instagram
                </a>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/dashboard"
                  className="btn-glow flex-1 text-center"
                  onClick={() => setShowTutorial(false)}
                >
                  Continue to Register →
                </Link>
                <button
                  type="button"
                  onClick={() => setShowTutorial(false)}
                  className="btn-glass flex-1"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}