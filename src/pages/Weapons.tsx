import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search, Crosshair, SlidersHorizontal, X, Swords, Loader2,
  Zap, Bomb, Magnet, Pickaxe, RadioTower,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useVersion } from "@/contexts/VersionContext";
import { fetchWeapons, weaponTypeLabel, WEAPON_TYPE_LABELS, type Weapon } from "@/data/weapons";
import heroBg from "@/assets/hero-bg.jpg";

// ---------------------------------------------------------------------------
// Couleurs & icônes par type API
// ---------------------------------------------------------------------------
const TYPE_STYLE: Record<string, { bg: string; text: string; border: string; Icon: React.ElementType }> = {
  WeaponGun:                    { bg: "from-blue-500/20 to-blue-600/5",    text: "text-blue-400",    border: "border-blue-500/30",    Icon: Crosshair },
  Missile:                      { bg: "from-rose-500/20 to-rose-600/5",    text: "text-rose-400",    border: "border-rose-500/30",    Icon: Bomb },
  WeaponMining:                 { bg: "from-amber-500/20 to-amber-600/5",  text: "text-amber-400",   border: "border-amber-500/30",   Icon: Pickaxe },
  TractorBeam:                  { bg: "from-cyan-500/20 to-cyan-600/5",    text: "text-cyan-400",    border: "border-cyan-500/30",    Icon: Magnet },
  EMP:                          { bg: "from-violet-500/20 to-violet-600/5",text: "text-violet-400",  border: "border-violet-500/30",  Icon: Zap },
  SalvageHead:                  { bg: "from-orange-500/20 to-orange-600/5",text: "text-orange-400",  border: "border-orange-500/30",  Icon: Pickaxe },
  Bomb:                         { bg: "from-red-500/20 to-red-600/5",      text: "text-red-400",     border: "border-red-500/30",     Icon: Bomb },
  SpaceMine:                    { bg: "from-red-500/20 to-red-600/5",      text: "text-red-400",     border: "border-red-500/30",     Icon: Bomb },
  TowingBeam:                   { bg: "from-teal-500/20 to-teal-600/5",    text: "text-teal-400",    border: "border-teal-500/30",    Icon: Magnet },
  QuantumInterdictionGenerator: { bg: "from-purple-500/20 to-purple-600/5",text: "text-purple-400",  border: "border-purple-500/30",  Icon: RadioTower },
};
const DEFAULT_STYLE = { bg: "from-primary/20 to-primary/5", text: "text-primary", border: "border-primary/30", Icon: Crosshair };

const typeStyle = (type: string | null) => (type && TYPE_STYLE[type]) ? TYPE_STYLE[type] : DEFAULT_STYLE;

