import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { manufacturers } from "@/data/manufacturers";
import { manufacturerTimelines } from "@/data/manufacturer-timelines";
import { ships } from "@/data/ships";
import { weapons } from "@/data/weapons";
import { components } from "@/data/components";
import { vehicles } from "@/data/vehicles";
import { Badge } from "@/components/ui/badge";

const ManufacturerDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const manufacturer = manufacturers.find((m) => m.slug === slug);

  if (!manufacturer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Entreprise introuvable</h1>
          <Link to="/manufacturers" className="mt-4 inline-block text-primary hover:underline">
            ← Retour aux entreprises
          </Link>
        </div>
      </div>
    );
  }

  const relatedShips = ships.filter((s) => s.manufacturer === manufacturer.name);
  const relatedWeapons = weapons.filter((w) => w.manufacturer === manufacturer.name);
  const relatedComponents = components.filter((c) => c.manufacturer === manufacturer.name);
  const relatedVehicles = vehicles.filter((v) => v.manufacturer === manufacturer.name);

  const sections = [
    { title: "Vaisseaux", items: relatedShips, linkBase: "/ships", getSubtitle: (i: any) => i.role },
    { title: "Armes", items: relatedWeapons, linkBase: "/weapons", getSubtitle: (i: any) => `${i.type} — Taille ${i.size}` },
    { title: "Composants", items: relatedComponents, linkBase: "/components", getSubtitle: (i: any) => `${i.type} ${i.size} — Grade ${i.grade}` },
    { title: "Véhicules", items: relatedVehicles, linkBase: "/vehicles", getSubtitle: (i: any) => `${i.type} — ${i.speed} km/h` },
  ].filter((s) => s.items.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Link
          to="/manufacturers"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Entreprises
        </Link>

        {/* Header */}
        <div className="mb-8 rounded-lg border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{manufacturer.logo}</span>
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold text-foreground">{manufacturer.name}</h1>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>📅 Fondée en {manufacturer.founded}</span>
                <span>📍 {manufacturer.headquarters}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {manufacturer.industry.map((ind) => (
                  <Badge key={ind} variant="secondary">{ind}</Badge>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{manufacturer.description}</p>
        </div>

        {/* Lore */}
        <div className="mb-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-3 font-display text-lg font-semibold text-foreground">Histoire</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{manufacturer.lore}</p>
        </div>

        {/* Chronologie */}
        {manufacturerTimelines[manufacturer.id] && (
          <div className="mb-8 rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Chronologie
            </h2>
            <div className="relative ml-3 border-l-2 border-primary/30 pl-6 space-y-4">
              {manufacturerTimelines[manufacturer.id].map((event, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                  <span className="text-xs font-mono font-semibold text-primary">{event.date}</span>
                  <p className="text-sm text-muted-foreground">{event.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {sections.map((section) => (
          <div key={section.title} className="mb-8">
            <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
              {section.title} ({section.items.length})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item: any) => (
                <Link
                  key={item.id}
                  to={`${section.linkBase}/${item.id}`}
                  className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-accent/50 block"
                >
                  <h3 className="font-display text-sm font-semibold text-foreground">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{section.getSubtitle(item)}</p>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun produit référencé pour cette entreprise.</p>
        )}
      </div>
    </div>
  );
};

export default ManufacturerDetail;
