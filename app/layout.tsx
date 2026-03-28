import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';

export const metadata: Metadata = {
  metadataBase: new URL('https://star-head.sc'),
  title: {
    template: '%s · Star-Head',
    default: 'Star-Head — Base de données Star Citizen',
  },
  description: 'Star-Head est la base de données ultime pour Star Citizen : vaisseaux, composants, armures, lieux et blueprints.',
  openGraph: {
    siteName: 'Star-Head',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Star-Head — Base de données Star Citizen' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  themeColor: '#14181f',
  alternates: {
    types: {
      'application/xml': 'https://star-head.sc/sitemap.xml',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
