import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { FileText, Globe, UserCheck, Ban, AlertTriangle, Shield, Power, Scale, RefreshCw, CalendarDays } from 'lucide-react';

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: "Conditions générales d'utilisation du site Star-Head.",
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

export default function CGU() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Conditions générales d'utilisation" }]}
        label="Administratif"
        title="Conditions générales d'utilisation"
        subtitle="Les règles d'utilisation du site Star-Head et les droits et obligations des utilisateurs."
      />
      <div className="container py-6">
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="flex flex-col gap-6">

            <Section icon={FileText} title="1. Objet">
              Les présentes conditions générales d'utilisation (CGU) régissent l'accès et l'utilisation
              du site Star-Head accessible à l'adresse <span className="font-medium text-foreground">star-head.sc</span>,
              base de données communautaire dédiée à l'univers du jeu Star Citizen.
              En accédant au site, vous acceptez sans réserve les présentes CGU.
            </Section>

            <Section icon={Globe} title="2. Accès au site">
              L'accès au site est libre et gratuit. Certaines fonctionnalités (contribution, historique
              personnel, export de données) nécessitent la création d'un compte. Vous devez avoir au
              moins <span className="font-medium text-foreground">15 ans</span> pour créer un compte.
              Si vous avez entre 15 et 18 ans, vous déclarez avoir obtenu l'autorisation de votre
              représentant légal.
              L'éditeur se réserve le droit de restreindre l'accès à tout ou partie du site, notamment
              pour des opérations de maintenance.
            </Section>

            <Section icon={UserCheck} title="3. Compte utilisateur">
              Lors de la création de votre compte, vous vous engagez à :
              <ul className="mt-2 space-y-1 list-none">
                {[
                  'Fournir des informations exactes et à les maintenir à jour.',
                  'Conserver la confidentialité de votre mot de passe et ne pas le communiquer à des tiers.',
                  'Ne pas créer plusieurs comptes pour un même utilisateur.',
                  'Ne pas céder, vendre ou transférer votre compte à une autre personne.',
                  'Notifier immédiatement l\'éditeur en cas d\'utilisation non autorisée de votre compte.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-0.5 text-primary shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              Vous êtes seul responsable de toute activité réalisée depuis votre compte.
            </Section>

            <Section icon={Ban} title="4. Comportements interdits">
              Il est strictement interdit d'utiliser le site pour :
              <ul className="mt-2 space-y-1 list-none">
                {[
                  'Publier, transmettre ou partager des contenus illicites, diffamatoires, obscènes ou portant atteinte aux droits de tiers.',
                  'Usurper l\'identité d\'un autre utilisateur ou d\'un tiers.',
                  'Tenter d\'accéder sans autorisation aux systèmes informatiques du site (piratage, injection, etc.).',
                  'Collecter automatiquement des données par scraping ou tout procédé automatisé sans accord préalable.',
                  'Diffuser des spams, messages publicitaires non sollicités ou contenus malveillants.',
                  'Perturber le bon fonctionnement du site ou de ses serveurs.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-0.5 text-primary shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section icon={AlertTriangle} title="5. Responsabilité">
              Star-Head est un site <span className="font-medium text-foreground">non officiel</span>, sans
              lien avec Cloud Imperium Games. Les données présentées proviennent de Star Citizen et peuvent
              être incomplètes ou temporairement inexactes. Nous ne pouvons être tenus responsables
              d'éventuelles erreurs, omissions ou interruptions de service.
              <br /><br />
              Le site peut contenir des liens vers des sites tiers. L'éditeur n'exerce aucun contrôle
              sur ces sites et décline toute responsabilité quant à leur contenu.
            </Section>

            <Section icon={Shield} title="6. Propriété intellectuelle">
              Star Citizen® est une marque déposée de <span className="font-medium text-foreground">Cloud Imperium Games Corporation</span>.
              Les contenus du site Star-Head (hors données du jeu) — code source, design, textes, logo — sont
              la propriété de GTL Studio. Toute reproduction, représentation ou exploitation sans autorisation
              écrite préalable est interdite.
            </Section>

            <Section icon={Power} title="7. Suspension et suppression de compte">
              L'éditeur se réserve le droit de suspendre ou supprimer tout compte, sans préavis ni
              indemnité, en cas de :
              <ul className="mt-2 space-y-1 list-none">
                {[
                  'Violation des présentes CGU.',
                  'Comportement abusif ou frauduleux.',
                  'Inactivité prolongée (supérieure à 2 ans).',
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-0.5 text-primary shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              L'utilisateur peut à tout moment supprimer son compte depuis sa{' '}
              <a href="/profile" className="text-primary hover:underline">page de profil</a>.
            </Section>

            <Section icon={Globe} title="8. Publicité">
              Le site Star-Head affiche des publicités diffusées par{' '}
              <span className="font-medium text-foreground">Google AdSense</span> (Google LLC).
              L'éditeur n'exerce aucun contrôle sur le contenu des annonces diffusées et décline
              toute responsabilité à leur égard. Les publicités sont gérées par Google conformément
              à sa{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                politique de confidentialité
              </a>.
            </Section>

            <Section icon={Power} title="9. Force majeure">
              L'éditeur ne pourra être tenu responsable d'une inexécution ou d'un retard dans
              l'exécution de ses obligations en cas de force majeure, incluant notamment : pannes
              d'infrastructure, cyberattaques, catastrophes naturelles, défaillances des fournisseurs
              tiers ou toute autre cause échappant à son contrôle raisonnable.
            </Section>

            <Section icon={Scale} title="10. Droit applicable et juridiction">
              Les présentes CGU sont soumises au <span className="font-medium text-foreground">droit français</span>.
              En cas de litige, et à défaut de résolution amiable, les tribunaux compétents seront ceux
              du ressort du domicile de l'éditeur.
            </Section>

            <Section icon={FileText} title="11. Langue">
              Les présentes CGU sont rédigées en langue française. En cas de traduction dans une
              autre langue, la <span className="font-medium text-foreground">version française fait foi</span> en
              cas de contradiction ou de litige.
            </Section>

            <Section icon={RefreshCw} title="12. Modification des CGU" last>
              L'éditeur se réserve le droit de modifier les présentes CGU à tout moment.
              Les modifications entrent en vigueur dès leur publication sur le site.
              Il est conseillé de consulter régulièrement cette page pour prendre connaissance
              d'éventuelles mises à jour.
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
