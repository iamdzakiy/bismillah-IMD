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
            <div className="glass rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center min-h-[160px] border border-white/10 hover:border-bio-cyan/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-bio-cyan/10 group cursor-pointer">
              <div className="w-36 h-36 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-white/5 to-white/5 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/10 group-hover:border-bio-cyan/30 transition-all duration-300 shadow-2xl">
                <img src={item.image} alt={item.name} className="w-32 h-32 md:w-32 md:h-32 object-contain" />
              </div>
              <p className="text-white/80 text-xs md:text-sm font-medium text-center leading-tight group-hover:text-white transition-colors">
                {item.name}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}