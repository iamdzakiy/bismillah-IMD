import type { Metadata } from 'next';
import { Poppins, Lato } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/provider/AuthProvider';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { EmailVerificationBanner } from '@/components/EmailVerificationBanner';
import { FloatingOrbs } from '@/components/ui/FloatingOrbs';

// GDV IMD 2026 typefaces
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], style: ['normal', 'italic'], variable: '--font-poppins' });
const lato = Lato({ subsets: ['latin'], weight: ['400', '700', '900'], style: ['normal', 'italic'], variable: '--font-lato' });

export const metadata: Metadata = {
  title: 'IMD 2026 ITB | Decode the Unknown!',
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
    <html lang="en" className={`${poppins.variable} ${lato.variable}`}>
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
