import { notFound } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientText } from '@/components/ui/GradientText';
import { COMPETITIONS, GRAND_THEME, PAYMENT_INFO, SOCIAL_MEDIA } from '@/lib/competitions-data';
import { Metadata } from 'next';
import Link from 'next/link';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const comp = COMPETITIONS.find(c => c.id === slug);
  if (!comp) return { title: 'Competition Not Found' };
  return {
    title: `${comp.title} – IMD 2026`,
    description: comp.description,
    keywords: `IMD 2026, ${comp.title}, ${comp.shortName}, Microbiology Competition, ITB, Archaea`,
  };
}

function glowBorderClass(glowColor: string) {
  const map: Record<string, string> = {
    blue: 'border-bio-blue/30 bg-bio-blue/5',
    pink: 'border-bio-pink/30 bg-bio-pink/5',
    green: 'border-bio-green/30 bg-bio-green/5',
    purple: 'border-bio-purple/30 bg-bio-purple/5',
  };
  return map[glowColor] || 'border-white/10 bg-white/5';
}

function GlowBadge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    blue: 'text-bio-blue border-bio-blue/30 bg-bio-blue/10',
    pink: 'text-bio-pink border-bio-pink/30 bg-bio-pink/10',
    green: 'text-bio-green border-bio-green/30 bg-bio-green/10',
    purple: 'text-bio-purple border-bio-purple/30 bg-bio-purple/10',
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
}

function SectionTitle({ children, glow = 'blue' }: { children: React.ReactNode; glow?: string }) {
  return (
    <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gradient">
      {children}
    </h2>
  );
}

function getCompColor(isOlympiad: boolean, isSPC: boolean, isNEC: boolean) {
  if (isOlympiad) return 'text-bio-blue';
  if (isSPC) return 'text-bio-pink';
  if (isNEC) return 'text-bio-green';
  return 'text-white';
}

function getCompBg(isOlympiad: boolean, isSPC: boolean, isNEC: boolean) {
  if (isOlympiad) return 'bg-bio-blue';
  if (isSPC) return 'bg-bio-pink';
  if (isNEC) return 'bg-bio-green';
  return 'bg-white';
}

function getCompBadge(isOlympiad: boolean, isSPC: boolean, isNEC: boolean) {
  if (isOlympiad) return 'bg-bio-blue/10 text-bio-blue border-bio-blue/30';
  if (isSPC) return 'bg-bio-pink/10 text-bio-pink border-bio-pink/30';
  if (isNEC) return 'bg-bio-green/10 text-bio-green border-bio-green/30';
  return 'bg-white/10 text-white';
}

function getCompHex(isOlympiad: boolean, isSPC: boolean, isNEC: boolean) {
  if (isOlympiad) return '#3b82f6';
  if (isSPC) return '#ec4899';
  if (isNEC) return '#10b981';
  return '#a78bfa';
}

