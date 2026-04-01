'use client';
import PageHeader from '@/components/PageHeader';
import { Building2, User, Server, Shield, Mail, Megaphone, CalendarDays } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div className="flex gap-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex-1 border-b border-border/50 pb-6">
      <h2 className="mb-2 text-base font-semibold text-foreground">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  </div>
);

export default function MentionsLegales() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const isFr = lang === 'fr';

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: isFr ? 'Mentions légales' : 'Legal Notice' }]}
        label={isFr ? 'Administratif' : 'Legal'}
        title={isFr ? 'Mentions légales' : 'Legal Notice'}
        subtitle={
          isFr
            ? "Informations légales relatives à l'édition et à l'hébergement du site Star-Head."
            : 'Legal information regarding the publishing and hosting of the Star-Head website.'
        }
      />
      <div className="container py-6">
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="flex flex-col gap-6">

            <Section icon={Building2} title={isFr ? 'Éditeur du site' : 'Website Publisher'}>
              {isFr ? (
                <>
                  Le site Star-Head (star-head.sc) est édité par :<br />
                  <span className="font-medium text-foreground">Jordan Guillot</span> — particulier<br />
                  Contact : <a href="mailto:contact@star-head.sc" className="text-primary hover:underline">contact@star-head.sc</a><br />
                  <br />
                  Conformément à l'article 6 III de la loi n° 2004-575 du 21 juin 2004 (LCEN), l'éditeur
                  est une personne physique qui a choisi de ne pas rendre publique son adresse personnelle.
                  Ses coordonnées complètes sont tenues à disposition par l'hébergeur ci-dessous et
                  communiquées sur réquisition des autorités compétentes.
                </>
              ) : (
                <>
                  The Star-Head website (star-head.sc) is published by:<br />
                  <span className="font-medium text-foreground">Jordan Guillot</span> — individual<br />
                  Contact: <a href="mailto:contact@star-head.sc" className="text-primary hover:underline">contact@star-head.sc</a><br />
                  <br />
                  The publisher is an individual who has chosen not to make their personal address public.
                  Full contact details are held by the hosting provider below and shared upon request
                  from competent authorities.
                </>
              )}
            </Section>

            <Section icon={User} title={isFr ? 'Directeur de la publication' : 'Publication Director'}>
              Jordan Guillot
            </Section>

            <Section icon={Server} title={isFr ? 'Hébergement' : 'Hosting'}>
              {isFr ? (
                <>
                  Le site est hébergé par <span className="font-medium text-foreground">OVHcloud</span><br />
                  2 rue Kellermann — 59100 Roubaix, France<br />
                  <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.ovhcloud.com</a>
                </>
              ) : (
                <>
                  This website is hosted by <span className="font-medium text-foreground">OVHcloud</span><br />
                  2 rue Kellermann — 59100 Roubaix, France<br />
                  <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.ovhcloud.com</a>
                </>
              )}
            </Section>

            <Section icon={Shield} title={isFr ? 'Propriété intellectuelle' : 'Intellectual Property'}>
              {isFr ? (
                <>
                  Star Citizen® et Roberts Space Industries® sont des marques déposées de Cloud Imperium Games Corporation.
                  Star-Head est un site non officiel, non affilié à Cloud Imperium Games.
                  Les données, images et contenus relatifs à Star Citizen appartiennent à leurs propriétaires respectifs.
                </>
              ) : (
                <>
                  Star Citizen® and Roberts Space Industries® are registered trademarks of Cloud Imperium Games Corporation.
                  Star-Head is an unofficial website, not affiliated with Cloud Imperium Games.
                  All data, images and content related to Star Citizen belong to their respective owners.
                </>
              )}
            </Section>

            <Section icon={Megaphone} title={isFr ? 'Publicité' : 'Advertising'}>
              {isFr ? (
                <>
                  Le site Star-Head affiche des publicités diffusées par{' '}
                  <span className="font-medium text-foreground">Google AdSense</span> (Google LLC, USA),
                  dans le cadre d'une activité à vocation commerciale. L'éditeur perçoit une rémunération
                  en fonction des impressions et clics générés. Google AdSense peut utiliser des cookies
                  pour personnaliser les annonces affichées.
                </>
              ) : (
                <>
                  Star-Head displays advertisements served by{' '}
                  <span className="font-medium text-foreground">Google AdSense</span> (Google LLC, USA)
                  as part of a commercial activity. The publisher receives remuneration based on impressions
                  and clicks generated. Google AdSense may use cookies to personalize the ads displayed.
                </>
              )}
            </Section>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-base font-semibold text-foreground">Contact</h2>
                <div className="text-sm text-muted-foreground">
                  {isFr ? 'Pour toute question :' : 'For any enquiry:'}{' '}
                  <a href="mailto:contact@star-head.sc" className="text-primary hover:underline">contact@star-head.sc</a>
                </div>
              </div>
            </div>

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
