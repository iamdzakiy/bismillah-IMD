'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { MascotDecoration } from '@/components/ui/MascotDecoration';
import { useEffect, useRef, useState } from 'react';

// Correct timeline data based on user's requirements
const TIMELINE = [
  {
    id: '1',
    phase: 'MO Registration',
    date: '13 July – 8 August 2026',
    title: 'Open Registration Batch 1 (Early Bird: IDR 75k)',
    description: 'Registration for Main Competition (MO) via IMD Official Website',
  },
  {
    id: '2',
    phase: 'MO Registration',
    date: '19 July – 8 August 2026',
    title: 'Open Registration Batch 1 (Per Timeline Page)',
    description: 'Registration for Main Competition (MO) via IMD Official Website',
  },
  {
    id: '3',
    phase: 'SPC & NEC',
    date: '19 July – 31 August 2026',
    title: 'Preliminary Stage: Registration & Abstract Submission (Free) — Extended',
    description: 'Registration for Scientific Paper Competition (SPC) & National Essay Competition (NEC) via IMD Official Website',
  },
  {
    id: '4',
    phase: 'MO Registration',
    date: '9 August – 31 August 2026',
    title: 'Open Registration Batch 2 (Normal: IDR 85k)',
    description: 'Registration for Main Competition (MO) via IMD Official Website',
  },
  {
    id: '5',
    phase: 'SPC & NEC',
    date: '8 September 2026',
    title: 'Semifinalist Announcement',
    description: 'Announcement of semifinalists via IMD Official Website',
  },
  {
    id: '6',
    phase: 'SPC',
    date: '9 September – 30 Sept 2026',
    title: 'Stage 2 Work Period: Proposal Writing & Elevator Pitch Video',
    description: 'Asynchronous / Instagram',
  },
  {
    id: '7',
    phase: 'NEC',
    date: '9 September – 30 Sept 2026',
    title: 'Full Paper Submission Window',
    description: 'Submission via IMD Official Website',
  },
  {
    id: '8',
    phase: 'NEC',
    date: 'September 2026 (TBA)',
    title: 'Full Paper Coaching Session',
    description: 'Zoom Meeting',
  },
  {
    id: '9',
    phase: 'MO',
    date: '3 – 4 October 2026',
    title: 'Preliminary Round System Access Trial & Technical Meeting',
    description: 'Online / Zoom',
  },
  {
    id: '10',
    phase: 'SPC & NEC',
    date: '11 October 2026',
    title: 'Finalist Announcement',
    description: 'Announcement of finalists via IMD Official Website',
  },
  {
    id: '11',
    phase: 'SPC',
    date: '12 October – 31 Oct 2026',
    title: 'Prototype Development Period for Finalists',
    description: 'Asynchronous',
  },
  {
    id: '12',
    phase: 'NEC',
    date: '12 October – 31 Oct 2026',
    title: 'Final Stage: Pitch Deck and Poster Digital Submission',
    description: 'Submission via IMD Official Website',
  },
  {
    id: '13',
    phase: 'MO',
    date: '17 October 2026',
    title: 'Elimination / Preliminary Round Exam (35 T/F Questions)',
    description: 'Online Examination Platform',
  },
  {
    id: '14',
    phase: 'MO',
    date: '25 October 2026',
    title: 'Announcement of Finalists',
    description: 'Online',
  },
  {
    id: '15',
    phase: 'MO',
    date: '25 – 31 October 2026',
    title: 'Re-registration of Finalists',
    description: 'Online',
  },
  {
    id: '16',
    phase: 'All Branches',
    date: '7 November 2026',
    title: 'Final Stage Technical Meeting',
    description: 'In-person at ITB Ganesha',
  },
  {
    id: '17',
    phase: 'All Branches',
    date: '14 November 2026',
    title: 'Final Round / Pitching Day',
    description: 'In-person at ITB Ganesha',
  },
  {
    id: '18',
    phase: 'All Branches',
    date: '15 November 2026',
    title: 'Exhibition & Grand Awarding Ceremony',
    description: 'In-person at ITB Ganesha',
  },
];

function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spaceshipRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number; opacity: number; speed: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate stars only once on client
    const generatedStars = [...Array(100)].map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * 800,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.02 + 0.005,
    }));
    setStars(generatedStars);

    let animationId: number;

    const animate = () => {
      if (!canvas || !ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      generatedStars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Twinkle effect
        star.opacity += (Math.random() - 0.5) * 0.02;
        star.opacity = Math.max(0.2, Math.min(1, star.opacity));
      });

      animationId = requestAnimationFrame(animate);
    };

    // Set canvas size
    const resize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = 800;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ height: '800px' }}
      />
      <div 
        ref={spaceshipRef}
        className="absolute pointer-events-none"
        style={{
          top: '10%',
          left: '-100px',
          width: '60px',
          height: '60px',
          animation: 'spaceship-fly 30s linear infinite',
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-blue-400">
          <path d="M12 2L15 8H9L12 2Z" fill="currentColor"/>
          <path d="M12 22L9 16H15L12 22Z" fill="currentColor"/>
          <circle cx="12" cy="12" r="3" fill="currentColor"/>
        </svg>
      </div>
      <style jsx>{`
        @keyframes spaceship-fly {
          0% { transform: translateX(-100px) translateY(0) rotate(15deg); }
          25% { transform: translateX(calc(100vw + 100px)) translateY(-50px) rotate(15deg); }
          50% { transform: translateX(calc(100vw + 100px)) translateY(50px) rotate(-15deg); }
          75% { transform: translateX(-100px) translateY(100px) rotate(-15deg); }
          100% { transform: translateX(-100px) translateY(0) rotate(15deg); }
        }
      `}</style>
    </>
  );
}

export function TimelineSection() {
  return (
    <section id="timeline" className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-space-900 via-space-800 to-space-900" />
      <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-bio-purple/10 rounded-full blur-[150px] -translate-x-1/2" />
      
      {/* Space Background with Stars and Spaceship */}
      <SpaceBackground />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 glass rounded-full text-bio-cyan text-xs font-semibold uppercase tracking-widest mb-4">
            Mark Your Calendar
          </span>
          <h2 className="text-5xl md:text-7xl font-black mb-6">
            <span className="text-gradient-purple">Event Timeline</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Follow the journey from registration to the grand awarding night
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-1/2">
            <div className="absolute inset-0 bg-gradient-to-b from-bio-cyan via-bio-emerald to-bio-purple opacity-30" />
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-bio-cyan via-bio-emerald to-bio-purple"
            />
          </div>

          <div className="space-y-16">
            {TIMELINE.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-bio-cyan rounded-full blur-xl animate-pulse-glow" />
                    <div className="relative w-4 h-4 bg-bio-cyan rounded-full ring-4 ring-space-900" />
                  </div>
                </div>

                <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                  <GlassCard hover={true} className="p-6 group">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-bio-cyan/10 border border-bio-cyan/30 rounded-full text-bio-cyan text-xs font-bold uppercase tracking-wider">
                        {item.phase}
                      </span>
                      <span className="text-sm text-white/40 font-mono">{item.date}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gradient transition-all">
                      {item.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {item.description}
                    </p>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-bio-cyan/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </GlassCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Mascot decorations at the bottom of timeline */}
        <div className="mt-16">
          <MascotDecoration count={4} size="md" className="justify-center" />
        </div>
      </div>
    </section>
  );
}