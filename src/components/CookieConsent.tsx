'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { Cookie, Check, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'cookie_consent';
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID  = process.env.NEXT_PUBLIC_GA_ID;

type Consent = 'accepted' | 'refused' | null;

// Helpers Google Consent Mode v2
function grantConsent() {
  if (typeof window === 'undefined') return;
  window.gtag?.('consent', 'update', {
    ad_storage:             'granted',
    ad_user_data:           'granted',
    ad_personalization:     'granted',
    analytics_storage:      'granted',
  });
}

function denyConsent() {
  if (typeof window === 'undefined') return;
  window.gtag?.('consent', 'update', {
    ad_storage:             'denied',
    ad_user_data:           'denied',
    ad_personalization:     'denied',
    analytics_storage:      'denied',
  });
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [visible, setVisible] = useState(false);

  // Initialisation : applique l'état stocké dès le montage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Consent;
    if (stored === 'accepted') {
      setConsent('accepted');
      grantConsent();
    } else if (stored === 'refused') {
      setConsent('refused');
      denyConsent();
    } else {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  // Bouton "Gérer les cookies" du footer
  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener('open-cookie-consent', handler);
    return () => window.removeEventListener('open-cookie-consent', handler);
  }, []);

  // Bloque le scroll quand la bannière est visible
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setConsent('accepted');
    grantConsent();
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem(STORAGE_KEY, 'refused');
    setConsent('refused');
    denyConsent();
    setVisible(false);
  };

  return (
    <>
      {/*
       * Google Consent Mode v2 — initialisé en "denied" par défaut.
       * Doit être chargé AVANT tout autre script Google (GTM, GA, AdSense).
       * AdSense est chargé dans le <head> par next/head ou layout.tsx et
       * respectera automatiquement ce signal : annonces non personnalisées
       * tant que ad_storage = denied.
       */}
      <Script
        id="gcm-default"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage:         'denied',
  ad_user_data:       'denied',
  ad_personalization: 'denied',
  analytics_storage:  'denied',
  wait_for_update:    500
});
gtag('js', new Date());`,
        }}
      />

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
              __html: `gtag('config','${GA_ID}');`,
            }}
          />
        </>
      )}

      {/* ── Bannière ── */}
      {visible && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Gestion des cookies"
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-4xl rounded-2xl border border-border bg-card shadow-2xl shadow-black/40">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Cookie className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Ce site utilise des cookies
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Nous utilisons des cookies pour analyser le trafic (Google Analytics) et
                  diffuser des publicités (Google AdSense). Si vous refusez, Google Analytics
                  sera désactivé et AdSense affichera uniquement des{' '}
                  <span className="font-medium text-foreground">annonces non personnalisées</span>{' '}
                  (sans suivi).{' '}
                  <Link
                    href="/legal/cookies"
                    className="underline underline-offset-2 hover:text-foreground transition-colors"
                  >
                    En savoir plus
                  </Link>
                </p>
              </div>

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
