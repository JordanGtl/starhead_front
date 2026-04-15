'use client';
import { useState, useMemo, useEffect } from "react";
import {
  Search, SlidersHorizontal, X, Swords, Loader2,
  Zap, Bomb, Magnet, Pickaxe, RadioTower, Crosshair,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useVersion } from "@/contexts/VersionContext";
import { fetchWeapons, weaponTypeLabel, type Weapon } from "@/data/weapons";
import { slugify } from "@/lib/slugify";
import PageHeader from "@/components/PageHeader";
import { useSEO } from "@/hooks/useSEO";

// ---------------------------------------------------------------------------
// Style par type API
// ---------------------------------------------------------------------------
const TYPE_STYLE: Record<string, {
  bg: string; border: string; iconColor: string; nameColor: string; gradientFrom: string; Icon: React.ElementType;
}> = {
  WeaponGun:                    { bg: "from-blue-500/15 to-blue-600/5",    border: "border-blue-500/50",    iconColor: "text-blue-400",    nameColor: "text-blue-300",    gradientFrom: "from-blue-500",    Icon: Crosshair },
  Missile:                      { bg: "from-rose-500/15 to-rose-600/5",    border: "border-rose-500/50",    iconColor: "text-rose-400",    nameColor: "text-rose-300",    gradientFrom: "from-rose-500",    Icon: Bomb },
  WeaponMining:                 { bg: "from-amber-500/15 to-amber-600/5",  border: "border-amber-500/50",   iconColor: "text-amber-400",   nameColor: "text-amber-300",   gradientFrom: "from-amber-500",   Icon: Pickaxe },
  TractorBeam:                  { bg: "from-cyan-500/15 to-cyan-600/5",    border: "border-cyan-500/50",    iconColor: "text-cyan-400",    nameColor: "text-cyan-300",    gradientFrom: "from-cyan-500",    Icon: Magnet },
  EMP:                          { bg: "from-violet-500/15 to-violet-600/5",border: "border-violet-500/50",  iconColor: "text-violet-400",  nameColor: "text-violet-300",  gradientFrom: "from-violet-500",  Icon: Zap },
  SalvageHead:                  { bg: "from-orange-500/15 to-orange-600/5",border: "border-orange-500/50",  iconColor: "text-orange-400",  nameColor: "text-orange-300",  gradientFrom: "from-orange-500",  Icon: Pickaxe },
  Bomb:                         { bg: "from-red-500/15 to-red-600/5",      border: "border-red-500/50",     iconColor: "text-red-400",     nameColor: "text-red-300",     gradientFrom: "from-red-500",     Icon: Bomb },
  SpaceMine:                    { bg: "from-red-500/15 to-red-600/5",      border: "border-red-500/50",     iconColor: "text-red-400",     nameColor: "text-red-300",     gradientFrom: "from-red-500",     Icon: Bomb },
  TowingBeam:                   { bg: "from-teal-500/15 to-teal-600/5",    border: "border-teal-500/50",    iconColor: "text-teal-400",    nameColor: "text-teal-300",    gradientFrom: "from-teal-500",    Icon: Magnet },
  QuantumInterdictionGenerator: { bg: "from-purple-500/15 to-purple-600/5",border: "border-purple-500/50",  iconColor: "text-purple-400",  nameColor: "text-purple-300",  gradientFrom: "from-purple-500",  Icon: RadioTower },
};
const DEFAULT_STYLE = {
  bg: "from-primary/15 to-primary/5", border: "border-primary/50",
  iconColor: "text-primary", nameColor: "text-primary", gradientFrom: "from-primary", Icon: Crosshair,
};

const typeStyle = (type: string | null) => (type && TYPE_STYLE[type]) ? TYPE_STYLE[type] : DEFAULT_STYLE;

