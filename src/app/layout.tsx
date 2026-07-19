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
  title: 'IMD 2026 ITB | International Microorganism Day',
  description: 'Register for IMD 2026 ITB at Institut Teknologi Bandung. Join Olympiad, SPC, NEC microbiology competitions today.',
  keywords: 'IMD 2026 ITB, International Microorganism Day, ITB, Institut Teknologi Bandung, microbiology competition, Olympiad, SPC, NEC, Indonesia',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'IMD 2026 ITB | International Microorganism Day',
    description: 'Register for IMD 2026 ITB at Institut Teknologi Bandung. Join Olympiad, SPC, NEC microbiology competitions today.',
    url: 'https://imd2026itb.vercel.app/',
    siteName: 'IMD 2026 ITB',
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
