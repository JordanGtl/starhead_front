import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { User, Database, Lock, Cookie, ShieldCheck, Clock, Globe, Scale, Shield, CalendarDays } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité du site Star-Head.',
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

export default function PolitiqueConfidentialite() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ label: 'Politique de confidentialité' }]}
        label="Administratif"
        title="Politique de confidentialité"
        subtitle="Comment nous collectons, utilisons et protégeons vos données personnelles."
      />
      <div className="container py-6">
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="flex flex-col gap-6">

            <Section icon={User} title="Responsable du traitement">
              Le responsable du traitement des données personnelles est :<br />
              <span className="font-medium text-foreground">Jordan Guillot</span><br />
              Contact : <a href="mailto:contact@star-head.sc" className="text-primary hover:underline">contact@star-head.sc</a>
            </Section>

            <Section icon={Database} title="Données collectées et base légale">
              <div className="mt-1 overflow-x-auto rounded-lg border border-border/50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-left">
                      <th className="px-4 py-2.5 font-semibold text-foreground">Données</th>
                      <th className="px-4 py-2.5 font-semibold text-foreground">Finalité</th>
                      <th className="px-4 py-2.5 font-semibold text-foreground">Base légale</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="px-4 py-2.5">Adresse e-mail</td>
                      <td className="px-4 py-2.5">Gestion du compte</td>
                      <td className="px-4 py-2.5">Exécution du contrat</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="px-4 py-2.5">Pseudo</td>
                      <td className="px-4 py-2.5">Identification sur le site</td>
                      <td className="px-4 py-2.5">Exécution du contrat</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="px-4 py-2.5">Mot de passe (hashé)</td>
                      <td className="px-4 py-2.5">Authentification sécurisée</td>
                      <td className="px-4 py-2.5">Exécution du contrat</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="px-4 py-2.5">Logs d'activité (connexions, modifications de profil)</td>
                      <td className="px-4 py-2.5">Sécurité du compte, historique</td>
                      <td className="px-4 py-2.5">Intérêt légitime</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="px-4 py-2.5">Adresse IP</td>
                      <td className="px-4 py-2.5">Sécurité, mesure d'audience</td>
                      <td className="px-4 py-2.5">Intérêt légitime / Consentement</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5">Données de navigation</td>
                      <td className="px-4 py-2.5">Mesure d'audience (Analytics)</td>
                      <td className="px-4 py-2.5">Consentement</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Section icon={Lock} title="Utilisation des données">
              Vos données sont utilisées uniquement pour la gestion de votre compte et ne sont jamais
              vendues ni transmises à des tiers à des fins commerciales.
            </Section>

            <Section icon={Globe} title="Transferts hors Union Européenne">
              Le site utilise Google Analytics et Google AdSense, services de Google LLC (USA).
              Ces services peuvent transférer des données vers les États-Unis dans le cadre du
              {' '}<span className="font-medium text-foreground">Data Privacy Framework UE-USA</span>.
              Pour plus d'informations :{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                politique de confidentialité Google
              </a>.
            </Section>

            <Section icon={Cookie} title="Cookies et traceurs">
              Le site utilise des cookies de mesure d'audience (Google Analytics) et de gestion des
              publicités (Google AdSense). Consultez notre{' '}
              <a href="/legal/cookies" className="text-primary hover:underline">politique de cookies</a>{' '}
              pour plus d'informations.
            </Section>

            <Section icon={Clock} title="Durée de conservation">
              Les données de compte sont conservées tant que le compte est actif et supprimées sur simple demande.
              Les données de navigation (cookies Analytics) sont conservées 26 mois maximum.
            </Section>

            <Section icon={ShieldCheck} title="Vos droits">
              Conformément au RGPD, vous disposez des droits suivants sur vos données :
              <ul className="mt-2 space-y-1 list-none">
                {[
                  ['Accès', 'obtenir une copie de vos données'],
                  ['Rectification', 'corriger des données inexactes'],
                  ['Suppression', 'demander l\'effacement de vos données'],
                  ['Portabilité', 'recevoir vos données dans un format structuré'],
                  ['Opposition', 'vous opposer à un traitement basé sur l\'intérêt légitime'],
                  ['Limitation', 'restreindre temporairement un traitement'],
                  ['Retrait du consentement', 'retirer votre consentement à tout moment'],
                ].map(([right, desc]) => (
                  <li key={right} className="flex gap-2">
                    <span className="font-medium text-foreground">{right} :</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                <p className="text-sm font-medium text-foreground">Gérer vos données directement depuis votre profil</p>
                <p className="mt-1 text-xs">
                  Une fois connecté, rendez-vous sur votre{' '}
                  <a href="/profile" className="text-primary hover:underline">page de profil</a>{' '}
                  pour <span className="font-medium text-foreground">télécharger l'intégralité de vos données</span> (export JSON)
                  ou <span className="font-medium text-foreground">supprimer définitivement votre compte</span> sans avoir à nous contacter.
                </p>
              </div>
              <p className="mt-3">
                Pour toute autre demande : <a href="mailto:contact@star-head.sc" className="text-primary hover:underline">contact@star-head.sc</a>
              </p>
            </Section>

            <Section icon={Shield} title="Sécurité des données">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
              <ul className="mt-2 space-y-1 list-none">
                {[
                  'Les mots de passe sont systématiquement hachés (bcrypt) avant stockage — nous ne connaissons pas votre mot de passe en clair.',
                  'Les communications entre votre navigateur et nos serveurs sont chiffrées via HTTPS (TLS).',
                  'L\'accès aux données est restreint aux seules personnes habilitées.',
                  'Les données sont hébergées chez OVH dans des datacentres situés en France.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-0.5 text-primary shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section icon={Scale} title="Droit de réclamation" last>
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation
              auprès de la <span className="font-medium text-foreground">CNIL</span> (Commission Nationale de l'Informatique et des Libertés) :{' '}
              <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                cnil.fr/fr/plaintes
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
