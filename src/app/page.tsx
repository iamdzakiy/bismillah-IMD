import { HeroSection } from './_components/HeroSection';
import { CompetitionsSection } from './_components/CompetitionsSection';
import { TimelineSection } from './_components/TimelineSection';
import { FAQSection } from './_components/FAQSection';
import { MemoriesGallery } from '@/components/ui/MemoriesGallery';
import { SponsorMarquee } from '@/components/ui/SponsorMarquee';
import { TimelineSlider } from '@/components/ui/TimelineSlider';
import { RoadshowPopup } from '@/components/ui/RoadshowPopup';
import { CursorGlow } from '@/components/ui/CursorGlow';
import { PoweredBy } from '@/components/ui/PoweredBy';
import { MascotDecoration } from '@/components/ui/MascotDecoration';
import { StarBackground } from '@/components/ui/StarBackground';
import { MEDIA_PARTNERS, INDUSTRY_PARTNERS } from '@/lib/constants';

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-space-900 text-white">
      <StarBackground />
      <div className="relative z-10">
        <CursorGlow />
        <RoadshowPopup />
        <HeroSection />

      {/* Mascots around hero */}
      <div className="relative max-w-7xl mx-auto px-4 -mt-8 mb-8">
        <MascotDecoration count={4} size="md" className="justify-center" />
      </div>
      
      {/* What is IMD - bisa ditambahkan di sini jika mau */}
      
      {/* Timeline Slider */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-10 tracking-tight">IMD 2026 ITB Event Timeline</h2>
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 glass rounded-full text-bio-cyan text-xs font-semibold uppercase tracking-widest mb-4">
            Your Journey
          </span>
          <h2 className="text-4xl md:text-6xl font-black mb-4">
            <span className="text-gradient">Event Timeline</span>
          </h2>
          <p className="text-white/50">Key milestones throughout IMD 2026</p>
        </div>
        <TimelineSlider />
      </section>

      {/* Memories Gallery */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-10 tracking-tight">IMD 2026 ITB Gallery</h2>
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 glass rounded-full text-bio-emerald text-xs font-semibold uppercase tracking-widest mb-4">
            Memories
          </span>
          <h2 className="text-4xl md:text-6xl font-black mb-4">
            <span className="text-gradient">Gallery of Previous Years</span>
          </h2>
          <p className="text-white/50">Relive the moments that made IMD special</p>
        </div>
        <MemoriesGallery />
      </section>

      {/* Sponsors */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-10 tracking-tight">IMD 2026 ITB Partners</h2>
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 glass rounded-full text-bio-purple text-xs font-semibold uppercase tracking-widest mb-4">
            Partners
          </span>
          <h2 className="text-4xl md:text-6xl font-black mb-4">
            <span className="text-gradient">Our Partners & Sponsors</span>
          </h2>
        </div>

        <div className="space-y-12">
          <div>
            <h3 className="text-center text-sm font-semibold text-white/40 uppercase tracking-wider mb-6">
              Media Partners
            </h3>
            <SponsorMarquee items={MEDIA_PARTNERS} direction="left" speed={1.2} />
          </div>
          <div>
            <h3 className="text-center text-sm font-semibold text-white/40 uppercase tracking-wider mb-6">
              Industry Partners
            </h3>
            <SponsorMarquee items={INDUSTRY_PARTNERS} direction="right" speed={1} />
          </div>
        </div>
      </section>

      <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-10 tracking-tight">IMD 2026 ITB Competitions</h2>
      <CompetitionsSection />

      {/* Mascots around competitions */}
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <MascotDecoration count={4} size="lg" className="justify-center" />
      </div>

      {/* Powered By */}
      <PoweredBy />

      <FAQSection />
      </div>
    </main>
  );
}
