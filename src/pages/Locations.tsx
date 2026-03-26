import { useState, useMemo } from "react";
import { Search, MapPin, Globe, Moon, Landmark, Radio, Orbit, SlidersHorizontal, X, Compass, Coffee } from "lucide-react";
import { locations, Location } from "@/data/locations";
import { Sun } from "lucide-react";

const typeIcons: Record<Location["type"], typeof Globe> = {
  Planet: Globe,
  Moon: Moon,
  Station: Radio,
  City: Landmark,
  Outpost: MapPin,
  "Asteroid Belt": Orbit,
  "Lagrange Point": Orbit,
  "Rest Stop": Coffee,
  Star: Sun,
};

const typeConfig: Record<string, { bg: string; icon: string; border: string }> = {
  Planet:          { bg: "from-blue-500/20 to-blue-600/5", icon: "text-blue-400", border: "border-blue-500/30" },
  Moon:            { bg: "from-slate-400/20 to-slate-500/5", icon: "text-slate-300", border: "border-slate-400/30" },
  Station:         { bg: "from-amber-500/20 to-amber-600/5", icon: "text-amber-400", border: "border-amber-500/30" },
  City:            { bg: "from-emerald-500/20 to-emerald-600/5", icon: "text-emerald-400", border: "border-emerald-500/30" },
  Outpost:         { bg: "from-orange-500/20 to-orange-600/5", icon: "text-orange-400", border: "border-orange-500/30" },
  "Asteroid Belt": { bg: "from-purple-500/20 to-purple-600/5", icon: "text-purple-400", border: "border-purple-500/30" },
  "Lagrange Point": { bg: "from-cyan-500/20 to-cyan-600/5", icon: "text-cyan-400", border: "border-cyan-500/30" },
  "Rest Stop":     { bg: "from-teal-500/20 to-teal-600/5", icon: "text-teal-400", border: "border-teal-500/30" },
  Star:            { bg: "from-yellow-500/20 to-yellow-600/5", icon: "text-yellow-400", border: "border-yellow-500/30" },
};

const defaultConfig = { bg: "from-primary/20 to-primary/5", icon: "text-primary", border: "border-primary/30" };

const LocationCard = ({ loc, isSelected, onClick }: { loc: Location; isSelected: boolean; onClick: () => void }) => {
  const Icon = typeIcons[loc.type] || MapPin;
  const tc = typeConfig[loc.type] || defaultConfig;

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_hsl(var(--primary)/0.1)] ${
        isSelected ? "border-primary ring-1 ring-primary/30" : "border-border"
      }`}
    >
      {/* Type color band */}
      <div className={`h-1 bg-gradient-to-r ${tc.bg}`} />

      {/* Header */}
      <div className={`flex items-center justify-between border-b border-border/50 bg-gradient-to-r ${tc.bg} px-4 py-2.5`}>
        <div className="flex items-center gap-2">
          <Icon className={`h-3.5 w-3.5 ${tc.icon}`} />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/80">{loc.type}</span>
        </div>
        <span className={`rounded border ${tc.border} bg-background/40 px-2 py-0.5 text-[10px] font-bold text-foreground/70 backdrop-blur-sm`}>
          {loc.system}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1">
          <h3 className="font-display text-lg font-bold text-foreground leading-tight">{loc.name}</h3>
          {loc.parent && (
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Orbite : {loc.parent}</p>
          )}
        </div>

        <p className="mb-4 text-sm leading-relaxed text-muted-foreground/80 line-clamp-2">{loc.description}</p>

        {/* Stats */}
        <div className="mt-auto grid grid-cols-2 gap-1.5 text-xs">
          <div className="rounded-md bg-secondary/80 px-2 py-1.5 text-center">
            <span className="block text-[10px] text-muted-foreground">Atmosphère</span>
            <span className="font-display font-bold text-foreground text-[11px]">{loc.atmosphere}</span>
          </div>
          <div className="rounded-md bg-secondary/80 px-2 py-1.5 text-center">
            <span className="block text-[10px] text-muted-foreground">Gravité</span>
            <span className="font-display font-bold text-foreground text-[11px]">{loc.gravity}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Locations = () => {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSystem, setSelectedSystem] = useState("");
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  const types = useMemo(() => [...new Set(locations.map((l) => l.type))], []);
  const systems = useMemo(() => [...new Set(locations.map((l) => l.system))], []);

  const activeFilterCount = [selectedType, selectedSystem].filter(Boolean).length;

  const filtered = useMemo(() => {
    return locations.filter((l) => {
      const matchSearch =
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.description.toLowerCase().includes(search.toLowerCase());
      const matchType = !selectedType || l.type === selectedType;
      const matchSystem = !selectedSystem || l.system === selectedSystem;
      return matchSearch && matchType && matchSystem;
    });
  }, [search, selectedType, selectedSystem]);

  const selectedLocation = selectedId ? locations.find((l) => l.id === selectedId) : undefined;

  const clearFilters = () => {
    setSelectedType("");
    setSelectedSystem("");
    setSearch("");
  };

  const typeStats = useMemo(() => types.map(t => {
    const Icon = typeIcons[t] || MapPin;
    const tc = typeConfig[t] || defaultConfig;
    return { type: t, count: locations.filter(l => l.type === t).length, Icon, iconColor: tc.icon };
  }), [types]);

  return (
    <div className="container py-8">
      {/* Hero header */}
      <div className="relative mb-8 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card via-card to-secondary p-8">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Compass className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Cartographie</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground">Lieux</h1>
              <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                Explorez les lieux du système Stanton et au-delà. Planètes, lunes, stations et avant-postes.
              </p>
            </div>

          </div>

          {/* Type quick filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            {typeStats.map(({ type, count, Icon, iconColor }) => (
              <button
                key={type}
                onClick={() => setSelectedType(selectedType === type ? "" : type)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-all ${
                  selectedType === type
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/50 bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${selectedType === type ? "text-primary" : iconColor}`} />
                <span className="font-medium">{type}</span>
                <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold">{count}</span>
              </button>
            ))}
          </div>

        </div>
      </div>

      <>
          {/* Search & filter bar */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un lieu..."
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
              Filtres
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div className="mb-6 rounded-lg border border-border bg-card/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Filtres avancés</p>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-primary hover:underline">
                    <X className="h-3 w-3" /> Réinitialiser
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="">Tous</option>
                    {types.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Système</label>
                  <select
                    value={selectedSystem}
                    onChange={(e) => setSelectedSystem(e.target.value)}
                    className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="">Tous</option>
                    {systems.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Results count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> lieu{filtered.length !== 1 ? "x" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Location grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((loc) => (
              <LocationCard key={loc.id} loc={loc} isSelected={selectedId === loc.id} onClick={() => setSelectedId(loc.id)} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-20 text-center">
              <Compass className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="text-lg font-medium text-muted-foreground">Aucun lieu trouvé</p>
              <p className="mt-1 text-sm text-muted-foreground/70">Essayez de modifier vos filtres</p>
              <button onClick={clearFilters} className="mt-4 text-sm text-primary hover:underline">
                Réinitialiser les filtres
              </button>
            </div>
          )}
      </>
    </div>
  );
};

export default Locations;