// ---------------------------------------------------------------------------
// WeaponCard — même style que ComponentCard
// ---------------------------------------------------------------------------
const WeaponCard = ({ weapon }: { weapon: Weapon }) => {
  const { t } = useTranslation();
  const s          = typeStyle(weapon.type);
  const { Icon }   = s;
  const name       = weapon.name ?? weapon.internalName;
  const label      = weaponTypeLabel(weapon.type);
  const sizeLabel  = weapon.size != null ? `S${weapon.size}` : null;

  return (
    <Link
      href={`/components/${weapon.id}/${slugify(weapon.name ?? weapon.internalName)}`}
      className="group rounded-lg border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_hsl(var(--primary)/0.1)] block"
    >
      {/* En-tête */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${s.iconColor}`} />
            <h3 className={`font-bold text-sm leading-tight line-clamp-2 ${s.nameColor}`}>{name}</h3>
          </div>
          {(sizeLabel || weapon.grade) && (
            <div className="shrink-0 text-right">
              {weapon.grade && (
                <p className="text-xs font-semibold text-muted-foreground">Grade {weapon.grade}</p>
              )}
              {sizeLabel && (
                <p className="text-[11px] text-muted-foreground">{sizeLabel}</p>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70 mt-0.5">
          <span>{label}</span>
          {weapon.subType && weapon.subType !== "UNDEFINED" && weapon.subType !== weapon.type && (
            <>
              <span className="opacity-40">·</span>
              <span>{weapon.subType}</span>
            </>
          )}
          {weapon.manufacturer && (
            <>
              <span className="opacity-40">·</span>
              <span>{weapon.manufacturer}</span>
            </>
          )}
        </div>
      </div>

      {/* Séparateur gradient */}
      <div className={`h-px mx-1 bg-gradient-to-r from-transparent ${s.gradientFrom} via-30% to-transparent opacity-60`} />

      {/* Corps — tableau */}
      <div className="px-4 py-3">
        <table className="w-full text-xs">
          <tbody>
            {sizeLabel && (
              <tr className="border-b border-border/30 last:border-0">
                <td className="py-1 text-muted-foreground">{t("weapons.size")}</td>
                <td className="py-1 text-right font-mono font-semibold text-foreground">{sizeLabel}</td>
              </tr>
            )}
            {weapon.grade && (
              <tr className="border-b border-border/30 last:border-0">
                <td className="py-1 text-muted-foreground">{t("weapons.grade")}</td>
                <td className="py-1 text-right font-semibold text-foreground">{weapon.grade}</td>
              </tr>
            )}
            {weapon.manufacturer && (
              <tr className="border-b border-border/30 last:border-0">
                <td className="py-1 text-muted-foreground">{t("common.manufacturer")}</td>
                <td className="py-1 text-right font-semibold text-foreground truncate max-w-[120px]">{weapon.manufacturer}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Link>
  );
};

// ---------------------------------------------------------------------------
// Weapons page
// ---------------------------------------------------------------------------
const Weapons = () => {
  const { t, i18n } = useTranslation();
  useSEO({ title: "Armes de vaisseau", description: "Liste complète des armes de vaisseau disponibles dans Star Citizen avec leurs statistiques.", path: "/weapons" });
  const { selectedVersion } = useVersion();

  const [allWeapons, setAllWeapons]   = useState<Weapon[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [selectedType, setSelectedType]           = useState("");
  const [selectedSize, setSelectedSize]           = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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

  const typeStats = useMemo(() =>
    types.map((type) => ({
      type,
      count: allWeapons.filter((w) => w.type === type).length,
      ...typeStyle(type),
    })),
    [types, allWeapons],
  );

  return (
    <div className="relative min-h-screen bg-background">
      <PageHeader
        breadcrumb={[{ label: t("weapons.title"), icon: Swords }]}
        label={t("nav.database")}
        labelIcon={Swords}
        title={t("weapons.title")}
        subtitle={t("weapons.description")}
      />

      <div className="container pb-8">

        {/* Search + filtres */}
        <div className="mb-6 mt-4 space-y-2">
          {/* Ligne recherche + bouton filtres avancés */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
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
              className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors ${
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

          {/* Chips type compacts */}
          {!loading && (
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedType("")}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                  !selectedType
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/50 bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <Swords className="h-3 w-3" />
                {t("common.all")}
                <span className="text-[10px] opacity-60">{allWeapons.length}</span>
              </button>
              {typeStats.map(({ type, count, Icon, iconColor }) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(selectedType === type ? "" : type)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                    selectedType === type
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border/50 bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-3 w-3 ${selectedType === type ? "text-primary" : iconColor}`} />
                  {weaponTypeLabel(type)}
                  <span className="text-[10px] opacity-60">{count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filtres avancés */}
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
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option value="">{t("common.all")}</option>
                  {types.map((tp) => <option key={tp} value={tp}>{weaponTypeLabel(tp)}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("common.size")}</label>
                <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option value="">{t("common.allFem")}</option>
                  {sizes.map((s) => <option key={s} value={s}>S{s}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("common.manufacturer")}</label>
                <select value={selectedManufacturer} onChange={(e) => setSelectedManufacturer(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option value="">{t("common.all")}</option>
                  {manufacturers.map((m) => <option key={m} value={m}>{m}</option>)}
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
                {t("weapons.found", { count: filtered.length })}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((w) => <WeaponCard key={w.id} weapon={w} />)}
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
