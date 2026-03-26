import { Zap, Crosshair, Thermometer, Eye, X, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { ShipComponent, ShipDetailed } from "@/data/ships-detailed";
import { weapons } from "@/data/weapons";

interface SavedLoadout {
  name: string;
  timestamp: number;
  components: Record<string, string>;
  hardpoints: Record<number, string | null>;
}

// Reuse stat calculation logic
const gradeMultipliers: Record<string, number> = { A: 1.0, B: 0.75, C: 0.5, D: 0.3 };
const sizeMultipliers: Record<string, number> = { S: 1, M: 2, L: 3.5 };
const componentStats: Record<string, { basePower: number; baseCooling: number; baseEmission: number }> = {
  "Power Plant": { basePower: 3000, baseCooling: 0, baseEmission: 200 },
  Shield: { basePower: -800, baseCooling: -100, baseEmission: 150 },
  Cooler: { basePower: -200, baseCooling: 2000, baseEmission: 50 },
  "Quantum Drive": { basePower: -500, baseCooling: -200, baseEmission: 100 },
  Radar: { basePower: -150, baseCooling: -50, baseEmission: 80 },
  Weapon: { basePower: -300, baseCooling: -150, baseEmission: 120 },
  "Missile Rack": { basePower: -100, baseCooling: -50, baseEmission: 60 },
};

function getComponentStat(comp: ShipComponent) {
  const base = componentStats[comp.type] || { basePower: 0, baseCooling: 0, baseEmission: 0 };
  const gm = gradeMultipliers[comp.grade] || 0.5;
  const sm = sizeMultipliers[comp.size] || 1;
  return {
    power: Math.round(base.basePower * gm * sm),
    cooling: Math.round(base.baseCooling * gm * sm),
    emission: Math.round(base.baseEmission * gm * sm),
  };
}

function computeLoadoutStats(saved: SavedLoadout, ship: ShipDetailed, allComponents: ShipComponent[]) {
  // Resolve components
  const loadout: Record<string, ShipComponent> = {};
  ship.defaultComponents.forEach(c => { loadout[c.type] = c; });
  allComponents.forEach(c => {
    if (saved.components[c.type] === c.name) loadout[c.type] = c;
  });

  const installed = Object.values(loadout);
  const totalEmission = installed.reduce((s, c) => s + getComponentStat(c).emission, 0);

  // Power
  const powerPlant = loadout["Power Plant"];
  const powerGen = powerPlant ? Math.abs(getComponentStat(powerPlant).power) : 0;
  const weaponPowerDraw = Object.values(saved.hardpoints).reduce((s, name) => {
    if (!name) return s;
    const w = weapons.find(x => x.name === name || name.includes(x.name));
    return s + (w?.powerDraw ?? 0);
  }, 0);
  const powerUsed = installed
    .filter(c => c.type !== "Power Plant")
    .reduce((s, c) => s + Math.abs(Math.min(0, getComponentStat(c).power)), 0) + weaponPowerDraw;
  const powerBalance = powerGen - powerUsed;

  // DPS
  const totalDps = Object.values(saved.hardpoints).reduce((s, name) => {
    if (!name) return s;
    const w = weapons.find(x => x.name === name || name.includes(x.name));
    if (!w) return s;
    return s + (w.dps ?? Math.round(w.damage * w.rof / 60));
  }, 0);

  // Cooling
  const cooler = loadout["Cooler"];
  const coolingGen = cooler ? Math.abs(getComponentStat(cooler).cooling) : 0;
  const weaponHeat = Object.values(saved.hardpoints).reduce((s, name) => {
    if (!name) return s;
    const w = weapons.find(x => x.name === name || name.includes(x.name));
    return s + ((w?.heatPerShot ?? 0) * (w?.rof ?? 0) / 60);
  }, 0);
  const heatGen = installed
    .filter(c => c.type !== "Cooler")
    .reduce((s, c) => s + Math.abs(Math.min(0, getComponentStat(c).cooling)), 0) + Math.round(weaponHeat);
  const coolingBalance = coolingGen - heatGen;

  return { powerBalance, powerGen, powerUsed, totalDps, coolingBalance, coolingGen, heatGen, totalEmission, loadout };
}

const DiffIndicator = ({ a, b, higherIsBetter = true }: { a: number; b: number; higherIsBetter?: boolean }) => {
  if (a === b) return <Minus className="h-3 w-3 text-muted-foreground" />;
  const aIsBetter = higherIsBetter ? a > b : a < b;
  return aIsBetter
    ? <ArrowUp className="h-3 w-3 text-emerald-400" />
    : <ArrowDown className="h-3 w-3 text-red-400" />;
};

interface Props {
  configA: SavedLoadout;
  configB: SavedLoadout;
  ship: ShipDetailed;
  allComponents: ShipComponent[];
  onClose: () => void;
}

const LoadoutCompare = ({ configA, configB, ship, allComponents, onClose }: Props) => {
  const statsA = computeLoadoutStats(configA, ship, allComponents);
  const statsB = computeLoadoutStats(configB, ship, allComponents);

  const statRows: { label: string; icon: typeof Zap; a: number; b: number; unit: string; higherIsBetter: boolean }[] = [
    { label: "Énergie", icon: Zap, a: statsA.powerBalance, b: statsB.powerBalance, unit: "pwr", higherIsBetter: true },
    { label: "Puissance générée", icon: Zap, a: statsA.powerGen, b: statsB.powerGen, unit: "", higherIsBetter: true },
    { label: "Puissance utilisée", icon: Zap, a: statsA.powerUsed, b: statsB.powerUsed, unit: "", higherIsBetter: false },
    { label: "DPS Total", icon: Crosshair, a: statsA.totalDps, b: statsB.totalDps, unit: "", higherIsBetter: true },
    { label: "Refroidissement", icon: Thermometer, a: statsA.coolingBalance, b: statsB.coolingBalance, unit: "cool", higherIsBetter: true },
    { label: "Capacité refroid.", icon: Thermometer, a: statsA.coolingGen, b: statsB.coolingGen, unit: "", higherIsBetter: true },
    { label: "Chaleur générée", icon: Thermometer, a: statsA.heatGen, b: statsB.heatGen, unit: "", higherIsBetter: false },
    { label: "Signatures", icon: Eye, a: statsA.totalEmission, b: statsB.totalEmission, unit: "", higherIsBetter: false },
  ];

  // Component differences
  const allTypes = [...new Set([...Object.keys(statsA.loadout), ...Object.keys(statsB.loadout)])];

  // Weapon differences
  const hpIndices = [...new Set([
    ...Object.keys(configA.hardpoints).map(Number),
    ...Object.keys(configB.hardpoints).map(Number),
  ])].sort((a, b) => a - b);

  return (
    <div className="mb-8 rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 bg-secondary/30 px-5 py-3">
        <span className="text-sm font-semibold text-foreground">Comparaison de configurations</span>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Config names header */}
      <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-border/30 bg-secondary/10">
        <div className="px-4 py-3" />
        <div className="px-4 py-3 text-center border-x border-border/20">
          <p className="font-display text-sm font-bold text-primary truncate">{configA.name}</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="font-display text-sm font-bold text-accent truncate">{configB.name}</p>
        </div>
      </div>

      {/* Stats comparison */}
      <div className="divide-y divide-border/20">
        {statRows.map(row => {
          const aBetter = row.higherIsBetter ? row.a > row.b : row.a < row.b;
          const bBetter = row.higherIsBetter ? row.b > row.a : row.b < row.a;
          const equal = row.a === row.b;
          return (
            <div key={row.label} className="grid grid-cols-[1fr_1fr_1fr] items-center">
              <div className="flex items-center gap-2 px-4 py-2.5">
                <row.icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">{row.label}</span>
              </div>
              <div className={`flex items-center justify-center gap-1.5 px-4 py-2.5 border-x border-border/20 ${aBetter ? "bg-emerald-500/5" : ""}`}>
                <DiffIndicator a={row.a} b={row.b} higherIsBetter={row.higherIsBetter} />
                <span className={`font-display text-sm font-bold ${aBetter ? "text-emerald-400" : equal ? "text-foreground" : "text-red-400"}`}>
                  {row.a.toLocaleString()}
                </span>
                {row.unit && <span className="text-[10px] text-muted-foreground">{row.unit}</span>}
              </div>
              <div className={`flex items-center justify-center gap-1.5 px-4 py-2.5 ${bBetter ? "bg-emerald-500/5" : ""}`}>
                <DiffIndicator a={row.b} b={row.a} higherIsBetter={row.higherIsBetter} />
                <span className={`font-display text-sm font-bold ${bBetter ? "text-emerald-400" : equal ? "text-foreground" : "text-red-400"}`}>
                  {row.b.toLocaleString()}
                </span>
                {row.unit && <span className="text-[10px] text-muted-foreground">{row.unit}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Component differences */}
      <div className="border-t border-border/50">
        <div className="px-4 py-2.5 bg-secondary/20">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Composants</span>
        </div>
        <div className="divide-y divide-border/20">
          {allTypes.map(type => {
            const compA = statsA.loadout[type];
            const compB = statsB.loadout[type];
            const isDifferent = compA?.name !== compB?.name;
            return (
              <div key={type} className={`grid grid-cols-[1fr_1fr_1fr] items-center ${isDifferent ? "bg-accent/5" : ""}`}>
                <div className="px-4 py-2 text-xs font-medium text-muted-foreground">{type}</div>
                <div className="px-4 py-2 text-center border-x border-border/20">
                  <p className={`text-xs ${isDifferent ? "font-semibold text-foreground" : "text-muted-foreground"} truncate`}>
                    {compA?.name ?? "—"}
                  </p>
                  {compA && <p className="text-[10px] text-muted-foreground">{compA.grade}</p>}
                </div>
                <div className="px-4 py-2 text-center">
                  <p className={`text-xs ${isDifferent ? "font-semibold text-foreground" : "text-muted-foreground"} truncate`}>
                    {compB?.name ?? "—"}
                  </p>
                  {compB && <p className="text-[10px] text-muted-foreground">{compB.grade}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hardpoint differences */}
      <div className="border-t border-border/50">
        <div className="px-4 py-2.5 bg-secondary/20">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Armes</span>
        </div>
        <div className="divide-y divide-border/20">
          {hpIndices.map(i => {
            const hp = ship.hardpoints[i];
            if (!hp) return null;
            const wA = configA.hardpoints[i] || null;
            const wB = configB.hardpoints[i] || null;
            const isDifferent = wA !== wB;
            return (
              <div key={i} className={`grid grid-cols-[1fr_1fr_1fr] items-center ${isDifferent ? "bg-accent/5" : ""}`}>
                <div className="px-4 py-2">
                  <p className="text-xs font-medium text-muted-foreground">{hp.slot}</p>
                  <p className="text-[10px] text-muted-foreground">S{hp.size}</p>
                </div>
                <div className="px-4 py-2 text-center border-x border-border/20">
                  <p className={`text-xs truncate ${isDifferent ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                    {wA || <span className="italic">Vide</span>}
                  </p>
                </div>
                <div className="px-4 py-2 text-center">
                  <p className={`text-xs truncate ${isDifferent ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                    {wB || <span className="italic">Vide</span>}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LoadoutCompare;
