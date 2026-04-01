'use client';
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Plus, X, Ruler, Gauge, Fuel,
  Shield, Box, Users, Loader2, Search, GitCompareArrows,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { useSEO } from "@/hooks/useSEO";
import { useTrackPageView } from "@/hooks/useAnalytics";
import { apiFetch, API_URL } from "@/lib/api";
import { useVersion } from "@/contexts/VersionContext";
import PageHeader from "@/components/PageHeader";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShipSummary {
  id:           number;
  name:         string;
  manufacturer: string | null;
  role:         string | null;
  career:       string | null;
  image:        string | null;
  sizeX:        number | null;
  sizeY:        number | null;
  sizeZ:        number | null;
  cargo:        number | null;
  crewSize:     string | null;
}

interface ShipStats {
  powerGenerated: number | null;
  shieldHealth:   number | null;
  shieldRegen:    number | null;
  qdSpeed:        number | null;
}

interface CompareShip extends ShipSummary {
  stats:        ShipStats | null;
  loadingDetail: boolean;
}

// ─── Spec rows ────────────────────────────────────────────────────────────────

const MAX_SHIPS = 4;

interface SpecRow {
  label:          string;
  icon:           typeof Ruler;
  getValue:       (s: CompareShip) => number | string | null;
  unit?:          string;
  higherIsBetter?: boolean;
  format?:        (v: number) => string;
}

const specRows = (t: (k: string) => string): SpecRow[] => [
  { label: t("shipCompare.specLength"),     icon: Ruler,     getValue: s => s.sizeX,                                   unit: "m" },
  { label: t("shipCompare.specBeam"),       icon: Ruler,     getValue: s => s.sizeY,                                   unit: "m" },
  { label: t("shipCompare.specHeight"),     icon: Ruler,     getValue: s => s.sizeZ,                                   unit: "m" },
  { label: t("shipCompare.specCrew"),       icon: Users,     getValue: s => s.crewSize },
  { label: t("shipCompare.specCargo"),      icon: Box,       getValue: s => s.cargo,     unit: "SCU", higherIsBetter: true },
  { label: "Bouclier (HP)",                 icon: Shield,    getValue: s => s.stats?.shieldHealth ?? null,              higherIsBetter: true, format: v => v.toLocaleString() },
  { label: "Régén. bouclier / s",           icon: Shield,    getValue: s => s.stats?.shieldRegen ?? null,               higherIsBetter: true, format: v => v.toFixed(1) },
  { label: "Vitesse QD (Mm/s)",             icon: Gauge,     getValue: s => s.stats?.qdSpeed != null ? Math.round(s.stats.qdSpeed / 10_000) / 100 : null, higherIsBetter: true, format: v => v.toFixed(2) },
  { label: "Puissance générée (W)",         icon: Fuel,      getValue: s => s.stats?.powerGenerated ?? null,            higherIsBetter: true, format: v => v.toLocaleString() },
];

const getBestIndex = (ships: CompareShip[], row: SpecRow): number | null => {
  if (!row.higherIsBetter || ships.length < 2) return null;
  let bestIdx = 0, bestVal = -Infinity;
  ships.forEach((s, i) => {
    const raw = row.getValue(s);
    const num = typeof raw === "number" ? raw : parseFloat(String(raw ?? "").replace(/[^0-9.-]/g, ""));
    if (!isNaN(num) && num > bestVal) { bestVal = num; bestIdx = i; }
  });
  return bestVal === -Infinity ? null : bestIdx;
};

// ─── Ship Selector ────────────────────────────────────────────────────────────

