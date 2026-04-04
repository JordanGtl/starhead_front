'use client';
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search, SlidersHorizontal, X, Crosshair, Package, Truck,
  FileSearch, Zap, Shield, Star, ChevronRight, Loader2,
  AlertCircle, Pickaxe, Siren, Wrench, MapPin, Radio,
  Anchor, Flag, HelpCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useVersion } from "@/contexts/VersionContext";
import { apiFetch } from "@/lib/api";
import { useSEO } from "@/hooks/useSEO";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ApiMission {
  id:           number;
  title:        string;
  type:         string | null;
  source:       string | null;
  lawful:       boolean;
  difficulty:   number | null;
  reward:       { amount: number; max: number | null; currency: string | null } | null;
  variantCount: number;
  givers:       string | null;
}

// ---------------------------------------------------------------------------
// Config visuel par type
// ---------------------------------------------------------------------------

type TypeCfg = {
  icon:      React.ElementType;
  color:     string;
  iconColor: string;
  badge:     string;
};

const TYPE_CFG: Record<string, TypeCfg> = {
  "Bounty Hunter":          { icon: Crosshair,  color: "from-red-500/20 to-red-600/5 border-red-500/30",         iconColor: "text-red-400",    badge: "bg-red-500/10 text-red-400 border-red-500/30"         },
  "Mercenary":              { icon: Shield,      color: "from-orange-500/20 to-orange-600/5 border-orange-500/30", iconColor: "text-orange-400", badge: "bg-orange-500/10 text-orange-400 border-orange-500/30" },
  "Delivery":               { icon: Package,     color: "from-blue-500/20 to-blue-600/5 border-blue-500/30",       iconColor: "text-blue-400",   badge: "bg-blue-500/10 text-blue-400 border-blue-500/30"       },
  "Hauling":                { icon: Truck,       color: "from-amber-500/20 to-amber-600/5 border-amber-500/30",    iconColor: "text-amber-400",  badge: "bg-amber-500/10 text-amber-400 border-amber-500/30"    },
  "Hauling - Local":        { icon: Truck,       color: "from-amber-500/20 to-amber-600/5 border-amber-500/30",    iconColor: "text-amber-400",  badge: "bg-amber-500/10 text-amber-400 border-amber-500/30"    },
  "Hauling - Planetary":    { icon: Truck,       color: "from-amber-500/20 to-amber-600/5 border-amber-500/30",    iconColor: "text-amber-400",  badge: "bg-amber-500/10 text-amber-400 border-amber-500/30"    },
  "Hauling - Stellar":      { icon: Truck,       color: "from-amber-500/20 to-amber-600/5 border-amber-500/30",    iconColor: "text-amber-400",  badge: "bg-amber-500/10 text-amber-400 border-amber-500/30"    },
  "Hauling - Interstellar": { icon: Truck,       color: "from-amber-500/20 to-amber-600/5 border-amber-500/30",    iconColor: "text-amber-400",  badge: "bg-amber-500/10 text-amber-400 border-amber-500/30"    },
  "Investigation":          { icon: FileSearch,  color: "from-violet-500/20 to-violet-600/5 border-violet-500/30", iconColor: "text-violet-400", badge: "bg-violet-500/10 text-violet-400 border-violet-500/30" },
  "Research":               { icon: FileSearch,  color: "from-violet-500/20 to-violet-600/5 border-violet-500/30", iconColor: "text-violet-400", badge: "bg-violet-500/10 text-violet-400 border-violet-500/30" },
  "Mining":                 { icon: Pickaxe,     color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30", iconColor: "text-emerald-400", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  "Salvage":                { icon: Wrench,      color: "from-stone-500/20 to-stone-600/5 border-stone-500/30",    iconColor: "text-stone-400",  badge: "bg-stone-500/10 text-stone-400 border-stone-500/30"    },
  "Racing":                 { icon: Flag,        color: "from-pink-500/20 to-pink-600/5 border-pink-500/30",       iconColor: "text-pink-400",   badge: "bg-pink-500/10 text-pink-400 border-pink-500/30"       },
  "Search":                 { icon: MapPin,      color: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/30",       iconColor: "text-cyan-400",   badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"       },
  "ECN Alert":              { icon: Siren,       color: "from-red-500/20 to-red-600/5 border-red-500/30",         iconColor: "text-red-400",    badge: "bg-red-500/10 text-red-400 border-red-500/30"         },
  "Maintenance":            { icon: Wrench,      color: "from-stone-500/20 to-stone-600/5 border-stone-500/30",    iconColor: "text-stone-400",  badge: "bg-stone-500/10 text-stone-400 border-stone-500/30"    },
  "Job":                    { icon: Anchor,      color: "from-sky-500/20 to-sky-600/5 border-sky-500/30",          iconColor: "text-sky-400",    badge: "bg-sky-500/10 text-sky-400 border-sky-500/30"          },
  "Appointment":            { icon: Radio,       color: "from-indigo-500/20 to-indigo-600/5 border-indigo-500/30", iconColor: "text-indigo-400", badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30" },
  "Priority":               { icon: Zap,         color: "from-yellow-500/20 to-yellow-600/5 border-yellow-500/30", iconColor: "text-yellow-400", badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" },
  "Service Beacons":        { icon: HelpCircle,  color: "from-teal-500/20 to-teal-600/5 border-teal-500/30",      iconColor: "text-teal-400",   badge: "bg-teal-500/10 text-teal-400 border-teal-500/30"       },
};

const DEFAULT_CFG: TypeCfg = {
  icon: HelpCircle,
  color: "from-muted/20 to-muted/5 border-border",
  iconColor: "text-muted-foreground",
  badge: "bg-secondary text-muted-foreground border-border",
};

const typeCfg = (type: string | null): TypeCfg => (type && TYPE_CFG[type]) ? TYPE_CFG[type] : DEFAULT_CFG;

// difficulty : -1 = variable, 0-5 = niveau
const diffStars = (d: number | null): number => {
  if (d === null || d < 0) return 0;
  return Math.min(d, 4);
};

const diffColor = (d: number | null): string => {
  if (d === null || d < 0) return "text-muted-foreground/30";
  if (d <= 1) return "text-emerald-400";
  if (d <= 2) return "text-amber-400";
  if (d <= 3) return "text-orange-400";
  return "text-red-400";
};

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

const MissionCard = ({ m }: { m: ApiMission }) => {
  const { t }  = useTranslation();
  const router = useRouter();
  const cfg    = typeCfg(m.type);
  const Icon   = cfg.icon;
  const stars  = diffStars(m.difficulty);
  const dc     = diffColor(m.difficulty);

  return (
    <div
      onClick={() => router.push(`/missions/${m.id}`)}
      className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_hsl(var(--primary)/0.1)] cursor-pointer"
    >
      {/* Bandeau type */}
      <div className={`flex items-center justify-between border-b border-border/50 bg-gradient-to-r ${cfg.color} px-4 py-2.5`}>
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${cfg.iconColor}`} />
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
            {m.type ?? "—"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {m.variantCount > 1 && (
            <span className="rounded bg-secondary/60 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
              ×{m.variantCount}
            </span>
          )}
          {/* Étoiles de difficulté */}
          {stars > 0 && (
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Star key={i} className={`h-3 w-3 ${i < stars ? dc : "text-muted-foreground/20"}`} fill={i < stars ? "currentColor" : "none"} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Corps */}
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-display text-sm font-bold text-foreground leading-tight line-clamp-2">{m.title}</h3>
          {!m.lawful && (
            <span className="shrink-0 rounded border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-red-400">
              {t("missions.illegal")}
            </span>
          )}
        </div>

        {m.givers && (
          <p className="mb-3 text-[11px] text-muted-foreground/70 line-clamp-1">{m.givers}</p>
        )}

        <div className="flex items-center justify-between text-[11px]">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground/60">{t("missions.source")}</span>
            <span className="font-medium text-foreground">{m.source ?? "—"}</span>
          </div>
          {m.reward ? (
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-muted-foreground/60">{t("missions.reward")}</span>
              <span className="font-bold text-primary font-mono">
                {m.reward.amount.toLocaleString()}
                {m.reward.max && m.reward.max !== m.reward.amount ? `–${m.reward.max.toLocaleString()}` : ""}
                {" "}{m.reward.currency}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-muted-foreground/60">{t("missions.reward")}</span>
              <span className="text-muted-foreground/40 italic text-[10px]">{t("missions.variableReward")}</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
          <span className={`text-[10px] font-medium ${m.lawful ? "text-emerald-400" : "text-red-400"}`}>
            {m.lawful ? t("missions.lawful") : t("missions.unlawful")}
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const Missions = () => {
  const { t }                                   = useTranslation();
  const { selectedVersion }                     = useVersion();
  const [missions, setMissions]                 = useState<ApiMission[]>([]);
  const visibleMissions = useMemo(() => missions.filter(m => m.title), [missions]);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState(false);
  const [search, setSearch]                     = useState("");
  const [selectedType, setSelectedType]         = useState("");
  const [selectedSource, setSelectedSource]     = useState("");
  const [selectedLawful, setSelectedLawful]     = useState("");
  const [showFilters, setShowFilters]           = useState(false);

  useSEO({ title: "Missions", description: "Liste des missions disponibles dans Star Citizen.", path: "/missions" });

  useEffect(() => {
    setLoading(true);
    setError(false);
    const qs = new URLSearchParams({ locale: "fr" });
    if (selectedVersion) qs.set("gameVersion", String(selectedVersion.id));
    if (selectedType)   qs.set("type",    selectedType);
    if (selectedSource) qs.set("source",  selectedSource);
    if (selectedLawful !== "") qs.set("lawful", selectedLawful);
    if (search)         qs.set("q",       search);
    apiFetch<ApiMission[]>(`/api/missions?${qs}`)
      .then(setMissions)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [selectedVersion, selectedType, selectedSource, selectedLawful, search]);

  // Types uniques présents dans les résultats courants (avant filtre type)
  const allTypes = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of visibleMissions) {
      if (m.type) map.set(m.type, (map.get(m.type) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [visibleMissions]);

  const sources = useMemo(() => [...new Set(visibleMissions.map(m => m.source).filter(Boolean))] as string[], [visibleMissions]);

  const activeFilterCount = [selectedType, selectedSource, selectedLawful].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedType("");
    setSelectedSource("");
    setSelectedLawful("");
    setSearch("");
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Fond */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
        <img src="/hero-bg.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" style={{ objectPosition: "50% 30%" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex min-h-[18vh] items-center">
        <div className="container pb-2 pt-8">
          <div className="mb-1 flex items-center gap-2">
            <Crosshair className="h-5 w-5 text-primary" />
            <span suppressHydrationWarning className="text-xs font-semibold uppercase tracking-widest text-primary">{t("missions.label")}</span>
          </div>
          <h1 suppressHydrationWarning className="font-display text-4xl font-bold text-foreground">{t("missions.title")}</h1>
          <p suppressHydrationWarning className="mt-2 max-w-lg text-sm text-muted-foreground">{t("missions.description")}</p>
        </div>
      </div>

      <div className="relative z-10 container pb-8 pt-0">

        {/* Chips types rapides */}
        {!loading && allTypes.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {allTypes.map(([type, count]) => {
              const cfg  = typeCfg(type);
              const Icon = cfg.icon;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(selectedType === type ? "" : type)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-all ${
                    selectedType === type
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border/50 bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${selectedType === type ? "text-primary" : cfg.iconColor}`} />
                  <span className="font-medium">{type}</span>
                  <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold">{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Barre de recherche + filtres */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("missions.searchPlaceholder")}
              suppressHydrationWarning
              className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors ${
              showFilters || activeFilterCount > 0
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span suppressHydrationWarning>{t("common.filters")}</span>
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mb-6 rounded-lg border border-border bg-card/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("common.advancedFilters")}</p>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-primary hover:underline">
                  <X className="h-3 w-3" /> {t("common.reset")}
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("common.type")}</label>
                <select value={selectedType} onChange={e => setSelectedType(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option value="">{t("common.all")}</option>
                  {allTypes.map(([type]) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("missions.source")}</label>
                <select value={selectedSource} onChange={e => setSelectedSource(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option value="">{t("common.all")}</option>
                  {sources.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("missions.legality")}</label>
                <select value={selectedLawful} onChange={e => setSelectedLawful(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option value="">{t("common.all")}</option>
                  <option value="1">{t("missions.lawful")}</option>
                  <option value="0">{t("missions.unlawful")}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Compteur */}
        {!loading && !error && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {t("missions.found", { count: visibleMissions.length })}
            </p>
          </div>
        )}

        {/* États */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center py-20 text-center text-muted-foreground">
            <AlertCircle className="mb-3 h-10 w-10 opacity-30" />
            <p className="text-sm">{t("common.loadError")}</p>
          </div>
        )}

        {/* Grille */}
        {!loading && !error && visibleMissions.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleMissions.map(m => <MissionCard key={m.id} m={m} />)}
          </div>
        )}

        {!loading && !error && visibleMissions.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <Crosshair className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-lg font-medium text-muted-foreground">{t("missions.noMissionFound")}</p>
            <p className="mt-1 text-sm text-muted-foreground/70">{t("common.modifyFilters")}</p>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="mt-4 text-sm text-primary hover:underline">
                {t("common.resetFilters")}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Missions;
