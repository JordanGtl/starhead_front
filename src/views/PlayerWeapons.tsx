'use client';
import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, X, Sword, Loader2, Crosshair, Bomb, Slice } from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useVersion } from "@/contexts/VersionContext";
import {
  fetchPlayerWeapons, playerWeaponTypeLabel, playerWeaponSubtypeLabel,
  PLAYER_WEAPON_TYPES, type PlayerWeaponItem,
} from "@/data/playerWeapons";
import PageHeader from "@/components/PageHeader";
import { useSEO } from "@/hooks/useSEO";

// ---------------------------------------------------------------------------
// Style par type / sous-type
// ---------------------------------------------------------------------------
const TYPE_STYLE: Record<string, {
  bg: string; border: string; iconColor: string; nameColor: string; gradientFrom: string; Icon: React.ElementType;
}> = {
  WeaponPersonal: { bg: "from-rose-500/15 to-rose-600/5",   border: "border-rose-500/50",   iconColor: "text-rose-400",   nameColor: "text-rose-300",   gradientFrom: "from-rose-500",   Icon: Crosshair },
  Grenade:        { bg: "from-orange-500/15 to-orange-600/5", border: "border-orange-500/50", iconColor: "text-orange-400", nameColor: "text-orange-300", gradientFrom: "from-orange-500", Icon: Bomb },
};
const DEFAULT_STYLE = { bg: "from-primary/15 to-primary/5", border: "border-primary/50", iconColor: "text-primary", nameColor: "text-primary", gradientFrom: "from-primary", Icon: Sword };

const typeStyle = (type: string | null) => type && TYPE_STYLE[type] ? TYPE_STYLE[type] : DEFAULT_STYLE;

const SUBTYPE_ICON: Record<string, React.ElementType> = {
  Knife:   Slice,
  Grenade: Bomb,
};

const SUBTYPE_COLOR: Record<string, string> = {
  Small:   "text-emerald-400",
  Medium:  "text-amber-400",
  Large:   "text-rose-400",
  Knife:   "text-cyan-400",
  Gadget:  "text-violet-400",
  Grenade: "text-orange-400",
};

