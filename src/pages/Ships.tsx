import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, GitCompareArrows, SlidersHorizontal, Rocket, X, Loader2 } from "lucide-react";
import { fetchShips, manufacturers, roles, type Ship } from "@/data/ships";
import ShipCard from "@/components/ShipCard";

const Ships = () => {
  const [allShips, setAllShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name");
  const [visibleCount, setVisibleCount] = useState(12);
  const loaderRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchShips()
      .then(setAllShips)
      .catch(() => setError("Impossible de charger les vaisseaux."))
      .finally(() => setLoading(false));
  }, []);

  const activeFilterCount = [selectedManufacturer, selectedRole, selectedSize].filter(Boolean).length;

  const filtered = useMemo(() => {
    let result = allShips.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.manufacturer.toLowerCase().includes(search.toLowerCase());
      const matchMfr = !selectedManufacturer || s.manufacturer === selectedManufacturer;
      const matchRole = !selectedRole || s.role === selectedRole;
      const matchSize = !selectedSize || s.size === selectedSize;
      return matchSearch && matchMfr && matchRole && matchSize;
    });

    if (sortBy === "price-asc") result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    else if (sortBy === "price-desc") result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    else result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [allShips, search, selectedManufacturer, selectedRole, selectedSize, sortBy]);

  const visibleShips = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => { setVisibleCount(ITEMS_PER_PAGE); }, [search, selectedManufacturer, selectedRole, selectedSize, sortBy]);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setVisibleCount((prev) => prev + ITEMS_PER_PAGE); },
      { threshold: 0.1 }
    );
    observer.observe(loader);
    return () => observer.disconnect();
  }, [hasMore]);

  const clearFilters = () => {
    setSelectedManufacturer(""); setSelectedRole(""); setSelectedSize(""); setSearch("");
  };

  return (
    <div className="container py-8">
      {/* Hero header */}
      <div className="relative mb-8 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card via-card to-secondary p-8">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Flotte</span>
            </div>
            <h1 className="font-display text-4xl font-bold text-foreground">Vaisseaux</h1>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Explorez l'intégralité de la flotte Star Citizen. Comparez, filtrez et trouvez le vaisseau parfait pour vos missions.
            </p>
          </div>
          <Link
            to="/ships/compare"
            className="hidden items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/20 hover:border-primary/50 sm:inline-flex"
          >
            <GitCompareArrows className="h-4 w-4" />
            Comparer
          </Link>
        </div>

        {/* Quick stats */}
        <div className="relative mt-6 flex gap-6">
          {[
            { label: "Vaisseaux", value: allShips.length },
            { label: "Fabricants", value: new Set(allShips.map(s => s.manufacturer)).size },
            { label: "Rôles", value: new Set(allShips.map(s => s.role)).size },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            </div>
          ))}
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
            placeholder="Rechercher un vaisseau ou fabricant..."
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

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          <option value="name">Nom A-Z</option>
          <option value="price-asc">Prix ↑</option>
          <option value="price-desc">Prix ↓</option>
        </select>
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
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Fabricant</label>
              <select
                value={selectedManufacturer}
                onChange={(e) => setSelectedManufacturer(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Tous</option>
                {manufacturers.filter(m => allShips.some(s => s.manufacturer === m)).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Rôle</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Tous</option>
                {roles.filter(r => allShips.some(s => s.role === r)).map((r) => (
                  <option key={r} value={r}>{r}</option>
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
                {["Small", "Medium", "Large", "Capital"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* États */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Chargement des vaisseaux…
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center gap-2 py-20 text-destructive">
          <Rocket className="h-8 w-8 opacity-50" />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> vaisseau{filtered.length !== 1 ? "x" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleShips.map((ship) => (
              <ShipCard key={ship.id} ship={ship} />
            ))}
          </div>

          {hasMore && (
            <div ref={loaderRef} className="flex items-center justify-center py-10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="ml-3 text-sm text-muted-foreground">Chargement...</span>
            </div>
          )}

          {!hasMore && filtered.length > ITEMS_PER_PAGE && (
            <p className="py-8 text-center text-sm text-muted-foreground">Tous les vaisseaux sont affichés</p>
          )}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-20 text-center">
              <Rocket className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="text-lg font-medium text-muted-foreground">Aucun vaisseau trouvé</p>
              <button onClick={clearFilters} className="mt-4 text-sm text-primary hover:underline">
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Ships;
