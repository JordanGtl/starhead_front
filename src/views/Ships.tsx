'use client';
import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, GitCompareArrows, SlidersHorizontal, Rocket, X, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchShips, manufacturers, roles, type Ship } from "@/data/ships";
import ShipCard from "@/components/ShipCard";
import { useSEO } from "@/hooks/useSEO";

const Ships = () => {
  const { t } = useTranslation();
  useSEO({ title: "Vaisseaux", description: "Parcourez tous les vaisseaux de Star Citizen : stats, prix, comparatif et historique.", path: "/ships" });
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
      .catch(() => setError(t("ships.loadError")))
      .finally(() => setLoading(false));
  }, []);

  const activeFilterCount = [selectedManufacturer, selectedRole, selectedSize].filter(Boolean).length;

  const filtered = useMemo(() => {
    let result = allShips.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.manufacturer ?? '').toLowerCase().includes(search.toLowerCase());
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
    <div className="relative min-h-screen bg-background">
      {/* Image de fond */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
        <img src="/hero-bg.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" style={{ objectPosition: "50% 30%" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex min-h-[18vh] items-center">
        <div className="container pb-2 pt-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("ships.fleet")}</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground">{t("ships.title")}</h1>
              <p className="mt-2 max-w-lg text-sm text-muted-foreground">{t("ships.description")}</p>
              {/* Quick stats */}
              <div className="mt-4 flex gap-6">
                {[
                  { label: t("ships.statsShips"), value: allShips.length },
                  { label: t("ships.statsManufacturers"), value: new Set(allShips.map(s => s.manufacturer)).size },
                  { label: t("ships.statsRoles"), value: new Set(allShips.map(s => s.role)).size },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <Link
              href="/ships/compare"
              className="hidden items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/20 hover:border-primary/50 sm:inline-flex"
            >
              <GitCompareArrows className="h-4 w-4" />
              {t("ships.compare")}
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 container pb-8 pt-0">

      {/* Search & filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("ships.searchPlaceholder")}
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

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          <option value="name">{t("ships.sortName")}</option>
          <option value="price-asc">{t("ships.sortPriceAsc")}</option>
          <option value="price-desc">{t("ships.sortPriceDesc")}</option>
        </select>
      </div>

      {/* Expandable filter panel */}
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
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("common.manufacturer")}</label>
              <select
                value={selectedManufacturer}
                onChange={(e) => setSelectedManufacturer(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">{t("common.all")}</option>
                {manufacturers.filter(m => allShips.some(s => s.manufacturer === m)).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("ships.role")}</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">{t("common.all")}</option>
                {roles.filter(r => allShips.some(s => s.role === r)).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("common.size")}</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">{t("common.allFem")}</option>
                {["Small", "Medium", "Large", "Capital"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {t("ships.loadingShips")}
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
              {t("ships.found", { count: filtered.length })}
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
              <span className="ml-3 text-sm text-muted-foreground">{t("ships.loadingMore")}</span>
            </div>
          )}

          {!hasMore && filtered.length > ITEMS_PER_PAGE && (
            <p className="py-8 text-center text-sm text-muted-foreground">{t("ships.allDisplayed")}</p>
          )}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-20 text-center">
              <Rocket className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="text-lg font-medium text-muted-foreground">{t("ships.noShipFound")}</p>
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

export default Ships;
