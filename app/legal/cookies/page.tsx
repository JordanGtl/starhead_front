import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { HelpCircle, List, ShieldCheck, Settings, ExternalLink, CalendarDays } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Politique de cookies',
  description: 'Politique de cookies du site Star-Head.',
};

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

const essentialCookies = [
  { name: 'auth_token', origin: 'Star-Head', purpose: 'Maintien de la session utilisateur connecté', duration: 'Durée de la session' },
];

const analyticsCookies = [
  { name: '_ga',   origin: 'Google Analytics', purpose: 'Identification unique du visiteur pour la mesure d\'audience', duration: '13 mois' },
  { name: '_gid',  origin: 'Google Analytics', purpose: 'Distinction des sessions utilisateurs', duration: '24 heures' },
  { name: '_gtm',  origin: 'Google Tag Manager', purpose: 'Gestion des balises de suivi', duration: 'Session' },
  { name: '__gads', origin: 'Google AdSense', purpose: 'Affichage de publicités personnalisées', duration: '13 mois' },
];

const CookieTable = ({ rows }: { rows: typeof essentialCookies }) => (
  <div className="mt-2 overflow-x-auto rounded-lg border border-border/50">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border bg-muted/30 text-left">
          <th className="px-4 py-2.5 font-semibold text-foreground">Cookie</th>
          <th className="px-4 py-2.5 font-semibold text-foreground">Origine</th>
          <th className="px-4 py-2.5 font-semibold text-foreground">Finalité</th>
          <th className="px-4 py-2.5 font-semibold text-foreground">Durée</th>
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
  return (
    <>
      <PageHeader
        breadcrumb={[{ label: 'Politique de cookies' }]}
        label="Administratif"
        title="Politique de cookies"
        subtitle="Les cookies utilisés sur Star-Head et comment les gérer."
      />
      <div className="container py-6">
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="flex flex-col gap-6">

            <Section icon={HelpCircle} title="Qu'est-ce qu'un cookie ?">
              Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d'un
              site web. Il permet de mémoriser des informations sur votre navigation (session,
              préférences, statistiques). Certains cookies sont indispensables au fonctionnement du
              site, d'autres nécessitent votre consentement préalable.
            </Section>

            <Section icon={ShieldCheck} title="Cookies essentiels (pas de consentement requis)">
              Ces cookies sont strictement nécessaires au fonctionnement du site. Ils ne peuvent pas
              être désactivés sans altérer votre expérience.
              <CookieTable rows={essentialCookies} />
            </Section>

            <Section icon={List} title="Cookies de mesure d'audience et de publicité (consentement requis)">
              Ces cookies sont déposés uniquement après votre consentement explicite. Ils permettent
              de mesurer l'audience du site et d'afficher des publicités personnalisées via
              Google Analytics, Google Tag Manager et Google AdSense.
              <CookieTable rows={analyticsCookies} />
              <p className="mt-3">
                Ces services sont opérés par <span className="font-medium text-foreground">Google LLC</span> (USA)
                et peuvent transférer des données vers les États-Unis dans le cadre du Data Privacy
                Framework UE-USA. Consultez la{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  politique de confidentialité Google
                </a>.
              </p>
            </Section>

            <Section icon={ShieldCheck} title="Consentement et Google Consent Mode v2">
              Lors de votre première visite, un bandeau vous informe de l'utilisation des cookies
              non essentiels et recueille votre consentement explicite (conformément au RGPD et aux
              recommandations de la CNIL).
              <br /><br />
              Le site implémente le <span className="font-medium text-foreground">Google Consent Mode v2</span> :
              <ul className="mt-2 space-y-1 list-none">
                {[
                  ['Si vous acceptez', 'Google Analytics et Google AdSense fonctionnent normalement avec personnalisation des annonces.'],
                  ['Si vous refusez', 'Google Analytics est désactivé. Google AdSense reste actif mais affiche uniquement des annonces non personnalisées (sans dépôt de cookies de ciblage publicitaire).'],
                ].map(([label, desc]) => (
                  <li key={label} className="flex gap-2">
                    <span className="font-medium text-foreground shrink-0">{label} :</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
              <br />
              Votre choix est mémorisé pour les visites suivantes. Vous pouvez le modifier à tout
              moment via le bouton <span className="font-medium text-foreground">« Gérer les cookies »</span> en
              bas de chaque page du site.
            </Section>

            <Section icon={Settings} title="Gérer les cookies par navigateur">
              Vous pouvez à tout moment désactiver ou supprimer les cookies via les paramètres de
              votre navigateur. Notez que la désactivation des cookies essentiels peut empêcher
              la connexion au site.
              <ul className="mt-3 space-y-1.5 list-none">
                {[
                  ['Google Chrome', 'https://support.google.com/chrome/answer/95647'],
                  ['Mozilla Firefox', 'https://support.mozilla.org/fr/kb/activer-desactiver-cookies'],
                  ['Safari', 'https://support.apple.com/fr-fr/guide/safari/sfri11471/mac'],
                  ['Microsoft Edge', 'https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09'],
                ].map(([browser, url]) => (
                  <li key={browser} className="flex gap-2 items-center">
                    <span className="mt-0.5 text-primary shrink-0">•</span>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {browser}
                    </a>
                  </li>
                ))}
              </ul>
            </Section>

            <Section icon={ExternalLink} title="En savoir plus" last>
              Pour plus d'informations sur vos droits concernant les cookies, consultez le site
              de la CNIL :{' '}
              <a
                href="https://www.cnil.fr/fr/cookies-et-autres-traceurs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                cnil.fr/fr/cookies-et-autres-traceurs
              </a>.
            </Section>

          </div>

          <div className="mt-8 flex items-center gap-2 border-t border-border/50 pt-6 text-xs text-muted-foreground/60">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <span>Dernière mise à jour : 28 mars 2026</span>
          </div>
        </div>
      </div>
    </>
  );
}
