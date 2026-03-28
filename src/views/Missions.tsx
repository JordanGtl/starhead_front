'use client';
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, Crosshair, Package, Truck, FileSearch, Zap, Shield, Star, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSEO } from "@/hooks/useSEO";

// --- Types ---

interface Mission {
  id: number;
  title: string;
  type: "Bounty" | "Delivery" | "Cargo" | "Investigation" | "Combat" | "Mining";
  difficulty: "Easy" | "Medium" | "Hard" | "Very Hard";
  location: string;
  reward: number;
  description: string;
  employer: string;
  legal: boolean;
}

// --- Static data ---

const missions: Mission[] = [
  { id: 1,  title: "Éliminer Raxon Pike",            type: "Bounty",        difficulty: "Medium",    location: "Hurston",         reward: 25000,  description: "Un criminel dangereux repéré dans les environs de Lorville. Mort ou vif.",                        employer: "Bounty Hunters Guild", legal: true  },
  { id: 2,  title: "Livraison urgente — ArcCorp",    type: "Delivery",      difficulty: "Easy",      location: "ArcCorp",         reward: 8500,   description: "Transporter un colis sécurisé depuis Area18 jusqu'au poste Shubin Mining.",                      employer: "Covalex Shipping",     legal: true  },
  { id: 3,  title: "Convoy cargo — Microtech",       type: "Cargo",         difficulty: "Medium",    location: "microTech",       reward: 42000,  description: "Escorter un convoi de ravitaillement jusqu'aux avant-postes de New Babbage.",                     employer: "MISC",                 legal: true  },
  { id: 4,  title: "Enquête : Epave mystérieuse",    type: "Investigation", difficulty: "Hard",      location: "Pyro",            reward: 75000,  description: "Une épave non identifiée a été détectée dans la ceinture d'astéroïdes de Pyro. Récupérez les données.",  employer: "Advocacy",             legal: true  },
  { id: 5,  title: "Défense de poste avancé",        type: "Combat",        difficulty: "Hard",      location: "Crusader",        reward: 60000,  description: "Des pirates Nine Tails ont encerclé le poste. Neutralisez-les avant qu'ils prennent le contrôle.", employer: "Crusader Industries",  legal: true  },
  { id: 6,  title: "Extraction — Agricium",          type: "Mining",        difficulty: "Easy",      location: "Yela",            reward: 15000,  description: "Localiser et extraire des dépôts d'Agricium dans la ceinture de Yela.",                           employer: "MISC",                 legal: true  },
  { id: 7,  title: "Colis discret — Grim HEX",       type: "Delivery",      difficulty: "Medium",    location: "Yela",            reward: 30000,  description: "Livraison confidentielle. Pas de questions posées.",                                              employer: "Inconnu",              legal: false },
  { id: 8,  title: "Chasse — Gix le Sanglant",       type: "Bounty",        difficulty: "Very Hard", location: "Hurston",         reward: 120000, description: "Criminel de guerre recherché par l'UEE. Extrêmement dangereux, approche en groupe recommandée.",    employer: "Bounty Hunters Guild", legal: true  },
  { id: 9,  title: "Sabotage — Armurerie Hurston",   type: "Combat",        difficulty: "Very Hard", location: "Hurston",         reward: 95000,  description: "Mission non officielle. Détruire les stocks d'armes de la sécurité Hurston.",                      employer: "Inconnu",              legal: false },
  { id: 10, title: "Livraison médicale — Orison",    type: "Delivery",      difficulty: "Easy",      location: "Crusader",        reward: 6000,   description: "Acheminer des fournitures médicales sur les plateformes d'Orison.",                               employer: "Covalex Shipping",     legal: true  },
  { id: 11, title: "Collecte de données — Microtech",type: "Investigation", difficulty: "Medium",    location: "microTech",       reward: 40000,  description: "Infiltrer une installation et récupérer des données propriétaires.",                              employer: "Advocacy",             legal: true  },
  { id: 12, title: "Escorte VIP — ArcCorp",          type: "Combat",        difficulty: "Medium",    location: "ArcCorp",         reward: 50000,  description: "Protéger un dignitaire depuis Area18 jusqu'au rendez-vous orbital.",                              employer: "Crusader Industries",  legal: true  },
];

// --- Config ---

