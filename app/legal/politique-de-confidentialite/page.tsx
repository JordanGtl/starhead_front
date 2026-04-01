'use client';
import PageHeader from '@/components/PageHeader';
import { User, Database, Lock, Cookie, ShieldCheck, Clock, Globe, Scale, Shield, CalendarDays } from 'lucide-react';
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

export default function PolitiqueConfidentialite() {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const rights = isFr
    ? [
        ['Accès', 'obtenir une copie de vos données'],
        ['Rectification', 'corriger des données inexactes'],
        ['Suppression', "demander l'effacement de vos données"],
        ['Portabilité', 'recevoir vos données dans un format structuré'],
        ['Opposition', "vous opposer à un traitement basé sur l'intérêt légitime"],
        ['Limitation', 'restreindre temporairement un traitement'],
        ['Retrait du consentement', 'retirer votre consentement à tout moment'],
      ]
    : [
        ['Access', 'obtain a copy of your data'],
        ['Rectification', 'correct inaccurate data'],
        ['Erasure', 'request deletion of your data'],
        ['Portability', 'receive your data in a structured format'],
        ['Objection', 'object to processing based on legitimate interest'],
        ['Restriction', 'temporarily restrict processing'],
        ['Withdrawal of consent', 'withdraw your consent at any time'],
      ];

  const securityItems = isFr
    ? [
        'Les mots de passe sont systématiquement hachés (bcrypt) avant stockage — nous ne connaissons pas votre mot de passe en clair.',
        'Les communications entre votre navigateur et nos serveurs sont chiffrées via HTTPS (TLS).',
        "L'accès aux données est restreint aux seules personnes habilitées.",
        'Les données sont hébergées chez OVH dans des datacentres situés en France.',
      ]
    : [
        'Passwords are systematically hashed (bcrypt) before storage — we never know your password in plain text.',
        'Communications between your browser and our servers are encrypted via HTTPS (TLS).',
        'Data access is restricted to authorized personnel only.',
        'Data is hosted at OVH in datacentres located in France.',
      ];

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: isFr ? 'Politique de confidentialité' : 'Privacy Policy' }]}
        label={isFr ? 'Administratif' : 'Legal'}
        title={isFr ? 'Politique de confidentialité' : 'Privacy Policy'}
        subtitle={
          isFr
            ? 'Comment nous collectons, utilisons et protégeons vos données personnelles.'
            : 'How we collect, use and protect your personal data.'
        }
      />
      <div className="container py-6">
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="flex flex-col gap-6">

            <Section icon={User} title={isFr ? 'Responsable du traitement' : 'Data Controller'}>
              {isFr ? 'Le responsable du traitement des données personnelles est :' : 'The data controller is:'}<br />
              <span className="font-medium text-foreground">Jordan Guillot</span><br />
              Contact : <a href="mailto:contact@star-head.sc" className="text-primary hover:underline">contact@star-head.sc</a>
            </Section>

            <Section icon={Database} title={isFr ? 'Données collectées et base légale' : 'Data Collected & Legal Basis'}>
              <div className="mt-1 overflow-x-auto rounded-lg border border-border/50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-left">
                      <th className="px-4 py-2.5 font-semibold text-foreground">{isFr ? 'Données' : 'Data'}</th>
                      <th className="px-4 py-2.5 font-semibold text-foreground">{isFr ? 'Finalité' : 'Purpose'}</th>
                      <th className="px-4 py-2.5 font-semibold text-foreground">{isFr ? 'Base légale' : 'Legal Basis'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(isFr ? [
                      ['Adresse e-mail', 'Gestion du compte', 'Exécution du contrat'],
                      ['Pseudo', 'Identification sur le site', 'Exécution du contrat'],
                      ['Mot de passe (hashé)', 'Authentification sécurisée', 'Exécution du contrat'],
                      ["Logs d'activité (connexions, modifications de profil)", 'Sécurité du compte, historique', 'Intérêt légitime'],
                      ['Adresse IP', "Sécurité, mesure d'audience", 'Intérêt légitime / Consentement'],
                      ['Données de navigation', "Mesure d'audience (Analytics)", 'Consentement'],
                    ] : [
                      ['Email address', 'Account management', 'Contract performance'],
                      ['Username', 'Site identification', 'Contract performance'],
                      ['Password (hashed)', 'Secure authentication', 'Contract performance'],
                      ['Activity logs (logins, profile edits)', 'Account security, history', 'Legitimate interest'],
                      ['IP address', 'Security, audience measurement', 'Legitimate interest / Consent'],
                      ['Browsing data', 'Audience measurement (Analytics)', 'Consent'],
                    ]).map(([data, purpose, basis], i, arr) => (
                      <tr key={i} className={i < arr.length - 1 ? 'border-b border-border/50' : ''}>
                        <td className="px-4 py-2.5">{data}</td>
                        <td className="px-4 py-2.5">{purpose}</td>
                        <td className="px-4 py-2.5">{basis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section icon={Lock} title={isFr ? 'Utilisation des données' : 'Data Use'}>
              {isFr
                ? "Vos données sont utilisées uniquement pour la gestion de votre compte et ne sont jamais vendues ni transmises à des tiers à des fins commerciales."
                : "Your data is used solely for account management and is never sold or shared with third parties for commercial purposes."}
            </Section>

            <Section icon={Globe} title={isFr ? "Transferts hors Union Européenne" : "Transfers Outside the European Union"}>
              {isFr ? (
                <>
                  Le site utilise Google Analytics et Google AdSense, services de Google LLC (USA).
                  Ces services peuvent transférer des données vers les États-Unis dans le cadre du{' '}
                  <span className="font-medium text-foreground">Data Privacy Framework UE-USA</span>.
                  Pour plus d'informations :{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    politique de confidentialité Google
                  </a>.
                </>
              ) : (
                <>
                  The site uses Google Analytics and Google AdSense, services provided by Google LLC (USA).
                  These services may transfer data to the United States under the{' '}
                  <span className="font-medium text-foreground">EU-US Data Privacy Framework</span>.
                  For more information:{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Google Privacy Policy
                  </a>.
                </>
              )}
            </Section>

            <Section icon={Cookie} title={isFr ? 'Cookies et traceurs' : 'Cookies & Trackers'}>
              {isFr ? (
                <>
                  Le site utilise des cookies de mesure d'audience (Google Analytics) et de gestion des
                  publicités (Google AdSense). Consultez notre{' '}
                  <a href="/legal/cookies" className="text-primary hover:underline">politique de cookies</a>{' '}
                  pour plus d'informations.
                </>
              ) : (
                <>
                  The site uses audience measurement cookies (Google Analytics) and advertising cookies
                  (Google AdSense). See our{' '}
                  <a href="/legal/cookies" className="text-primary hover:underline">cookie policy</a>{' '}
                  for more information.
                </>
              )}
            </Section>

            <Section icon={Clock} title={isFr ? 'Durée de conservation' : 'Retention Period'}>
              {isFr
                ? "Les données de compte sont conservées tant que le compte est actif et supprimées sur simple demande. Les données de navigation (cookies Analytics) sont conservées 26 mois maximum."
                : "Account data is retained for as long as the account is active and deleted upon request. Browsing data (Analytics cookies) is retained for a maximum of 26 months."}
            </Section>

            <Section icon={ShieldCheck} title={isFr ? 'Vos droits' : 'Your Rights'}>
              {isFr
                ? 'Conformément au RGPD, vous disposez des droits suivants sur vos données :'
                : 'Under the GDPR, you have the following rights regarding your data:'}
              <ul className="mt-2 space-y-1 list-none">
                {rights.map(([right, desc]) => (
                  <li key={right} className="flex gap-2">
                    <span className="font-medium text-foreground">{right} :</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                <p className="text-sm font-medium text-foreground">
                  {isFr ? 'Gérer vos données directement depuis votre profil' : 'Manage your data directly from your profile'}
                </p>
                <p className="mt-1 text-xs">
                  {isFr ? (
                    <>
                      Une fois connecté, rendez-vous sur votre{' '}
                      <a href="/profile" className="text-primary hover:underline">page de profil</a>{' '}
                      pour <span className="font-medium text-foreground">télécharger l'intégralité de vos données</span> (export JSON)
                      ou <span className="font-medium text-foreground">supprimer définitivement votre compte</span> sans avoir à nous contacter.
                    </>
                  ) : (
                    <>
                      Once logged in, visit your{' '}
                      <a href="/profile" className="text-primary hover:underline">profile page</a>{' '}
                      to <span className="font-medium text-foreground">download all your data</span> (JSON export)
                      or <span className="font-medium text-foreground">permanently delete your account</span> without having to contact us.
                    </>
                  )}
                </p>
              </div>
              <p className="mt-3">
                {isFr ? 'Pour toute autre demande :' : 'For any other request:'}{' '}
                <a href="mailto:contact@star-head.sc" className="text-primary hover:underline">contact@star-head.sc</a>
              </p>
            </Section>

            <Section icon={Shield} title={isFr ? 'Sécurité des données' : 'Data Security'}>
              {isFr
                ? 'Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :'
                : 'We implement appropriate technical and organisational measures to protect your data:'}
              <ul className="mt-2 space-y-1 list-none">
                {securityItems.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-0.5 text-primary shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section icon={Scale} title={isFr ? 'Droit de réclamation' : 'Right to Lodge a Complaint'} last>
              {isFr ? (
                <>
                  Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation
                  auprès de la <span className="font-medium text-foreground">CNIL</span> (Commission Nationale de l'Informatique et des Libertés) :{' '}
                  <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    cnil.fr/fr/plaintes
                  </a>.
                </>
              ) : (
                <>
                  If you believe your rights are not being respected, you may lodge a complaint
                  with your local data protection authority. In France, this is the{' '}
                  <span className="font-medium text-foreground">CNIL</span>:{' '}
                  <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    cnil.fr/fr/plaintes
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
