'use client';
import { useState, useMemo, useEffect } from "react";
import { Search, Shield, AlertTriangle, Scale, Lock, SlidersHorizontal, X, Users, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { fetchFactions, type Faction } from "@/data/factions";
import { useSEO } from "@/hooks/useSEO";
import { useVersion } from "@/contexts/VersionContext";

// --- Static config maps ---

const typeConfig: Record<string, { labelKey: string; color: string; icon: typeof Shield }> = {
  Lawful:          { labelKey: "factions.typeLawful",          color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30", icon: Scale },
  LawEnforcement:  { labelKey: "factions.typeLawEnforcement",  color: "from-blue-500/20 to-blue-600/5 border-blue-500/30",          icon: Shield },
  PrivateSecurity: { labelKey: "factions.typePrivateSecurity", color: "from-violet-500/20 to-violet-600/5 border-violet-500/30",     icon: Lock },
  Unlawful:        { labelKey: "factions.typeUnlawful",        color: "from-red-500/20 to-red-600/5 border-red-500/30",             icon: AlertTriangle },
};

const typeIconColor: Record<string, string> = {
  Lawful:          "text-emerald-400",
  LawEnforcement:  "text-blue-400",
  PrivateSecurity: "text-violet-400",
  Unlawful:        "text-red-400",
};

const typeBadgeColor: Record<string, string> = {
  Lawful:          "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  LawEnforcement:  "bg-blue-500/10 text-blue-400 border-blue-500/30",
  PrivateSecurity: "bg-violet-500/10 text-violet-400 border-violet-500/30",
  Unlawful:        "bg-red-500/10 text-red-400 border-red-500/30",
};

const reactionConfig: Record<string, { labelKey: string; dot: string }> = {
  Friendly: { labelKey: "factions.reactionFriendly", dot: "bg-emerald-400" },
  Neutral:  { labelKey: "factions.reactionNeutral",  dot: "bg-amber-400"   },
  Hostile:  { labelKey: "factions.reactionHostile",  dot: "bg-red-400"     },
};

// --- Card ---

const FactionCard = ({ f }: { f: Faction }) => {
  const { t } = useTranslation();
  const cfg      = typeConfig[f.factionType]       ?? typeConfig.Unlawful;
  const reaction = reactionConfig[f.defaultReaction] ?? reactionConfig.Neutral;
  const Icon     = cfg.icon;
  const iconCol  = typeIconColor[f.factionType]    ?? "text-primary";
  const badge    = typeBadgeColor[f.factionType]   ?? "bg-muted text-muted-foreground border-border";
  const displayName = f.name ?? f.ref;

  return (
    <div className="group flex overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/50">

      {/* Panneau logo — même structure que Manufacturers */}
      <div className="relative flex w-24 shrink-0 items-center justify-center border-r border-border overflow-hidden">
        <img
          src="/background-1.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-black/60" />
        {/* Barre de couleur en haut selon le type */}
        <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${cfg.color}`} />

        <div className="relative z-10 flex items-center justify-center p-2">
          {f.logo ? (
            <img
              src={f.logo}
              alt={displayName}
              className="max-h-16 w-16 object-contain"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
                img.nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          <Users className={`h-10 w-10 ${iconCol} opacity-60 ${f.logo ? "hidden" : ""}`} />
        </div>
      </div>

      {/* Contenu */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="font-display text-base font-semibold text-foreground transition-colors group-hover:text-primary line-clamp-1">
            {displayName}
          </h3>
          <div className="mt-1 flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${reaction.dot}`} />
            <span className="text-xs text-muted-foreground">{t(reaction.labelKey)}</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-semibold ${badge}`}>
            <Icon className="h-3 w-3" />
            {t(cfg.labelKey)}
          </span>
          {f.noLegalRights && (
            <span className="inline-flex rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400">
              {t("factions.noLegalRights")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Page ---

const Factions = () => {
  const { t } = useTranslation();
  useSEO({ title: "Factions", description: "Factions de l'univers Star Citizen : leurs réputations, objectifs et interactions.", path: "/factions" });
  const locale = i18n.language.startsWith("fr") ? "fr" : "en";
  const { selectedVersion } = useVersion();

  const [allFactions, setAllFactions]         = useState<Faction[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [search, setSearch]                   = useState("");
  const [selectedType, setSelectedType]       = useState("");
  const [selectedReaction, setSelectedReaction] = useState("");
  const [showFilters, setShowFilters]         = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchFactions({ locale, versionId: selectedVersion?.id })
      .then(setAllFactions)
      .finally(() => setLoading(false));
  }, [locale, selectedVersion?.id]);

  const types     = useMemo(() => [...new Set(allFactions.map((f) => f.factionType))].sort(), [allFactions]);
  const reactions = useMemo(() => [...new Set(allFactions.map((f) => f.defaultReaction))], [allFactions]);

  const activeFilterCount = [selectedType, selectedReaction].filter(Boolean).length;

  const filtered = useMemo(() => {
    return allFactions.filter((f) => {
      const name = f.name ?? f.ref;
      const matchSearch  = name.toLowerCase().includes(search.toLowerCase());
      const matchType    = !selectedType     || f.factionType     === selectedType;
      const matchReaction = !selectedReaction || f.defaultReaction === selectedReaction;
      return matchSearch && matchType && matchReaction;
    });
  }, [allFactions, search, selectedType, selectedReaction]);

  const clearFilters = () => {
    setSelectedType("");
    setSelectedReaction("");
    setSearch("");
  };

  const typeStats = useMemo(() => types.map((type) => ({
    type,
    count: allFactions.filter((f) => f.factionType === type).length,
    cfg:   typeConfig[type] ?? typeConfig.Unlawful,
    iconColor: typeIconColor[type] ?? "text-primary",
  })), [types, allFactions]);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Image de fond */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
        <img src="/hero-bg.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" style={{ objectPosition: '50% 30%' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex min-h-[18vh] items-center">
        <div className="container pb-2 pt-8">
          <div className="mb-1 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("factions.universe")}</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">{t("factions.title")}</h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">{t("factions.description")}</p>
        </div>
      </div>

      <div className="relative z-10 container pb-8 pt-0">
        {/* Filtres rapides par type */}
        <div className="mb-6 flex flex-wrap gap-3">
          {typeStats.map(({ type, count, cfg, iconColor }) => {
            const Icon = cfg.icon;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(selectedType === type ? "" : type)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                  selectedType === type
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/50 bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 ${selectedType === type ? "text-primary" : iconColor}`} />
                <span className="font-medium">{t(cfg.labelKey)}</span>
                <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold">{count}</span>
              </button>
            );
          })}
        </div>

      {/* Search + Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("factions.searchPlaceholder")}
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
          {t("common.filters")}
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="mb-6 rounded-lg border border-border bg-card/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("common.advancedFilters")}
            </p>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-primary hover:underline">
                <X className="h-3 w-3" /> {t("common.reset")}
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("common.type")}</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">{t("common.all")}</option>
                {types.map((tp) => (
                  <option key={tp} value={tp}>{t(typeConfig[tp]?.labelKey ?? tp)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("factions.reaction")}</label>
              <select
                value={selectedReaction}
                onChange={(e) => setSelectedReaction(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">{t("common.all")}</option>
                {reactions.map((r) => (
                  <option key={r} value={r}>{t(reactionConfig[r]?.labelKey ?? r)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t("factions.found", { count: filtered.length })}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((f) => (
              <FactionCard key={f.id} f={f} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-20 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="text-lg font-medium text-muted-foreground">{t("factions.noFactionFound")}</p>
              <p className="mt-1 text-sm text-muted-foreground/70">{t("common.modifyFilters")}</p>
              <button onClick={clearFilters} className="mt-4 text-sm text-primary hover:underline">
                {t("common.resetFilters")}
              </button>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default Factions;
