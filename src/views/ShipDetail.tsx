'use client';
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shield, Zap, Thermometer, Gauge, Crosshair, Box, Users, Ruler, Weight, Fuel, Heart, Wrench, Rocket, Euro, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getShipById, ShipComponent, Hardpoint } from "@/data/ships-detailed";
import { ships } from "@/data/ships";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PriceEvolutionChart from "@/components/PriceEvolutionChart";
import { shipTimelines } from "@/data/ship-timelines";
import { useSEO } from "@/hooks/useSEO";

const statusColor = {
  "Flight Ready": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "In Concept": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "In Production": "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const typeIcons: Record<string, typeof Shield> = {
  Shield, "Power Plant": Zap, Cooler: Thermometer, "Quantum Drive": Gauge, Radar: Crosshair, "Missile Rack": Crosshair,
};

const gradeColors: Record<string, string> = {
  A: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  B: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  C: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  D: "text-muted-foreground border-border bg-secondary",
};

const ComponentRow = ({ comp }: { comp: ShipComponent }) => {
  const Icon = typeIcons[comp.type] || Shield;
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-secondary/50 px-3 py-2.5">
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{comp.name}</p>
        <p className="text-xs text-muted-foreground">{comp.manufacturer}</p>
      </div>
      <Badge variant="outline" className="text-[10px] shrink-0">{comp.type}</Badge>
      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${gradeColors[comp.grade]}`}>
        {comp.grade}
      </span>
      <span className="text-xs text-muted-foreground">{comp.size}</span>
    </div>
  );
};

const HardpointRow = ({ hp }: { hp: Hardpoint }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-secondary/50 px-3 py-2.5">
      <div className="flex items-center gap-3">
        <Crosshair className="h-4 w-4 text-accent" />
        <div>
          <p className="text-sm font-medium text-foreground">{hp.slot}</p>
          <p className="text-xs text-muted-foreground">{t("shipDetail.taille")} {hp.size} · {hp.type}</p>
        </div>
      </div>
      {hp.equipped ? (
        <span className="text-xs text-primary">{hp.equipped}</span>
      ) : (
        <span className="text-xs text-muted-foreground italic">{t("shipDetail.empty")}</span>
      )}
    </div>
  );
};

const ShipDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const ship = id ? getShipById(id) : undefined;
  const shipBasic = id ? ships.find(s => s.id === id) : undefined;

  useSEO({
    title: ship?.name ?? undefined,
    description: ship ? `${ship.name} — ${ship.role ?? ""} by ${ship.manufacturer ?? ""}. Specs, prix et loadout dans StarHead.` : undefined,
    path: id ? `/ships/${id}` : undefined,
    image: shipBasic?.image ?? undefined,
  });

  if (!ship) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">{t("shipDetail.notFound")}</h1>
        <Link href="/ships" className="mt-4 text-primary hover:underline">← {t("shipDetail.backToShips")}</Link>
      </div>
    );
  }

  const specs = ship.specs;
  const shipImage = shipBasic?.image;

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <Link href="/ships" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" />
        {t("shipDetail.backToShips")}
      </Link>

      {/* Hero with image */}
      <div className="relative mb-8 overflow-hidden rounded-xl border border-border bg-card">
        {shipImage && (
          <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
            <img
              src={shipImage}
              alt={ship.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
          </div>
        )}

        <div className={`relative ${shipImage ? "-mt-24 sm:-mt-28" : ""} p-6 sm:p-8`}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-primary">{ship.manufacturer}</p>
              <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{ship.name}</h1>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor[ship.status]}`}>
                  {ship.status}
                </span>
                <Badge variant="outline">{ship.role}</Badge>
                <Badge variant="outline">{ship.size}</Badge>
                <Badge variant="outline">{ship.crew} {t("shipDetail.pilots")}</Badge>
                <Badge variant="outline">{ship.price.toLocaleString()} aUEC</Badge>
                <Badge variant="outline" className="border-accent/30 text-accent">
                  <Euro className="mr-1 h-3 w-3" />
                  {shipBasic?.priceEur ?? "N/A"} €
                </Badge>
              </div>
            </div>

            <Link
              href={`/ships/${id}/loadout`}
              className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/20 hover:border-primary/50"
            >
              <Wrench className="h-4 w-4" />
              {t("shipDetail.configurator")}
            </Link>
          </div>
        </div>
      </div>

      {/* Price evolution chart */}
      <div className="mb-8">
        <PriceEvolutionChart
          shipId={ship.id}
          currentPriceAuec={ship.price}
          currentPriceEur={shipBasic?.priceEur ?? 0}
        />
      </div>

      {/* Lore */}
      <div className="mb-8 rounded-lg border border-border bg-card p-6">
        <h2 className="mb-2 font-display text-lg font-semibold text-foreground">{t("shipDetail.history")}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{ship.lore}</p>
      </div>

      {/* Timeline */}
      {shipTimelines[ship.id] && shipTimelines[ship.id].length > 0 && (
        <div className="mb-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {t("shipDetail.timeline")}
          </h2>
          <div className="relative ml-3 border-l-2 border-primary/20 pl-6">
            {shipTimelines[ship.id].map((event, i) => (
              <div key={i} className="relative mb-6 last:mb-0">
                <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                <span className="font-display text-xs font-bold text-primary">{event.date}</span>
                <p className="mt-0.5 text-sm text-muted-foreground">{event.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specs grid */}
      <div className="mb-8">
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">{t("shipDetail.specs")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {[
            { icon: Ruler, label: t("shipDetail.length"), value: `${specs.length}m` },
            { icon: Ruler, label: t("shipDetail.beam"), value: `${specs.beam}m` },
            { icon: Ruler, label: t("shipDetail.height"), value: `${specs.height}m` },
            { icon: Weight, label: t("shipDetail.mass"), value: `${(specs.mass / 1000).toFixed(0)}t` },
            { icon: Gauge, label: t("shipDetail.scm"), value: `${specs.scmSpeed} m/s` },
            { icon: Gauge, label: t("shipDetail.max"), value: `${specs.maxSpeed} m/s` },
            { icon: Fuel, label: "QT Fuel", value: `${specs.qtFuelCapacity.toLocaleString()}` },
            { icon: Fuel, label: "H2 Fuel", value: `${specs.hydrogenFuelCapacity.toLocaleString()}` },
            { icon: Shield, label: t("shipDetail.shield"), value: `${specs.shieldHp.toLocaleString()} HP` },
            { icon: Heart, label: t("shipDetail.hull"), value: `${specs.hullHp.toLocaleString()} HP` },
            { icon: Box, label: t("shipDetail.cargo"), value: `${ship.cargo} SCU` },
            { icon: Users, label: t("shipDetail.crew"), value: ship.crew },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <s.icon className="h-3.5 w-3.5" />
                <span className="text-xs">{s.label}</span>
              </div>
              <p className="mt-1 font-display text-sm font-semibold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs: Hardpoints / Default Components / Upgrades */}
      <Tabs defaultValue="hardpoints" className="mb-8">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="hardpoints" className="font-display text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            {t("shipDetail.hardpoints")} ({ship.hardpoints.length})
          </TabsTrigger>
          <TabsTrigger value="default" className="font-display text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            {t("shipDetail.defaultComponents")} ({ship.defaultComponents.length})
          </TabsTrigger>
          <TabsTrigger value="upgrades" className="font-display text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            {t("shipDetail.upgrades")} ({ship.compatibleComponents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hardpoints" className="mt-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {ship.hardpoints.map((hp, i) => (
              <HardpointRow key={i} hp={hp} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="default" className="mt-4">
          <p className="mb-3 text-xs text-muted-foreground">{t("shipDetail.defaultComponentsDesc")}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {ship.defaultComponents.map((comp, i) => (
              <ComponentRow key={i} comp={comp} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upgrades" className="mt-4">
          <p className="mb-3 text-xs text-muted-foreground">{t("shipDetail.upgradesDesc")}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {ship.compatibleComponents.map((comp, i) => (
              <ComponentRow key={i} comp={comp} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShipDetail;
