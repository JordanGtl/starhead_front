import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';

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
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta name="theme-color" content="#14181f" />
        <link rel="sitemap" type="application/xml" href="https://star-head.sc/sitemap.xml" />
      </head>
      <body>
        {GTM_ID && (
          <>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0" width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              />
            </noscript>
            <Script
              id="gtm"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
              }}
            />
          </>
        )}
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
