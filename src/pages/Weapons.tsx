import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Crosshair, Zap, Target, SlidersHorizontal, X, Swords } from "lucide-react";
import { weapons, Weapon } from "@/data/weapons";

const typeColors: Record<string, { bg: string; icon: string; border: string }> = {
  "Laser Cannon":      { bg: "from-blue-500/20 to-blue-600/5", icon: "text-blue-400", border: "border-blue-500/30" },
  "Laser Repeater":    { bg: "from-cyan-500/20 to-cyan-600/5", icon: "text-cyan-400", border: "border-cyan-500/30" },
  "Ballistic Cannon":  { bg: "from-amber-500/20 to-amber-600/5", icon: "text-amber-400", border: "border-amber-500/30" },
  "Ballistic Repeater":{ bg: "from-orange-500/20 to-orange-600/5", icon: "text-orange-400", border: "border-orange-500/30" },
  "Ballistic Gatling": { bg: "from-red-500/20 to-red-600/5", icon: "text-red-400", border: "border-red-500/30" },
  "Distortion":        { bg: "from-violet-500/20 to-violet-600/5", icon: "text-violet-400", border: "border-violet-500/30" },
  "Missile":           { bg: "from-rose-500/20 to-rose-600/5", icon: "text-rose-400", border: "border-rose-500/30" },
  "FPS Ballistic":     { bg: "from-amber-500/20 to-amber-600/5", icon: "text-amber-400", border: "border-amber-500/30" },
  "FPS Energy":        { bg: "from-cyan-500/20 to-cyan-600/5", icon: "text-cyan-400", border: "border-cyan-500/30" },
  "FPS Shotgun":       { bg: "from-red-500/20 to-red-600/5", icon: "text-red-400", border: "border-red-500/30" },
};

const defaultType = { bg: "from-primary/20 to-primary/5", icon: "text-primary", border: "border-primary/30" };