const typeConfig: Record<string, { labelKey: string; icon: typeof Crosshair; color: string; iconColor: string; badge: string }> = {
  Bounty:        { labelKey: "missions.typeBounty",        icon: Crosshair,  color: "from-red-500/20 to-red-600/5 border-red-500/30",         iconColor: "text-red-400",    badge: "bg-red-500/10 text-red-400 border-red-500/30"         },
  Delivery:      { labelKey: "missions.typeDelivery",      icon: Package,    color: "from-blue-500/20 to-blue-600/5 border-blue-500/30",       iconColor: "text-blue-400",   badge: "bg-blue-500/10 text-blue-400 border-blue-500/30"       },
  Cargo:         { labelKey: "missions.typeCargo",         icon: Truck,      color: "from-amber-500/20 to-amber-600/5 border-amber-500/30",    iconColor: "text-amber-400",  badge: "bg-amber-500/10 text-amber-400 border-amber-500/30"    },
  Investigation: { labelKey: "missions.typeInvestigation", icon: FileSearch, color: "from-violet-500/20 to-violet-600/5 border-violet-500/30", iconColor: "text-violet-400", badge: "bg-violet-500/10 text-violet-400 border-violet-500/30" },
  Combat:        { labelKey: "missions.typeCombat",        icon: Shield,     color: "from-orange-500/20 to-orange-600/5 border-orange-500/30", iconColor: "text-orange-400", badge: "bg-orange-500/10 text-orange-400 border-orange-500/30" },
  Mining:        { labelKey: "missions.typeMining",        icon: Zap,        color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30", iconColor: "text-emerald-400", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
};

const difficultyConfig: Record<string, { labelKey: string; color: string; stars: number }> = {
  Easy:      { labelKey: "missions.diffEasy",     color: "text-emerald-400", stars: 1 },
  Medium:    { labelKey: "missions.diffMedium",   color: "text-amber-400",   stars: 2 },
  Hard:      { labelKey: "missions.diffHard",     color: "text-orange-400",  stars: 3 },
  "Very Hard": { labelKey: "missions.diffVeryHard", color: "text-red-400",   stars: 4 },
};

// --- Card ---

const MissionCard = ({ m }: { m: Mission }) => {
  const { t } = useTranslation();
  const cfg   = typeConfig[m.type]       ?? typeConfig.Combat;
  const diff  = difficultyConfig[m.difficulty] ?? difficultyConfig.Medium;
  const Icon  = cfg.icon;

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_hsl(var(--primary)/0.1)] cursor-pointer">
      <div className={`h-1 bg-gradient-to-r ${cfg.color}`} />

      <div className={`flex items-center justify-between border-b border-border/50 bg-gradient-to-r ${cfg.color} px-4 py-2.5`}>
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${cfg.iconColor}`} />
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground/80">{t(cfg.labelKey)}</span>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < diff.stars ? diff.color : "text-muted-foreground/20"}`} fill={i < diff.stars ? "currentColor" : "none"} />
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-bold text-foreground leading-tight">{m.title}</h3>
          {!m.legal && (
            <span className="shrink-0 rounded border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-red-400">
              {t("missions.illegal")}
            </span>
          )}
        </div>

        <p className="mb-4 text-sm leading-relaxed text-muted-foreground/80 line-clamp-2">{m.description}</p>

        <div className="flex items-center justify-between text-[11px]">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground/60">{t("missions.location")}</span>
            <span className="font-medium text-foreground">{m.location}</span>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-muted-foreground/60">{t("missions.reward")}</span>
            <span className="font-bold text-primary">{m.reward.toLocaleString()} aUEC</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
          <span className="text-[10px] text-muted-foreground/60">{m.employer}</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </div>
    </div>
  );
};

// --- Page ---

const Missions = () => {
  const { t } = useTranslation();
  useSEO({ title: "Missions", description: "Missions disponibles dans Star Citizen : types, récompenses et factions.", path: "/missions" });
  const [search, setSearch]               = useState("");
  const [selectedType, setSelectedType]   = useState("");
  const [selectedDiff, setSelectedDiff]   = useState("");
  const [showFilters, setShowFilters]     = useState(false);

  const types       = [...new Set(missions.map((m) => m.type))];
  const difficulties = ["Easy", "Medium", "Hard", "Very Hard"];

  const activeFilterCount = [selectedType, selectedDiff].filter(Boolean).length;

  const filtered = useMemo(() => {
    return missions.filter((m) => {
      const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.employer.toLowerCase().includes(search.toLowerCase());
      const matchType   = !selectedType || m.type === selectedType;
      const matchDiff   = !selectedDiff || m.difficulty === selectedDiff;
      return matchSearch && matchType && matchDiff;
    });
  }, [search, selectedType, selectedDiff]);

  const clearFilters = () => { setSelectedType(""); setSelectedDiff(""); setSearch(""); };

  const typeStats = types.map((type) => ({
    type,
    count: missions.filter((m) => m.type === type).length,
    cfg: typeConfig[type] ?? typeConfig.Combat,
  }));

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
            <Crosshair className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("missions.label")}</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">{t("missions.title")}</h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">{t("missions.description")}</p>
        </div>
      </div>

      <div className="relative z-10 container pb-8 pt-0">
        {/* Filtres rapides par type */}
        <div className="mb-6 flex flex-wrap gap-3">
          {typeStats.map(({ type, count, cfg }) => {
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
                <Icon className={`h-4 w-4 ${selectedType === type ? "text-primary" : cfg.iconColor}`} />
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
              placeholder={t("missions.searchPlaceholder")}
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
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("common.advancedFilters")}</p>
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
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("missions.difficulty")}</label>
                <select
                  value={selectedDiff}
                  onChange={(e) => setSelectedDiff(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="">{t("common.all")}</option>
                  {difficulties.map((d) => (
                    <option key={d} value={d}>{t(difficultyConfig[d]?.labelKey ?? d)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
            {t("missions.found", { count: filtered.length })}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <MissionCard key={m.id} m={m} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <Crosshair className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-lg font-medium text-muted-foreground">{t("missions.noMissionFound")}</p>
            <p className="mt-1 text-sm text-muted-foreground/70">{t("common.modifyFilters")}</p>
            <button onClick={clearFilters} className="mt-4 text-sm text-primary hover:underline">
              {t("common.resetFilters")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Missions;
