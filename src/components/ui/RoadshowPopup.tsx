'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function RoadshowPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('imd2026_popup_seen');
    if (!seen) {
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem('imd2026_popup_seen', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
          onClick={(e) => e.target === e.currentTarget && closePopup()}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl glass-strong rounded-3xl p-6 md:p-8 overflow-y-auto max-h-[90vh]"
          >
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-red-500/20 transition-all"
            >
              <i className="fas fa-times"></i>
            </button>

            <div className="text-center">
              <div className="inline-block px-4 py-1.5 glass rounded-full text-bio-cyan text-xs font-bold uppercase tracking-wider mb-4">
                <i className="fas fa-bus mr-2"></i> ROADSHOW 2026
              </div>

              <h3 className="text-3xl md:text-4xl font-black mb-3">
                The Great <span className="text-gradient">Microbial Odyssey</span>
              </h3>

              <p className="text-white/60 text-sm mb-6">
                Watch our official roadshow teaser and get ready for the biggest microbiology event in Indonesia!
              </p>

              <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-black">
                <iframe
                  src="https://www.youtube.com/embed/EZOiy1-cnxM?autoplay=1&rel=0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-sm text-white/60 mb-6">
                <div className="flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-bio-cyan"></i>
                  <span>ITB Ganesha, Bandung</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-calendar text-bio-cyan"></i>
                  <span>Coming Soon 2026</span>
                </div>
              </div>

              <button
                onClick={closePopup}
                className="btn-glow w-full"
              >
                <i className="fas fa-arrow-right mr-2"></i> Explore Competitions
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}