import { Hero } from './_components/landing/Hero';
import { DarkMatter } from './_components/landing/DarkMatter';
import { Competitions } from './_components/landing/Competitions';
import { Timeline } from './_components/landing/Timeline';
import { FAQSection } from './_components/FAQSection';
import { MemoriesGallery } from '@/components/ui/MemoriesGallery';
import { SponsorMarquee } from '@/components/ui/SponsorMarquee';
import { RoadshowPopup } from '@/components/ui/RoadshowPopup';
import { PoweredBy } from '@/components/ui/PoweredBy';
import { MEDIA_PARTNERS } from '@/lib/constants';

const GUIDEBOOK_URL = 'https://drive.google.com/file/d/1XQdURa56gx-El9M1j1pX6n_Tb15Km-Tu/view';

export default function HomePage() {
  return (
    <div className="relative bg-ink-900 text-paper">
      <RoadshowPopup />
      <Hero />
      <DarkMatter />
      <Competitions />
      <Timeline />

      <section className="py-24 md:py-32" aria-labelledby="gallery-title">
        <div className="mx-auto mb-12 flex max-w-7xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="tag-mono mb-4">Archive</p>
            <h2 id="gallery-title" className="text-[clamp(2.4rem,6vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.03em]">
              Previous editions.
            </h2>
          </div>
          <p className="max-w-sm text-white/60">
            Petri dish art, the Microverse exhibition and awarding night from IMD 2024 and 2025.
          </p>
        </div>
        <MemoriesGallery />
      </section>

      <section className="border-y border-white/10 py-10" aria-labelledby="media-title">
        <h2 id="media-title" className="tag-mono mb-6 px-4 text-center">
          Media partners
        </h2>
        <SponsorMarquee items={MEDIA_PARTNERS} duration={45} />
      </section>

      <PoweredBy />
      <FAQSection />

      <section className="px-4 pb-28 pt-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 rounded-3xl bg-agar p-8 text-ink-950 sm:p-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-950/60">Guidebook</p>
            <p className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Every rule, rubric and deadline is in the competition guidebook.
            </p>
          </div>
          <a
            href={GUIDEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-shrink-0 items-center justify-center rounded-full bg-ink-950 px-7 py-3 font-semibold text-paper transition-colors hover:bg-ink-800"
          >
            Open the guidebook (PDF)
          </a>
        </div>
      </section>
    </div>
  );
}
