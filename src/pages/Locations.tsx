import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search, MapPin, Globe, Moon, Landmark, Radio, Orbit,
  SlidersHorizontal, X, Compass, Coffee, Loader2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Sun } from "lucide-react";
import { fetchLocations, type Location } from "@/data/locations";
import { useVersion } from "@/contexts/VersionContext";
import PageHeader from "@/components/PageHeader";

// ---------------------------------------------------------------------------
// Style par type
// ---------------------------------------------------------------------------
const TYPE_STYLE: Record<string, {
  bg: string; border: string; iconColor: string; nameColor: string; gradientFrom: string; Icon: React.ElementType;
}> = {
  Planet:           { bg: "from-blue-500/15 to-blue-600/5",     border: "border-blue-500/50",    iconColor: "text-blue-400",    nameColor: "text-blue-300",    gradientFrom: "from-blue-500",    Icon: Globe },
  Moon:             { bg: "from-slate-400/15 to-slate-500/5",   border: "border-slate-400/50",   iconColor: "text-slate-300",   nameColor: "text-slate-200",   gradientFrom: "from-slate-400",   Icon: Moon },
  Station:          { bg: "from-amber-500/15 to-amber-600/5",   border: "border-amber-500/50",   iconColor: "text-amber-400",   nameColor: "text-amber-300",   gradientFrom: "from-amber-500",   Icon: Radio },
  City:             { bg: "from-emerald-500/15 to-emerald-600/5",border:"border-emerald-500/50", iconColor: "text-emerald-400", nameColor: "text-emerald-300", gradientFrom: "from-emerald-500", Icon: Landmark },
  Outpost:          { bg: "from-orange-500/15 to-orange-600/5", border: "border-orange-500/50",  iconColor: "text-orange-400",  nameColor: "text-orange-300",  gradientFrom: "from-orange-500",  Icon: MapPin },
  POI:              { bg: "from-pink-500/15 to-pink-600/5",     border: "border-pink-500/50",    iconColor: "text-pink-400",    nameColor: "text-pink-300",    gradientFrom: "from-pink-500",    Icon: Compass },
  "Asteroid Belt":  { bg: "from-purple-500/15 to-purple-600/5", border: "border-purple-500/50",  iconColor: "text-purple-400",  nameColor: "text-purple-300",  gradientFrom: "from-purple-500",  Icon: Orbit },
  "Lagrange Point": { bg: "from-cyan-500/15 to-cyan-600/5",     border: "border-cyan-500/50",    iconColor: "text-cyan-400",    nameColor: "text-cyan-300",    gradientFrom: "from-cyan-500",    Icon: Orbit },
  "Rest Stop":      { bg: "from-teal-500/15 to-teal-600/5",     border: "border-teal-500/50",    iconColor: "text-teal-400",    nameColor: "text-teal-300",    gradientFrom: "from-teal-500",    Icon: Coffee },
  Star:             { bg: "from-yellow-500/15 to-yellow-600/5", border: "border-yellow-500/50",  iconColor: "text-yellow-400",  nameColor: "text-yellow-300",  gradientFrom: "from-yellow-500",  Icon: Sun },
};
const DEFAULT_STYLE = { bg: "from-primary/15 to-primary/5", border: "border-primary/50", iconColor: "text-primary", nameColor: "text-primary", gradientFrom: "from-primary", Icon: MapPin };

const typeStyle = (type: string | null | undefined) =>
  type && TYPE_STYLE[type] ? TYPE_STYLE[type] : DEFAULT_STYLE;

