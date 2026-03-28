'use client';
import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, X, Truck, Crosshair, Loader2, Users, Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchVehicles, type Vehicle } from "@/data/vehicles";
import { useSEO } from "@/hooks/useSEO";

const typeConfig: Record<string, { gradient: string; badge: string; bar: string; icon: string }> = {
  Ground:  { gradient: "from-amber-500/20 via-amber-500/10 to-transparent",  badge: "bg-amber-500/80 border-amber-400/50",   bar: "from-primary via-amber-400/60 to-accent/40",   icon: "text-amber-400"  },
  Hover:   { gradient: "from-blue-500/20 via-blue-500/10 to-transparent",    badge: "bg-blue-500/80 border-blue-400/50",     bar: "from-primary via-blue-400/60 to-accent/40",    icon: "text-blue-400"   },
  Gravlev: { gradient: "from-violet-500/20 via-violet-500/10 to-transparent", badge: "bg-violet-500/80 border-violet-400/50", bar: "from-primary via-violet-400/60 to-accent/40",  icon: "text-violet-400" },
};
const defaultTypeConfig = { gradient: "from-primary/20 via-primary/10 to-transparent", badge: "bg-primary/80 border-primary/50", bar: "from-primary via-primary/60 to-accent/40", icon: "text-primary" };

// --- Card ---

const VehicleCard = ({ v }: { v: Vehicle }) => {
  const { t } = useTranslation();
  const tc = typeConfig[v.type] ?? defaultTypeConfig;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_hsl(var(--primary)/0.12)]">
      {/* Image area */}
      <div className="relative h-52 overflow-hidden bg-secondary">
        {v.image ? (
          <img
            src={v.image}
            alt={v.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        <div className={`flex h-full items-center justify-center ${v.image ? "hidden" : ""}`}>
          <Truck className="h-16 w-16 text-muted-foreground/15" />
        </div>

        {/* Manufacturer notch — top right */}
        <div className="absolute right-0 top-0 rounded-bl-lg border-b border-l border-border/50 bg-background/80 pb-2 pl-3 pr-3 pt-2 text-[10px] font-bold uppercase tracking-wider text-foreground/90 backdrop-blur-md">
          {v.manufacturer}
        </div>

        {/* Type badge — bottom right */}
        <span className={`absolute bottom-3 right-3 inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md text-white ${tc.badge}`}>
          {v.type}
          {v.hasWeapons && <Crosshair className="h-3 w-3 ml-0.5" />}
        </span>
      </div>

      {/* Info bar */}
      <div className={`flex items-center gap-1.5 bg-gradient-to-r ${tc.gradient} px-4 py-2 text-[11px] text-muted-foreground`}>
        <Users className="h-3 w-3 text-primary/70" />
        <span>{t("vehicles.seats")} {v.seats ?? "—"}</span>
        <span className="text-muted-foreground/40">/</span>
        <Package className="h-3 w-3 text-primary/70" />
        <span>{v.cargo ?? 0} SCU</span>
        {v.hasWeapons && (
          <>
            <span className="text-muted-foreground/40">/</span>
            <Crosshair className="h-3 w-3 text-red-400/70" />
            <span className="text-red-400/80 font-medium">{t("vehicles.armed")}</span>
          </>
        )}
      </div>

      {/* Bottom section */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {v.manufacturer}
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

      {/* Bottom accent line */}
      <div className={`h-0.5 bg-gradient-to-r ${tc.bar}`} />
    </div>
  );
};

// --- Page ---

const Vehicles = () => {
  const { t } = useTranslation();
  useSEO({ title: "Véhicules terrestres", description: "Motos et rovers terrestres disponibles dans Star Citizen.", path: "/vehicles" });
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedMfr, setSelectedMfr] = useState("");
  const [armedOnly, setArmedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchVehicles().then(setAllVehicles).finally(() => setLoading(false));
  }, []);

  const types = useMemo(() => [...new Set(allVehicles.map((v) => v.type))].sort(), [allVehicles]);
  const mfrs  = useMemo(() => [...new Set(allVehicles.map((v) => v.manufacturer))].sort(), [allVehicles]);
  const activeFilterCount = [selectedType, selectedMfr, armedOnly ? "armed" : ""].filter(Boolean).length;

  const filtered = useMemo(() => {
    return allVehicles.filter((v) => {
      const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
        (v.manufacturer ?? "").toLowerCase().includes(search.toLowerCase());
      const matchType  = !selectedType || v.type         === selectedType;
      const matchMfr   = !selectedMfr  || v.manufacturer === selectedMfr;
      const matchArmed = !armedOnly    || v.hasWeapons;
      return matchSearch && matchType && matchMfr && matchArmed;
    });
  }, [allVehicles, search, selectedType, selectedMfr, armedOnly]);

  const clearFilters = () => {
    setSelectedType(""); setSelectedMfr(""); setArmedOnly(false); setSearch("");
  };

  const typeStats = useMemo(() => types.map((type) => ({
    type,
    count: allVehicles.filter((v) => v.type === type).length,
    cfg: typeConfig[type] ?? defaultTypeConfig,
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
          <div className="mb-1 flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("vehicles.garage")}</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">{t("vehicles.title")}</h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">{t("vehicles.description")}</p>
        </div>
      </div>

      <div className="relative z-10 container pb-8 pt-0">
        {/* Filtres rapides par type */}
        <div className="mb-6 flex flex-wrap gap-3">
          {typeStats.map(({ type, count, cfg }) => (
            <button
              key={type}
              onClick={() => setSelectedType(selectedType === type ? "" : type)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                selectedType === type
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border/50 bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              <Truck className={`h-4 w-4 ${selectedType === type ? "text-primary" : cfg.icon}`} />
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
              onChange={(e) => setSearch(e.target.value)}
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
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("common.type")}</label>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option value="">{t("common.all")}</option>
                  {types.map((tp) => <option key={tp} value={tp}>{tp}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("common.manufacturer")}</label>
                <select value={selectedMfr} onChange={(e) => setSelectedMfr(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option value="">{t("common.all")}</option>
                  {mfrs.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("vehicles.armedFilter")}</label>
                <label className="flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-foreground cursor-pointer">
                  <input type="checkbox" checked={armedOnly} onChange={(e) => setArmedOnly(e.target.checked)}
                    className="accent-[hsl(var(--primary))]" />
                  {t("vehicles.armedOnly")}
                </label>
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
                {t("vehicles.found", { count: filtered.length })}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((v) => <VehicleCard key={v.id} v={v} />)}
            </div>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-20 text-center">
                <Truck className="mb-4 h-12 w-12 text-muted-foreground/30" />
                <p className="text-lg font-medium text-muted-foreground">{t("vehicles.noVehicleFound")}</p>
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

export default Vehicles;
