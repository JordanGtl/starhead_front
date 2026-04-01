'use client';
import PageHeader from '@/components/PageHeader';
import { FileText, Globe, UserCheck, Ban, AlertTriangle, Shield, Power, Scale, RefreshCw, CalendarDays } from 'lucide-react';
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

const Bullet = ({ items }: { items: string[] }) => (
  <ul className="mt-2 space-y-1 list-none">
    {items.map((item, i) => (
      <li key={i} className="flex gap-2">
        <span className="mt-0.5 text-primary shrink-0">•</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export default function CGU() {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: isFr ? "Conditions générales d'utilisation" : 'Terms of Service' }]}
        label={isFr ? 'Administratif' : 'Legal'}
        title={isFr ? "Conditions générales d'utilisation" : 'Terms of Service'}
        subtitle={
          isFr
            ? "Les règles d'utilisation du site Star-Head et les droits et obligations des utilisateurs."
            : "The rules governing use of the Star-Head website and the rights and obligations of users."
        }
      />
      <div className="container py-6">
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="flex flex-col gap-6">

            <Section icon={FileText} title={isFr ? '1. Objet' : '1. Purpose'}>
              {isFr ? (
                <>
                  Les présentes conditions générales d'utilisation (CGU) régissent l'accès et l'utilisation
                  du site Star-Head accessible à l'adresse <span className="font-medium text-foreground">star-head.sc</span>,
                  base de données communautaire dédiée à l'univers du jeu Star Citizen.
                  En accédant au site, vous acceptez sans réserve les présentes CGU.
                </>
              ) : (
                <>
                  These Terms of Service govern access to and use of the Star-Head website available at{' '}
                  <span className="font-medium text-foreground">star-head.sc</span>,
                  a community database dedicated to the Star Citizen game universe.
                  By accessing the site, you unconditionally accept these Terms of Service.
                </>
              )}
            </Section>

            <Section icon={Globe} title={isFr ? '2. Accès au site' : '2. Site Access'}>
              {isFr ? (
                <>
                  L'accès au site est libre et gratuit. Certaines fonctionnalités (contribution, historique
                  personnel, export de données) nécessitent la création d'un compte. Vous devez avoir au
                  moins <span className="font-medium text-foreground">15 ans</span> pour créer un compte.
                  Si vous avez entre 15 et 18 ans, vous déclarez avoir obtenu l'autorisation de votre
                  représentant légal.
                  L'éditeur se réserve le droit de restreindre l'accès à tout ou partie du site, notamment
                  pour des opérations de maintenance.
                </>
              ) : (
                <>
                  Access to the site is free and open. Certain features (contribution, personal history,
                  data export) require account creation. You must be at least{' '}
                  <span className="font-medium text-foreground">15 years old</span> to create an account.
                  If you are between 15 and 18, you declare that you have obtained permission from your
                  legal guardian.
                  The publisher reserves the right to restrict access to all or part of the site,
                  particularly for maintenance operations.
                </>
              )}
            </Section>

            <Section icon={UserCheck} title={isFr ? '3. Compte utilisateur' : '3. User Account'}>
              {isFr ? 'Lors de la création de votre compte, vous vous engagez à :' : 'When creating your account, you agree to:'}
              <Bullet items={isFr ? [
                'Fournir des informations exactes et à les maintenir à jour.',
                'Conserver la confidentialité de votre mot de passe et ne pas le communiquer à des tiers.',
                'Ne pas créer plusieurs comptes pour un même utilisateur.',
                'Ne pas céder, vendre ou transférer votre compte à une autre personne.',
                "Notifier immédiatement l'éditeur en cas d'utilisation non autorisée de votre compte.",
              ] : [
                'Provide accurate information and keep it up to date.',
                'Keep your password confidential and not share it with any third party.',
                'Not create multiple accounts for the same user.',
                'Not assign, sell or transfer your account to another person.',
                'Immediately notify the publisher of any unauthorized use of your account.',
              ]} />
              <p className="mt-2">
                {isFr
                  ? 'Vous êtes seul responsable de toute activité réalisée depuis votre compte.'
                  : 'You are solely responsible for any activity carried out from your account.'}
              </p>
            </Section>

            <Section icon={Ban} title={isFr ? '4. Comportements interdits' : '4. Prohibited Conduct'}>
              {isFr ? "Il est strictement interdit d'utiliser le site pour :" : 'It is strictly prohibited to use the site to:'}
              <Bullet items={isFr ? [
                'Publier, transmettre ou partager des contenus illicites, diffamatoires, obscènes ou portant atteinte aux droits de tiers.',
                "Usurper l'identité d'un autre utilisateur ou d'un tiers.",
                "Tenter d'accéder sans autorisation aux systèmes informatiques du site (piratage, injection, etc.).",
                'Collecter automatiquement des données par scraping ou tout procédé automatisé sans accord préalable.',
                'Diffuser des spams, messages publicitaires non sollicités ou contenus malveillants.',
                'Perturber le bon fonctionnement du site ou de ses serveurs.',
              ] : [
                'Post, transmit or share unlawful, defamatory, obscene or rights-infringing content.',
                'Impersonate another user or any third party.',
                'Attempt to gain unauthorized access to the site\'s systems (hacking, injection, etc.).',
                'Automatically collect data via scraping or any automated process without prior consent.',
                'Send spam, unsolicited advertising messages or malicious content.',
                'Disrupt the proper functioning of the site or its servers.',
              ]} />
            </Section>

            <Section icon={AlertTriangle} title={isFr ? '5. Responsabilité' : '5. Liability'}>
              {isFr ? (
                <>
                  Star-Head est un site <span className="font-medium text-foreground">non officiel</span>, sans
                  lien avec Cloud Imperium Games. Les données présentées proviennent de Star Citizen et peuvent
                  être incomplètes ou temporairement inexactes. Nous ne pouvons être tenus responsables
                  d'éventuelles erreurs, omissions ou interruptions de service.
                  <br /><br />
                  Le site peut contenir des liens vers des sites tiers. L'éditeur n'exerce aucun contrôle
                  sur ces sites et décline toute responsabilité quant à leur contenu.
                </>
              ) : (
                <>
                  Star-Head is an <span className="font-medium text-foreground">unofficial</span> website,
                  unaffiliated with Cloud Imperium Games. The data presented originates from Star Citizen
                  and may be incomplete or temporarily inaccurate. We cannot be held liable for any errors,
                  omissions or service interruptions.
                  <br /><br />
                  The site may contain links to third-party websites. The publisher has no control over
                  these sites and accepts no responsibility for their content.
                </>
              )}
            </Section>

            <Section icon={Shield} title={isFr ? '6. Propriété intellectuelle' : '6. Intellectual Property'}>
              {isFr ? (
                <>
                  Star Citizen® est une marque déposée de <span className="font-medium text-foreground">Cloud Imperium Games Corporation</span>.
                  Les contenus du site Star-Head (hors données du jeu) — code source, design, textes, logo — sont
                  la propriété de GTL Studio. Toute reproduction, représentation ou exploitation sans autorisation
                  écrite préalable est interdite.
                </>
              ) : (
                <>
                  Star Citizen® is a registered trademark of <span className="font-medium text-foreground">Cloud Imperium Games Corporation</span>.
                  The content of the Star-Head website (excluding game data) — source code, design, text, logo — is
                  the property of GTL Studio. Any reproduction, representation or exploitation without prior
                  written authorisation is prohibited.
                </>
              )}
            </Section>

            <Section icon={Power} title={isFr ? '7. Suspension et suppression de compte' : '7. Account Suspension & Deletion'}>
              {isFr
                ? "L'éditeur se réserve le droit de suspendre ou supprimer tout compte, sans préavis ni indemnité, en cas de :"
                : 'The publisher reserves the right to suspend or delete any account, without prior notice or compensation, in the event of:'}
              <Bullet items={isFr ? [
                'Violation des présentes CGU.',
                'Comportement abusif ou frauduleux.',
                'Inactivité prolongée (supérieure à 2 ans).',
              ] : [
                'Breach of these Terms of Service.',
                'Abusive or fraudulent behaviour.',
                'Extended inactivity (more than 2 years).',
              ]} />
              <p className="mt-2">
                {isFr ? (
                  <>L'utilisateur peut à tout moment supprimer son compte depuis sa{' '}
                    <a href="/profile" className="text-primary hover:underline">page de profil</a>.</>
                ) : (
                  <>Users may delete their account at any time from their{' '}
                    <a href="/profile" className="text-primary hover:underline">profile page</a>.</>
                )}
              </p>
            </Section>

            <Section icon={Globe} title={isFr ? '8. Publicité' : '8. Advertising'}>
              {isFr ? (
                <>
                  Le site Star-Head affiche des publicités diffusées par{' '}
                  <span className="font-medium text-foreground">Google AdSense</span> (Google LLC).
                  L'éditeur n'exerce aucun contrôle sur le contenu des annonces diffusées et décline
                  toute responsabilité à leur égard. Les publicités sont gérées par Google conformément
                  à sa{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    politique de confidentialité
                  </a>.
                </>
              ) : (
                <>
                  Star-Head displays advertisements served by{' '}
                  <span className="font-medium text-foreground">Google AdSense</span> (Google LLC).
                  The publisher has no control over the content of ads displayed and accepts no
                  liability in that regard. Ads are managed by Google in accordance with its{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    privacy policy
                  </a>.
                </>
              )}
            </Section>

            <Section icon={Power} title={isFr ? '9. Force majeure' : '9. Force Majeure'}>
              {isFr
                ? "L'éditeur ne pourra être tenu responsable d'une inexécution ou d'un retard dans l'exécution de ses obligations en cas de force majeure, incluant notamment : pannes d'infrastructure, cyberattaques, catastrophes naturelles, défaillances des fournisseurs tiers ou toute autre cause échappant à son contrôle raisonnable."
                : "The publisher cannot be held liable for any failure or delay in performing its obligations in the event of force majeure, including but not limited to: infrastructure outages, cyberattacks, natural disasters, third-party provider failures or any other cause beyond its reasonable control."}
            </Section>

            <Section icon={Scale} title={isFr ? '10. Droit applicable et juridiction' : '10. Governing Law & Jurisdiction'}>
              {isFr ? (
                <>
                  Les présentes CGU sont soumises au <span className="font-medium text-foreground">droit français</span>.
                  En cas de litige, et à défaut de résolution amiable, les tribunaux compétents seront ceux
                  du ressort du domicile de l'éditeur.
                </>
              ) : (
                <>
                  These Terms of Service are governed by <span className="font-medium text-foreground">French law</span>.
                  In the event of a dispute, and in the absence of an amicable resolution, the competent courts
                  shall be those of the publisher's place of domicile.
                </>
              )}
            </Section>

            <Section icon={FileText} title={isFr ? '11. Langue' : '11. Language'}>
              {isFr ? (
                <>
                  Les présentes CGU sont rédigées en langue française. En cas de traduction dans une
                  autre langue, la <span className="font-medium text-foreground">version française fait foi</span> en
                  cas de contradiction ou de litige.
                </>
              ) : (
                <>
                  These Terms of Service are written in French. In the event of a translation into another
                  language, the <span className="font-medium text-foreground">French version shall prevail</span> in
                  case of contradiction or dispute.
                </>
              )}
            </Section>

            <Section icon={RefreshCw} title={isFr ? '12. Modification des CGU' : '12. Amendments'} last>
              {isFr
                ? "L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur le site. Il est conseillé de consulter régulièrement cette page pour prendre connaissance d'éventuelles mises à jour."
                : "The publisher reserves the right to amend these Terms of Service at any time. Amendments take effect upon publication on the site. Users are advised to check this page regularly for any updates."}
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
