'use client';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Cookie } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  const openCookieConsent = () => {
    window.dispatchEvent(new CustomEvent('open-cookie-consent'));
  };

  return (
    <footer className="border-t border-border py-8">
      <div className="container flex flex-col items-center gap-4 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} gtl-studio.com</p>
        <nav className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <Link href="/legal/mentions-legales" suppressHydrationWarning className="hover:text-foreground transition-colors">{t('index.footerLegal')}</Link>
          <Link href="/legal/politique-de-confidentialite" suppressHydrationWarning className="hover:text-foreground transition-colors">{t('index.footerPrivacy')}</Link>
          <Link href="/legal/cgu" suppressHydrationWarning className="hover:text-foreground transition-colors">{t('index.footerTos')}</Link>
          <Link href="/legal/cookies" suppressHydrationWarning className="hover:text-foreground transition-colors">{t('index.footerCookies')}</Link>
          <button
            onClick={openCookieConsent}
            suppressHydrationWarning
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Cookie className="h-3 w-3" />
            <span suppressHydrationWarning>{t('index.footerManageCookies')}</span>
          </button>
        </nav>
      </div>
      <div className="container mt-3 text-xs text-muted-foreground/60 sm:text-left">
        <p suppressHydrationWarning>{t('index.footerLine2')}</p>
      </div>
    </footer>
  );
};

export default Footer;
