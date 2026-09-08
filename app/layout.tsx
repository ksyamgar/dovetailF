import type { Metadata } from 'next';
import { Inter, EB_Garamond, DM_Mono } from 'next/font/google';
import '@/styles/globals.css';
import '@/styles/projects.css';
import '@/styles/contact.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CustomCursor } from '@/components/ui/CustomCursor';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dovetail Architecture — Himalayan Practice',
  description:
    'Dovetail Architecture — Himalayan architecture practice led by Ar. Karan Sharma. Conservation, adaptive reuse, interiors and landscape across the Western Himalayas.',
  keywords: [
    'Himalayan Architecture',
    'Ar. Karan Sharma',
    'Architectural Conservation',
    'Palampur',
    'Leh Ladakh',
    'Adaptive Reuse',
    'Sustainable Vernacular Architecture'
  ],
  authors: [{ name: 'Ar. Karan Sharma' }],
  openGraph: {
    title: 'Dovetail Architecture — Himalayan Practice',
    description:
      'Architecture rooted in place, crafted with clarity. Work across Himachal Pradesh, Ladakh, and the Western Himalayas.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${ebGaramond.variable} ${dmMono.variable}`}>
      <body>
        <CustomCursor />
        <div id="app">
          <main className="site-shell">
            <Header />
            {children}
            <Footer />
          </main>
        </div>
      </body>
    </html>
  );
}
