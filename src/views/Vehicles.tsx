'use client';
import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X, Truck, Loader2, Users, Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchVehicles, movementClassToType, type Vehicle } from "@/data/vehicles";
import { useSEO } from "@/hooks/useSEO";
import { API_URL } from "@/lib/api";

const typeStyles: Record<string, string> = {
  Ground: "bg-amber-500/80 text-white border-amber-400/50",
  Hover:  "bg-blue-500/80 text-white border-blue-400/50",
};
const defaultTypeStyle = "bg-primary/80 text-white border-primary/50";

const typeIconStyles: Record<string, string> = {
  Ground: "text-amber-400",
  Hover:  "text-blue-400",
};

const shortManufacturer: Record<string, string> = {
  "Greycat Industrial":     "Greycat",
  "Tumbril Land Systems":   "Tumbril",
  "Roberts Space Industries": "RSI",
  "Aegis Dynamics":         "Aegis",
  "Drake Interplanetary":   "Drake",
  "Anvil Aerospace":        "Anvil",
  "Crusader Industries":    "Crusader",
  "Origin Jumpworks":       "Origin",
  "Consolidated Outland":   "C.O.",
  "Aopoa":                  "Aopoa",
};

const manufacturerLogo: Record<string, string> = {
  "Roberts Space Industries": "/manufacturers/logo-rsi.png",
  "Aegis Dynamics":           "/manufacturers/logo-aegis-dynamic.png",
  "Drake Interplanetary":     "/manufacturers/logo-drake.png",
  "Anvil Aerospace":          "/manufacturers/logo-anvil.webp",
  "Crusader Industries":      "/manufacturers/logo-crusader.webp",
  "Origin Jumpworks":         "/manufacturers/logo-origin.webp",
  "Greycat Industrial":       "/manufacturers/logo-greycat.svg",
  "Tumbril Land Systems":     "/manufacturers/logo-tumbril.svg",
  "Consolidated Outland":     "/manufacturers/logo-consolidated-outland.png",
  "Aopoa":                    "/manufacturers/logo-aopoa.svg",
};

// --- Card ---

