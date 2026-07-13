'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import DecodeCore from './DecodeCore';
import NavigationPanel from './NavigationPanel';

const BiomeParticles = dynamic(() => import('./BiomeParticles'), { ssr: false });
const BioScannerLens = dynamic(() => import('./BioScannerLens'), { ssr: false });
const HUDOverlay = dynamic(() => import('./HUDOverlay'), { ssr: false });

export default function SpaceshipHero() {
  const mousePosition = useRef({ x: 0, y: 0 });
  const [isDecoded, setIsDecoded] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);

  const handleDecodeComplete = () => {
    setIsDecoded(true);
    setTimeout(() => setShowScrollHint(true), 2000);
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#050a18]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#050a18] to-[#020408]" />
      <BiomeParticles mousePosition={mousePosition} />
      <HUDOverlay />
      <BioScannerLens mousePosition={mousePosition} />

      <div className="relative z-20 min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-6 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="hidden lg:block">
              <NavigationPanel />
            </motion.div>

            <div className="flex flex-col items-center">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }} className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-500/30" />
                  <span className="text-[10px] font-mono text-cyan-400/40 tracking-[0.3em] uppercase">IMD 2026</span>
                  <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-500/30" />
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tight">
                  <span className="text-white">The Great</span>{' '}
                  <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent">Microbial</span>{' '}
                  <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">Odyssey</span>
                </h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="mt-3 text-sm text-white/30 font-mono tracking-[0.15em] max-w-xl mx-auto">
                  Decoding the Earth's Dark Matter to Orchestrate a Sustainable Future
                </motion.p>
              </motion.div>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="text-xs text-center text-white/15 font-mono tracking-wider max-w-md mb-8 leading-relaxed">
                99% of the microbial universe remains unculturable, hidden in the shadows of the unknown.
                Are you ready to decode the Earth's dark matter?
              </motion.p>

              <DecodeCore onDecodeComplete={handleDecodeComplete} />

              <AnimatePresence>
                {isDecoded && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="mt-8 lg:hidden">
                    <NavigationPanel />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden lg:block" />
          </div>
        </div>

        <AnimatePresence>
          {showScrollHint && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-8 text-center">
              <motion.p className="text-[10px] font-mono text-white/15 tracking-widest" animate={{ opacity: [0.15, 0.4, 0.15] }} transition={{ duration: 2, repeat: Infinity }}>
                SCROLL TO EXPLORE
              </motion.p>
              <motion.div className="mt-2 mx-auto w-4 h-6 border border-white/10 rounded-full flex justify-center" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
                <motion.div className="w-1 h-1.5 bg-white/30 rounded-full mt-1" animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-emerald-500/3 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050a18] to-transparent pointer-events-none z-20" />
    </section>
  );
}