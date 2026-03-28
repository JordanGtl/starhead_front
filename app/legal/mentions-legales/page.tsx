import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Building2, User, Server, Shield, Mail, Megaphone, CalendarDays } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du site Star-Head.',
};

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
  return (
    <>
      <PageHeader
        breadcrumb={[{ label: 'Mentions légales' }]}
        label="Administratif"
        title="Mentions légales"
        subtitle="Informations légales relatives à l'édition et à l'hébergement du site Star-Head."
      />
      <div className="container py-6">
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="flex flex-col gap-6">

            <Section icon={Building2} title="Éditeur du site">
              Le site Star-Head (star-head.sc) est édité par GTL Studio.<br />
              Site web : <a href="https://gtl-studio.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">gtl-studio.com</a>
            </Section>

            <Section icon={User} title="Directeur de la publication">
              Jordan Guillot
            </Section>

            <Section icon={Server} title="Hébergement">
              Le site est hébergé par <span className="font-medium text-foreground">OVHcloud</span><br />
              2 rue Kellermann — 59100 Roubaix, France<br />
              <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.ovhcloud.com</a>
            </Section>

            <Section icon={Shield} title="Propriété intellectuelle">
              Star Citizen® et Roberts Space Industries® sont des marques déposées de Cloud Imperium Games Corporation.
              Star-Head est un site non officiel, non affilié à Cloud Imperium Games.
              Les données, images et contenus relatifs à Star Citizen appartiennent à leurs propriétaires respectifs.
            </Section>

            <Section icon={Megaphone} title="Publicité">
              Le site Star-Head affiche des publicités diffusées par{' '}
              <span className="font-medium text-foreground">Google AdSense</span> (Google LLC, USA),
              dans le cadre d'une activité à vocation commerciale. L'éditeur perçoit une rémunération
              en fonction des impressions et clics générés. Google AdSense peut utiliser des cookies
              pour personnaliser les annonces affichées.
            </Section>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-base font-semibold text-foreground">Contact</h2>
                <div className="text-sm text-muted-foreground">
                  Pour toute question :{' '}
                  <a href="mailto:contact@star-head.sc" className="text-primary hover:underline">contact@star-head.sc</a>
                </div>
              </div>
            </div>

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
