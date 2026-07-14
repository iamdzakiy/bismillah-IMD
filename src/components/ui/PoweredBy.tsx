'use client';

import { motion } from 'framer-motion';
import { POWERED_BY } from '@/lib/constants';

export function PoweredBy() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-1.5 glass rounded-full text-bio-cyan text-xs font-semibold uppercase tracking-widest mb-4">
          Supported By
        </span>
        <h2 className="text-3xl md:text-5xl font-black mb-3">
          <span className="text-gradient">Powered By</span>
        </h2>
        <p className="text-white/50 text-sm">In collaboration with leading institutions</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
        {POWERED_BY.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
          >
            <div className="glass rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center min-h-[140px] border border-white/10 hover:border-bio-cyan/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-bio-cyan/10">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-bio-cyan/10 to-bio-purple/10 flex items-center justify-center mb-3">
                <span className="text-3xl md:text-4xl font-bold text-gradient">
                  {item.name.charAt(0)}
                </span>
              </div>
              <p className="text-white/70 text-xs md:text-sm font-medium text-center leading-tight">
                {item.name}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}