import { useState, useMemo } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Shield, Zap, Thermometer, Crosshair, Eye, Wrench, RotateCcw, Share2, ClipboardList, Save, FolderOpen, Trash2, X, GitCompare } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { getShipById, ShipComponent } from "@/data/ships-detailed";
import { ships } from "@/data/ships";
import { weapons, Weapon } from "@/data/weapons";
import LoadoutCompare from "@/components/LoadoutCompare";

// --- Saved loadout types & helpers ---
interface SavedLoadout {
  name: string;
  timestamp: number;
  components: Record<string, string>; // type -> component name
  hardpoints: Record<number, string | null>; // index -> weapon name
}

function getSavedLoadouts(shipId: string): SavedLoadout[] {
  try {
    const raw = localStorage.getItem(`loadouts_${shipId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function setSavedLoadouts(shipId: string, loadouts: SavedLoadout[]) {
  localStorage.setItem(`loadouts_${shipId}`, JSON.stringify(loadouts));
}

// Simulated stats per component grade
const gradeMultipliers: Record<string, number> = { A: 1.0, B: 0.75, C: 0.5, D: 0.3 };

const componentStats: Record<string, { basePower: number; baseCooling: number; baseEmission: number }> = {
  "Power Plant": { basePower: 3000, baseCooling: 0, baseEmission: 200 },
  Shield: { basePower: -800, baseCooling: -100, baseEmission: 150 },
  Cooler: { basePower: -200, baseCooling: 2000, baseEmission: 50 },
  "Quantum Drive": { basePower: -500, baseCooling: -200, baseEmission: 100 },
  Radar: { basePower: -150, baseCooling: -50, baseEmission: 80 },
  Weapon: { basePower: -300, baseCooling: -150, baseEmission: 120 },
  "Missile Rack": { basePower: -100, baseCooling: -50, baseEmission: 60 },
};

const sizeMultipliers: Record<string, number> = { S: 1, M: 2, L: 3.5 };

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

const typeIcons: Record<string, typeof Shield> = {
  Shield, "Power Plant": Zap, Cooler: Thermometer, "Quantum Drive": Zap, Radar: Eye, Weapon: Crosshair, "Missile Rack": Crosshair,
};

const gradeColors: Record<string, string> = {
  A: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  B: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  C: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  D: "text-muted-foreground border-border bg-secondary",
};

const StatBar = ({ label, value, max, color, unit, icon: Icon }: {
  label: string; value: number; max: number; color: string; unit: string; icon: typeof Zap;
}) => {
  const pct = Math.min(Math.abs(value) / max * 100, 100);
  const isNegative = value < 0;
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
        </div>
        <span className={`font-display text-sm font-bold ${isNegative ? "text-red-400" : color}`}>
          {isNegative ? "" : "+"}{value.toLocaleString()} {unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${isNegative ? "bg-red-500/60" : color.replace("text-", "bg-").replace("400", "500/60")}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const ShipLoadout = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const ship = id ? getShipById(id) : undefined;
  const shipBasic = id ? ships.find(s => s.id === id) : undefined;

  const allComponents = useMemo(() => {
    if (!ship) return [];
    return [...ship.defaultComponents, ...ship.compatibleComponents];
  }, [ship]);

  const componentsByType = useMemo(() => {
    const map: Record<string, ShipComponent[]> = {};
    allComponents.forEach(c => {
      if (!map[c.type]) map[c.type] = [];
      if (!map[c.type].find(x => x.name === c.name)) map[c.type].push(c);
    });
    return map;
  }, [allComponents]);

  const [loadout, setLoadout] = useState<Record<string, ShipComponent>>(() => {
    if (!ship) return {};
    const initial: Record<string, ShipComponent> = {};
    ship.defaultComponents.forEach(c => { initial[c.type] = c; });
    // Restore from URL params
    allComponents.forEach(c => {
      const paramKey = `c_${c.type.replace(/\s/g, "_")}`;
      const paramVal = searchParams.get(paramKey);
      if (paramVal && paramVal === c.name) initial[c.type] = c;
    });
    return initial;
  });

  // Hardpoint weapon state: index -> weapon name or null
  const [hardpointWeapons, setHardpointWeapons] = useState<Record<number, string | null>>(() => {
    if (!ship) return {};
    const initial: Record<number, string | null> = {};
    ship.hardpoints.forEach((hp, i) => {
      const paramVal = searchParams.get(`h_${i}`);
      initial[i] = paramVal || hp.equipped || null;
    });
    return initial;
  });

  // Available ship weapons grouped by compatible size
  const shipWeapons = useMemo(() => {
    return weapons.filter(w => w.category === "Ship" && !["Missile"].includes(w.type));
  }, []);

  // Saved loadouts state
  const [savedLoadouts, setSavedLoadoutsState] = useState<SavedLoadout[]>(() => id ? getSavedLoadouts(id) : []);
  const [saveName, setSaveName] = useState("");
  const [showSaves, setShowSaves] = useState(false);
  const [compareSelection, setCompareSelection] = useState<number[]>([]);

  const { t } = useTranslation();

  if (!ship) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">{t("loadout.shipNotFound")}</h1>
        <Link to="/ships" className="mt-4 text-primary hover:underline">← {t("loadout.backToShips")}</Link>
      </div>
    );
  }

  const handleSelect = (type: string, comp: ShipComponent) => {
    setLoadout(prev => ({ ...prev, [type]: comp }));
  };

  const resetLoadout = () => {
    const initial: Record<string, ShipComponent> = {};
    ship.defaultComponents.forEach(c => { initial[c.type] = c; });
    setLoadout(initial);
    const initialHp: Record<number, string | null> = {};
    ship.hardpoints.forEach((hp, i) => { initialHp[i] = hp.equipped || null; });
    setHardpointWeapons(initialHp);
  };

  const handleWeaponChange = (index: number, weaponName: string | null) => {
    setHardpointWeapons(prev => ({ ...prev, [index]: weaponName }));
  };

  // Build shareable URL
  const generateShareUrl = () => {
    const params = new URLSearchParams();
    Object.entries(loadout).forEach(([type, comp]) => {
      params.set(`c_${type.replace(/\s/g, "_")}`, comp.name);
    });
    Object.entries(hardpointWeapons).forEach(([idx, name]) => {
      if (name) params.set(`h_${idx}`, name);
    });
    return `${window.location.origin}/ships/${id}/loadout?${params.toString()}`;
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(generateShareUrl());
    toast.success(t("loadout.linkCopied"));
  };

  const copyTextSummary = () => {
    const lines = [`⚙️ ${ship.name} — Configuration`];
    lines.push(`${ship.manufacturer} · ${ship.role}\n`);
    lines.push(`📦 ${t("loadout.componentsLabel")}`);
    Object.entries(loadout).forEach(([type, comp]) => {
      lines.push(`  ${type}: ${comp.name} [${comp.grade}] (${comp.manufacturer})`);
    });
    lines.push(`\n🔫 ${t("loadout.weaponsLabel")}`);
    ship.hardpoints.forEach((hp, i) => {
      const wName = hardpointWeapons[i];
      lines.push(`  ${hp.slot} (S${hp.size}): ${wName || t("loadout.empty")}`);
    });
    lines.push(`\n📊 ${t("loadout.statsLabel")}`);
    lines.push(`  ${t("loadout.energy")}: ${powerBalance >= 0 ? "+" : ""}${powerBalance}`);
    lines.push(`  DPS: ${totalDps}`);
    lines.push(`  ${t("loadout.cooling")}: ${coolingBalance >= 0 ? "+" : ""}${coolingBalance}`);
    lines.push(`  ${t("loadout.signatures")}: ${totalEmission}`);
    navigator.clipboard.writeText(lines.join("\n"));
    toast.success(t("loadout.configCopied"));
  };

  const saveCurrentLoadout = () => {
    if (!id) return;
    const name = saveName.trim() || `Config ${savedLoadouts.length + 1}`;
    const entry: SavedLoadout = {
      name,
      timestamp: Date.now(),
      components: Object.fromEntries(Object.entries(loadout).map(([t, c]) => [t, c.name])),
      hardpoints: { ...hardpointWeapons },
    };
    const updated = [...savedLoadouts, entry];
    setSavedLoadoutsState(updated);
    setSavedLoadouts(id, updated);
    setSaveName("");
    toast.success(t("loadout.savedSuccess", { name }));
  };

  const loadSavedLoadout = (saved: SavedLoadout) => {
    const restored: Record<string, ShipComponent> = {};
    ship.defaultComponents.forEach(c => { restored[c.type] = c; });
    allComponents.forEach(c => {
      if (saved.components[c.type] === c.name) restored[c.type] = c;
    });
    setLoadout(restored);
    const restoredHp: Record<number, string | null> = {};
    ship.hardpoints.forEach((hp, i) => {
      restoredHp[i] = saved.hardpoints[i] ?? hp.equipped ?? null;
    });
    setHardpointWeapons(restoredHp);
    toast.success(t("loadout.loadedSuccess", { name: saved.name }));
  };

  const deleteSavedLoadout = (index: number) => {
    if (!id) return;
    const updated = savedLoadouts.filter((_, i) => i !== index);
    setSavedLoadoutsState(updated);
    setSavedLoadouts(id, updated);
    toast.success(t("loadout.deletedSuccess"));
  };

  const toggleCompareSelection = (index: number) => {
    setCompareSelection(prev => {
      if (prev.includes(index)) return prev.filter(i => i !== index);
      if (prev.length >= 2) return [prev[1], index];
      return [...prev, index];
    });
  };

  const getWeaponByName = (name: string | null): Weapon | undefined => {
    if (!name) return undefined;
    return weapons.find(w => w.name === name || name.includes(w.name));
  };

  // Calculate stats
  const installedComponents = Object.values(loadout);
  const totalPower = installedComponents.reduce((sum, c) => sum + getComponentStat(c).power, 0);
  const totalCooling = installedComponents.reduce((sum, c) => sum + getComponentStat(c).cooling, 0);
  const totalEmission = installedComponents.reduce((sum, c) => sum + getComponentStat(c).emission, 0);

  // DPS from configurable hardpoints
  const totalDps = Object.entries(hardpointWeapons).reduce((sum, [, weaponName]) => {
    const w = getWeaponByName(weaponName);
    return sum + (w?.dps ?? Math.round((w?.damage ?? 0) * (w?.rof ?? 0) / 60));
  }, 0);

  // Power/heat from weapons on hardpoints
  const weaponPowerDraw = Object.values(hardpointWeapons).reduce((sum, name) => {
    const w = getWeaponByName(name);
    return sum + (w?.powerDraw ?? 0);
  }, 0);
  const weaponHeat = Object.values(hardpointWeapons).reduce((sum, name) => {
    const w = getWeaponByName(name);
    return sum + ((w?.heatPerShot ?? 0) * (w?.rof ?? 0) / 60);
  }, 0);

  // Power balance (components + weapons)
  const powerPlant = loadout["Power Plant"];
  const powerGen = powerPlant ? Math.abs(getComponentStat(powerPlant).power) : 0;
  const powerUsed = installedComponents
    .filter(c => c.type !== "Power Plant")
    .reduce((sum, c) => sum + Math.abs(Math.min(0, getComponentStat(c).power)), 0) + weaponPowerDraw;
  const powerBalance = powerGen - powerUsed;

  // Cooling balance (components + weapon heat)
  const cooler = loadout["Cooler"];
  const coolingGen = cooler ? Math.abs(getComponentStat(cooler).cooling) : 0;
  const heatGen = installedComponents
    .filter(c => c.type !== "Cooler")
    .reduce((sum, c) => sum + Math.abs(Math.min(0, getComponentStat(c).cooling)), 0) + Math.round(weaponHeat);
  const coolingBalance = coolingGen - heatGen;

  const shipImage = shipBasic?.image;

  return (
    <div className="container py-8">
      <Link to={`/ships/${id}`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" />
        {t("loadout.backToShip")}
      </Link>

      {/* Hero */}
      <div className="relative mb-8 overflow-hidden rounded-xl border border-border bg-card">
        {shipImage && (
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <img src={shipImage} alt={ship.name} className="h-full w-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />
          </div>
        )}
        <div className={`relative ${shipImage ? "-mt-20" : ""} p-6 sm:p-8`}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("loadout.title")}</span>
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">{ship.name}</h1>
              <p className="text-sm text-muted-foreground">{ship.manufacturer} · {ship.role}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isAuthenticated ? (
                <button
                  onClick={() => setShowSaves(!showSaves)}
                  className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    showSaves ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  <FolderOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("loadout.myConfigs")}</span>
                  {savedLoadouts.length > 0 && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/20 px-1 text-[10px] font-bold text-primary">
                      {savedLoadouts.length}
                    </span>
                  )}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:border-primary/30"
                >
                  <FolderOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("loadout.loginToSave")}</span>
                </Link>
              )}
              <button
                onClick={copyTextSummary}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:border-primary/30"
              >
                <ClipboardList className="h-4 w-4" />
                <span className="hidden sm:inline">{t("loadout.copyText")}</span>
              </button>
              <button
                onClick={copyShareLink}
                className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">{t("loadout.share")}</span>
              </button>
              <button
                onClick={resetLoadout}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:border-primary/30"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">{t("loadout.reset")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save & Load panel */}
      {showSaves && (
        <div className="mb-8 rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/50 bg-secondary/30 px-5 py-3">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">{t("loadout.savedConfigs")}</span>
            </div>
            <button onClick={() => setShowSaves(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Save current */}
          <div className="flex items-center gap-3 border-b border-border/30 px-5 py-3">
            <input
              type="text"
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && saveCurrentLoadout()}
              placeholder={t("loadout.configNamePlaceholder")}
              className="flex-1 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
            />
            <button
              onClick={saveCurrentLoadout}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Save className="h-4 w-4" />
              {t("loadout.save")}
            </button>
          </div>

          {/* Saved list */}
          {savedLoadouts.length === 0 ? (
            <div className="px-5 py-6 text-center text-sm text-muted-foreground">
              {t("loadout.noSavedConfigs")}
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {savedLoadouts.map((saved, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/20 transition-colors">
                  {savedLoadouts.length >= 2 && (
                    <button
                      onClick={() => toggleCompareSelection(i)}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                        compareSelection.includes(i)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-transparent hover:border-primary/50"
                      }`}
                      title={t("loadout.compareSelection")}
                    >
                      <GitCompare className="h-3 w-3" />
                    </button>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-semibold text-foreground truncate">{saved.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {Object.keys(saved.components).length} {t("loadoutCompare.components").toLowerCase()} · {Object.values(saved.hardpoints).filter(Boolean).length} {t("loadoutCompare.weapons").toLowerCase()} · {new Date(saved.timestamp).toLocaleDateString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <button
                    onClick={() => loadSavedLoadout(saved)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                  >
                    <FolderOpen className="h-3 w-3" />
                    {t("common.load")}
                  </button>
                  <button
                    onClick={() => deleteSavedLoadout(i)}
                    className="inline-flex items-center rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:text-destructive hover:border-destructive/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Compare button */}
          {compareSelection.length === 2 && (
            <div className="border-t border-border/30 px-5 py-3 bg-secondary/20">
              <button
                onClick={() => setShowSaves(false)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <GitCompare className="h-4 w-4" />
                {t("loadout.compareBtn", { a: savedLoadouts[compareSelection[0]]?.name, b: savedLoadouts[compareSelection[1]]?.name })}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Compare view */}
      {compareSelection.length === 2 && !showSaves && savedLoadouts[compareSelection[0]] && savedLoadouts[compareSelection[1]] && (
        <LoadoutCompare
          configA={savedLoadouts[compareSelection[0]]}
          configB={savedLoadouts[compareSelection[1]]}
          ship={ship}
          allComponents={allComponents}
          onClose={() => setCompareSelection([])}
        />
      )}

      {/* Stats overview */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("loadout.energy")}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`font-display text-2xl font-bold ${powerBalance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {powerBalance >= 0 ? "+" : ""}{powerBalance.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">pwr</span>
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">
            <span className="text-emerald-400">{powerGen.toLocaleString()}</span> {t("loadout.generated")} · <span className="text-red-400">{powerUsed.toLocaleString()}</span> {t("loadout.used")}
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${powerBalance >= 0 ? "bg-emerald-500/70" : "bg-red-500/70"}`}
              style={{ width: `${Math.min((powerGen / (powerUsed || 1)) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Crosshair className="h-4 w-4 text-red-400" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("loadout.dpsTotal")}</span>
          </div>
          <span className="font-display text-2xl font-bold text-foreground">{totalDps.toLocaleString()}</span>
          <p className="mt-1 text-[11px] text-muted-foreground">{ship.hardpoints.filter(h => h.equipped).length} {t("loadout.armedLabel")}</p>
          <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-red-500/60" style={{ width: `${Math.min((totalDps / 3000) * 100, 100)}%` }} />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("loadout.cooling")}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`font-display text-2xl font-bold ${coolingBalance >= 0 ? "text-cyan-400" : "text-red-400"}`}>
              {coolingBalance >= 0 ? "+" : ""}{coolingBalance.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">cool</span>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            <span className="text-cyan-400">{coolingGen.toLocaleString()}</span> {t("loadout.capacity")} · <span className="text-red-400">{heatGen.toLocaleString()}</span> {t("loadout.heat")}
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${coolingBalance >= 0 ? "bg-cyan-500/70" : "bg-red-500/70"}`}
              style={{ width: `${Math.min((coolingGen / (heatGen || 1)) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-4 w-4 text-violet-400" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("loadout.signatures")}</span>
          </div>
          <span className="font-display text-2xl font-bold text-foreground">{totalEmission.toLocaleString()}</span>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {totalEmission < 500 ? t("loadout.stealth") : totalEmission < 1000 ? t("loadout.moderate") : t("loadout.detectable")}
          </p>
          <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-violet-500/60" style={{ width: `${Math.min((totalEmission / 2000) * 100, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Component slots */}
      <h2 className="mb-4 font-display text-lg font-semibold text-foreground">{t("loadout.installedComponents")}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(componentsByType).map(([type, options]) => {
          const current = loadout[type];
          const Icon = typeIcons[type] || Shield;
          const stats = current ? getComponentStat(current) : null;

          return (
            <div key={type} className="rounded-lg border border-border bg-card overflow-hidden">
              {/* Slot header */}
              <div className="flex items-center gap-2 border-b border-border/50 bg-secondary/30 px-4 py-3">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{type}</span>
                {current && (
                  <span className={`ml-auto inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${gradeColors[current.grade]}`}>
                    {current.grade}
                  </span>
                )}
              </div>

              {/* Current component info */}
              {current && stats && (
                <div className="px-4 py-3 border-b border-border/30">
                  <p className="font-display text-sm font-bold text-foreground">{current.name}</p>
                  <p className="text-[11px] text-muted-foreground">{current.manufacturer} · {t("loadout.taille")} {current.size}</p>
                  <div className="mt-2 flex gap-3 text-[10px]">
                    {stats.power !== 0 && (
                      <span className={stats.power > 0 ? "text-emerald-400" : "text-red-400"}>
                        <Zap className="inline h-3 w-3 mr-0.5" />{stats.power > 0 ? "+" : ""}{stats.power}
                      </span>
                    )}
                    {stats.cooling !== 0 && (
                      <span className={stats.cooling > 0 ? "text-cyan-400" : "text-red-400"}>
                        <Thermometer className="inline h-3 w-3 mr-0.5" />{stats.cooling > 0 ? "+" : ""}{stats.cooling}
                      </span>
                    )}
                    <span className="text-violet-400">
                      <Eye className="inline h-3 w-3 mr-0.5" />{stats.emission}
                    </span>
                  </div>
                </div>
              )}

              {/* Options */}
              <div className="max-h-48 overflow-y-auto">
                {options.map((comp) => {
                  const isActive = current?.name === comp.name;
                  return (
                    <button
                      key={comp.name}
                      onClick={() => handleSelect(type, comp)}
                      className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      <span className="flex-1 truncate">{comp.name}</span>
                      <span className="text-[10px] text-muted-foreground">{comp.manufacturer}</span>
                      <span className={`inline-flex rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${gradeColors[comp.grade]}`}>
                        {comp.grade}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hardpoints - configurable */}
      <h2 className="mt-8 mb-4 font-display text-lg font-semibold text-foreground">{t("loadout.hardpoints")}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ship.hardpoints.map((hp, i) => {
          const currentWeaponName = hardpointWeapons[i];
          const currentWeapon = getWeaponByName(currentWeaponName);
          const compatibleWeapons = shipWeapons.filter(w => {
            const wSize = typeof w.size === "string" ? parseInt(w.size) : w.size;
            return wSize <= hp.size && (hp.type === "Weapon" || hp.type === "Turret");
          });
          const isMissile = hp.type === "Missile";

          return (
            <div key={i} className="rounded-lg border border-border bg-card overflow-hidden">
              {/* Slot header */}
              <div className="flex items-center gap-2 border-b border-border/50 bg-gradient-to-r from-red-500/10 to-transparent px-4 py-3">
                <Crosshair className="h-4 w-4 text-red-400" />
                <span className="text-sm font-semibold text-foreground">{hp.slot}</span>
                <span className="ml-auto text-[10px] font-bold text-muted-foreground">S{hp.size} · {hp.type}</span>
              </div>

              {/* Current weapon info */}
              {currentWeapon && (
                <div className="px-4 py-3 border-b border-border/30">
                  <p className="font-display text-sm font-bold text-foreground">{currentWeapon.name}</p>
                  <p className="text-[11px] text-muted-foreground">{currentWeapon.manufacturer} · {currentWeapon.type}</p>
                  <div className="mt-2 flex gap-3 text-[10px]">
                    <span className="text-red-400">
                      <Crosshair className="inline h-3 w-3 mr-0.5" />DPS {currentWeapon.dps ?? Math.round(currentWeapon.damage * currentWeapon.rof / 60)}
                    </span>
                    {currentWeapon.powerDraw && (
                      <span className="text-amber-400">
                        <Zap className="inline h-3 w-3 mr-0.5" />-{currentWeapon.powerDraw}
                      </span>
                    )}
                    <span className="text-muted-foreground">{currentWeapon.range}m</span>
                  </div>
                </div>
              )}

              {/* Weapon selector */}
              {!isMissile ? (
                <div className="max-h-48 overflow-y-auto">
                  {/* Empty option */}
                  <button
                    onClick={() => handleWeaponChange(i, null)}
                    className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${
                      !currentWeaponName ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <span className="italic">{t("loadout.empty")}</span>
                  </button>
                  {compatibleWeapons.map((w) => {
                    const isActive = currentWeaponName === w.name;
                    const wDps = w.dps ?? Math.round(w.damage * w.rof / 60);
                    return (
                      <button
                        key={w.id}
                        onClick={() => handleWeaponChange(i, w.name)}
                        className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${
                          isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary/50"
                        }`}
                      >
                        <span className="flex-1 truncate">{w.name}</span>
                        <span className="text-[10px] text-muted-foreground">S{w.size}</span>
                        <span className="text-[10px] text-red-400">{wDps}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="px-4 py-3 text-xs text-muted-foreground italic">
                  {currentWeaponName || t("loadout.missileSlot")}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShipLoadout;