export default async function CompetitionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comp = COMPETITIONS.find(c => c.id === slug);
  if (!comp) notFound();

  const isOlympiad = comp.id === 'olympiad';
  const isSPC = comp.id === 'spc';
  const isNEC = comp.id === 'nec';

  const defaultGuidebookUrl = '#'; // Placeholder - replace with actual URL

  return (
    <div className="min-h-screen bg-space-900 text-white pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* ===== HERO ===== */}
        <div className="text-center mb-16">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <span className={`inline-block px-4 py-1.5 glass rounded-full text-xs font-semibold uppercase tracking-widest ${getCompColor(isOlympiad, isSPC, isNEC)}`}>
              {comp.category}
            </span>
            <span className="inline-block px-4 py-1.5 glass rounded-full text-white/70 text-xs font-semibold uppercase tracking-widest">
              {comp.scale}
            </span>
            <span className="inline-block px-4 py-1.5 glass rounded-full text-white/70 text-xs font-semibold uppercase tracking-widest">
              {comp.format}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <GradientText>{comp.title}</GradientText>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-4">
            {comp.fullDescription}
          </p>
          <p className="text-sm text-white/50 max-w-2xl mx-auto">
            Organizer: {comp.organizer}
          </p>
          
          {/* Guidebook Download */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a
              href={defaultGuidebookUrl}
              download
              className="btn-glass inline-flex items-center gap-2 text-sm"
              onClick={(e) => {
                e.preventDefault();
                window.open(defaultGuidebookUrl, '_blank');
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Guidebook
            </a>
            <Link href="/dashboard" className="btn-glow text-sm">
              Register Now
            </Link>
          </div>
        </div>

        {/* ===== EMBEDDED PDF ===== */}
        <GlassCard glow={comp.glowColor as any} className="p-8 mb-12">
          <SectionTitle glow={comp.glowColor}>Guidebook Preview</SectionTitle>
          <div className="text-center mb-6">
            <a
              href={defaultGuidebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all border ${getCompBadge(isOlympiad, isSPC, isNEC)}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Open Full Guidebook PDF ↗
            </a>
          </div>
          <div className="relative w-full rounded-xl overflow-hidden border border-white/10" style={{ height: '500px' }}>
            <iframe
              src={`${defaultGuidebookUrl}#view=FitH`}
              className="absolute inset-0 w-full h-full"
              style={{ border: 'none' }}
              title={`${comp.shortName} Guidebook`}
            />
            {/* Fallback for when PDF can't load */}
            <div className="absolute inset-0 flex items-center justify-center bg-space-900/80 backdrop-blur-sm">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">📄</div>
                <p className="text-white/70 mb-4">Guidebook preview not available</p>
                <a
                  href={defaultGuidebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all border ${getCompBadge(isOlympiad, isSPC, isNEC)}`}
                >
                  Download PDF Instead
                </a>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* ===== GRAND THEME ===== */}
        <GlassCard glow={comp.glowColor as any} className="p-8 mb-12 text-center">
          <h3 className="text-lg font-semibold text-white/60 mb-3 uppercase tracking-widest text-xs">Grand Theme</h3>
          <p className="text-2xl md:text-3xl font-bold leading-tight text-gradient">
            {GRAND_THEME.title}
          </p>
        </GlassCard>

        {/* ===== VISION & MISSION ===== */}
        {comp.vision && (
          <GlassCard glow={comp.glowColor as any} className="p-8 mb-12">
            <SectionTitle glow={comp.glowColor}>Vision & Mission</SectionTitle>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-white/80 italic mb-6 text-center leading-relaxed">"{comp.vision}"</p>
              {comp.mission && comp.mission.length > 0 && (
                <div>
                  <h4 className="font-bold text-white mb-4 text-center">Mission</h4>
                  <ul className="space-y-3">
                    {comp.mission.map((m, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/70">
                        <span className={`font-bold ${getCompColor(isOlympiad, isSPC, isNEC)}`}>{i + 1}.</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </GlassCard>
        )}

        {/* ===== ELIGIBILITY ===== */}
        {comp.eligibilityDetails && (
          <GlassCard glow={comp.glowColor as any} className="p-8 mb-12">
            <SectionTitle glow={comp.glowColor}>Eligibility Requirements</SectionTitle>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-emerald-400 mb-3 flex items-center gap-2">
                  <span>✅</span> Who Can Participate
                </h4>
                <ul className="space-y-2 text-white/70">
                  {comp.eligibilityDetails.canParticipate.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                  <span>❌</span> Who Cannot Participate
                </h4>
                <ul className="space-y-2 text-white/70">
                  {comp.eligibilityDetails.cannotParticipate.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div className="p-4 glass-dark rounded-xl">
                <h4 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">Document Requirements</h4>
                <ul className="space-y-1 text-white/60 text-sm">
                  {comp.eligibilityDetails.documentRequirements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={getCompColor(isOlympiad, isSPC, isNEC)}>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 glass-dark rounded-xl">
                <h4 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">Multiple Participants</h4>
                <p className="text-white/60 text-sm">{comp.eligibilityDetails.multiplePerSchool}</p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* ===== REGISTRATION ===== */}
        {comp.registration && (
          <GlassCard glow={comp.glowColor as any} className="p-8 mb-12">
            <SectionTitle glow={comp.glowColor}>Registration Details</SectionTitle>
            <div className="space-y-8">
              {/* Batches & Fees */}
              <div>
                <h4 className="font-bold text-white mb-4 text-lg">Registration Fees</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {comp.registration.batches.map((batch, i) => (
                    <div key={i} className={`p-5 rounded-xl border ${
                      i === 0 ? 'border-bio-blue/30 bg-bio-blue/5' : 'border-bio-purple/30 bg-bio-purple/5'
                    }`}>
                      <p className="font-bold text-white text-lg">{batch.name}</p>
                      <p className="text-sm text-white/60 mt-1">{batch.period}</p>
                      <p className={`text-2xl font-black mt-2 ${
                        i === 0 ? 'text-bio-blue' : 'text-bio-purple'
                      }`}>{batch.fee}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-white/50 mt-3">
                  Registration Link: <a href={comp.registration.link} className={getCompColor(isOlympiad, isSPC, isNEC) + ' underline'} target="_blank" rel="noopener noreferrer">{comp.registration.link}</a>
                </p>
              </div>

              {/* Required Documents */}
              <div>
                <h4 className="font-bold text-white mb-4 text-lg">Required Documents & File Naming</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 font-semibold text-white/80">Document</th>
                        <th className="text-left py-3 px-4 font-semibold text-white/80">File Naming Format</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comp.registration.requiredDocuments.map((doc, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td className="py-3 px-4 text-white/70">{doc.item}</td>
                          <td className="py-3 px-4 text-white/50 font-mono text-xs">{doc.namingFormat}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="font-bold text-white mb-4 text-lg">Social Media Requirements</h4>
                <ul className="space-y-2">
                  {comp.registration.socialMediaRequirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/70">
                      <span className={`font-bold ${getCompColor(isOlympiad, isSPC, isNEC)}`}>•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Payment */}
              <div>
                <h4 className="font-bold text-white mb-4 text-lg">Payment Information</h4>
                <div className="p-5 rounded-xl border border-bio-blue/30 bg-bio-blue/5">
                  <div className="grid sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wider">Bank</p>
                      <p className="font-bold text-white">{comp.registration.paymentDetails.bank}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wider">Account Number</p>
                      <p className="font-bold text-bio-blue text-lg">{comp.registration.paymentDetails.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wider">Account Holder</p>
                      <p className="font-bold text-white">{comp.registration.paymentDetails.accountHolder}</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/50">{comp.registration.paymentDetails.notes}</p>
                </div>
              </div>

              {/* Verification */}
              <div className="p-5 rounded-xl border border-white/10 bg-white/5">
                <h4 className="font-bold text-white mb-3 text-lg">Verification Process</h4>
                <p className="text-white/70 text-sm leading-relaxed">{comp.registration.verificationProcess}</p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* ===== SYLLABUS (MO only) ===== */}
        {comp.syllabus && comp.syllabus.length > 0 && (
          <GlassCard glow={comp.glowColor as any} className="p-8 mb-12">
            <SectionTitle glow={comp.glowColor}>Competition Syllabus</SectionTitle>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comp.syllabus.map((topic, i) => (
                <div key={i} className={`p-4 rounded-xl border ${glowBorderClass(comp.glowColor)}`}>
                  <p className="text-white font-medium text-sm">{topic}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* ===== SUBTHEMES (SPC/NEC) ===== */}
        {comp.subthemes && comp.subthemes.length > 0 && (
          <GlassCard glow={comp.glowColor as any} className="p-8 mb-12">
            <SectionTitle glow={comp.glowColor}>Competition Sub-Themes</SectionTitle>
            <div className="space-y-8">
              {comp.subthemes.map((theme, i) => (
                <div key={i} className={`p-6 rounded-xl border ${glowBorderClass(comp.glowColor)}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getCompBadge(isSPC, false, !isSPC)}`}>
                      {i + 1}
                    </span>
                    <h4 className="text-xl font-bold text-white">{theme.name}</h4>
                  </div>
                  <p className="text-white/60 text-sm mb-4">{theme.focus}</p>
                  <div className="mb-4">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Topics Covered</p>
                    <ul className="flex flex-wrap gap-2">
                      {theme.topics.map((topic, j) => (
                        <li key={j} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs">
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {theme.keywords.map((kw, j) => (
                        <span key={j} className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCompBadge(isSPC, false, !isSPC)}`}>
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* ===== TIMELINE ===== */}
        <GlassCard glow={comp.glowColor as any} className="p-8 mb-12">
          <SectionTitle glow={comp.glowColor}>Complete Timeline</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-semibold text-white/80">Activity</th>
                  <th className="text-left py-3 px-4 font-semibold text-white/80">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-white/80">Platform</th>
                </tr>
              </thead>
              <tbody>
                {comp.timeline.map((item, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${getCompBg(isOlympiad, isSPC, isNEC)}`} />
                        <span className="text-white font-medium">{item.phase}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white/60">{item.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs ${
                        item.platform.includes('Offline') || item.platform.includes('In-person')
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-bio-blue/10 text-bio-blue border border-bio-blue/30'
                      }`}>
                        {item.platform}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* ===== ELIMINATION PHASE (MO only) ===== */}
        {comp.eliminationPhase && (
          <GlassCard glow={comp.glowColor as any} className="p-8 mb-12">
            <SectionTitle glow={comp.glowColor}>Elimination Phase (Preliminary Round)</SectionTitle>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-5 rounded-xl border ${glowBorderClass('blue')}`}>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Format</p>
                  <p className="text-white/80 text-sm">{comp.eliminationPhase.format}</p>
                </div>
                <div className={`p-5 rounded-xl border ${glowBorderClass('blue')}`}>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Duration</p>
                  <p className="text-white/80 text-lg font-bold">{comp.eliminationPhase.duration}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white mb-3">Question Structure</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 font-semibold text-white/80">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-white/80">Count</th>
                        <th className="text-left py-3 px-4 font-semibold text-white/80">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comp.eliminationPhase.questions.map((q, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td className="py-3 px-4 text-bio-blue font-medium">{q.type}</td>
                          <td className="py-3 px-4 text-white font-bold">{q.count}</td>
                          <td className="py-3 px-4 text-white/60 text-xs">{q.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white mb-3">Scoring System</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                    <p className="text-xs text-white/50 uppercase">Correct</p>
                    <p className="text-2xl font-bold text-emerald-400">{comp.eliminationPhase.scoring.correct}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
                    <p className="text-xs text-white/50 uppercase">Incorrect</p>
                    <p className="text-2xl font-bold text-red-400">{comp.eliminationPhase.scoring.incorrect}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <p className="text-xs text-white/50 uppercase">Unanswered</p>
                    <p className="text-2xl font-bold text-white/60">{comp.eliminationPhase.scoring.unanswered}</p>
                  </div>
                </div>
                <p className="text-center text-white/50 text-sm mt-3">Maximum Score: <span className="font-bold text-bio-blue">{comp.eliminationPhase.scoring.maxScore}</span></p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* ===== FINAL PHASE (MO only) ===== */}
        {comp.finalPhase && (
          <GlassCard glow={comp.glowColor as any} className="p-8 mb-12">
            <SectionTitle glow={comp.glowColor}>Final Phase</SectionTitle>
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Venue</p>
                <p className="text-white font-bold">{comp.finalPhase.venue}</p>
              </div>

              <h4 className="font-bold text-white text-lg">Assessment Components</h4>
              <div className="grid md:grid-cols-2 gap-6">
                {comp.finalPhase.components.map((component, i) => (
                  <div key={i} className={`p-6 rounded-xl border ${
                    i === 0 ? 'border-bio-blue/30 bg-bio-blue/5' : 'border-bio-purple/30 bg-bio-purple/5'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-bold text-white">{component.name}</h5>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        i === 0 ? 'bg-bio-blue/20 text-bio-blue' : 'bg-bio-purple/20 text-bio-purple'
                      }`}>
                        {component.weight}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm">{component.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        )}

        {/* ===== COMPETITION STAGES (SPC/NEC) ===== */}
        {comp.competitionStages && comp.competitionStages.length > 0 && (
          <div className="space-y-8 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center">
              <span className="text-gradient">Competition Stages</span>
            </h2>
            {comp.competitionStages.map((stage, idx) => (
              <GlassCard key={idx} glow={comp.glowColor as any} className="p-8">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold ${getCompBadge(isSPC, false, !isSPC)}`}>
                    {idx + 1}
                  </span>
                  <h3 className="text-2xl font-bold text-white">{stage.name}</h3>
                  {stage.cost && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      stage.cost.toLowerCase().includes('free')
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {stage.cost}
                    </span>
                  )}
                </div>

                {/* Details */}
                {stage.details.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Details</h4>
                    <ul className="space-y-2">
                      {stage.details.map((d, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/70">
                          <span className={`font-bold mt-0.5 ${getCompColor(isSPC, false, !isSPC)}`}>•</span>
                          <span className="text-sm">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Requirements */}
                {stage.requirements && stage.requirements.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Requirements</h4>
                    <div className="space-y-2">
                      {stage.requirements.map((req, i) => (
                        <p key={i} className="text-white/70 text-sm leading-relaxed">{req}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assessment Criteria */}
                {stage.assessmentCriteria && stage.assessmentCriteria.length > 0 && (
                  <div>
                    <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Assessment Criteria</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-3 px-4 font-semibold text-white/80">Criterion</th>
                            <th className="text-center py-3 px-4 font-semibold text-white/80 w-20">Weight</th>
                            <th className="text-left py-3 px-4 font-semibold text-white/80">Assessment Focus</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stage.assessmentCriteria.map((criterion, ci) => (
                            <tr key={ci} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4 text-white font-medium">{criterion.criteria}</td>
                              <td className="py-3 px-4 text-center">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${getCompBadge(isSPC, false, !isSPC)}`}>
                                  {criterion.weight}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-white/60 text-xs">{criterion.focus}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        )}

        {/* ===== AWARDS ===== */}
        {comp.awards && comp.awards.length > 0 && (
          <GlassCard glow={comp.glowColor as any} className="p-8 mb-12">
            <SectionTitle glow={comp.glowColor}>Awards & Prizes</SectionTitle>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {comp.awards.map((award, i) => (
                <div key={i} className={`p-6 rounded-xl border text-center ${
                  i === 0
                    ? 'border-amber-500/50 bg-amber-500/10'
                    : i === 1
                    ? 'border-gray-400/30 bg-gray-400/10'
                    : i === 2
                    ? 'border-amber-700/30 bg-amber-700/10'
                    : `${glowBorderClass(comp.glowColor)}`
                }`}>
                  <p className={`text-lg font-bold mb-1 ${
                    i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : getCompColor(isOlympiad, isSPC, isNEC)
                  }`}>
                    {award.prize}
                  </p>
                  <p className="text-white/60 text-xs">{award.reward}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* ===== KEY RULES (MO only) ===== */}
        {comp.keyRules && comp.keyRules.length > 0 && (
          <GlassCard glow={comp.glowColor as any} className="p-8 mb-12">
            <SectionTitle glow={comp.glowColor}>Key Rules & Regulations</SectionTitle>
            <div className="grid md:grid-cols-2 gap-4">
              {comp.keyRules.map((rule, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className={`font-bold mt-0.5 ${getCompColor(isOlympiad, isSPC, isNEC)}`}>{i + 1}.</span>
                  <p className="text-white/70 text-sm">{rule}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* ===== RULES (SPC/NEC) ===== */}
        {comp.rules && comp.rules.length > 0 && (
          <GlassCard glow={comp.glowColor as any} className="p-8 mb-12">
            <SectionTitle glow={comp.glowColor}>Rules & Regulations</SectionTitle>
            <div className="grid md:grid-cols-2 gap-4">
              {comp.rules.map((rule, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className={`font-bold mt-0.5 ${getCompColor(isOlympiad, isSPC, isNEC)}`}>{i + 1}.</span>
                  <p className="text-white/70 text-sm">{rule}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* ===== GENERAL PAYMENT INFO ===== */}
        <GlassCard glow={comp.glowColor as any} className="p-8 mb-12">
          <SectionTitle glow={comp.glowColor}>Payment Procedures</SectionTitle>
          <div className="space-y-6">
            <div className={`p-5 rounded-xl border ${glowBorderClass('blue')}`}>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider">Bank</p>
                  <p className="font-bold text-white">{PAYMENT_INFO.bank}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider">Account Number</p>
                  <p className="font-bold text-bio-blue text-lg">{PAYMENT_INFO.accountNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider">Account Holder</p>
                  <p className="font-bold text-white">{PAYMENT_INFO.accountHolder}</p>
                </div>
              </div>
              <p className="text-sm text-white/50">{PAYMENT_INFO.notes}</p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">Procedures</h4>
              <ul className="space-y-2">
                {PAYMENT_INFO.procedures.map((proc, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/70 text-sm">
                    <span className={`font-bold ${getCompColor(isOlympiad, isSPC, isNEC)}`}>{i + 1}.</span>
                    <span>{proc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">Terms & Conditions</h4>
              <ul className="space-y-2">
                {PAYMENT_INFO.terms.map((term, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/70 text-sm">
                    <span className="text-red-400 font-bold">•</span>
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* ===== CONTACT & SOCIAL MEDIA ===== */}
        <GlassCard glow={comp.glowColor as any} className="p-8 mb-12">
          <SectionTitle glow={comp.glowColor}>Official Social Media & Contacts</SectionTitle>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Instagram Accounts</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                    📸
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider">Main Account</p>
                    <p className="text-lg font-bold text-white">{SOCIAL_MEDIA.instagram.main}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-bio-blue/10 to-emerald-500/10 border border-bio-blue/30">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-bio-blue to-emerald-500 flex items-center justify-center text-2xl">
                    🦠
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider">Archaea Account</p>
                    <p className="text-lg font-bold text-white">{SOCIAL_MEDIA.instagram.archaea}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Contact Persons</h4>
              <div className="space-y-4">
                {SOCIAL_MEDIA.contactPersons.map((cp, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-bio-blue/20 flex items-center justify-center text-lg">
                      👤
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wider">{cp.name}</p>
                      <p className="text-white font-medium">{cp.contact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* ===== FAQ ===== */}
        {comp.faq && comp.faq.length > 0 && (
          <GlassCard glow={comp.glowColor as any} className="p-8 mb-12">
            <SectionTitle glow={comp.glowColor}>Frequently Asked Questions</SectionTitle>
            <div className="space-y-4 max-w-3xl mx-auto">
              {comp.faq.map((item, i) => (
                <div key={i} className="glass-dark rounded-xl p-5">
                  <p className="font-bold text-white mb-2">{item.q}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* ===== STATS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {comp.benefits.map((benefit, i) => (
            <GlassCard key={i} className="p-6 text-center" glow={comp.glowColor as any}>
              <div className="text-4xl mb-2">{benefit.icon}</div>
              <p className="text-sm text-white/60 mb-1">{benefit.title}</p>
              <p className="text-lg font-bold" style={{
                color: getCompHex(isOlympiad, isSPC, isNEC)
              }}>{benefit.value}</p>
            </GlassCard>
          ))}
        </div>

        {/* ===== CTA ===== */}
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard glow={comp.glowColor as any} className="p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
            <p className="text-white/70 mb-8">Register your team now and start your microbial odyssey!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="btn-glow">
                Register Now
              </Link>
              <Link href="/" className="btn-glass">
                Back to Home
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}