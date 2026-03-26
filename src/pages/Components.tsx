import { useState, useMemo } from "react";
import { Search, Shield, Zap, Thermometer, Gauge, Crosshair, SlidersHorizontal, X, Cpu } from "lucide-react";
import { components } from "@/data/components";

const typeIcons: Record<string, typeof Shield> = {
  Shield: Shield,
  "Power Plant": Zap,
  Cooler: Thermometer,
  "Quantum Drive": Gauge,
  Radar: Crosshair,
};

const typeColors: Record<string, string> = {
  Shield: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
  "Power Plant": "from-amber-500/20 to-amber-600/5 border-amber-500/30",
  Cooler: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/30",
  "Quantum Drive": "from-violet-500/20 to-violet-600/5 border-violet-500/30",
  Radar: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30",
};

const typeIconColors: Record<string, string> = {
  Shield: "text-blue-400",
  "Power Plant": "text-amber-400",
  Cooler: "text-cyan-400",
  "Quantum Drive": "text-violet-400",
  Radar: "text-emerald-400",
};

const gradeConfig: Record<string, { color: string; label: string; bar: string }> = {
  A: { color: "bg-amber-500/10 text-amber-400 border-amber-500/30", label: "A — Militaire", bar: "w-full bg-amber-400" },
  B: { color: "bg-blue-500/10 text-blue-400 border-blue-500/30", label: "B — Avancé", bar: "w-3/4 bg-blue-400" },
  C: { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", label: "C — Standard", bar: "w-1/2 bg-emerald-400" },
  D: { color: "bg-muted text-muted-foreground border-border", label: "D — Basique", bar: "w-1/4 bg-muted-foreground" },
};

const sizeLabels: Record<string, string> = { S: "Small", M: "Medium", L: "Large" };

const ComponentCard = ({ c }: { c: (typeof components)[0] }) => {
  const Icon = typeIcons[c.type] || Shield;
  const grade = gradeConfig[c.grade];
  const colorClass = typeColors[c.type] || "from-primary/20 to-primary/5 border-primary/30";
  const iconColor = typeIconColors[c.type] || "text-primary";

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_hsl(var(--primary)/0.1)]">
      {/* Top gradient band by type */}
      <div className={`h-1 bg-gradient-to-r ${colorClass}`} />

      {/* Header with icon + type badge */}
      <div className={`flex items-center justify-between border-b border-border/50 bg-gradient-to-r ${colorClass} px-4 py-2.5`}>
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${iconColor}`} />
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground/80">{c.type}</span>
        </div>
        <span className="text-[10px] font-medium text-muted-foreground">
          Taille {c.size} • {sizeLabels[c.size]}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground leading-tight">{c.name}</h3>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{c.manufacturer}</p>
          </div>
          <span className={`shrink-0 inline-flex rounded border px-2 py-0.5 text-[10px] font-bold ${grade.color}`}>
            {c.grade}
          </span>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-muted-foreground/80 line-clamp-2">{c.description}</p>

        {/* Grade quality bar */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-muted-foreground">{grade.label}</span>
          <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
            <div className={`h-full rounded-full ${grade.bar} transition-all`} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Components = () => {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedMfr, setSelectedMfr] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const types = useMemo(() => [...new Set(components.map((c) => c.type))], []);
  const mfrs = useMemo(() => [...new Set(components.map((c) => c.manufacturer))].sort(), []);

  const activeFilterCount = [selectedType, selectedSize, selectedGrade, selectedMfr].filter(Boolean).length;

  const filtered = useMemo(() => {
    return components.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.manufacturer.toLowerCase().includes(search.toLowerCase());
      const matchType = !selectedType || c.type === selectedType;
      const matchSize = !selectedSize || c.size === selectedSize;
      const matchGrade = !selectedGrade || c.grade === selectedGrade;
      const matchMfr = !selectedMfr || c.manufacturer === selectedMfr;
      return matchSearch && matchType && matchSize && matchGrade && matchMfr;
    });
  }, [search, selectedType, selectedSize, selectedGrade, selectedMfr]);

  const clearFilters = () => {
    setSelectedType("");
    setSelectedSize("");
    setSelectedGrade("");
    setSelectedMfr("");
    setSearch("");
  };

  // Stats by type
  const typeStats = useMemo(() => types.map(t => ({
    type: t,
    count: components.filter(c => c.type === t).length,
    icon: typeIcons[t] || Shield,
    iconColor: typeIconColors[t] || "text-primary",
  })), [types]);

  return (
    <div className="container py-8">
      {/* Hero header */}
      <div className="relative mb-8 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card via-card to-secondary p-8">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative">
          <div className="mb-2 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Équipement</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">Composants</h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            Explorez tous les composants disponibles pour équiper vos vaisseaux. Filtrez par type, grade et taille.
          </p>

          {/* Type stats */}
          <div className="mt-6 flex flex-wrap gap-4">
            {typeStats.map(({ type, count, icon: Icon, iconColor }) => (
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
            placeholder="Rechercher un composant ou fabricant..."
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Taille</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Toutes</option>
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Grade</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Tous</option>
                <option value="A">Grade A — Militaire</option>
                <option value="B">Grade B — Avancé</option>
                <option value="C">Grade C — Standard</option>
                <option value="D">Grade D — Basique</option>
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
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filtered.length}</span> composant{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Component grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((c) => (
          <ComponentCard key={c.id} c={c} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-20 text-center">
          <Cpu className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-lg font-medium text-muted-foreground">Aucun composant trouvé</p>
          <p className="mt-1 text-sm text-muted-foreground/70">Essayez de modifier vos filtres</p>
          <button onClick={clearFilters} className="mt-4 text-sm text-primary hover:underline">
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};

export default Components;
