import { useState, useMemo } from "react";
import { Search, Gauge, Box, Users, Crosshair, SlidersHorizontal, X, Truck } from "lucide-react";
import { vehicles } from "@/data/vehicles";

const typeConfig: Record<string, { bg: string; icon: string; border: string }> = {
  Ground:  { bg: "from-amber-500/20 to-amber-600/5", icon: "text-amber-400", border: "border-amber-500/30" },
  Hover:   { bg: "from-blue-500/20 to-blue-600/5", icon: "text-blue-400", border: "border-blue-500/30" },
  Gravlev: { bg: "from-violet-500/20 to-violet-600/5", icon: "text-violet-400", border: "border-violet-500/30" },
};

const defaultTypeConfig = { bg: "from-primary/20 to-primary/5", icon: "text-primary", border: "border-primary/30" };

const VehicleCard = ({ v }: { v: (typeof vehicles)[0] }) => {
  const tc = typeConfig[v.type] || defaultTypeConfig;
  const maxSpeed = 80;
  const speedPercent = Math.min((v.speed / maxSpeed) * 100, 100);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_hsl(var(--primary)/0.1)]">
      {/* Type color band */}
      <div className={`h-1 bg-gradient-to-r ${tc.bg}`} />

      {/* Header */}
      <div className={`flex items-center justify-between border-b border-border/50 bg-gradient-to-r ${tc.bg} px-4 py-2.5`}>
        <div className="flex items-center gap-2">
          <Truck className={`h-3.5 w-3.5 ${tc.icon}`} />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/80">{v.type}</span>
        </div>
        {v.weapons && (
          <span className={`rounded border ${tc.border} bg-background/40 px-2 py-0.5 text-[10px] font-bold text-foreground/70 backdrop-blur-sm`}>
            <Crosshair className="inline h-3 w-3 mr-0.5" />Armé
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1">
          <h3 className="font-display text-lg font-bold text-foreground leading-tight">{v.name}</h3>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{v.manufacturer}</p>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-muted-foreground/80 line-clamp-2">{v.description}</p>

        {/* Stats */}
        <div className="mt-auto grid grid-cols-3 gap-1.5 text-xs">
          <div className="rounded-md bg-secondary/80 px-2 py-1.5 text-center">
            <span className="block text-[10px] text-muted-foreground">Vitesse</span>
            <span className="font-display font-bold text-foreground">{v.speed} <span className="text-[9px] font-normal text-muted-foreground">km/h</span></span>
          </div>
          <div className="rounded-md bg-secondary/80 px-2 py-1.5 text-center">
            <span className="block text-[10px] text-muted-foreground">Places</span>
            <span className="font-display font-bold text-foreground">{v.seats}</span>
          </div>
          <div className="rounded-md bg-secondary/80 px-2 py-1.5 text-center">
            <span className="block text-[10px] text-muted-foreground">Cargo</span>
            <span className="font-display font-bold text-foreground">{v.cargo} <span className="text-[9px] font-normal text-muted-foreground">SCU</span></span>
          </div>
        </div>

        {/* Speed bar */}
        <div className="mt-3 flex items-center gap-2">
          <Gauge className={`h-3 w-3 shrink-0 ${tc.icon}`} />
          <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${tc.bg.replace('/20', '/80').replace('/5', '/40')}`}
              style={{ width: `${speedPercent}%` }}
            />
          </div>
          <span className={`text-[11px] font-display font-bold ${tc.icon}`}>{v.speed}</span>
        </div>
      </div>
    </div>
  );
};

const Vehicles = () => {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedMfr, setSelectedMfr] = useState("");
  const [armedOnly, setArmedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const types = useMemo(() => [...new Set(vehicles.map((v) => v.type))], []);
  const mfrs = useMemo(() => [...new Set(vehicles.map((v) => v.manufacturer))].sort(), []);

  const activeFilterCount = [selectedType, selectedMfr, armedOnly ? "armed" : ""].filter(Boolean).length;

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      const matchSearch =
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.manufacturer.toLowerCase().includes(search.toLowerCase());
      const matchType = !selectedType || v.type === selectedType;
      const matchMfr = !selectedMfr || v.manufacturer === selectedMfr;
      const matchArmed = !armedOnly || v.weapons;
      return matchSearch && matchType && matchMfr && matchArmed;
    });
  }, [search, selectedType, selectedMfr, armedOnly]);

  const clearFilters = () => {
    setSelectedType("");
    setSelectedMfr("");
    setArmedOnly(false);
    setSearch("");
  };

  const typeStats = useMemo(() => types.map(t => ({
    type: t,
    count: vehicles.filter(v => v.type === t).length,
    ...typeConfig[t] || defaultTypeConfig,
  })), [types]);

  return (
    <div className="container py-8">
      {/* Hero header */}
      <div className="relative mb-8 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card via-card to-secondary p-8">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative">
          <div className="mb-2 flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Garage</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">Véhicules</h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            Parcourez les véhicules terrestres, hover et gravlev. Comparez vitesse, capacité et armement.
          </p>

          {/* Type quick filters */}
          <div className="mt-6 flex flex-wrap gap-3">
            {typeStats.map(({ type, count, icon: iconColor }) => (
              <button
                key={type}
                onClick={() => setSelectedType(selectedType === type ? "" : type)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-all ${
                  selectedType === type
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/50 bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <Truck className={`h-4 w-4 ${selectedType === type ? "text-primary" : iconColor}`} />
                <span className="font-medium">{type}</span>
                <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold">{count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search & filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un véhicule ou fabricant..."
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
          <div className="grid gap-3 sm:grid-cols-3">
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
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Fabricant</label>
              <select
                value={selectedMfr}
                onChange={(e) => setSelectedMfr(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Tous</option>
                {mfrs.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Armement</label>
              <label className="flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={armedOnly}
                  onChange={(e) => setArmedOnly(e.target.checked)}
                  className="accent-[hsl(var(--primary))]"
                />
                Armés uniquement
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filtered.length}</span> véhicule{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Vehicle grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((v) => (
          <VehicleCard key={v.id} v={v} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-20 text-center">
          <Truck className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-lg font-medium text-muted-foreground">Aucun véhicule trouvé</p>
          <p className="mt-1 text-sm text-muted-foreground/70">Essayez de modifier vos filtres</p>
          <button onClick={clearFilters} className="mt-4 text-sm text-primary hover:underline">
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