const ShipSelector = ({
  selected, onSelect, onRemove, usedIds, allShips, loadingAll,
}: {
  selected:   CompareShip | null;
  onSelect:   (s: ShipSummary) => void;
  onRemove:   () => void;
  usedIds:    number[];
  allShips:   ShipSummary[];
  loadingAll: boolean;
}) => {
  const { t } = useTranslation();
  const [open,   setOpen]   = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() =>
    allShips
      .filter(s => !usedIds.includes(s.id))
      .filter(s =>
        (s.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (s.manufacturer ?? "").toLowerCase().includes(search.toLowerCase())
      ),
  [allShips, usedIds, search]);

  if (!selected) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-card/50 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          {loadingAll
            ? <Loader2 className="h-6 w-6 animate-spin" />
            : <><Plus className="h-8 w-8" /><span className="text-sm font-medium">{t("shipCompare.addShip")}</span></>
          }
        </button>
        {open && !loadingAll && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-auto rounded-lg border border-border bg-card shadow-xl">
            <div className="sticky top-0 bg-card p-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t("shipCompare.searchPlaceholder")}
                  className="h-9 w-full rounded-md border border-border bg-secondary pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            {filtered.length === 0
              ? <p className="px-3 py-4 text-center text-xs text-muted-foreground">Aucun vaisseau trouvé</p>
              : filtered.map(s => (
                <button
                  key={s.id}
                  onClick={() => { onSelect(s); setOpen(false); setSearch(""); }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-secondary"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.manufacturer}</p>
                  </div>
                </button>
              ))
            }
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card">
      {selected.image && (
        <div className="absolute inset-0">
          <img src={`${API_URL}${selected.image}`} alt="" className="h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-card/40" />
        </div>
      )}
      <div className="relative p-4">
        <button onClick={onRemove} className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
        <div className="pr-6">
          <Link href={`/ships/${selected.id}`} className="font-display text-base font-bold text-foreground hover:text-primary transition-colors">
            {selected.name}
          </Link>
          <p className="text-xs text-muted-foreground">{selected.manufacturer}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {selected.role   && <Badge variant="outline" className="text-[10px]">{selected.role}</Badge>}
            {selected.career && <Badge variant="outline" className="text-[10px]">{selected.career}</Badge>}
          </div>
          {selected.loadingDetail && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" /> Chargement des stats…
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const ShipCompare = () => {
  const { t }                       = useTranslation();
  const { selectedVersion }         = useVersion();
  const [allShips, setAllShips]     = useState<ShipSummary[]>([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [slots, setSlots]           = useState<(CompareShip | null)[]>([null, null]);

  useTrackPageView('tool_compare');
  useSEO({
    title: "Comparateur de vaisseaux",
    description: "Comparez les statistiques de plusieurs vaisseaux Star Citizen côte à côte.",
    path: "/ships/compare",
  });

  // Charge la liste complète
  useEffect(() => {
    const qs = selectedVersion ? `?gameVersion=${selectedVersion.id}` : '';
    apiFetch<ShipSummary[]>(`/api/ships${qs}`)
      .then(setAllShips)
      .finally(() => setLoadingAll(false));
  }, [selectedVersion]);

  const selectedShips = slots.filter(Boolean) as CompareShip[];
  const usedIds = selectedShips.map(s => s.id);
  const rows = specRows(t);

  const handleSelect = async (index: number, summary: ShipSummary) => {
    const ship: CompareShip = { ...summary, stats: null, loadingDetail: true };
    setSlots(prev => { const next = [...prev]; next[index] = ship; return next; });

    try {
      const qs = selectedVersion ? `?gameVersion=${selectedVersion.id}` : '';
      const detail = await apiFetch<{ stats: ShipStats }>(`/api/ships/${summary.id}${qs}`);
      setSlots(prev => {
        const next = [...prev];
        next[index] = { ...ship, stats: detail.stats ?? null, loadingDetail: false };
        return next;
      });
    } catch {
      setSlots(prev => { const next = [...prev]; next[index] = { ...ship, loadingDetail: false }; return next; });
    }
  };

  const handleRemove = (index: number) => {
    setSlots(prev => { const next = [...prev]; next[index] = null; return next; });
  };

  const addSlot = () => {
    if (slots.length < MAX_SHIPS) setSlots(prev => [...prev, null]);
  };

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: t("ships.title"), href: "/ships", icon: GitCompareArrows },
          { label: t("shipCompare.title") },
        ]}
        title={t("shipCompare.title")}
        label={t("ships.title")}
        labelIcon={GitCompareArrows}
        subtitle={t("shipCompare.description", { max: MAX_SHIPS })}
      />

    <div className="container py-8">
      {/* Sélecteurs */}
      <div className="mb-8 grid gap-4" style={{ gridTemplateColumns: `repeat(${slots.length}, minmax(0, 1fr))${slots.length < MAX_SHIPS ? " auto" : ""}` }}>
        {slots.map((ship, i) => (
          <ShipSelector
            key={i}
            selected={ship}
            onSelect={s => handleSelect(i, s)}
            onRemove={() => handleRemove(i)}
            usedIds={usedIds}
            allShips={allShips}
            loadingAll={loadingAll}
          />
        ))}
        {slots.length < MAX_SHIPS && (
          <button
            onClick={addSlot}
            className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border/50 text-muted-foreground/50 transition-colors hover:border-primary/30 hover:text-primary/50"
          >
            <Plus className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Tableau de comparaison */}
      {selectedShips.length >= 2 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="p-3 text-left font-display text-xs font-semibold text-muted-foreground">{t("shipCompare.spec")}</th>
                {selectedShips.map(s => (
                  <th key={s.id} className="p-3 text-center font-display text-xs font-semibold text-primary">{s.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => {
                const bestIdx = getBestIndex(selectedShips, row);
                return (
                  <tr key={row.label} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                    <td className="p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <row.icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="text-xs font-medium">{row.label}</span>
                      </div>
                    </td>
                    {selectedShips.map((s, i) => {
                      const raw  = row.getValue(s);
                      const isBest = bestIdx === i;
                      const display = raw == null
                        ? <span className="text-muted-foreground/30">—</span>
                        : <span className={`font-display text-sm font-semibold ${isBest ? "text-primary" : "text-foreground"}`}>
                            {typeof raw === "number" && row.format
                              ? row.format(raw)
                              : String(raw)
                            }{row.unit && typeof raw === "number" ? ` ${row.unit}` : ""}
                          </span>;
                      return (
                        <td key={s.id} className="p-3 text-center">
                          {s.loadingDetail
                            ? <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin text-muted-foreground/40" />
                            : display
                          }
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedShips.length < 2 && (
        <div className="rounded-lg border border-border/50 bg-card/30 py-16 text-center text-muted-foreground">
          <p className="text-sm">{t("shipCompare.selectMin")}</p>
        </div>
      )}
    </div>
    </>
  );
};

export default ShipCompare;