const VehicleCard = ({ v }: { v: Vehicle }) => {
  const { t } = useTranslation();
  const displayType = movementClassToType(v.movementClass);
  const badgeStyle  = typeStyles[displayType]    ?? defaultTypeStyle;
  const iconStyle   = typeIconStyles[displayType] ?? "text-primary";

  return (
    <Link
      href={`/vehicles/${v.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_hsl(var(--primary)/0.12)]"
    >
      {/* Image area */}
      <div className="relative h-52 overflow-hidden bg-secondary">
        {v.image ? (
          <img
            src={v.image?.startsWith('/') ? `${API_URL}${v.image}` : v.image}
            alt={v.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Truck className="h-16 w-16 text-muted-foreground/15" />
          </div>
        )}

        {/* Manufacturer notch — top right */}
        <div className="absolute top-0 right-0 bg-background/80 backdrop-blur-md pl-3 pb-2 pr-3 pt-2 rounded-bl-lg border-l border-b border-border/50 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground/90">
          {v.manufacturer && manufacturerLogo[v.manufacturer] && (
            <img src={manufacturerLogo[v.manufacturer]} alt={v.manufacturer} className="h-3.5 w-auto object-contain" />
          )}
          {v.manufacturer ? (shortManufacturer[v.manufacturer] ?? v.manufacturer) : "—"}
        </div>

      </div>

      {/* Info bar */}
      <div className="flex items-center gap-1.5 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent px-4 py-2 text-[11px] text-muted-foreground">
        <Truck className={`h-3 w-3 ${iconStyle}`} />
        <span className="font-medium text-foreground/80">{displayType}</span>
        {v.minCrew != null && (
          <>
            <span className="text-muted-foreground/40">/</span>
            <Users className="h-3 w-3 text-primary/70" />
            <span>{t("vehicles.seats")} {v.minCrew}</span>
          </>
        )}
        {v.cargo != null && v.cargo > 0 && (
          <>
            <span className="text-muted-foreground/40">/</span>
            <Package className="h-3 w-3 text-primary/70" />
            <span>{v.cargo} SCU</span>
          </>
        )}
      </div>

      {/* Bottom section */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {v.manufacturer ?? "—"}
        </p>
        <h3 className="mt-1 font-display text-xl font-bold text-foreground">
          {v.name}
        </h3>
        {v.description && (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground/80 line-clamp-2">
            {v.description}
          </p>
        )}
      </div>
    </Link>
  );
};

// --- Page ---

const ITEMS_PER_PAGE = 12;

const Vehicles = () => {
  const { t } = useTranslation();
  useSEO({ title: "Véhicules terrestres", description: "Motos et rovers terrestres disponibles dans Star Citizen.", path: "/vehicles" });

  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedMfr,  setSelectedMfr]  = useState("");
  const [showFilters,  setShowFilters]  = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetchVehicles().then(setAllVehicles).finally(() => setLoading(false));
  }, []);

  const types = useMemo(() =>
    [...new Set(allVehicles.map(v => movementClassToType(v.movementClass)))].sort(),
    [allVehicles],
  );
  const mfrs = useMemo(() =>
    [...new Set(allVehicles.map(v => v.manufacturer).filter(Boolean) as string[])].sort(),
    [allVehicles],
  );
  const activeFilterCount = [selectedType, selectedMfr].filter(Boolean).length;

  const filtered = useMemo(() => {
    return allVehicles.filter(v => {
      const displayType = movementClassToType(v.movementClass);
      const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
        (v.manufacturer ?? "").toLowerCase().includes(search.toLowerCase());
      const matchType = !selectedType || displayType === selectedType;
      const matchMfr  = !selectedMfr  || v.manufacturer === selectedMfr;
      return matchSearch && matchType && matchMfr;
    });
  }, [allVehicles, search, selectedType, selectedMfr]);

  const visibleVehicles = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => { setVisibleCount(ITEMS_PER_PAGE); }, [search, selectedType, selectedMfr]);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader || !hasMore) return;
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) setVisibleCount(prev => prev + ITEMS_PER_PAGE); },
      { threshold: 0.1 },
    );
    observer.observe(loader);
    return () => observer.disconnect();
  }, [hasMore]);

  const clearFilters = () => { setSelectedType(""); setSelectedMfr(""); setSearch(""); };

  const typeStats = useMemo(() => types.map(type => ({
    type,
    count: allVehicles.filter(v => movementClassToType(v.movementClass) === type).length,
    iconStyle: typeIconStyles[type] ?? "text-primary",
  })), [types, allVehicles]);

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
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("vehicles.garage")}</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground">{t("vehicles.title")}</h1>
              <p className="mt-2 max-w-lg text-sm text-muted-foreground">{t("vehicles.description")}</p>
              <div className="mt-4 flex gap-6">
                {[
                  { label: t("vehicles.statsVehicles"),     value: allVehicles.length },
                  { label: t("vehicles.statsManufacturers"), value: new Set(allVehicles.map(v => v.manufacturer)).size },
                  { label: t("vehicles.statsTypes"),         value: new Set(allVehicles.map(v => v.movementClass)).size },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container pb-8 pt-0">
        {/* Filtres rapides par type */}
        <div className="mb-6 flex flex-wrap gap-3">
          {typeStats.map(({ type, count, iconStyle }) => (
            <button
              key={type}
              onClick={() => setSelectedType(selectedType === type ? "" : type)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                selectedType === type
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border/50 bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              <Truck className={`h-4 w-4 ${selectedType === type ? "text-primary" : iconStyle}`} />
              <span className="font-medium">{type}</span>
              <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold">{count}</span>
            </button>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("vehicles.searchPlaceholder")}
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
                <select value={selectedType} onChange={e => setSelectedType(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option value="">{t("common.all")}</option>
                  {types.map(tp => <option key={tp} value={tp}>{tp}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("common.manufacturer")}</label>
                <select value={selectedMfr} onChange={e => setSelectedMfr(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option value="">{t("common.all")}</option>
                  {mfrs.map(m => <option key={m} value={m}>{m}</option>)}
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
                {t("vehicles.found", { count: filtered.length })}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleVehicles.map(v => <VehicleCard key={v.id} v={v} />)}
            </div>

            {hasMore && (
              <div ref={loaderRef} className="flex items-center justify-center py-10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="ml-3 text-sm text-muted-foreground">{t("ships.loadingMore")}</span>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-20 text-center">
                <Truck className="mb-4 h-12 w-12 text-muted-foreground/30" />
                <p className="text-lg font-medium text-muted-foreground">{t("vehicles.noVehicleFound")}</p>
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

export default Vehicles;
