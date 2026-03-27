import { useState, useMemo, useEffect } from "react";
import {
  Search, Shield, Zap, Thermometer, Gauge, Crosshair,
  SlidersHorizontal, X, Cpu, Loader2, Fuel, Radar, Target,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useVersion } from "@/contexts/VersionContext";
import {
  fetchComponents, componentTypeLabel, gradeLabel,
  type ShipComponent,
} from "@/data/components";

// ---------------------------------------------------------------------------
// Style par type API
// ---------------------------------------------------------------------------
const TYPE_STYLE: Record<string, { bg: string; border: string; iconColor: string; Icon: React.ElementType }> = {
  Shield:          { bg: "from-blue-500/20 to-blue-600/5",    border: "border-blue-500/30",    iconColor: "text-blue-400",    Icon: Shield },
  PowerPlant:      { bg: "from-amber-500/20 to-amber-600/5",  border: "border-amber-500/30",   iconColor: "text-amber-400",   Icon: Zap },
  Cooler:          { bg: "from-cyan-500/20 to-cyan-600/5",    border: "border-cyan-500/30",    iconColor: "text-cyan-400",    Icon: Thermometer },
  QuantumDrive:    { bg: "from-violet-500/20 to-violet-600/5",border: "border-violet-500/30",  iconColor: "text-violet-400",  Icon: Gauge },
  Radar:           { bg: "from-emerald-500/20 to-emerald-600/5",border:"border-emerald-500/30",iconColor: "text-emerald-400", Icon: Radar },
  WeaponDefensive: { bg: "from-rose-500/20 to-rose-600/5",    border: "border-rose-500/30",    iconColor: "text-rose-400",    Icon: Target },
  FuelTank:        { bg: "from-orange-500/20 to-orange-600/5",border: "border-orange-500/30",  iconColor: "text-orange-400",  Icon: Fuel },
  QuantumFuelTank: { bg: "from-purple-500/20 to-purple-600/5",border: "border-purple-500/30",  iconColor: "text-purple-400",  Icon: Fuel },
  FuelIntake:      { bg: "from-teal-500/20 to-teal-600/5",    border: "border-teal-500/30",    iconColor: "text-teal-400",    Icon: Fuel },
};
const DEFAULT_STYLE = { bg: "from-primary/20 to-primary/5", border: "border-primary/30", iconColor: "text-primary", Icon: Cpu };

const typeStyle = (type: string | null) => type && TYPE_STYLE[type] ? TYPE_STYLE[type] : DEFAULT_STYLE;

