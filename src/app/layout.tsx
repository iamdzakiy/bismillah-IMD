import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/provider/AuthProvider';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { EmailVerificationBanner } from '@/components/EmailVerificationBanner';
import { FloatingOrbs } from '@/components/ui/FloatingOrbs';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'IMD 2026 – International Microorganism Day | ITB',
  description: "The Great Microbial Odyssey: Decoding the Earth's Dark Matter to Orchestrate a Sustainable Future",
  keywords: 'IMD 2026, International Microorganism Day, Archaea ITB, Microbiology Competition, Olympiad, SPC, NEC',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'IMD 2026 – International Microorganism Day',
    description: "The Great Microbial Odyssey: Decoding the Earth's Dark Matter",
    url: 'https://imd2026itb.vercel.app/',
    siteName: 'IMD 2026',
    images: [{ url: 'https://imd2026itb.vercel.app/favicon.svg' }],
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans noise-overlay">
        <AuthProvider>
          <FloatingOrbs />
          <EmailVerificationBanner />
          <Navbar />
          <main className="relative z-10">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
