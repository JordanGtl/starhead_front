import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, X, Ruler, Weight, Gauge, Fuel, Shield, Heart, Box, Users, Zap, Thermometer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { shipsDetailed, ShipDetailed } from "@/data/ships-detailed";
import { ships } from "@/data/ships";
import { Badge } from "@/components/ui/badge";

const MAX_SHIPS = 4;

const statusColor: Record<string, string> = {
  "Flight Ready": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "In Concept": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "In Production": "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

interface SpecRow {
  labelKey: string;
  icon: typeof Ruler;
  getValue: (s: ShipDetailed) => string | number;
  unit?: string;
  higherIsBetter?: boolean;
}

const specRows: SpecRow[] = [
  { labelKey: "shipCompare.specLength", icon: Ruler, getValue: (s) => s.specs.length, unit: "m" },
  { labelKey: "shipCompare.specBeam", icon: Ruler, getValue: (s) => s.specs.beam, unit: "m" },
  { labelKey: "shipCompare.specHeight", icon: Ruler, getValue: (s) => s.specs.height, unit: "m" },
  { labelKey: "shipCompare.specMass", icon: Weight, getValue: (s) => `${(s.specs.mass / 1000).toFixed(0)}t` },
  { labelKey: "shipCompare.specScm", icon: Gauge, getValue: (s) => s.specs.scmSpeed, unit: "m/s", higherIsBetter: true },
  { labelKey: "shipCompare.specMax", icon: Gauge, getValue: (s) => s.specs.maxSpeed, unit: "m/s", higherIsBetter: true },
  { labelKey: "shipCompare.specShield", icon: Shield, getValue: (s) => s.specs.shieldHp.toLocaleString(), higherIsBetter: true },
  { labelKey: "shipCompare.specHull", icon: Heart, getValue: (s) => s.specs.hullHp.toLocaleString(), higherIsBetter: true },
  { labelKey: "shipCompare.specCargo", icon: Box, getValue: (s) => s.cargo, unit: "SCU", higherIsBetter: true },
  { labelKey: "shipCompare.specCrew", icon: Users, getValue: (s) => s.crew },
  { labelKey: "shipCompare.specPrice", icon: Zap, getValue: (s) => s.price.toLocaleString(), unit: "aUEC" },
  { labelKey: "shipCompare.specHardpoints", icon: Thermometer, getValue: (s) => s.hardpoints.length, higherIsBetter: true },
];

const getBestIndex = (ships: ShipDetailed[], row: SpecRow): number | null => {
  if (!row.higherIsBetter || ships.length < 2) return null;
  let bestIdx = 0;
  let bestVal = -Infinity;
  ships.forEach((s, i) => {
    const raw = row.getValue(s);
    const num = typeof raw === "number" ? raw : parseFloat(String(raw).replace(/[^0-9.-]/g, ""));
    if (!isNaN(num) && num > bestVal) {
      bestVal = num;
      bestIdx = i;
    }
  });
  return bestIdx;
};

const ShipSelector = ({
  selected,
  onSelect,
  onRemove,
  usedIds,
}: {
  selected: ShipDetailed | null;
  onSelect: (s: ShipDetailed) => void;
  onRemove: () => void;
  usedIds: string[];
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  if (!selected) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-card/50 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          <Plus className="h-8 w-8" />
          <span className="text-sm font-medium">{t("shipCompare.addShip")}</span>
        </button>
        {open && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-auto rounded-lg border border-border bg-card shadow-xl">
            <div className="sticky top-0 bg-card p-2">
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("shipCompare.searchPlaceholder")}
                className="h-9 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            {shipsDetailed
              .filter((s) => !usedIds.includes(s.id))
              .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.manufacturer.toLowerCase().includes(search.toLowerCase()))
              .map((s) => (
                <button
                  key={s.id}
                  onClick={() => { onSelect(s); setOpen(false); setSearch(""); }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-secondary"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.manufacturer}</p>
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card">
      {(() => {
        const shipImage = ships.find(s => s.id === selected.id)?.image;
        return shipImage ? (
          <div className="absolute inset-0">
            <img src={shipImage} alt="" className="h-full w-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-card/40" />
          </div>
        ) : null;
      })()}
      <div className="relative p-4">
        <button onClick={onRemove} className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
        <div className="pr-6">
          <Link to={`/ships/${selected.id}`} className="font-display text-base font-bold text-foreground hover:text-primary transition-colors">
            {selected.name}
          </Link>
          <p className="text-xs text-muted-foreground">{selected.manufacturer}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge variant="outline" className="text-[10px]">{selected.role}</Badge>
            <Badge variant="outline" className="text-[10px]">{selected.size}</Badge>
            <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusColor[selected.status]}`}>
              {selected.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShipCompare = () => {
  const { t } = useTranslation();
  const [slots, setSlots] = useState<(ShipDetailed | null)[]>([null, null]);

  const selectedShips = slots.filter(Boolean) as ShipDetailed[];
  const usedIds = selectedShips.map((s) => s.id);

  const handleSelect = (index: number, ship: ShipDetailed) => {
    const next = [...slots];
    next[index] = ship;
    setSlots(next);
  };

  const handleRemove = (index: number) => {
    const next = [...slots];
    next[index] = null;
    setSlots(next);
  };

  const addSlot = () => {
    if (slots.length < MAX_SHIPS) setSlots([...slots, null]);
  };

  return (
    <div className="container py-8">
      <Link to="/ships" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" />
        {t("shipCompare.backToShips")}
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">{t("shipCompare.title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("shipCompare.description", { max: MAX_SHIPS })}</p>
      </div>

      {/* Ship selectors */}
      <div className="mb-8 grid gap-4" style={{ gridTemplateColumns: `repeat(${slots.length}, minmax(0, 1fr))${slots.length < MAX_SHIPS ? " auto" : ""}` }}>
        {slots.map((ship, i) => (
          <ShipSelector
            key={i}
            selected={ship}
            onSelect={(s) => handleSelect(i, s)}
            onRemove={() => handleRemove(i)}
            usedIds={usedIds}
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

      {/* Comparison table */}
      {selectedShips.length >= 2 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="p-3 text-left font-display text-xs font-semibold text-muted-foreground">{t("shipCompare.spec")}</th>
                {selectedShips.map((s) => (
                  <th key={s.id} className="p-3 text-center font-display text-xs font-semibold text-primary">{s.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specRows.map((row) => {
                const bestIdx = getBestIndex(selectedShips, row);
                return (
                  <tr key={row.labelKey} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                    <td className="p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <row.icon className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">{t(row.labelKey)}</span>
                      </div>
                    </td>
                    {selectedShips.map((s, i) => {
                      const val = row.getValue(s);
                      const isBest = bestIdx === i;
                      return (
                        <td key={s.id} className="p-3 text-center">
                          <span className={`font-display text-sm font-semibold ${isBest ? "text-primary" : "text-foreground"}`}>
                            {val}
                            {row.unit && typeof val === "number" ? ` ${row.unit}` : ""}
                          </span>
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
  );
};

export default ShipCompare;
