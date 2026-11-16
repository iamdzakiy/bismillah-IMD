'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GdvBloom, GdvStar } from './GdvShapes';

interface Specimen {
  code: string;
  genus: string;
  species: string;
  domain: string;
  gram: string;
  shape: string;
  oxygen: string;
  role: string;
  art: 'rod' | 'oval' | 'diplo' | 'coccobacillus' | 'yeast';
}

// Five well-studied members of the human gut community, chosen to preview the
// symposium theme. Facts are deliberately conservative.
const SPECIMENS: Specimen[] = [
  {
    code: 'GUT-01',
    genus: 'Lactobacillus',
    species: 'acidophilus',
    domain: 'Bacteria',
    gram: 'Gram-positive',
    shape: 'Rod',
    oxygen: 'Microaerophilic',
    role: 'Ferments sugars into lactic acid, which lowers pH. A familiar strain in yoghurt and probiotic products.',
    art: 'rod',
  },
  {
    code: 'GUT-02',
    genus: 'Bacteroides',
    species: 'thetaiotaomicron',
    domain: 'Bacteria',
    gram: 'Gram-negative',
    shape: 'Rod',
    oxygen: 'Obligate anaerobe',
    role: 'Carries a large toolkit of polysaccharide-degrading genes, so it can break down plant fibres our own enzymes cannot.',
    art: 'rod',
  },
  {
    code: 'GUT-03',
    genus: 'Akkermansia',
    species: 'muciniphila',
    domain: 'Bacteria',
    gram: 'Gram-negative',
    shape: 'Oval',
    oxygen: 'Strict anaerobe',
    role: 'Lives in the intestinal mucus layer and uses mucin as food. Higher levels are associated with better metabolic health in human studies.',
    art: 'oval',
  },
  {
    code: 'GUT-04',
    genus: 'Methanobrevibacter',
    species: 'smithii',
    domain: 'Archaea',
    gram: 'Stains Gram-positive, but the wall is pseudomurein',
    shape: 'Coccobacillus',
    oxygen: 'Strict anaerobe',
    role: 'The most common archaeon in the human gut. It consumes the hydrogen other microbes release and turns it into methane.',
    art: 'coccobacillus',
  },
  {
    code: 'GUT-05',
    genus: 'Saccharomyces',
    species: 'cerevisiae var. boulardii',
    domain: 'Eukarya (Fungi)',
    gram: 'Not applicable, yeast',
    shape: 'Oval, budding',
    oxygen: 'Facultative anaerobe',
    role: 'A probiotic yeast studied for preventing antibiotic-associated diarrhoea. Proof that not every gut microbe is a bacterium.',
    art: 'yeast',
  },
];