// ---------------------------------------------------------------------------
// WeaponCard
// ---------------------------------------------------------------------------
const WeaponCard = ({ item }: { item: PlayerWeaponItem }) => {
  const s    = typeStyle(item.type);
  const sub  = item.subType?.toLowerCase() !== "undefined" ? item.subType : null;
  const SubIcon = sub ? (SUBTYPE_ICON[sub] ?? s.Icon) : s.Icon;
  const name = item.name ?? item.internalName;
  const subLabel = sub ? playerWeaponSubtypeLabel(sub) : null;

  return (
    <Link
      href={`/components/${item.id}`}
      className="group rounded-lg border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_hsl(var(--primary)/0.1)] block"
    >
      {/* En-tête */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <SubIcon className={`h-4 w-4 shrink-0 mt-0.5 ${s.iconColor}`} />
            <h3 className={`font-bold text-sm leading-tight line-clamp-2 ${s.nameColor}`}>{name}</h3>
          </div>
          {subLabel && (
            <span className={`shrink-0 text-xs font-semibold ${SUBTYPE_COLOR[sub!] ?? "text-muted-foreground"}`}>
              {subLabel}
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
          <span>{playerWeaponTypeLabel(item.type)}</span>
          {item.manufacturer && (
            <>
              <span className="opacity-40">·</span>
              <span>{item.manufacturer}</span>
            </>
          )}
        </div>
      </div>

      {/* Séparateur gradient */}
      <div className={`h-px mx-1 bg-gradient-to-r from-transparent ${s.gradientFrom} via-30% to-transparent opacity-60`} />

      {/* Tableau de stats */}
      <div className="px-4 py-3">
        <table className="w-full text-xs">
          <tbody>
            {item.manufacturer && (
              <tr className="border-b border-border/30 last:border-0">
                <td className="py-1 text-muted-foreground">Fabricant</td>
                <td className="py-1 text-right font-semibold text-foreground truncate max-w-[120px]">{item.manufacturer}</td>
              </tr>
            )}
            {subLabel && (
              <tr className="border-b border-border/30 last:border-0">
                <td className="py-1 text-muted-foreground">Classe</td>
                <td className={`py-1 text-right font-semibold ${SUBTYPE_COLOR[sub!] ?? "text-foreground"}`}>{subLabel}</td>
              </tr>
            )}
            {item.health != null && (
              <tr className="border-b border-border/30 last:border-0">
                <td className="py-1 text-muted-foreground">Points de vie</td>
                <td className="py-1 text-right font-mono font-semibold text-foreground">{item.health}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Link>
  );
};

// ---------------------------------------------------------------------------
// PlayerWeapons page
// ---------------------------------------------------------------------------
const PlayerWeapons = () => {
  const { t, i18n } = useTranslation();
  useSEO({ title: "Armes FPS", description: "Pistolets, fusils et armes lourdes disponibles pour les personnages dans Star Citizen.", path: "/player/weapons" });
  const { selectedVersion } = useVersion();

  const [allItems, setAllItems]           = useState<PlayerWeaponItem[]>([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [selectedType, setSelectedType]   = useState("");
  const [selectedSubType, setSelectedSubType] = useState("");
  const [selectedMfr, setSelectedMfr]     = useState("");
  const [showFilters, setShowFilters]     = useState(false);

  useEffect(() => {
    if (!selectedVersion) return;
    setLoading(true);
    fetchPlayerWeapons({ gameVersion: selectedVersion.id, locale: i18n.language })
      .then(setAllItems)
      .catch(() => setAllItems([]))
      .finally(() => setLoading(false));
  }, [selectedVersion, i18n.language]);

  const types = useMemo(
    () => PLAYER_WEAPON_TYPES.filter((t) => allItems.some((i) => i.type === t)),
    [allItems],
  );
  const subTypes = useMemo(
    () => [...new Set(allItems.map((i) => i.subType).filter((s): s is string => !!s && s.toLowerCase() !== "undefined"))].sort(),
    [allItems],
  );
  const mfrs = useMemo(
    () => [...new Set(allItems.map((i) => i.manufacturer).filter(Boolean) as string[])].sort(),
    [allItems],
  );

  const activeFilterCount = [selectedType, selectedSubType, selectedMfr].filter(Boolean).length;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allItems.filter((item) => {
      const name        = (item.name ?? item.internalName).toLowerCase();
      const mfr         = (item.manufacturer ?? "").toLowerCase();
      const matchSearch   = !q || name.includes(q) || mfr.includes(q);
      const matchType     = !selectedType    || item.type === selectedType;
      const matchSubType  = !selectedSubType || item.subType === selectedSubType;
      const matchMfr      = !selectedMfr     || item.manufacturer === selectedMfr;
      return matchSearch && matchType && matchSubType && matchMfr;
    });
  }, [allItems, search, selectedType, selectedSubType, selectedMfr]);

  const clearFilters = () => {
    setSelectedType(""); setSelectedSubType(""); setSelectedMfr(""); setSearch("");
  };

  const typeStats = useMemo(() =>
    types.map((type) => ({
      type,
      count: allItems.filter((i) => i.type === type).length,
      ...typeStyle(type),
    })),
    [types, allItems],
  );

  return (
    <div className="relative min-h-screen bg-background">
      <PageHeader
        breadcrumb={[{ label: t("nav.playerWeapons"), icon: Sword }]}
        label={t("nav.groupPlayer")}
        labelIcon={Sword}
        title={t("nav.playerWeapons")}
        subtitle={t("nav.descPlayerWeapons")}
      />

      <div className="container pb-8">

        {/* Search + filtres type */}
        <div className="mb-6 mt-4 space-y-2">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une arme ou un fabricant…"
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

          {/* Chips type */}
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
                <Sword className="h-3 w-3" />
                {t("common.all")}
                <span className="text-[10px] opacity-60">{allItems.length}</span>
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
                  {playerWeaponTypeLabel(type)}
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
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{t("common.type")}</label>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option value="">{t("common.all")}</option>
                  {types.map((tp) => <option key={tp} value={tp}>{playerWeaponTypeLabel(tp)}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Classe</label>
                <select value={selectedSubType} onChange={(e) => setSelectedSubType(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option value="">{t("common.all")}</option>
                  {subTypes.map((s) => <option key={s} value={s}>{playerWeaponSubtypeLabel(s) || s}</option>)}
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
                {filtered.length} arme{filtered.length !== 1 ? "s" : ""} trouvée{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((item) => <WeaponCard key={item.id} item={item} />)}
            </div>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-20 text-center">
                <Sword className="mb-4 h-12 w-12 text-muted-foreground/30" />
                <p className="text-lg font-medium text-muted-foreground">Aucune arme trouvée</p>
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

export default PlayerWeapons;
