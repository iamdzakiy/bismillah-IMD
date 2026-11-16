import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/provider/AuthProvider';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { EmailVerificationBanner } from '@/components/EmailVerificationBanner';
import { FloatingOrbs } from '@/components/ui/FloatingOrbs';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'IMD 2026 ITB | International Microorganism Day',
  description: 'International Microorganism Day 2026 at Institut Teknologi Bandung: the Microbiology Olympiad, Science Project Competition and National Essay Competition, with finals on 14–15 November 2026.',
  keywords: 'IMD 2026 ITB, International Microorganism Day, ITB, Institut Teknologi Bandung, microbiology competition, Olympiad, SPC, NEC, Indonesia',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'IMD 2026 ITB | International Microorganism Day',
    description: 'International Microorganism Day 2026 at Institut Teknologi Bandung: MO, SPC and NEC, with finals on 14–15 November 2026.',
    url: 'https://imd2026itb.vercel.app/',
    siteName: 'IMD 2026 ITB',
    images: [{ url: 'https://imd2026itb.vercel.app/favicon.svg' }],
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
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