function SpecimenArt({ art, revealed }: { art: Specimen['art']; revealed: boolean }) {
  const stroke = revealed ? '#62F2BD' : 'rgba(241,249,200,0.35)';
  const fill = revealed ? 'rgba(98,242,189,0.18)' : 'rgba(241,249,200,0.06)';
  const common = { stroke, fill, strokeWidth: 2.5, style: { transition: 'all 600ms ease' } };
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="none" stroke="rgba(241,249,200,0.12)" strokeDasharray="2 5" />
      {art === 'rod' && (
        <>
          <rect x="22" y="42" width="52" height="18" rx="9" {...common} />
          <rect x="50" y="66" width="50" height="18" rx="9" {...common} transform="rotate(-18 75 75)" />
        </>
      )}
      {art === 'oval' && (
        <>
          <ellipse cx="46" cy="52" rx="16" ry="12" {...common} />
          <ellipse cx="76" cy="70" rx="16" ry="12" {...common} />
        </>
      )}
      {art === 'diplo' && (
        <>
          <circle cx="50" cy="60" r="14" {...common} />
          <circle cx="72" cy="60" r="14" {...common} />
        </>
      )}
      {art === 'coccobacillus' && (
        <>
          <rect x="30" y="46" width="30" height="20" rx="10" {...common} />
          <rect x="62" y="58" width="30" height="20" rx="10" {...common} />
          <rect x="44" y="72" width="30" height="20" rx="10" {...common} />
        </>
      )}
      {art === 'yeast' && (
        <>
          <ellipse cx="54" cy="64" rx="24" ry="20" {...common} />
          <ellipse cx="82" cy="44" rx="11" ry="9" {...common} />
          <circle cx="50" cy="62" r="6" fill="none" stroke={stroke} strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}

export function GutDecoder() {
  const [open, setOpen] = useState<string[]>([]);
  const all = open.length === SPECIMENS.length;

  const toggle = (code: string) =>
    setOpen((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));

  return (
    <section
      id="decode"
      className="relative scroll-mt-20 overflow-hidden bg-paper px-4 py-24 text-ink-900 sm:px-6 md:py-32"
      aria-labelledby="decode-title"
    >
      <GdvBloom className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 text-royal/10" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="tag-mono mb-4 flex items-center gap-2 text-royal">
              <GdvStar className="h-3 w-3" /> Specimen bench
            </p>
            <h2 id="decode-title" className="max-w-3xl text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em]">
              Five unknowns from your gut. Decode them.
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-ink-900/70">
              Your intestine hosts trillions of microbes from all three domains of life. Open each sample to read its
              profile, then meet the experts at the symposium.
            </p>
            <div className="mt-5 flex items-center gap-3" aria-live="polite">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-900/10">
                <motion.div
                  className="h-full rounded-full bg-royal"
                  animate={{ width: `${(open.length / SPECIMENS.length) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
              </div>
              <span className="font-display text-sm font-semibold tabular-nums text-royal">
                {open.length}/{SPECIMENS.length} decoded
              </span>
            </div>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {SPECIMENS.map((s, i) => {
            const isOpen = open.includes(s.code);
            return (
              <motion.li
                key={s.code}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <button
                  type="button"
                  onClick={() => toggle(s.code)}
                  aria-expanded={isOpen}
                  className={`group flex h-full w-full flex-col rounded-3xl p-5 text-left transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-1 focus-visible:ring-offset-paper ${
                    isOpen ? 'bg-ink-900 text-paper shadow-xl shadow-royal/20' : 'bg-white/70 text-ink-900 ring-1 ring-ink-900/10 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`tag-mono ${isOpen ? 'text-mint' : 'text-royal'}`}>{s.code}</span>
                    <span
                      className={`rounded-full px-2.5 py-1 font-display text-[11px] font-semibold ${
                        isOpen ? 'bg-mint text-ink-950' : 'bg-royal text-paper'
                      }`}
                    >
                      {isOpen ? 'Decoded' : 'Decode'}
                    </span>
                  </div>

                  <div className={`mx-auto my-5 h-28 w-28 rounded-full ${isOpen ? 'bg-ink-800' : 'bg-ink-900'} p-2 transition-colors`}>
                    <SpecimenArt art={s.art} revealed={isOpen} />
                  </div>

                  <AnimatePresence mode="wait" initial={false}>
                    {isOpen ? (
                      <motion.div
                        key="open"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="font-display text-lg font-semibold leading-tight">
                          <i>{s.genus}</i>{' '}
                          {s.species.split(' var. ').map((part, k) => (
                            <span key={part}>
                              {k > 0 && ' var. '}
                              <i>{part}</i>
                            </span>
                          ))}
                        </p>
                        <dl className="mt-3 space-y-1.5 text-xs">
                          {[
                            ['Domain', s.domain],
                            ['Gram', s.gram],
                            ['Shape', s.shape],
                            ['Oxygen', s.oxygen],
                          ].map(([k, v]) => (
                            <div key={k} className="flex gap-2">
                              <dt className="w-14 flex-shrink-0 text-paper/45">{k}</dt>
                              <dd className="text-paper/85">{v}</dd>
                            </div>
                          ))}
                        </dl>
                        <p className="mt-4 text-sm leading-relaxed text-paper/70">{s.role}</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="closed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="font-display text-lg font-semibold tracking-[0.12em] text-ink-900/35">
                          {s.genus.replace(/[a-z]/gi, (c, k: number) => 'ACGT'[(k + i) % 4])}
                        </p>
                        <p className="mt-2 text-sm text-ink-900/55">Unidentified isolate. Tap to read its profile.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.li>
            );
          })}
        </ul>

        <AnimatePresence>
          {all && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 flex flex-col items-start gap-4 rounded-3xl bg-royal p-6 text-paper sm:flex-row sm:items-center sm:justify-between sm:p-8"
            >
              <p className="font-display text-xl font-semibold">
                Bench cleared. Bacteria, archaea and a fungus: all three domains live in you.
              </p>
              <Link href="/#events" className="btn-glow flex-shrink-0">
                Meet the symposium speakers
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
