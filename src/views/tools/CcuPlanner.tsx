'use client';
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  ArrowRight, Search, TrendingDown, TrendingUp, Rocket, Star,
  ChevronDown, ChevronRight, Info, RotateCcw, Plus, Trash2,
  BadgeDollarSign, Route, AlertCircle, CheckCircle2, Loader2,
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { apiFetch } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Ship {
  id:           number;
  name:         string;
  manufacturer: string;
  price:        number;   // USD — prix store actuel
}

interface Ccu {
  fromId: number;
  toId:   number;
  price:  number;
}

interface ChainStep {
  ccu:  Ccu;
  from: Ship;
  to:   Ship;
}

interface ApiShip {
  id:           number;
  name:         string;
  manufacturer: string | null;
  price:        number | null;
}

// ─── Algorithme Dijkstra ──────────────────────────────────────────────────────

interface DijkstraResult {
  cost:  number;
  steps: ChainStep[];
}

function findCheapestChain(
  fromId: number,
  toId:   number,
  ships:  Ship[],
  ccus:   Ccu[],
): DijkstraResult | null {
  const shipMap = new Map(ships.map((s) => [s.id, s]));

  const dist = new Map<number, number>();
  const prev = new Map<number, { ccu: Ccu; fromId: number } | null>();

  for (const s of ships) {
    dist.set(s.id, Infinity);
    prev.set(s.id, null);
  }
  dist.set(fromId, 0);

  const unvisited = new Set(ships.map((s) => s.id));

  while (unvisited.size > 0) {
    let u: number | null = null;
    let minDist = Infinity;
    for (const id of unvisited) {
      const d = dist.get(id) ?? Infinity;
      if (d < minDist) { minDist = d; u = id; }
    }
    if (u === null || minDist === Infinity) break;
    if (u === toId) break;
    unvisited.delete(u);

    for (const ccu of ccus) {
      if (ccu.fromId !== u) continue;
      const alt = (dist.get(u) ?? Infinity) + ccu.price;
      if (alt < (dist.get(ccu.toId) ?? Infinity)) {
        dist.set(ccu.toId, alt);
        prev.set(ccu.toId, { ccu, fromId: u });
      }
    }
  }

  const totalCost = dist.get(toId);
  if (totalCost === undefined || totalCost === Infinity) return null;

  const steps: ChainStep[] = [];
  let current = toId;
  while (prev.get(current) !== null && prev.get(current) !== undefined) {
    const entry = prev.get(current)!;
    if (!entry) break;
    const from = shipMap.get(entry.fromId)!;
    const to   = shipMap.get(current)!;
    steps.unshift({ ccu: entry.ccu, from, to });
    current = entry.fromId;
  }

  return { cost: totalCost, steps };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtUsd = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Génère tous les CCU possibles depuis les prix : prix(B) - prix(A) */
function buildCcus(ships: Ship[]): Ccu[] {
  const ccus: Ccu[] = [];
  for (let i = 0; i < ships.length; i++) {
    for (let j = 0; j < ships.length; j++) {
      if (i === j) continue;
      const diff = ships[j].price - ships[i].price;
      if (diff > 0) {
        ccus.push({ fromId: ships[i].id, toId: ships[j].id, price: diff });
      }
    }
  }
  return ccus;
}

// ─── ShipSelect ───────────────────────────────────────────────────────────────

const ShipSelect = ({
  value, onChange, placeholder, exclude, ships,
}: {
  value:       number | null;
  onChange:    (id: number) => void;
  placeholder: string;
  exclude?:    number | null;
  ships:       Ship[];
}) => {
  const [open,   setOpen]   = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => ships.filter(
      (s) => s.id !== exclude &&
        (s.name.toLowerCase().includes(search.toLowerCase()) ||
         s.manufacturer.toLowerCase().includes(search.toLowerCase())),
    ),
    [search, exclude, ships],
  );

  const selected = ships.find((s) => s.id === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-left text-sm transition-colors hover:border-primary/40"
      >
        <span className={selected ? "text-foreground font-medium" : "text-muted-foreground"}>
          {selected ? (
            <span className="flex items-center gap-2">
              <Rocket className="h-3.5 w-3.5 text-primary" />
              {selected.name}
              <span className="text-xs text-muted-foreground">— {fmtUsd(selected.price)}</span>
            </span>
          ) : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-lg border border-border bg-card shadow-xl">
          <div className="border-b border-border/50 p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher…"
                className="w-full rounded-md bg-secondary/50 py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.map((s) => (
              <button
                key={s.id}
                onClick={() => { onChange(s.id); setOpen(false); setSearch(""); }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-secondary ${
                  s.id === value ? "bg-primary/10 text-primary" : "text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Rocket className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground">{s.manufacturer}</span>
                </span>
                <span className="tabular-nums text-muted-foreground">{fmtUsd(s.price)}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-center text-xs text-muted-foreground">Aucun vaisseau trouvé</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Page principale ──────────────────────────────────────────────────────────

const CcuPlanner = () => {
  useSEO({ title: "Planificateur CCU", description: "Planifiez vos Cross-Chassis Upgrades pour optimiser votre flotte Star Citizen.", path: "/tools/ccu" });

  const [ships,       setShips]       = useState<Ship[]>([]);
  const [loadingShips, setLoadingShips] = useState(true);

  const [fromId,       setFromId]       = useState<number | null>(null);
  const [toId,         setToId]         = useState<number | null>(null);
  const [manualChain,  setManualChain]  = useState<number[]>([]);
  const [addShipId,    setAddShipId]    = useState<number | null>(null);

  // ── Chargement des vaisseaux depuis l'API ───────────────────────────────────
  useEffect(() => {
    apiFetch<{ items: ApiShip[] }>('/api/ships?pagesize=300&movementClass=Spaceship')
      .then((data) => {
        const withPrice: Ship[] = (data.items ?? (data as any))
          .filter((s: ApiShip) => s.price != null)
          .map((s: ApiShip) => ({
            id:           s.id,
            name:         s.name,
            manufacturer: s.manufacturer ?? '',
            price:        s.price!,
          }))
          .sort((a: Ship, b: Ship) => a.price - b.price);
        setShips(withPrice);
      })
      .catch(() => {})
      .finally(() => setLoadingShips(false));
  }, []);

  // ── CCU générés dynamiquement ───────────────────────────────────────────────
  const ccus = useMemo(() => buildCcus(ships), [ships]);

  // ── Calcul chaîne optimale ──────────────────────────────────────────────────
  const result = useMemo<DijkstraResult | null>(() => {
    if (!fromId || !toId || fromId === toId || ships.length === 0) return null;
    return findCheapestChain(fromId, toId, ships, ccus);
  }, [fromId, toId, ships, ccus]);

  const fromShip  = ships.find((s) => s.id === fromId);
  const toShip    = ships.find((s) => s.id === toId);
  const directBuy = toShip?.price ?? 0;
  // Tu possèdes déjà le vaisseau de départ — le coût de la chaîne est uniquement le coût CCU.
  // Économies = prix direct - coût CCU = valeur du vaisseau de départ que tu réutilises.
  const savings   = result ? directBuy - result.cost : 0;

  // ── Chaîne manuelle ─────────────────────────────────────────────────────────
  const addToManual = useCallback(() => {
    if (!addShipId) return;
    setManualChain((prev) => [...prev, addShipId]);
    setAddShipId(null);
  }, [addShipId]);

  const removeFromManual = useCallback((idx: number) => {
    setManualChain((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const manualSteps = useMemo(() => {
    const all = fromId ? [fromId, ...manualChain] : manualChain;
    const steps: { from: Ship; to: Ship; ccuPrice: number | null }[] = [];
    for (let i = 0; i < all.length - 1; i++) {
      const from = ships.find((s) => s.id === all[i]);
      const to   = ships.find((s) => s.id === all[i + 1]);
      if (!from || !to) continue;
      const diff = to.price - from.price;
      steps.push({ from, to, ccuPrice: diff > 0 ? diff : null });
    }
    return steps;
  }, [fromId, manualChain, ships]);

  const manualTotal = manualSteps.reduce(
    (acc, s) => acc + (s.ccuPrice ?? 0), 0,
  );
  const manualSavings = toId ? directBuy - manualTotal : 0;

  const reset = () => {
    setFromId(null); setToId(null); setManualChain([]); setAddShipId(null);
  };

  return (
    <div className="relative min-h-screen bg-background">

      {/* Hero image */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
        <img src="/hero-bg.jpg" alt="" aria-hidden="true"
          className="h-full w-full object-cover opacity-30"
          style={{ objectPosition: "50% 30%" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex min-h-[18vh] items-center">
        <div className="container pb-2 pt-8">
          <div className="mb-1 flex items-center gap-2">
            <Route className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Outils</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">Planificateur CCU</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Trouvez la chaîne de upgrades la moins chère pour atteindre votre vaisseau cible
          </p>
        </div>
      </div>

      <div className="relative z-10 container pb-12 pt-0">

        {loadingShips ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : ships.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <AlertCircle className="mb-3 h-10 w-10 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">
              Aucun vaisseau avec un prix disponible. Lancez la synchronisation des prix.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

            {/* ── Colonne gauche ── */}
            <div className="flex flex-col gap-6">

              {/* Config */}
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                    Configuration
                  </h2>
                  <button onClick={reset} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <RotateCcw className="h-3.5 w-3.5" /> Réinitialiser
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Vaisseau de départ
                    </label>
                    <ShipSelect
                      value={fromId}
                      onChange={setFromId}
                      placeholder="Choisir un vaisseau…"
                      exclude={toId}
                      ships={ships}
                    />
                    {fromShip && (
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        Prix store : <span className="text-foreground">{fmtUsd(fromShip.price)}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Vaisseau cible
                    </label>
                    <ShipSelect
                      value={toId}
                      onChange={setToId}
                      placeholder="Choisir un vaisseau…"
                      exclude={fromId}
                      ships={ships}
                    />
                    {toShip && (
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        Prix store : <span className="text-foreground">{fmtUsd(toShip.price)}</span>
                      </p>
                    )}
                  </div>
                </div>

                <p className="mt-3 flex items-start gap-1.5 text-[10px] text-muted-foreground/50">
                  <Info className="mt-0.5 h-3 w-3 shrink-0" />
                  {ships.length} vaisseaux chargés — prix synchronisés depuis le RSI Pledge Store
                </p>
              </div>

              {/* ── Résultat chaîne optimale ── */}
              {fromId && toId && (
                <div className="rounded-lg border border-border bg-card p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-primary" />
                    <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                      Chaîne optimale
                    </h2>
                  </div>

                  {result === null ? (
                    <div className="flex flex-col items-center py-8 text-center">
                      <AlertCircle className="mb-2 h-8 w-8 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">
                        Aucune chaîne disponible — le vaisseau cible doit être plus cher que le départ.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Résumé économies */}
                      <div className="mb-5 grid grid-cols-3 gap-3">
                        <div className="rounded-md border border-border bg-secondary/30 p-3 text-center">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Coût CCU</p>
                          <p className="mt-1 font-display text-lg font-bold text-foreground tabular-nums">
                            {fmtUsd(result.cost)}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            à payer en upgrade
                          </p>
                        </div>
                        <div className="rounded-md border border-border bg-secondary/30 p-3 text-center">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Achat direct</p>
                          <p className="mt-1 font-display text-lg font-bold text-foreground tabular-nums">
                            {fmtUsd(directBuy)}
                          </p>
                          <p className="text-[10px] text-muted-foreground">Prix store actuel</p>
                        </div>
                        <div className={`rounded-md border p-3 text-center ${
                          savings > 0
                            ? "border-emerald-500/30 bg-emerald-500/10"
                            : "border-border bg-secondary/30"
                        }`}>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Économies</p>
                          <p className={`mt-1 font-display text-lg font-bold tabular-nums ${
                            savings > 0 ? "text-emerald-400" : "text-foreground"
                          }`}>
                            {savings > 0 ? `-${fmtUsd(savings)}` : fmtUsd(0)}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {savings > 0
                              ? `${Math.round((savings / directBuy) * 100)}% d'économie`
                              : "Pas d'économie"}
                          </p>
                        </div>
                      </div>

                      {/* Étapes */}
                      <div className="flex flex-col gap-2">
                        {/* Départ */}
                        <div className="flex items-center gap-3 rounded-md border border-border/50 bg-secondary/20 px-3 py-2.5">
                          <Rocket className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{fromShip?.name}</p>
                            <p className="text-[10px] text-muted-foreground">{fromShip?.manufacturer} — {fmtUsd(fromShip?.price ?? 0)}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">Départ</span>
                        </div>

                        {result.steps.map((step, i) => (
                          <div key={i} className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 pl-4">
                              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-primary/30 bg-primary/10">
                                <ChevronRight className="h-3 w-3 text-primary" />
                              </div>
                              <div className="flex flex-1 items-center justify-between rounded-md border border-primary/20 bg-primary/5 px-3 py-1.5">
                                <span className="flex items-center gap-1.5 text-xs text-primary">
                                  <BadgeDollarSign className="h-3 w-3" />
                                  CCU {step.from.name} → {step.to.name}
                                </span>
                                <span className="font-mono text-xs font-semibold text-primary">{fmtUsd(step.ccu.price)}</span>
                              </div>
                            </div>

                            <div className={`flex items-center gap-3 rounded-md border px-3 py-2.5 ${
                              i === result.steps.length - 1
                                ? "border-primary/30 bg-primary/10"
                                : "border-border/50 bg-secondary/20"
                            }`}>
                              <Rocket className={`h-4 w-4 shrink-0 ${i === result.steps.length - 1 ? "text-primary" : "text-muted-foreground"}`} />
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${i === result.steps.length - 1 ? "text-primary" : "text-foreground"}`}>
                                  {step.to.name}
                                </p>
                                <p className="text-[10px] text-muted-foreground">{step.to.manufacturer} — {fmtUsd(step.to.price)}</p>
                              </div>
                              {i === result.steps.length - 1 && (
                                <span className="flex items-center gap-1 text-xs text-primary">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Cible
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <p className="mt-4 flex items-start gap-1.5 text-[10px] text-muted-foreground/60">
                        <Info className="mt-0.5 h-3 w-3 shrink-0" />
                        Le coût CCU est la différence de prix entre les deux vaisseaux au tarif store actuel.
                        Les CCU Warbond peuvent être moins chers — vérifiez sur le RSI Store.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ── Colonne droite — Chaîne manuelle ── */}
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                    Ma chaîne personnalisée
                  </h2>
                </div>

                <p className="mb-4 text-[11px] text-muted-foreground">
                  Construisez manuellement votre chaîne pour comparer avec la chaîne optimale.
                </p>

                {fromId && (
                  <div className="mb-2 flex items-center gap-2 rounded-md border border-border/50 bg-secondary/20 px-3 py-2">
                    <Rocket className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="flex-1 text-xs font-medium text-foreground">{fromShip?.name}</span>
                    <span className="text-[10px] text-muted-foreground">Départ</span>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  {manualChain.map((shipId, idx) => {
                    const ship = ships.find((s) => s.id === shipId);
                    const step = manualSteps[idx];
                    return (
                      <div key={idx} className="flex flex-col gap-1">
                        {step && (
                          <div className="flex items-center gap-1.5 pl-3">
                            <ChevronRight className="h-3 w-3 text-primary/50" />
                            {step.ccuPrice !== null ? (
                              <span className="text-[10px] text-primary/70 font-mono">
                                CCU — {fmtUsd(step.ccuPrice)}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] text-destructive/70">
                                <AlertCircle className="h-3 w-3" /> Vaisseau cible moins cher que la source
                              </span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-2 rounded-md border border-border/50 bg-secondary/20 px-3 py-2">
                          <Rocket className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <span className="flex-1 text-xs font-medium text-foreground">{ship?.name}</span>
                          <span className="text-[10px] text-muted-foreground mr-2">{fmtUsd(ship?.price ?? 0)}</span>
                          <button
                            onClick={() => removeFromManual(idx)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 flex gap-2">
                  <div className="flex-1">
                    <ShipSelect
                      value={addShipId}
                      onChange={setAddShipId}
                      placeholder="Ajouter un vaisseau…"
                      exclude={fromId}
                      ships={ships}
                    />
                  </div>
                  <button
                    onClick={addToManual}
                    disabled={!addShipId}
                    className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {manualSteps.length > 0 && toId && (
                  <div className="mt-4 rounded-md border border-border/50 bg-secondary/20 p-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Total CCU</span>
                      <span className="font-mono font-semibold text-foreground">{fmtUsd(manualTotal)}</span>
                    </div>
                    <div className="mt-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">Coût total CCU</span>
                      <span className="font-mono font-semibold text-foreground">
                        {fmtUsd(manualTotal)}
                      </span>
                    </div>
                    {manualSavings > 0 && (
                      <div className="mt-2 flex items-center justify-between rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-1">
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                          <TrendingDown className="h-3 w-3" /> Économies vs direct
                        </span>
                        <span className="font-mono text-xs font-semibold text-emerald-400">
                          -{fmtUsd(manualSavings)}
                        </span>
                      </div>
                    )}
                    {result && manualTotal > result.cost && (
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-400/80">
                        <TrendingUp className="h-3 w-3" />
                        La chaîne optimale est {fmtUsd(manualTotal - result.cost)} moins chère
                      </div>
                    )}
                    {result && manualTotal === result.cost && (
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400/80">
                        <CheckCircle2 className="h-3 w-3" />
                        C'est la chaîne optimale !
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Légende */}
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Comment ça marche</p>
                <div className="flex flex-col gap-2 text-[11px] text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    Un CCU coûte la différence de prix entre le vaisseau source et le vaisseau cible.
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    Choisir un vaisseau de départ moins cher réduit le coût total de la chaîne.
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    Les CCU Warbond (achetés en cash) peuvent être moins chers — vérifiez sur le RSI Store.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CcuPlanner;