// ---------------------------------------------------------------------------
// Grade config
// ---------------------------------------------------------------------------
const GRADE_CONFIG: Record<string, { color: string; bar: string; labelKey: string }> = {
  A: { color: "bg-amber-500/10 text-amber-400 border-amber-500/30",  bar: "w-full bg-amber-400",         labelKey: "components.gradeA" },
  B: { color: "bg-blue-500/10 text-blue-400 border-blue-500/30",     bar: "w-3/4 bg-blue-400",           labelKey: "components.gradeB" },
  C: { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", bar: "w-1/2 bg-emerald-400",  labelKey: "components.gradeC" },
  D: { color: "bg-muted text-muted-foreground border-border",        bar: "w-1/4 bg-muted-foreground",   labelKey: "components.gradeD" },
  "?":{ color: "bg-secondary text-muted-foreground border-border",   bar: "w-0",                         labelKey: "components.gradeD" },
};

// ---------------------------------------------------------------------------
// ComponentCard
// ---------------------------------------------------------------------------
const ComponentCard = ({ c }: { c: ShipComponent }) => {
  const { t } = useTranslation();
  const s     = typeStyle(c.type);
  const { Icon } = s;
  const gl    = gradeLabel(c.grade);
  const gc    = GRADE_CONFIG[gl];
  const label = componentTypeLabel(c.type);
  const name  = c.name ?? c.internalName;

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_hsl(var(--primary)/0.1)]">
      <div className={`h-1 bg-gradient-to-r ${s.bg}`} />

      <div className={`flex items-center justify-between border-b border-border/50 bg-gradient-to-r ${s.bg} px-4 py-2.5`}>
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${s.iconColor}`} />
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground/80">{label}</span>
        </div>
        {c.size != null && (
          <span className="text-[10px] font-medium text-muted-foreground">
            S{c.size}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display text-base font-bold leading-tight text-foreground line-clamp-2">{name}</h3>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {c.manufacturer ?? "—"}
            </p>
          </div>
          <span className={`shrink-0 inline-flex rounded border px-2 py-0.5 text-[10px] font-bold ${gc.color}`}>
            {gl}
          </span>
        </div>

        {c.description && (
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground/80 line-clamp-2">{c.description}</p>
        )}

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-muted-foreground shrink-0">{t(gc.labelKey)}</span>
          <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
            <div className={`h-full rounded-full ${gc.bar} transition-all`} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Components page
// ---------------------------------------------------------------------------
const Components = () => {
  const { t, i18n } = useTranslation();
  const { selectedVersion } = useVersion();

  const [allComponents, setAllComponents] = useState<ShipComponent[]>([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [selectedType, setSelectedType]   = useState("");
  const [selectedSize, setSelectedSize]   = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedMfr, setSelectedMfr]     = useState("");
  const [showFilters, setShowFilters]     = useState(false);

  useEffect(() => {
    if (!selectedVersion) return;
    setLoading(true);
    fetchComponents({ gameVersion: selectedVersion.id, locale: i18n.language })
      .then(setAllComponents)
      .catch(() => setAllComponents([]))
      .finally(() => setLoading(false));
  }, [selectedVersion, i18n.language]);

  const types = useMemo(
    () => [...new Set(allComponents.map((c) => c.type).filter(Boolean) as string[])].sort(),
    [allComponents],
  );
  const sizes = useMemo(
    () => [...new Set(allComponents.filter((c) => c.size != null).map((c) => c.size as number))].sort((a, b) => a - b),
    [allComponents],
  );
  const mfrs = useMemo(
    () => [...new Set(allComponents.map((c) => c.manufacturer).filter(Boolean) as string[])].sort(),
    [allComponents],
  );

  const activeFilterCount = [selectedType, selectedSize, selectedGrade, selectedMfr].filter(Boolean).length;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allComponents.filter((c) => {
      const name = (c.name ?? c.internalName).toLowerCase();
      const mfr  = (c.manufacturer ?? "").toLowerCase();
      const matchSearch = !q || name.includes(q) || mfr.includes(q);
      const matchType   = !selectedType  || c.type === selectedType;
      const matchSize   = !selectedSize  || String(c.size) === selectedSize;
      const matchGrade  = !selectedGrade || gradeLabel(c.grade) === selectedGrade;
      const matchMfr    = !selectedMfr   || c.manufacturer === selectedMfr;
      return matchSearch && matchType && matchSize && matchGrade && matchMfr;
    });
  }, [allComponents, search, selectedType, selectedSize, selectedGrade, selectedMfr]);

  const clearFilters = () => {
    setSelectedType(""); setSelectedSize(""); setSelectedGrade(""); setSelectedMfr(""); setSearch("");
  };

  const typeStats = useMemo(() =>
    types.map((type) => ({
      type,
      count: allComponents.filter((c) => c.type === type).length,
      ...typeStyle(type),
    })),
    [types, allComponents],
  );

  return (
    <div className="container py-8">
      {/* Hero header */}
      <div className="relative mb-8 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card via-card to-secondary p-8">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative">
          <div className="mb-2 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              {t("components.equipment")}
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">{t("components.title")}</h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">{t("components.description")}</p>

          {!loading && (
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType("")}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                  !selectedType
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/50 bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <Cpu className="h-4 w-4" />
                <span className="font-medium">{t("common.all")}</span>
                <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold">
                  {allComponents.length}
                </span>
              </button>

              {typeStats.map(({ type, count, Icon, iconColor }) => (
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
                  <span className="font-medium">{componentTypeLabel(type)}</span>
                  <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold">{count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search + filters bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("components.searchPlaceholder")}
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("common.type")}</label>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                <option value="">{t("common.all")}</option>
                {types.map((tp) => <option key={tp} value={tp}>{componentTypeLabel(tp)}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("common.size")}</label>
              <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                <option value="">{t("common.allFem")}</option>
                {sizes.map((s) => <option key={s} value={String(s)}>S{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("common.grade")}</label>
              <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                <option value="">{t("common.all")}</option>
                <option value="A">{t("components.gradeAFull")}</option>
                <option value="B">{t("components.gradeBFull")}</option>
                <option value="C">{t("components.gradeCFull")}</option>
                <option value="D">{t("components.gradeDFull")}</option>
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
              {t("components.found", { count: filtered.length })}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c) => <ComponentCard key={c.id} c={c} />)}
          </div>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-20 text-center">
              <Cpu className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="text-lg font-medium text-muted-foreground">{t("components.noComponentFound")}</p>
              <p className="mt-1 text-sm text-muted-foreground/70">{t("common.modifyFilters")}</p>
              <button onClick={clearFilters} className="mt-4 text-sm text-primary hover:underline">
                {t("common.resetFilters")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Components;
