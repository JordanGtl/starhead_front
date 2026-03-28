'use client';
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, MapPin, Globe, Moon, Landmark, Radio, Orbit,
  Coffee, Tag, Layers, Wind, Gauge, Ruler, Palette, BookOpen, Loader2, ChevronRight,
} from "lucide-react";
import { Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { fetchLocation, fetchLocationChildren, type Location } from "@/data/locations";
import { useSEO } from "@/hooks/useSEO";

const typeIcons: Record<string, typeof Globe> = {
  Planet: Globe, Moon, Station: Radio, City: Landmark,
  Outpost: MapPin, "Asteroid Belt": Orbit, "Lagrange Point": Orbit,
  "Rest Stop": Coffee, Star: Sun,
};

const typeConfig: Record<string, { bg: string; icon: string; border: string }> = {
  Planet:           { bg: "from-blue-500/20 to-blue-600/5",     icon: "text-blue-400",     border: "border-blue-500/30"     },
  Moon:             { bg: "from-slate-400/20 to-slate-500/5",   icon: "text-slate-300",    border: "border-slate-400/30"    },
  Station:          { bg: "from-amber-500/20 to-amber-600/5",   icon: "text-amber-400",    border: "border-amber-500/30"    },
  City:             { bg: "from-emerald-500/20 to-emerald-600/5", icon: "text-emerald-400", border: "border-emerald-500/30" },
  Outpost:          { bg: "from-orange-500/20 to-orange-600/5", icon: "text-orange-400",   border: "border-orange-500/30"   },
  "Asteroid Belt":  { bg: "from-purple-500/20 to-purple-600/5", icon: "text-purple-400",   border: "border-purple-500/30"   },
  "Lagrange Point": { bg: "from-cyan-500/20 to-cyan-600/5",     icon: "text-cyan-400",     border: "border-cyan-500/30"     },
  "Rest Stop":      { bg: "from-teal-500/20 to-teal-600/5",     icon: "text-teal-400",     border: "border-teal-500/30"     },
  Star:             { bg: "from-yellow-500/20 to-yellow-600/5", icon: "text-yellow-400",   border: "border-yellow-500/30"   },
};
const defaultTc = { bg: "from-primary/20 to-primary/5", icon: "text-primary", border: "border-primary/30" };

const LocationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [location, setLocation]   = useState<Location | null>(null);
  const [children, setChildren]   = useState<Location[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useSEO({
    title: location?.name ?? undefined,
    description: location ? `${location.name} — ${location.type ?? "Lieu"} dans Star Citizen. Découvrez ce lieu dans StarHead.` : undefined,
    path: id ? `/locations/${id}` : undefined,
    jsonLd: location ? {
      "@context": "https://schema.org",
      "@type": "Place",
      "name": location.name,
      "description": `${location.type ?? "Lieu"} dans Star Citizen — ${location.name}`,
      "url": `https://star-head.sc/locations/${location.id}`,
    } : undefined,
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setChildren([]);
    fetchLocation(Number(id), i18n.language)
      .then((loc) => {
        setLocation(loc);
        fetchLocationChildren(loc.id, i18n.language).then(setChildren).catch(() => {});
      })
      .catch(() => setError("Location not found"))
      .finally(() => setLoading(false));
  }, [id, i18n.language]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">{error ?? t("common.noResults")}</p>
        <Link href="/locations" className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> {t("locations.title")}
        </Link>
      </div>
    );
  }

  const tc   = typeConfig[location.type ?? ""] ?? defaultTc;
  const Icon = typeIcons[location.type ?? ""] ?? MapPin;
  const displayName = location.name ?? location.internal ?? "—";

  return (
    <div>
      {/* ── Hero ── */}
      <div className="relative h-[30vh] overflow-hidden">
        <img
          src="/hero-bg.jpg"
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: "center 20%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />

        <div className="absolute bottom-0 left-0 right-0 container pb-6">
          <Link
            href="/locations"
            className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("locations.title")}
          </Link>

          <div className="flex flex-wrap items-end gap-3">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br ${tc.bg} ${tc.border}`}>
              <Icon className={`h-6 w-6 ${tc.icon}`} />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">{displayName}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {location.type && (
                  <span className={`rounded border ${tc.border} bg-background/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${tc.icon}`}>
                    {location.type}
                  </span>
                )}
                {location.system && (
                  <span className="rounded border border-border bg-background/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {location.system}
                  </span>
                )}
                {location.parent && (
                  <span className="rounded border border-border bg-background/60 px-2 py-0.5 text-[11px] text-muted-foreground">
                    {t("locations.orbit")} {location.parent}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container py-8">
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description */}
            {location.description && (
              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-primary">
                  <BookOpen className="h-4 w-4" />
                  {t("common.description")}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{location.description}</p>
              </section>
            )}

            {/* Lore */}
            {(location as any).lore && (
              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-primary">
                  <BookOpen className="h-4 w-4" />
                  Lore
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{(location as any).lore}</p>
              </section>
            )}

            {/* Pas de description ni lore */}
            {!location.description && !(location as any).lore && (
              <section className="rounded-xl border border-border bg-card/50 p-6 text-center">
                <p className="text-sm text-muted-foreground">{t("locations.noDescription")}</p>
              </section>
            )}

            {/* Lieux enfants */}
            {children.length > 0 && (
              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-primary">
                  <MapPin className="h-4 w-4" />
                  {t("locations.children")}
                  <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">{children.length}</span>
                </h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {children.map((child) => {
                    const ChildIcon = typeIcons[child.type ?? ""] ?? MapPin;
                    const ctc = typeConfig[child.type ?? ""] ?? defaultTc;
                    return (
                      <Link
                        key={child.id}
                        href={`/locations/${child.id}`}
                        className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-secondary"
                      >
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-gradient-to-br ${ctc.bg} ${ctc.border}`}>
                          <ChildIcon className={`h-3.5 w-3.5 ${ctc.icon}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {child.name ?? child.internal ?? "—"}
                          </p>
                          {child.type && <p className="text-[10px] text-muted-foreground">{child.type}</p>}
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Specs */}
            <section className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t("common.specifications")}
              </h2>
              <dl className="space-y-3">
                {location.atmosphere && (
                  <Spec icon={Wind} label={t("locations.atmosphere")} value={location.atmosphere} />
                )}
                {location.gravity && (
                  <Spec icon={Gauge} label={t("locations.gravity")} value={location.gravity} />
                )}
                {location.size != null && (
                  <Spec icon={Ruler} label={t("locations.size")} value={String(location.size)} />
                )}
                {location.color && (
                  <Spec icon={Palette} label={t("locations.color")} value={location.color} />
                )}
                {(location as any).orbitAngle != null && (
                  <Spec icon={Orbit} label={t("locations.orbitAngle")} value={`${(location as any).orbitAngle}°`} />
                )}
                {(location as any).orbitRadius != null && (
                  <Spec icon={Orbit} label={t("locations.orbitRadius")} value={String((location as any).orbitRadius)} />
                )}
              </dl>
            </section>

            {/* Meta */}
            <section className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Infos
              </h2>
              <dl className="space-y-3">
                {(location as any).internal && (
                  <Spec icon={Layers} label="Référence interne" value={(location as any).internal} mono />
                )}
                {(location as any).version && (
                  <Spec icon={Tag} label="Version" value={(location as any).version.label} mono />
                )}
              </dl>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const Spec = ({
  icon: Icon, label, value, mono = false,
}: {
  icon: typeof MapPin; label: string; value: string; mono?: boolean;
}) => (
  <div className="flex items-start justify-between gap-4">
    <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {label}
    </dt>
    <dd className={`text-right text-xs font-medium text-foreground ${mono ? "font-mono" : ""}`}>{value}</dd>
  </div>
);

export default LocationDetail;