const WeaponCard = ({ weapon }: { weapon: Weapon }) => {
  const tc = typeColors[weapon.type] || defaultType;
  const dps = weapon.dps ?? Math.round(weapon.damage * weapon.rof / 60);
  const maxDps = 2500; // for bar scaling
  const dpsPercent = Math.min((dps / maxDps) * 100, 100);

  return (
    <Link to={`/weapons/${weapon.id}`} className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_hsl(var(--primary)/0.1)]">
      {/* Type color band */}
      <div className={`h-1 bg-gradient-to-r ${tc.bg}`} />

      {/* Header with type + category */}
      <div className={`flex items-center justify-between border-b border-border/50 bg-gradient-to-r ${tc.bg} px-4 py-2.5`}>
        <div className="flex items-center gap-2">
          {weapon.category === "Ship" ? (
            <Crosshair className={`h-3.5 w-3.5 ${tc.icon}`} />
          ) : (
            <Target className={`h-3.5 w-3.5 ${tc.icon}`} />
          )}
          <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/80">{weapon.type}</span>
        </div>
        <span className={`rounded border ${tc.border} bg-background/40 px-2 py-0.5 text-[10px] font-bold text-foreground/70 backdrop-blur-sm`}>
          S{weapon.size}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1">
          <h3 className="font-display text-lg font-bold text-foreground leading-tight">{weapon.name}</h3>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{weapon.manufacturer}</p>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-muted-foreground/80 line-clamp-2">{weapon.description}</p>

        {/* Stats row */}
        <div className="mt-auto grid grid-cols-3 gap-1.5 text-xs">
          <div className="rounded-md bg-secondary/80 px-2 py-1.5 text-center">
            <span className="block text-[10px] text-muted-foreground">Alpha</span>
            <span className="font-display font-bold text-foreground">{weapon.damage}</span>
          </div>
          <div className="rounded-md bg-secondary/80 px-2 py-1.5 text-center">
            <span className="block text-[10px] text-muted-foreground">Cadence</span>
            <span className="font-display font-bold text-foreground">{weapon.rof}</span>
          </div>
          <div className="rounded-md bg-secondary/80 px-2 py-1.5 text-center">
            <span className="block text-[10px] text-muted-foreground">Portée</span>
            <span className="font-display font-bold text-foreground">{weapon.range}m</span>
          </div>
        </div>

        {/* DPS bar */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[10px] font-medium text-muted-foreground shrink-0">DPS</span>
          <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${tc.bg.replace('/20', '/80').replace('/5', '/40')}`}
              style={{ width: `${dpsPercent}%` }}
            />
          </div>
          <span className={`text-[11px] font-display font-bold ${tc.icon}`}>{dps.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
};

const Weapons = () => {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const types = useMemo(() => [...new Set(weapons.map(w => w.type))].sort(), []);
  const sizes = useMemo(() => [...new Set(weapons.map(w => String(w.size)))].sort(), []);
  const manufacturers = useMemo(() => [...new Set(weapons.map(w => w.manufacturer))].sort(), []);

  const activeFilterCount = [selectedType, selectedSize, selectedManufacturer, selectedCategory].filter(Boolean).length;

  const filtered = useMemo(() => {
    return weapons.filter((w) => {
      const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.manufacturer.toLowerCase().includes(search.toLowerCase());
      const matchType = !selectedType || w.type === selectedType;
      const matchSize = !selectedSize || String(w.size) === selectedSize;
      const matchMfr = !selectedManufacturer || w.manufacturer === selectedManufacturer;
      const matchCat = !selectedCategory || w.category === selectedCategory;
      return matchSearch && matchType && matchSize && matchMfr && matchCat;
    });
  }, [search, selectedType, selectedSize, selectedManufacturer, selectedCategory]);

  const clearFilters = () => {
    setSelectedType("");
    setSelectedSize("");
    setSelectedManufacturer("");
    setSelectedCategory("");
    setSearch("");
  };

  const shipCount = useMemo(() => weapons.filter(w => w.category === "Ship").length, []);
  const fpsCount = useMemo(() => weapons.filter(w => w.category === "FPS").length, []);

  return (
    <div className="container py-8">
      {/* Hero header */}
      <div className="relative mb-8 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card via-card to-secondary p-8">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative">
          <div className="mb-2 flex items-center gap-2">
            <Swords className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Arsenal</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">Armes</h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            Toutes les armes embarquées et personnelles de Star Citizen. Comparez les DPS, portées et caractéristiques.
          </p>

          {/* Category quick filters */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(selectedCategory === "" ? "" : "")}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-all ${
                !selectedCategory ? "border-primary/50 bg-primary/10 text-primary" : "border-border/50 bg-card/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Swords className="h-4 w-4" />
              <span className="font-medium">Toutes</span>
              <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold">{weapons.length}</span>
            </button>
            <button
              onClick={() => setSelectedCategory(selectedCategory === "Ship" ? "" : "Ship")}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-all ${
                selectedCategory === "Ship" ? "border-primary/50 bg-primary/10 text-primary" : "border-border/50 bg-card/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Crosshair className="h-4 w-4" />
              <span className="font-medium">Embarquées</span>
              <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold">{shipCount}</span>
            </button>
            <button
              onClick={() => setSelectedCategory(selectedCategory === "FPS" ? "" : "FPS")}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-all ${
                selectedCategory === "FPS" ? "border-primary/50 bg-primary/10 text-primary" : "border-border/50 bg-card/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Target className="h-4 w-4" />
              <span className="font-medium">Personnelles</span>
              <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold">{fpsCount}</span>
            </button>
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
            placeholder="Rechercher une arme ou fabricant..."
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
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Taille</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Toutes</option>
                {sizes.map((s) => (
                  <option key={s} value={s}>Taille {s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Fabricant</label>
              <select
                value={selectedManufacturer}
                onChange={(e) => setSelectedManufacturer(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Tous</option>
                {manufacturers.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filtered.length}</span> arme{filtered.length !== 1 ? "s" : ""} trouvée{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Weapon grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((w) => (
          <WeaponCard key={w.id} weapon={w} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-20 text-center">
          <Swords className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-lg font-medium text-muted-foreground">Aucune arme trouvée</p>
          <p className="mt-1 text-sm text-muted-foreground/70">Essayez de modifier vos filtres</p>
          <button onClick={clearFilters} className="mt-4 text-sm text-primary hover:underline">
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};

export default Weapons;
