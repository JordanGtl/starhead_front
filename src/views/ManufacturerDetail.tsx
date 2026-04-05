'use client';
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Building2, MapPin, Calendar, Tag, Loader2, ChevronRight, History, ChevronLeft, Shield, Users, Rocket, BookOpen, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchManufacturer, localize, type Manufacturer } from "@/data/manufacturers";
import { fetchShips, type Ship } from "@/data/ships";
import { useSEO } from "@/hooks/useSEO";
import PageHeader from "@/components/PageHeader";
import ShipCard from "@/components/ShipCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

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
  const loreRef     = useRef<HTMLParagraphElement>(null);
  const [loreOverflows, setLoreOverflows] = useState(false);
  const [loreExpanded, setLoreExpanded]         = useState(false);
  const [sourcesModalOpen, setSourcesModalOpen] = useState(false);

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

  useEffect(() => {
    if (!loreRef.current) return;
    setLoreOverflows(loreRef.current.scrollHeight > 112);
  }, [manufacturer?.lore, i18n.language]);

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

      <div className="container pt-0 pb-0 space-y-6">

        {/* Bouton sources au-dessus du bloc */}
        {manufacturer.sources && manufacturer.sources.length > 0 && (
          <>
            <div className="flex justify-end -mb-3">
              <button
                onClick={() => setSourcesModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" />
                {t("manufacturers.sources")} ({manufacturer.sources.length})
              </button>
            </div>
            <Dialog open={sourcesModalOpen} onOpenChange={setSourcesModalOpen}>
              <DialogContent className="max-w-lg flex flex-col max-h-[75vh]">
                <DialogHeader className="shrink-0">
                  <DialogTitle className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    {t("manufacturers.sources")} — {manufacturer.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto flex-1 divide-y divide-border/50 pr-1">
                  {manufacturer.sources.map(src => (
                    <a
                      key={src.id}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span>{src.title}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-50" />
                    </a>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}

        {/* Card principale + Histoire côte à côte */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Card principale */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
            {/* Logo en filigrane */}
            {logoSrc && (
              <img
                src={logoSrc}
                alt=""
                aria-hidden
                className="absolute right-0 top-1/2 -translate-y-1/2 h-[200%] w-[40%] object-contain object-right pointer-events-none select-none"
                style={{ opacity: 0.02 }}
              />
            )}
            <div className="relative flex items-start gap-5">
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
              <p className="relative mt-5 border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground">
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

                <div className="relative overflow-hidden" style={{ maxHeight: 112 }}>
                  <p ref={loreRef} className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {localize(manufacturer.lore, i18n.language)}
                  </p>
                  {loreOverflows && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                  )}
                </div>

                <button
                  onClick={() => setLoreExpanded(v => !v)}
                  className="mt-3 text-xs font-medium text-primary hover:underline transition-colors"
                >
                  {loreExpanded ? `${t("manufacturers.readLess")} ↑` : `${t("manufacturers.readMore")} ↓`}
                </button>
            </div>
          )}

        </div>

        {/* Lore détaillé — sections expandables */}
        {loreExpanded && manufacturer.loreSections && manufacturer.loreSections.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-8">
            {manufacturer.loreSections.map((section, i) => (
              <div key={i}>
                <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                  <span className="inline-block h-0.5 w-4 rounded bg-primary shrink-0" />
                  {localize(section.title, i18n.language)}
                </h3>
                <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {localize(section.content, i18n.language)
                    .split('\n')
                    .filter(line => line.trim() !== '')
                    .map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chronologie */}
        {(manufacturer.timeline ?? []).length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-6 flex items-center gap-2 font-display text-base font-semibold text-foreground">
              <History className="h-4 w-4 text-primary" />
              {t("manufacturers.timeline")}
            </h2>
            <div className="relative">
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
              <div ref={timelineRef} className="overflow-x-auto pb-2" onScroll={onTimelineScroll} style={{ scrollbarWidth: 'none' }}>
              <div className="relative flex gap-6 min-w-max">
              <div className="absolute left-0 right-0 top-[5px] h-px bg-border" />
                {(manufacturer.timeline ?? [])
                  .slice()
                  .sort((a, b) => a.date.replace(/[^0-9]/g, '').localeCompare(b.date.replace(/[^0-9]/g, '')))
                  .map((event, i) => (
                    <Tooltip key={i} delayDuration={200}>
                      <TooltipTrigger asChild>
                        <div className="group relative flex flex-col cursor-default" style={{ minWidth: 160, maxWidth: 200 }}>
                          <div className="relative z-10 mb-3 h-[11px] w-[11px] shrink-0 rounded-full border-2 border-primary bg-card transition-colors group-hover:bg-primary" />
                          <span className="font-mono text-[11px] font-bold text-primary">{event.date}</span>
                          <span className="mt-1 text-xs font-semibold text-foreground leading-snug">{localize(event.title, i18n.language)}</span>
                          {event.description && (
                            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground line-clamp-3">{localize(event.description, i18n.language)}</p>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs space-y-1 whitespace-normal">
                        <p className="font-mono text-[11px] font-bold text-primary">{event.date}</p>
                        <p className="font-semibold">{localize(event.title, i18n.language)}</p>
                        {event.description && (
                          <p className="text-xs leading-relaxed opacity-80">{localize(event.description, i18n.language)}</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
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
              <div ref={shipsRef} className="overflow-x-auto pb-2" onScroll={onShipsScroll} style={{ scrollbarWidth: 'none' }}>
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