// ---------------------------------------------------------------------------
// LocationCard
// ---------------------------------------------------------------------------
const LocationCard = ({ loc }: { loc: Location }) => {
  const s = typeStyle(loc.type);
  const { Icon } = s;
  const name = loc.name ?? loc.internal ?? "—";

  return (
    <Link
      to={`/locations/${loc.id}`}
      className="group rounded-lg border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_hsl(var(--primary)/0.1)] block"
    >
      {/* En-tête */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${s.iconColor}`} />
            <h3 className={`font-bold text-sm leading-tight line-clamp-2 ${s.nameColor}`}>{name}</h3>
          </div>
          {loc.system && (
            <span className="shrink-0 rounded border border-border/50 bg-background/40 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
              {loc.system}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
          {loc.type}
          {loc.parent && <span className="opacity-60"> · {loc.parent}</span>}
        </p>
      </div>

      {/* Corps — tableau */}
      <div className="px-4 py-3">
        <table className="w-full text-xs">
          <tbody>
            {loc.atmosphere && (
              <tr className="border-b border-border/30 last:border-0">
                <td className="py-1 text-muted-foreground">Atmosphère</td>
                <td className="py-1 text-right font-mono font-semibold text-foreground">{loc.atmosphere}</td>
              </tr>
            )}
            {loc.gravity && (
              <tr className="border-b border-border/30 last:border-0">
                <td className="py-1 text-muted-foreground">Gravité</td>
                <td className="py-1 text-right font-mono font-semibold text-foreground">{loc.gravity}</td>
              </tr>
            )}
            {loc.size != null && (
              <tr className="border-b border-border/30 last:border-0">
                <td className="py-1 text-muted-foreground">Taille</td>
                <td className="py-1 text-right font-mono font-semibold text-foreground">{loc.size}</td>
              </tr>
            )}
            {!loc.atmosphere && !loc.gravity && !loc.size && loc.description && (
              <tr>
                <td colSpan={2} className="py-1 text-muted-foreground/80 line-clamp-2">{loc.description}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Link>
  );
};

// ---------------------------------------------------------------------------
// Locations page
// ---------------------------------------------------------------------------
const Locations = () => {
  const { t } = useTranslation();
  const { selectedVersion } = useVersion();

  const [allLocations, setAllLocations]   = useState<Location[]>([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [selectedType, setSelectedType]   = useState("");
  const [selectedSystem, setSelectedSystem] = useState("");
  const [showFilters, setShowFilters]     = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchLocations({ gameVersion: selectedVersion?.id })
      .then(setAllLocations)
      .finally(() => setLoading(false));
  }, [selectedVersion?.id]);

  const types   = useMemo(() => [...new Set(allLocations.map((l) => l.type).filter(Boolean) as string[])].sort(), [allLocations]);
  const systems = useMemo(() => [...new Set(allLocations.map((l) => l.system).filter(Boolean) as string[])].sort(), [allLocations]);

  const activeFilterCount = [selectedType, selectedSystem].filter(Boolean).length;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allLocations.filter((l) => {
      const name = (l.name ?? l.internal ?? "").toLowerCase();
      const matchSearch = !q || name.includes(q) || (l.system ?? "").toLowerCase().includes(q);
      const matchType   = !selectedType   || l.type === selectedType;
      const matchSystem = !selectedSystem || l.system === selectedSystem;
      return matchSearch && matchType && matchSystem;
    });
  }, [allLocations, search, selectedType, selectedSystem]);

  const clearFilters = () => { setSelectedType(""); setSelectedSystem(""); setSearch(""); };

  const typeStats = useMemo(() =>
    types.map((type) => ({
      type,
      count: allLocations.filter((l) => l.type === type).length,
      ...typeStyle(type),
    })),
    [types, allLocations],
  );

  return (
    <div className="relative min-h-screen bg-background">
      <PageHeader
        breadcrumb={[{ label: t("locations.title"), icon: Compass }]}
        label={t("nav.database")}
        labelIcon={Compass}
        title={t("locations.title")}
        subtitle={t("locations.description")}
      />

      <div className="container pb-8">

        {/* Recherche + filtres */}
        <div className="mb-6 mt-4 space-y-2">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("locations.searchPlaceholder")}
                className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors ${
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

          {/* Chips type */}
          {!loading && (
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedType("")}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                  !selectedType
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/50 bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <Compass className="h-3 w-3" />
                {t("common.all")}
                <span className="text-[10px] opacity-60">{allLocations.length}</span>
              </button>
              {typeStats.map(({ type, count, Icon, iconColor }) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(selectedType === type ? "" : type)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                    selectedType === type
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border/50 bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-3 w-3 ${selectedType === type ? "text-primary" : iconColor}`} />
                  {type}
                  <span className="text-[10px] opacity-60">{count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="mb-6 rounded-lg border border-border bg-card/50 p-4">
            <div className="mb-3 flex items-center justify-between">
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
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option value="">{t("common.all")}</option>
                  {types.map((tp) => <option key={tp} value={tp}>{tp}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("locations.system")}</label>
                <select value={selectedSystem} onChange={(e) => setSelectedSystem(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option value="">{t("common.all")}</option>
                  {systems.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                {t("locations.found", { count: filtered.length })}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((loc) => (
                <LocationCard key={loc.id} loc={loc} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-20 text-center">
                <Compass className="mb-4 h-12 w-12 text-muted-foreground/30" />
                <p className="text-lg font-medium text-muted-foreground">{t("locations.noLocationFound")}</p>
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

export default Locations;
