import { useState, useMemo } from "react";
import {
  Gem, ChevronDown, ChevronUp,
  TrendingUp, Clock, Coins, AlertTriangle, RotateCcw, Info,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import heroBg from "@/assets/hero-bg.jpg";
import {
  ORES, REFINING_METHODS, REFINERY_STATIONS,
  computeRefineResult, formatDuration, formatAUEC,
  RARITY_LABELS, RARITY_COLORS,
  type Ore, type RefiningMethod,
} from "@/data/refining";

// ─── Rating dots ──────────────────────────────────────────────────────────────

const RatingDots = ({ value, color }: { value: 1 | 2 | 3 | 4 | 5; color: string }) => (
  <span className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`h-1.5 w-1.5 rounded-full transition-colors ${
          i < value ? color : "bg-muted-foreground/20"
        }`}
      />
    ))}
  </span>
);

// ─── Ore row ──────────────────────────────────────────────────────────────────

const OreRow = ({
  ore,
  quantity,
  onChange,
}: {
  ore: Ore;
  quantity: number;
  onChange: (id: string, val: number) => void;
}) => {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-all ${
        quantity > 0
          ? `${ore.color} bg-opacity-100`
          : "border-border/40 bg-card/40"
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-bold ${quantity > 0 ? "" : "text-muted-foreground"}`}>
            {ore.shortName}
          </span>
          {ore.decays && (
            <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0" title="Se dégrade avec le temps" />
          )}
        </div>
        <p className="text-[10px] text-muted-foreground truncate">{ore.name}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onChange(ore.id, Math.max(0, quantity - 1))}
          className="flex h-6 w-6 items-center justify-center rounded border border-border/50 bg-background/60 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
        >
          <ChevronDown className="h-3 w-3" />
        </button>
        <input
          type="number"
          min={0}
          max={9999}
          value={quantity || ""}
          placeholder="0"
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            onChange(ore.id, isNaN(val) || val < 0 ? 0 : val);
          }}
          className="h-6 w-14 rounded border border-border/50 bg-background/60 px-1.5 text-center text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
        />
        <button
          onClick={() => onChange(ore.id, quantity + 1)}
          className="flex h-6 w-6 items-center justify-center rounded border border-border/50 bg-background/60 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
        >
          <ChevronUp className="h-3 w-3" />
        </button>
        <span className="w-7 text-right text-[10px] text-muted-foreground">SCU</span>
      </div>
    </div>
  );
};

// ─── Method card ──────────────────────────────────────────────────────────────

const MethodCard = ({
  method,
  selected,
  onClick,
}: {
  method: RefiningMethod;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`group flex flex-col gap-2 rounded-lg border p-3 text-left transition-all duration-200 ${
      selected
        ? "border-primary/60 bg-primary/10 shadow-[0_0_16px_hsl(var(--primary)/0.1)]"
        : "border-border/50 bg-card/40 hover:border-primary/30 hover:bg-card/70"
    }`}
  >
    <div className="flex items-start justify-between gap-2">
      <span className={`text-sm font-semibold leading-tight ${selected ? "text-primary" : "text-foreground"}`}>
        {method.name}
      </span>
      <span className={`shrink-0 text-xs font-bold ${selected ? "text-primary" : "text-muted-foreground"}`}>
        {Math.round(method.yieldFactor * 100)}%
      </span>
    </div>
    <p className="text-[10px] leading-relaxed text-muted-foreground line-clamp-2">{method.description}</p>
    <div className="flex items-center gap-3 pt-0.5">
      <div className="flex flex-col gap-0.5">
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60">Rend.</span>
        <RatingDots value={method.yieldRating} color="bg-emerald-400" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60">Vit.</span>
        <RatingDots value={method.speedRating} color="bg-blue-400" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60">Coût</span>
        <RatingDots value={method.costRating} color="bg-amber-400" />
      </div>
    </div>
  </button>
);

// ─── Result row ───────────────────────────────────────────────────────────────

const ResultRow = ({ ore, rawSCU, method }: { ore: Ore; rawSCU: number; method: RefiningMethod }) => {
  const r = computeRefineResult(ore, rawSCU, method);
  const profitable = r.profitAUEC > 0;
  return (
    <div className={`rounded-lg border px-3 py-2.5 ${ore.color}`}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{ore.shortName}</span>
          {ore.decays && <AlertTriangle className="h-3 w-3 text-amber-400" />}
          <span className="text-xs text-muted-foreground">{ore.name}</span>
        </div>
        <span className={`text-sm font-bold ${profitable ? "text-emerald-400" : "text-red-400"}`}>
          {profitable ? "+" : ""}{formatAUEC(r.profitAUEC)}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div>
          <p className="text-[10px] text-muted-foreground">Brut → Raffiné</p>
          <p className="font-semibold text-foreground">
            {rawSCU} → <span className="text-primary">{r.outputSCU.toFixed(1)}</span> SCU
          </p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-2.5 w-2.5" />Durée</p>
          <p className="font-semibold text-foreground">{formatDuration(r.timeSeconds)}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Coins className="h-2.5 w-2.5" />Coût</p>
          <p className="font-semibold text-foreground">{formatAUEC(r.costAUEC)}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1"><TrendingUp className="h-2.5 w-2.5" />Valeur brute</p>
          <p className="font-semibold text-foreground">{formatAUEC(r.grossValueAUEC)}</p>
        </div>
      </div>
    </div>
  );
};

// ─── Comparison table ─────────────────────────────────────────────────────────

const ComparisonTable = ({ ores, quantities }: { ores: Ore[]; quantities: Record<string, number> }) => {
  const activeOres = ores.filter(o => (quantities[o.id] ?? 0) > 0);
  if (activeOres.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border/50">
            <th className="pb-2 text-left font-medium text-muted-foreground">Méthode</th>
            <th className="pb-2 text-right font-medium text-muted-foreground">Rendement</th>
            <th className="pb-2 text-right font-medium text-muted-foreground">Durée totale</th>
            <th className="pb-2 text-right font-medium text-muted-foreground">Coût total</th>
            <th className="pb-2 text-right font-medium text-muted-foreground">Profit</th>
          </tr>
        </thead>
        <tbody>
          {REFINING_METHODS.map(method => {
            const results = activeOres.map(ore =>
              computeRefineResult(ore, quantities[ore.id] ?? 0, method)
            );
            const totalTime    = Math.max(...results.map(r => r.timeSeconds));
            const totalCost    = results.reduce((s, r) => s + r.costAUEC, 0);
            const totalProfit  = results.reduce((s, r) => s + r.profitAUEC, 0);
            const avgYield     = Math.round(method.yieldFactor * 100);
            const profitable   = totalProfit > 0;

            return (
              <tr key={method.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                <td className="py-2 font-medium text-foreground">{method.name}</td>
                <td className="py-2 text-right text-muted-foreground">{avgYield}%</td>
                <td className="py-2 text-right text-muted-foreground">{formatDuration(totalTime)}</td>
                <td className="py-2 text-right text-muted-foreground">{formatAUEC(totalCost)}</td>
                <td className={`py-2 text-right font-semibold ${profitable ? "text-emerald-400" : "text-red-400"}`}>
                  {profitable ? "+" : ""}{formatAUEC(totalProfit)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const RARITY_ORDER = ["exceptional", "rare", "uncommon", "common"] as const;

const RefiningSimulator = () => {
  const { t } = useTranslation();

  const [quantities, setQuantities]       = useState<Record<string, number>>({});
  const [selectedMethod, setSelectedMethod] = useState<string>("clesci");
  const [selectedStation, setSelectedStation] = useState<string>("cl1");
  const [rarityFilter, setRarityFilter]   = useState<string>("all");
  const [showComparison, setShowComparison] = useState(false);

  const method = useMemo(
    () => REFINING_METHODS.find(m => m.id === selectedMethod) ?? REFINING_METHODS[0],
    [selectedMethod]
  );

  const handleQuantity = (id: string, val: number) =>
    setQuantities(prev => ({ ...prev, [id]: val }));

  const handleReset = () => setQuantities({});

  const activeOres = useMemo(
    () => ORES.filter(o => (quantities[o.id] ?? 0) > 0),
    [quantities]
  );

  const totals = useMemo(() => {
    if (activeOres.length === 0) return null;
    const results = activeOres.map(ore => computeRefineResult(ore, quantities[ore.id] ?? 0, method));
    return {
      time:    Math.max(...results.map(r => r.timeSeconds)), // parallel jobs
      cost:    results.reduce((s, r) => s + r.costAUEC, 0),
      gross:   results.reduce((s, r) => s + r.grossValueAUEC, 0),
      profit:  results.reduce((s, r) => s + r.profitAUEC, 0),
      results,
    };
  }, [activeOres, quantities, method]);

  const filteredOres = useMemo(
    () => rarityFilter === "all" ? ORES : ORES.filter(o => o.rarity === rarityFilter),
    [rarityFilter]
  );

  const totalRawSCU = useMemo(
    () => Object.values(quantities).reduce((s, v) => s + v, 0),
    [quantities]
  );

  return (
    <div className="relative min-h-screen bg-background">
      {/* Hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[22vh] overflow-hidden">
        <img src={heroBg} alt="" aria-hidden className="h-full w-full object-cover opacity-30" style={{ objectPosition: "50% 40%" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex min-h-[20vh] items-center">
        <div className="container pb-2 pt-8">
          <div className="mb-1 flex items-center gap-2">
            <Gem className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("tools.hub.overline")}</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">{t("tools.refining.title")}</h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">{t("tools.refining.subtitle")}</p>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 container pb-12 pt-2">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr_340px]">

          {/* ── Column 1 : Ore inputs ──────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {/* Station selector */}
            <div className="rounded-xl border border-border/50 bg-card/60 p-4">
              <h2 className="mb-3 text-sm font-semibold text-foreground">{t("tools.refining.station")}</h2>
              <select
                value={selectedStation}
                onChange={e => setSelectedStation(e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-background px-2 text-xs text-foreground focus:border-primary/50 focus:outline-none"
              >
                {REFINERY_STATIONS.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Ore list */}
            <div className="rounded-xl border border-border/50 bg-card/60 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">{t("tools.refining.ores")}</h2>
                {totalRawSCU > 0 && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" /> {t("tools.refining.reset")}
                  </button>
                )}
              </div>

              {/* Rarity filter */}
              <div className="mb-3 flex flex-wrap gap-1">
                {["all", ...RARITY_ORDER].map(r => (
                  <button
                    key={r}
                    onClick={() => setRarityFilter(r)}
                    className={`rounded px-2 py-0.5 text-[10px] font-medium transition-all border ${
                      rarityFilter === r
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border/30 bg-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r === "all" ? t("common.all") : RARITY_LABELS[r]}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                {filteredOres.map(ore => (
                  <OreRow
                    key={ore.id}
                    ore={ore}
                    quantity={quantities[ore.id] ?? 0}
                    onChange={handleQuantity}
                  />
                ))}
              </div>

              {totalRawSCU > 0 && (
                <div className="mt-3 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
                  <span className="text-xs text-muted-foreground">Total brut</span>
                  <span className="text-sm font-bold text-primary">{totalRawSCU} SCU</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Column 2 : Method selector ─────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-border/50 bg-card/60 p-4">
              <h2 className="mb-3 text-sm font-semibold text-foreground">{t("tools.refining.method")}</h2>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {REFINING_METHODS.map(m => (
                  <MethodCard
                    key={m.id}
                    method={m}
                    selected={selectedMethod === m.id}
                    onClick={() => setSelectedMethod(m.id)}
                  />
                ))}
              </div>
            </div>

            {/* Comparison toggle */}
            {activeOres.length > 0 && (
              <div className="rounded-xl border border-border/50 bg-card/60 p-4">
                <button
                  onClick={() => setShowComparison(v => !v)}
                  className="mb-3 flex w-full items-center justify-between text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    {t("tools.refining.comparison")}
                  </span>
                  {showComparison ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {showComparison && (
                  <ComparisonTable ores={ORES} quantities={quantities} />
                )}
              </div>
            )}

            {/* Empty state */}
            {activeOres.length === 0 && (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-border/40 bg-card/30 py-16 text-center">
                <Gem className="mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">{t("tools.refining.emptyHint")}</p>
              </div>
            )}
          </div>

          {/* ── Column 3 : Results ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {totals ? (
              <>
                {/* Summary card */}
                <div className="rounded-xl border border-border/50 bg-card/60 p-4">
                  <h2 className="mb-3 text-sm font-semibold text-foreground">{t("tools.refining.summary")}</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-border/40 bg-background/60 p-3">
                      <p className="mb-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" /> {t("tools.refining.duration")}
                      </p>
                      <p className="text-lg font-bold text-foreground">{formatDuration(totals.time)}</p>
                      <p className="text-[10px] text-muted-foreground">en parallèle</p>
                    </div>
                    <div className="rounded-lg border border-border/40 bg-background/60 p-3">
                      <p className="mb-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Coins className="h-3 w-3" /> {t("tools.refining.cost")}
                      </p>
                      <p className="text-lg font-bold text-foreground">{formatAUEC(totals.cost)}</p>
                    </div>
                    <div className="rounded-lg border border-border/40 bg-background/60 p-3">
                      <p className="mb-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                        <TrendingUp className="h-3 w-3" /> {t("tools.refining.grossValue")}
                      </p>
                      <p className="text-lg font-bold text-foreground">{formatAUEC(totals.gross)}</p>
                    </div>
                    <div className={`rounded-lg border p-3 ${
                      totals.profit >= 0
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-red-500/30 bg-red-500/5"
                    }`}>
                      <p className="mb-1 text-[10px] text-muted-foreground">{t("tools.refining.profit")}</p>
                      <p className={`text-lg font-bold ${totals.profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {totals.profit >= 0 ? "+" : ""}{formatAUEC(totals.profit)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quantanium warning */}
                {activeOres.some(o => o.decays) && (
                  <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <p className="text-xs text-amber-300/80">{t("tools.refining.decayWarning")}</p>
                  </div>
                )}

                {/* Per-ore details */}
                <div className="rounded-xl border border-border/50 bg-card/60 p-4">
                  <h2 className="mb-3 text-sm font-semibold text-foreground">{t("tools.refining.perOre")}</h2>
                  <div className="flex flex-col gap-2">
                    {totals.results.map(r => {
                      const ore = ORES.find(o => o.id === r.oreId)!;
                      return (
                        <ResultRow
                          key={ore.id}
                          ore={ore}
                          rawSCU={quantities[ore.id] ?? 0}
                          method={method}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Info note */}
                <div className="flex items-start gap-2 rounded-lg border border-border/30 bg-card/40 p-3">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                  <p className="text-[10px] text-muted-foreground/60 leading-relaxed">{t("tools.refining.disclaimer")}</p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-border/40 bg-card/30 py-16 text-center">
                <Gem className="mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">{t("tools.refining.resultsEmpty")}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default RefiningSimulator;
