import { notFound } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientText } from '@/components/ui/GradientText';
import { COMPETITIONS } from '@/lib/competitions-data';
import { Metadata } from 'next';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const comp = COMPETITIONS.find(c => c.id === params.slug);
  if (!comp) return { title: 'Competition Not Found' };
  return {
    title: `${comp.title} – IMD 2026`,
    description: comp.description,
    keywords: `IMD 2026, ${comp.title}, ${comp.shortName}, Microbiology Competition, ITB, Archaea`,
  };
}

export default function CompetitionPage({ params }: { params: { slug: string } }) {
  const comp = COMPETITIONS.find(c => c.id === params.slug);
  if (!comp) notFound();

  return (
    <div className="min-h-screen bg-space-900 text-white pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 glass rounded-full text-bio-cyan text-xs font-semibold uppercase tracking-widest mb-4">
            {comp.category}
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <GradientText>{comp.title}</GradientText>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            {comp.fullDescription}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {comp.benefits.map((benefit, i) => (
            <GlassCard key={i} className="p-6 text-center" glow={comp.glowColor}>
              <div className="text-4xl mb-2">{benefit.icon}</div>
              <p className="text-sm text-white/60 mb-1">{benefit.title}</p>
              <p className="text-lg font-bold text-bio-cyan">{benefit.value}</p>
            </GlassCard>
          ))}
        </div>

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <GlassCard glow="cyan" className="p-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-bio-cyan">📋</span> Competition Details
            </h3>
            <div className="space-y-4 text-white/70">
              <div>
                <p className="font-semibold text-white">Format</p>
                <p className="text-sm">{comp.format}</p>
              </div>
              <div>
                <p className="font-semibold text-white">Team Size</p>
                <p className="text-sm">{comp.teamSize}</p>
              </div>
              <div>
                <p className="font-semibold text-white">Eligibility</p>
                <p className="text-sm">{comp.eligibility}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard glow="purple" className="p-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-bio-purple">🧪</span> Requirements
            </h3>
            <ul className="space-y-3 text-white/70">
              {comp.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-bio-purple font-bold">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>

        {/* Why Join */}
        <h2 className="text-4xl font-bold mb-8 text-center">
          <span className="text-gradient-purple">Why You Should Join</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {comp.whyJoin.map((item, i) => (
            <GlassCard key={i} className="p-6" glow="cyan">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-white/70 leading-relaxed">{item.desc}</p>
            </GlassCard>
          ))}
        </div>

        {/* Timeline */}
        <GlassCard className="p-8 mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center">
            <span className="text-gradient">Competition Timeline</span>
          </h3>
          <div className="space-y-4">
            {comp.timeline.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 glass-dark rounded-xl">
                <div className="w-12 h-12 rounded-full bg-bio-cyan/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-bio-cyan font-bold">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white">{item.phase}</p>
                  <p className="text-bio-cyan text-sm">{item.date}</p>
                </div>
                <p className="text-white/60 text-sm hidden md:block">{item.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* FAQ */}
        {comp.faq && comp.faq.length > 0 && (
          <GlassCard className="p-8 mb-12">
            <h3 className="text-2xl font-bold mb-6 text-center">
              <span className="text-gradient">Frequently Asked Questions</span>
            </h3>
            <div className="space-y-4">
              {comp.faq.map((item, i) => (
                <div key={i} className="p-4 glass-dark rounded-xl">
                  <p className="font-bold text-white mb-1">{item.q}</p>
                  <p className="text-white/70 text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* CTA */}
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="p-12" glow="cyan">
            <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
            <p className="text-white/70 mb-8">Register your team now and start your microbial odyssey!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/dashboard" className="btn-glow">
                Register Now
              </a>
              <a href="/guidebook.pdf" target="_blank" className="btn-glass">
                Download Guidebook
              </a>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}