// ---------------------------------------------------------------------------
// WeaponCard
// ---------------------------------------------------------------------------
const WeaponCard = ({ weapon }: { weapon: Weapon }) => {
  const { t } = useTranslation();
  const s = typeStyle(weapon.type);
  const { Icon } = s;
  const displayName = weapon.name ?? weapon.internalName;
  const label       = weaponTypeLabel(weapon.type);
  const sizeLabel   = weapon.size != null ? `S${weapon.size}` : null;
  const mfr         = weapon.manufacturer ?? "—";

  return (
    <Link
      to={`/weapons/${weapon.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_hsl(var(--primary)/0.1)]"
    >
      {/* Top accent bar */}
      <div className={`h-1 bg-gradient-to-r ${s.bg}`} />

      {/* Header */}
      <div className={`flex items-center justify-between border-b border-border/50 bg-gradient-to-r ${s.bg} px-4 py-2.5`}>
        <div className="flex items-center gap-2">
          <Icon className={`h-3.5 w-3.5 ${s.text}`} />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/80">{label}</span>
          {weapon.subType && weapon.subType !== "UNDEFINED" && weapon.subType !== weapon.type && (
            <span className="text-[10px] text-muted-foreground">· {weapon.subType}</span>
          )}
        </div>
        {sizeLabel && (
          <span className={`rounded border ${s.border} bg-background/40 px-2 py-0.5 text-[10px] font-bold text-foreground/70 backdrop-blur-sm`}>
            {sizeLabel}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-bold leading-tight text-foreground line-clamp-2">
          {displayName}
        </h3>
        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {mfr}
        </p>

        {weapon.description && (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground/80 line-clamp-2">
            {weapon.description}
          </p>
        )}

        {/* Stats row */}
        <div className="mt-auto pt-3 grid grid-cols-3 gap-1.5 text-xs">
          <div className="rounded-md bg-secondary/80 px-2 py-1.5 text-center">
            <span className="block text-[10px] text-muted-foreground">{t("weapons.size")}</span>
            <span className="font-display font-bold text-foreground">{sizeLabel ?? "—"}</span>
          </div>
          <div className="rounded-md bg-secondary/80 px-2 py-1.5 text-center">
            <span className="block text-[10px] text-muted-foreground">{t("weapons.grade")}</span>
            <span className="font-display font-bold text-foreground">{weapon.grade ?? "—"}</span>
          </div>
          <div className="rounded-md bg-secondary/80 px-2 py-1.5 text-center">
            <span className="block text-[10px] text-muted-foreground">{t("weapons.health")}</span>
            <span className="font-display font-bold text-foreground">
              {weapon.health != null ? weapon.health.toLocaleString() : "—"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// ---------------------------------------------------------------------------
// Weapons page
// ---------------------------------------------------------------------------
const Weapons = () => {
  const { t, i18n } = useTranslation();
  const { selectedVersion } = useVersion();

  const [allWeapons, setAllWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [selectedType, setSelectedType]           = useState("");
  const [selectedSize, setSelectedSize]           = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [showFilters, setShowFilters]             = useState(false);

  // Recharge quand la version change
  useEffect(() => {
    if (!selectedVersion) return;
    setLoading(true);
    fetchWeapons({ gameVersion: selectedVersion.id, locale: i18n.language })
      .then(setAllWeapons)
      .catch(() => setAllWeapons([]))
      .finally(() => setLoading(false));
  }, [selectedVersion, i18n.language]);

  const types = useMemo(
    () => [...new Set(allWeapons.map((w) => w.type).filter(Boolean) as string[])].sort(),
    [allWeapons],
  );
  const sizes = useMemo(
    () => [...new Set(allWeapons.filter((w) => w.size != null).map((w) => String(w.size)))].sort((a, b) => Number(a) - Number(b)),
    [allWeapons],
  );
  const manufacturers = useMemo(
    () => [...new Set(allWeapons.map((w) => w.manufacturer).filter(Boolean) as string[])].sort(),
    [allWeapons],
  );

  const activeFilterCount = [selectedType, selectedSize, selectedManufacturer].filter(Boolean).length;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allWeapons.filter((w) => {
      const name = (w.name ?? w.internalName).toLowerCase();
      const mfr  = (w.manufacturer ?? "").toLowerCase();
      const matchSearch = !q || name.includes(q) || mfr.includes(q);
      const matchType   = !selectedType || w.type === selectedType;
      const matchSize   = !selectedSize || String(w.size) === selectedSize;
      const matchMfr    = !selectedManufacturer || w.manufacturer === selectedManufacturer;
      return matchSearch && matchType && matchSize && matchMfr;
    });
  }, [allWeapons, search, selectedType, selectedSize, selectedManufacturer]);

  const clearFilters = () => {
    setSelectedType(""); setSelectedSize(""); setSelectedManufacturer(""); setSearch("");
  };

  // Compteurs par type pour les quick-tabs
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allWeapons.forEach((w) => {
      if (w.type) counts[w.type] = (counts[w.type] ?? 0) + 1;
    });
    return counts;
  }, [allWeapons]);

  // Types principaux à afficher en tabs (top 4 par count)
  const mainTypes = useMemo(
    () => Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k]) => k),
    [typeCounts],
  );

  return (
    <div className="relative min-h-screen bg-background">
      {/* Image de fond */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
        <img src={heroBg} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" style={{ objectPosition: '50% 30%' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex min-h-[18vh] items-center">
        <div className="container pb-2 pt-8">
          <div className="mb-1 flex items-center gap-2">
            <Crosshair className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("weapons.title")}</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">{t("weapons.title")}</h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">{t("weapons.description")}</p>
        </div>
      </div>

      <div className="relative z-10 container pb-8 pt-0">

        {/* Quick type tabs */}
        {!loading && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType("")}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-all ${
                !selectedType
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border/50 bg-card/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Swords className="h-4 w-4" />
              <span className="font-medium">{t("common.all")}</span>
              <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold">
                {allWeapons.length}
              </span>
            </button>

            {mainTypes.map((mt) => {
              const s = typeStyle(mt);
              const { Icon } = s;
              return (
                <button
                  key={mt}
                  onClick={() => setSelectedType(selectedType === mt ? "" : mt)}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-all ${
                    selectedType === mt
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border/50 bg-card/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{weaponTypeLabel(mt)}</span>
                  <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold">
                    {typeCounts[mt]}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Search + filters bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("weapons.searchPlaceholder")}
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
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("common.type")}</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">{t("common.all")}</option>
                {types.map((tp) => (
                  <option key={tp} value={tp}>{weaponTypeLabel(tp)}</option>
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
                {sizes.map((s) => (
                  <option key={s} value={s}>S{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("common.manufacturer")}</label>
              <select
                value={selectedManufacturer}
                onChange={(e) => setSelectedManufacturer(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">{t("common.all")}</option>
                {manufacturers.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
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
              {t("weapons.found", { count: filtered.length })}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((w) => (
              <WeaponCard key={w.id} weapon={w} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-20 text-center">
              <Swords className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="text-lg font-medium text-muted-foreground">{t("weapons.noWeaponFound")}</p>
              <p className="mt-1 text-sm text-muted-foreground/70">{t("weapons.modifyFilters")}</p>
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

export default Weapons;
