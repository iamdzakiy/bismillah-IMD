'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/GradientText';
import { Countdown } from '@/components/ui/Countdown';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-12 px-4">
      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-bio-cyan/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-bio-purple/20 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-bio-emerald/15 rounded-full blur-[100px] animate-blob" style={{ animationDelay: '5s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Countdown */}
        <div className="glass rounded-2xl p-4 md:p-6 mb-12">
          <Countdown targetDate="2026-07-31T23:59:59" />
        </div>

        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2 glass rounded-full mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bio-emerald opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-bio-emerald"></span>
              </span>
              <span className="text-sm font-medium text-white/90">
                🧬 International Microorganism Day 2026
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight"
            >
              The Great <br />
              <GradientText className="block">Microbial Odyssey</GradientText>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-white/70 mb-6 max-w-2xl italic font-light"
            >
              <span className="text-bio-cyan/80">"</span>
              Decoding the Earth's Dark Matter to Orchestrate a Sustainable Future
              <span className="text-bio-cyan/80">"</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-white/50 mb-8 max-w-xl"
            >
              Join thousands of innovators, researchers, and microbiology enthusiasts in Indonesia's
              most prestigious microbiology event at ITB Ganesha. Unveil the 99% of microorganisms
              that remain hidden and unlock their potential for solving global challenges.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Link href="/#competitions" className="btn-glow">
                <i className="fas fa-trophy mr-2"></i> Explore Competitions
              </Link>
              <Link href="/register" className="btn-glass">
                <i className="fas fa-user-plus mr-2"></i> Register Now
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 glass rounded-2xl p-6"
            >
              {[
                { target: 2100, label: 'Participants', suffix: '+' },
                { target: 4000, label: 'Academy', suffix: '+' },
                { target: 20, label: 'Media Partners', suffix: '+' },
                { target: 13, label: 'Companies', suffix: '' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-gradient">
                    {stat.target}{stat.suffix}
                  </div>
                  <div className="text-xs text-white/50 uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:flex justify-center"
          >
            <div className="glass rounded-3xl p-8 max-w-md w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-bio-cyan/5 to-bio-purple/5" />
              <div className="relative text-center">
                <div className="text-8xl mb-4 animate-float">🦠</div>
                <h3 className="text-2xl font-bold">IMD 2026 Mascot</h3>
                <p className="text-white/50 text-sm">Meet our friendly microbial explorer!</p>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  <span className="px-3 py-1 glass rounded-full text-xs">✨ Microbial Explorer</span>
                  <span className="px-3 py-1 glass rounded-full text-xs">🎨 Sustainable Future</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}