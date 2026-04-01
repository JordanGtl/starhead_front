'use client';
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Building2, MapPin, Calendar, Tag, Loader2, ChevronRight, History, ChevronLeft, Shield, Users, Rocket } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchManufacturer, localize, type Manufacturer } from "@/data/manufacturers";
import { fetchShips, type Ship } from "@/data/ships";
import { useSEO } from "@/hooks/useSEO";
import PageHeader from "@/components/PageHeader";
import ShipCard from "@/components/ShipCard";

const ManufacturerDetail = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();

  const [manufacturer, setManufacturer] = useState<Manufacturer | null>(null);
  const [loading, setLoading]           = useState(true);
  const [notFound, setNotFound]         = useState(false);
  const [ships, setShips]               = useState<Ship[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState]   = useState({ left: false, right: true });
  const shipsRef    = useRef<HTMLDivElement>(null);
  const [shipsScroll, setShipsScroll]   = useState({ left: false, right: true });

  useSEO({
    title: manufacturer?.name,
    description: manufacturer
      ? `${manufacturer.name} — Fabricant Star Citizen. Vaisseaux, armes et composants dans StarHead.`
      : undefined,
    path: slug ? `/manufacturers/${slug}` : undefined,
  });

  useEffect(() => {
    if (!slug) return;
    fetchManufacturer(slug)
      .then(setManufacturer)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!manufacturer) return;
    fetchShips({ manufacturer: manufacturer.name }).then(result => {
      setShips(result);
      setTimeout(() => {
        const el = shipsRef.current;
        if (el) setShipsScroll({ left: false, right: el.scrollWidth > el.clientWidth });
      }, 50);
    });
  }, [manufacturer?.name]);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    setScrollState({ left: false, right: el.scrollWidth > el.clientWidth });
  }, [manufacturer?.timeline]);

  const scrollBy = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') => {
    const el = ref.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.6);
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  const onShipsScroll = () => {
    const el = shipsRef.current;
    if (!el) return;
    setShipsScroll({ left: el.scrollLeft > 10, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 10 });
  };

  const onTimelineScroll = () => {
    const el = timelineRef.current;
    if (!el) return;
    setScrollState({
      left:  el.scrollLeft > 10,
      right: el.scrollLeft < el.scrollWidth - el.clientWidth - 10,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !manufacturer) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Building2 className="h-10 w-10 opacity-20" />
        <p className="text-sm">{t("manufacturers.notFound")}</p>
        <Link href="/manufacturers" className="text-sm text-primary hover:underline">
          ← {t("manufacturers.backToList")}
        </Link>
      </div>
    );
  }

  const logoSrc = manufacturer.logoBase64 ?? null;

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: t("manufacturers.title"), href: "/manufacturers", icon: Building2 },
          { label: manufacturer.name },
        ]}
        title={manufacturer.name}
        label={t("manufacturers.title")}
        labelIcon={Building2}
        subtitle={manufacturer.headquarters ?? undefined}
      />

      <div className="container py-8 space-y-6">

        {/* Card principale + Histoire côte à côte */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Card principale */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-start gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary">
                {logoSrc
                  ? <img src={logoSrc} alt={`Logo ${manufacturer.name}`} className="h-14 w-14 object-contain" />
                  : <Building2 className="h-8 w-8 text-muted-foreground/30" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-xl font-bold text-foreground">{manufacturer.name}</h2>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  {manufacturer.founded && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      {t("manufacturers.founded")} {manufacturer.founded}
                    </div>
                  )}
                  {manufacturer.headquarters && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {manufacturer.headquarters}
                    </div>
                  )}
                </div>
                {(manufacturer.industry ?? []).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(manufacturer.industry ?? []).map((ind, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                        <Tag className="h-3 w-3 shrink-0" />
                        {localize(ind, i18n.language)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {manufacturer.description && (
              <p className="mt-5 border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground">
                {localize(manufacturer.description, i18n.language)}
              </p>
            )}
          </div>

          {/* Histoire */}
          {manufacturer.lore && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-foreground">
                <Building2 className="h-4 w-4 text-primary" />
                {t("manufacturers.history")}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {localize(manufacturer.lore, i18n.language)}
              </p>
            </div>
          )}

        </div>

        {/* Chronologie */}
        {(manufacturer.timeline ?? []).length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-6 flex items-center gap-2 font-display text-base font-semibold text-foreground">
              <History className="h-4 w-4 text-primary" />
              {t("manufacturers.timeline")}
            </h2>
            <div className="relative">
              {/* Fondu gauche */}
              {scrollState.left && (
                <div className="absolute left-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-r from-card to-transparent">
                  <button
                    onClick={() => scrollBy(timelineRef, 'left')}
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border shadow-md text-foreground hover:bg-secondary hover:border-primary/50 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </div>
              )}
              {/* Fondu droit */}
              {scrollState.right && (
                <div className="absolute right-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-l from-card to-transparent">
                  <button
                    onClick={() => scrollBy(timelineRef, 'right')}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border shadow-md text-foreground hover:bg-secondary hover:border-primary/50 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div ref={timelineRef} className="overflow-x-auto pb-2" onScroll={onTimelineScroll}>
              <div className="relative flex gap-6 min-w-max">
              {/* Trait horizontal aligné sur les points */}
              <div className="absolute left-0 right-0 top-[5px] h-px bg-border" />
                {(manufacturer.timeline ?? [])
                  .slice()
                  .sort((a, b) => a.date.replace(/[^0-9]/g, '').localeCompare(b.date.replace(/[^0-9]/g, '')))
                  .map((event, i) => (
                    <div key={i} className="group relative flex flex-col" style={{ minWidth: 160, maxWidth: 200 }}>
                      {/* Point aligné à gauche sur la ligne */}
                      <div className="relative z-10 mb-3 h-[11px] w-[11px] shrink-0 rounded-full border-2 border-primary bg-card transition-colors group-hover:bg-primary" />
                      <span className="font-mono text-[11px] font-bold text-primary">{event.date}</span>
                      <span className="mt-1 text-xs font-semibold text-foreground leading-snug">{localize(event.title, i18n.language)}</span>
                      {event.description && (
                        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground line-clamp-3">{localize(event.description, i18n.language)}</p>
                      )}
                    </div>
                  ))
                }
              </div>
              </div>
            </div>
          </div>
        )}


        {/* Relations & partenariats */}
        {manufacturer.relations && manufacturer.relations.length > 0 && (
          <div>
            <h2 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-foreground">
              <Users className="h-4 w-4 text-primary" />
              {t("manufacturers.relations")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {manufacturer.relations.map(rel => (
                <div key={rel.name} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{rel.name}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{localize(rel.description, i18n.language)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vaisseaux du fabricant */}
        {ships.length > 0 && (
          <div>
            <h2 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-foreground">
              <Rocket className="h-4 w-4 text-primary" />
              {t("manufacturers.sectionShips")}
            </h2>
            <div className="relative">
              {/* Fondu gauche */}
              {shipsScroll.left && (
                <div className="absolute left-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-r from-background to-transparent">
                  <button
                    onClick={() => scrollBy(shipsRef, 'left')}
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border shadow-md text-foreground hover:bg-secondary hover:border-primary/50 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </div>
              )}
              {/* Fondu droit */}
              {shipsScroll.right && (
                <div className="absolute right-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-l from-background to-transparent">
                  <button
                    onClick={() => scrollBy(shipsRef, 'right')}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border shadow-md text-foreground hover:bg-secondary hover:border-primary/50 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div ref={shipsRef} className="overflow-x-auto pb-2" onScroll={onShipsScroll}>
                <div className="flex items-stretch gap-5 min-w-max">
                  {ships.map(ship => (
                    <div key={ship.id} className="w-64 shrink-0 [&>a]:h-full">
                      <ShipCard ship={ship} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default ManufacturerDetail;
