// src/components/ui/SuccessPopup.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  mascotImage?: string;
}

export function SuccessPopup({ 
  isOpen, 
  onClose, 
  message = 'Success! 🎉',
  mascotImage = '/4.svg' // Archaea 4.svg
}: SuccessPopupProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto close after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            exit={{ y: 20 }}
            className="glass-strong rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative orbs */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-bio-emerald/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-bio-cyan/20 rounded-full blur-2xl" />
            
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 mx-auto mb-4"
            >
              <img 
                src={mascotImage} 
                alt="Mascot" 
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </motion.div>
            
            <h3 className="text-2xl font-bold text-bio-emerald mb-2">
              🎉 Selamat!
            </h3>
            <p className="text-white/80 text-lg">{message}</p>
            
            <div className="mt-6 flex justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="w-2 h-2 bg-bio-emerald rounded-full"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}