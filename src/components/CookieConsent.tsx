'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { Cookie, Check, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'cookie_consent';
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID  = process.env.NEXT_PUBLIC_GA_ID;

type Consent = 'accepted' | 'refused' | null;

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Consent;
    if (stored === 'accepted' || stored === 'refused') {
      setConsent(stored);
    } else {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  // Écoute le bouton "Gérer les cookies" du footer
  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener('open-cookie-consent', handler);
    return () => window.removeEventListener('open-cookie-consent', handler);
  }, []);

  // Bloque le scroll du body quand la bannière est visible
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setConsent('accepted');
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem(STORAGE_KEY, 'refused');
    setConsent('refused');
    setVisible(false);
  };

  return (
    <>
      {/* ── GTM — chargé uniquement si consentement accepté ── */}
      {consent === 'accepted' && GTM_ID && (
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
      {/* ── GA — chargé uniquement si consentement accepté ── */}
      {consent === 'accepted' && GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
            }}
          />
        </>
      )}

      {/* ── Bannière de consentement ── */}
      {visible && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Gestion des cookies"
        >
          {/* Overlay bloquant */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-4xl rounded-2xl border border-border bg-card shadow-2xl shadow-black/40">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6">

              {/* Icône */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Cookie className="h-5 w-5" />
              </div>

              {/* Texte */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Ce site utilise des cookies
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Nous utilisons des cookies pour analyser le trafic (Google Analytics), diffuser
                  des publicités (Google AdSense) et maintenir votre session.
                  Google AdSense continuera de fonctionner quel que soit votre choix,
                  contrairement aux autres traceurs analytiques.{' '}
                  <Link
                    href="/legal/cookies"
                    className="underline underline-offset-2 hover:text-foreground transition-colors"
                  >
                    En savoir plus
                  </Link>
                </p>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-4">
                <button
                  onClick={refuse}
                  className="text-xs text-muted-foreground/50 underline underline-offset-2 hover:text-muted-foreground transition-colors"
                >
                  Refuser
                </button>
                <button
                  onClick={accept}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Check className="h-3.5 w-3.5" />
                  Tout accepter
                </button>
              </div>

            </div>

            {/* Mention RGPD */}
            <div className="flex items-center gap-1.5 border-t border-border/40 px-5 py-2.5 text-[10px] text-muted-foreground/60">
              <ShieldCheck className="h-3 w-3 shrink-0" />
              Vous pouvez modifier votre choix à tout moment via le bouton &laquo;&nbsp;Gérer les cookies&nbsp;&raquo; en bas de page.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
