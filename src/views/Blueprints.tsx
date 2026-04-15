'use client';
import { useState, useMemo, useEffect } from "react";
import {
  Search, ScrollText, SlidersHorizontal, X,
  Clock, Crosshair, Shield, Cpu, Package, Loader2, Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useVersion } from "@/contexts/VersionContext";
import { apiFetch } from "@/lib/api";
import { slugify } from "@/lib/slugify";
import PageHeader from "@/components/PageHeader";
import { useSEO } from "@/hooks/useSEO";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Blueprint {
  id:               number;
  ref:              string;
  dataId:           number;
  internalName:     string;
  blueprintType:    string | null;
  outputRef:        string | null;
  outputName:       string | null;
  outputType:       string | null;
  outputSubType:    string | null;
  outputManufacturer: string | null;
  craftTimeSec:     number | null;
  version:          { id: number; label: string } | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const OUTPUT_TYPE_LABELS: Record<string, string> = {
  WeaponPersonal:   "Arme personnelle",
  WeaponAttachment: "Accessoire",
  Char_Armor_Helmet:"Casque",
  Char_Armor_Torso: "Torse",
  Char_Armor_Arms:  "Bras",
  Char_Armor_Legs:  "Jambes",
  Char_Armor_Undersuit: "Sous-combinaison",
  Char_Armor_Backpack:  "Sac à dos",
  Armor:            "Armure complète",
  FPS_Consumable:   "Consommable",
  Grenade:          "Grenade",
  Shield:           "Bouclier",
  PowerPlant:       "Générateur",
  Cooler:           "Refroidisseur",
  QuantumDrive:     "Quantum Drive",
};

const OUTPUT_TYPE_ICON: Record<string, React.ElementType> = {
  WeaponPersonal:   Crosshair,
  WeaponAttachment: Package,
  Shield:           Shield,
  PowerPlant:       Zap,
  Cooler:           Cpu,
  QuantumDrive:     Cpu,
};

const outputTypeLabel  = (t: string | null) => t ? (OUTPUT_TYPE_LABELS[t] ?? t) : "—";
const outputTypeIcon   = (t: string | null): React.ElementType =>
  (t && OUTPUT_TYPE_ICON[t]) ? OUTPUT_TYPE_ICON[t] : ScrollText;

const fmtCraftTime = (sec: number | null) => {
  if (sec == null) return null;
  if (sec < 60)  return `${sec}s`;
  if (sec < 3600) return `${Math.floor(sec / 60)}min`;
  return `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}min`;
};

async function fetchBlueprints(params: { gameVersion?: number; locale?: string }): Promise<Blueprint[]> {
  const qs = new URLSearchParams({ locale: params.locale ?? "fr" });
  if (params.gameVersion) qs.set("gameVersion", String(params.gameVersion));
  return apiFetch<Blueprint[]>(`/api/blueprints?${qs}`);
}

// ---------------------------------------------------------------------------
// BlueprintCard
// ---------------------------------------------------------------------------
const BlueprintCard = ({ bp }: { bp: Blueprint }) => {
  const Icon = outputTypeIcon(bp.outputType);
  const craftTime = fmtCraftTime(bp.craftTimeSec);

  return (
    <Link
      href={`/blueprints/${bp.id}/${slugify(bp.outputName ?? bp.internalName)}`}
      className="rounded-lg border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_hsl(var(--primary)/0.1)] block"
    >
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Icon className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
            <h3 className="font-bold text-sm leading-tight line-clamp-2 text-primary">
              {bp.outputName ?? bp.internalName}
            </h3>
          </div>
          {craftTime && (
            <div className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="font-mono">{craftTime}</span>
            </div>
          )}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
          <span>{outputTypeLabel(bp.outputType)}</span>
          {bp.outputManufacturer && (
            <>
              <span className="opacity-40">·</span>
              <span>{bp.outputManufacturer}</span>
            </>
          )}
        </div>
      </div>

      <div className="h-px mx-1 bg-gradient-to-r from-transparent from-primary via-30% to-transparent opacity-30" />

      <div className="px-4 py-3">
        <table className="w-full text-xs">
          <tbody>
            {bp.outputSubType && bp.outputSubType.toLowerCase() !== "undefined" && (
              <tr className="border-b border-border/30 last:border-0">
                <td className="py-1 text-muted-foreground">Classe</td>
                <td className="py-1 text-right font-semibold text-foreground">{bp.outputSubType}</td>
              </tr>
            )}
            {bp.outputManufacturer && (
              <tr className="border-b border-border/30 last:border-0">
                <td className="py-1 text-muted-foreground">Fabricant</td>
                <td className="py-1 text-right font-semibold text-foreground truncate max-w-[120px]">{bp.outputManufacturer}</td>
              </tr>
            )}
            {craftTime && (
              <tr className="border-b border-border/30 last:border-0">
                <td className="py-1 text-muted-foreground">Temps de craft</td>
                <td className="py-1 text-right font-mono font-semibold text-foreground">{craftTime}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Link>
  );
};

// ---------------------------------------------------------------------------
// Blueprints page
// ---------------------------------------------------------------------------
const Blueprints = () => {
  const { t, i18n } = useTranslation();
  useSEO({ title: "Blueprints de craft", description: "Blueprints de fabrication de Star Citizen : recettes, ingrédients et temps de craft.", path: "/blueprints" });
  const { selectedVersion } = useVersion();

  const [allBlueprints, setAllBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [selectedType, setSelectedType]   = useState("");
  const [selectedMfr, setSelectedMfr]     = useState("");
  const [showFilters, setShowFilters]     = useState(false);

  useEffect(() => {
    if (!selectedVersion) return;
    setLoading(true);
    fetchBlueprints({ gameVersion: selectedVersion.id, locale: i18n.language })
      .then(setAllBlueprints)
      .catch(() => setAllBlueprints([]))
      .finally(() => setLoading(false));
  }, [selectedVersion, i18n.language]);

  const types = useMemo(
    () => [...new Set(allBlueprints.map((b) => b.outputType).filter(Boolean) as string[])].sort(),
    [allBlueprints],
  );
  const mfrs = useMemo(
    () => [...new Set(allBlueprints.map((b) => b.outputManufacturer).filter(Boolean) as string[])].sort(),
    [allBlueprints],
  );

  const activeFilterCount = [selectedType, selectedMfr].filter(Boolean).length;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allBlueprints.filter((bp) => {
      const name      = (bp.outputName ?? bp.internalName ?? "").toLowerCase();
      const mfr       = (bp.outputManufacturer ?? "").toLowerCase();
      const matchSearch = !q || name.includes(q) || mfr.includes(q);
      const matchType   = !selectedType || bp.outputType === selectedType;
      const matchMfr    = !selectedMfr  || bp.outputManufacturer === selectedMfr;
      return matchSearch && matchType && matchMfr;
    });
  }, [allBlueprints, search, selectedType, selectedMfr]);

  const clearFilters = () => { setSelectedType(""); setSelectedMfr(""); setSearch(""); };

  return (
    <div className="relative min-h-screen bg-background">
      <PageHeader
        breadcrumb={[{ label: t("nav.blueprints"), icon: ScrollText }]}
        label={t("nav.groupCraft")}
        labelIcon={ScrollText}
        title={t("nav.blueprints")}
        subtitle={t("nav.descBlueprints")}
      />

      <div className="container pb-8">

        <div className="mb-6 mt-4 space-y-2">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un blueprint ou un fabricant…"
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
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Type de produit</label>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option value="">{t("common.all")}</option>
                  {types.map((tp) => <option key={tp} value={tp}>{outputTypeLabel(tp)}</option>)}
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
                {filtered.length} blueprint{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((bp) => <BlueprintCard key={bp.id} bp={bp} />)}
            </div>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-20 text-center">
                <ScrollText className="mb-4 h-12 w-12 text-muted-foreground/30" />
                <p className="text-lg font-medium text-muted-foreground">Aucun blueprint trouvé</p>
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

export default Blueprints;
