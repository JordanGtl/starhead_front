'use client';
import PageHeader from '@/components/PageHeader';
import { HelpCircle, List, ShieldCheck, Settings, ExternalLink, CalendarDays } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Section = ({ icon: Icon, title, children, last = false }: { icon: React.ElementType; title: string; children: React.ReactNode; last?: boolean }) => (
  <div className="flex gap-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon className="h-5 w-5" />
    </div>
    <div className={`flex-1 ${!last ? 'border-b border-border/50 pb-6' : ''}`}>
      <h2 className="mb-2 text-base font-semibold text-foreground">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  </div>
);

type CookieRow = { name: string; origin: string; purpose: string; duration: string };

const CookieTable = ({ rows, headers }: { rows: CookieRow[]; headers: [string, string, string, string] }) => (
  <div className="mt-2 overflow-x-auto rounded-lg border border-border/50">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border bg-muted/30 text-left">
          {headers.map(h => <th key={h} className="px-4 py-2.5 font-semibold text-foreground">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((c, i) => (
          <tr key={c.name} className={i < rows.length - 1 ? 'border-b border-border/50' : ''}>
            <td className="px-4 py-2.5 font-mono text-xs text-foreground">{c.name}</td>
            <td className="px-4 py-2.5">{c.origin}</td>
            <td className="px-4 py-2.5">{c.purpose}</td>
            <td className="px-4 py-2.5 whitespace-nowrap">{c.duration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function Cookies() {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const tableHeaders: [string, string, string, string] = isFr
    ? ['Cookie', 'Origine', 'Finalité', 'Durée']
    : ['Cookie', 'Origin', 'Purpose', 'Duration'];

  const essentialCookies: CookieRow[] = [
    {
      name: 'auth_token',
      origin: 'Star-Head',
      purpose: isFr ? 'Maintien de la session utilisateur connecté' : 'Maintains the logged-in user session',
      duration: isFr ? 'Durée de la session' : 'Session',
    },
  ];

  const analyticsCookies: CookieRow[] = [
    { name: '_ga',    origin: 'Google Analytics',   purpose: isFr ? "Identification unique du visiteur pour la mesure d'audience" : 'Unique visitor identification for audience measurement', duration: isFr ? '13 mois' : '13 months' },
    { name: '_gid',   origin: 'Google Analytics',   purpose: isFr ? 'Distinction des sessions utilisateurs' : 'Distinguishes user sessions', duration: isFr ? '24 heures' : '24 hours' },
    { name: '_gtm',   origin: 'Google Tag Manager', purpose: isFr ? 'Gestion des balises de suivi' : 'Tracking tag management', duration: isFr ? 'Session' : 'Session' },
    { name: '__gads', origin: 'Google AdSense',      purpose: isFr ? 'Affichage de publicités personnalisées' : 'Display of personalised advertisements', duration: isFr ? '13 mois' : '13 months' },
  ];

  const browsers = [
    ['Google Chrome',   'https://support.google.com/chrome/answer/95647'],
    ['Mozilla Firefox', 'https://support.mozilla.org/fr/kb/activer-desactiver-cookies'],
    ['Safari',          'https://support.apple.com/fr-fr/guide/safari/sfri11471/mac'],
    ['Microsoft Edge',  'https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09'],
  ];

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: isFr ? 'Politique de cookies' : 'Cookie Policy' }]}
        label={isFr ? 'Administratif' : 'Legal'}
        title={isFr ? 'Politique de cookies' : 'Cookie Policy'}
        subtitle={isFr ? 'Les cookies utilisés sur Star-Head et comment les gérer.' : 'The cookies used on Star-Head and how to manage them.'}
      />
      <div className="container py-6">
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="flex flex-col gap-6">

            <Section icon={HelpCircle} title={isFr ? "Qu'est-ce qu'un cookie ?" : 'What is a cookie?'}>
              {isFr
                ? "Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d'un site web. Il permet de mémoriser des informations sur votre navigation (session, préférences, statistiques). Certains cookies sont indispensables au fonctionnement du site, d'autres nécessitent votre consentement préalable."
                : "A cookie is a small text file placed on your device when you visit a website. It stores information about your browsing session (session, preferences, statistics). Some cookies are essential to the site's operation; others require your prior consent."}
            </Section>

            <Section icon={ShieldCheck} title={isFr ? 'Cookies essentiels (pas de consentement requis)' : 'Essential cookies (no consent required)'}>
              {isFr
                ? "Ces cookies sont strictement nécessaires au fonctionnement du site. Ils ne peuvent pas être désactivés sans altérer votre expérience."
                : "These cookies are strictly necessary for the site to function. They cannot be disabled without affecting your experience."}
              <CookieTable rows={essentialCookies} headers={tableHeaders} />
            </Section>

            <Section icon={List} title={isFr ? "Cookies de mesure d'audience et de publicité (consentement requis)" : 'Analytics & advertising cookies (consent required)'}>
              {isFr
                ? "Ces cookies sont déposés uniquement après votre consentement explicite. Ils permettent de mesurer l'audience du site et d'afficher des publicités personnalisées via Google Analytics, Google Tag Manager et Google AdSense."
                : "These cookies are only placed after your explicit consent. They enable audience measurement and the display of personalised ads via Google Analytics, Google Tag Manager and Google AdSense."}
              <CookieTable rows={analyticsCookies} headers={tableHeaders} />
              <p className="mt-3">
                {isFr ? (
                  <>
                    Ces services sont opérés par <span className="font-medium text-foreground">Google LLC</span> (USA)
                    et peuvent transférer des données vers les États-Unis dans le cadre du Data Privacy
                    Framework UE-USA. Consultez la{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      politique de confidentialité Google
                    </a>.
                  </>
                ) : (
                  <>
                    These services are operated by <span className="font-medium text-foreground">Google LLC</span> (USA)
                    and may transfer data to the United States under the EU-US Data Privacy Framework. See the{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Google Privacy Policy
                    </a>.
                  </>
                )}
              </p>
            </Section>

            <Section icon={ShieldCheck} title={isFr ? 'Consentement et Google Consent Mode v2' : 'Consent & Google Consent Mode v2'}>
              {isFr ? (
                <>
                  Lors de votre première visite, un bandeau vous informe de l'utilisation des cookies
                  non essentiels et recueille votre consentement explicite (conformément au RGPD et aux
                  recommandations de la CNIL).
                </>
              ) : (
                <>
                  On your first visit, a banner informs you about the use of non-essential cookies
                  and collects your explicit consent (in accordance with the GDPR).
                </>
              )}
              <br /><br />
              {isFr
                ? <>Le site implémente le <span className="font-medium text-foreground">Google Consent Mode v2</span> :</>
                : <>The site implements <span className="font-medium text-foreground">Google Consent Mode v2</span>:</>}
              <ul className="mt-2 space-y-1 list-none">
                {(isFr ? [
                  ['Si vous acceptez', 'Google Analytics et Google AdSense fonctionnent normalement avec personnalisation des annonces.'],
                  ['Si vous refusez', 'Google Analytics est désactivé. Google AdSense reste actif mais affiche uniquement des annonces non personnalisées (sans dépôt de cookies de ciblage publicitaire).'],
                ] : [
                  ['If you accept', 'Google Analytics and Google AdSense operate normally with ad personalisation.'],
                  ['If you decline', 'Google Analytics is disabled. Google AdSense remains active but displays only non-personalised ads (without advertising targeting cookies).'],
                ]).map(([label, desc]) => (
                  <li key={label} className="flex gap-2">
                    <span className="font-medium text-foreground shrink-0">{label} :</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
              <br />
              {isFr
                ? <>Votre choix est mémorisé pour les visites suivantes. Vous pouvez le modifier à tout moment via le bouton <span className="font-medium text-foreground">« Gérer les cookies »</span> en bas de chaque page du site.</>
                : <>Your choice is saved for future visits. You can change it at any time via the <span className="font-medium text-foreground">"Manage cookies"</span> button at the bottom of every page.</>}
            </Section>

            <Section icon={Settings} title={isFr ? 'Gérer les cookies par navigateur' : 'Managing cookies via your browser'}>
              {isFr
                ? "Vous pouvez à tout moment désactiver ou supprimer les cookies via les paramètres de votre navigateur. Notez que la désactivation des cookies essentiels peut empêcher la connexion au site."
                : "You can disable or delete cookies at any time via your browser settings. Note that disabling essential cookies may prevent you from logging in to the site."}
              <ul className="mt-3 space-y-1.5 list-none">
                {browsers.map(([browser, url]) => (
                  <li key={browser} className="flex gap-2 items-center">
                    <span className="mt-0.5 text-primary shrink-0">•</span>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {browser}
                    </a>
                  </li>
                ))}
              </ul>
            </Section>

            <Section icon={ExternalLink} title={isFr ? 'En savoir plus' : 'Learn more'} last>
              {isFr ? (
                <>
                  Pour plus d'informations sur vos droits concernant les cookies, consultez le site
                  de la CNIL :{' '}
                  <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    cnil.fr/fr/cookies-et-autres-traceurs
                  </a>.
                </>
              ) : (
                <>
                  For more information about your rights regarding cookies, visit the CNIL website:{' '}
                  <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    cnil.fr/fr/cookies-et-autres-traceurs
                  </a>.
                </>
              )}
            </Section>

          </div>

          <div className="mt-8 flex items-center gap-2 border-t border-border/50 pt-6 text-xs text-muted-foreground/60">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <span>{isFr ? 'Dernière mise à jour : 28 mars 2026' : 'Last updated: March 28, 2026'}</span>
          </div>
        </div>
      </div>
    </>
  );
}
