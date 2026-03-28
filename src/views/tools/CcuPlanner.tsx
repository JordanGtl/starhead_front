'use client';
import { useState, useMemo, useCallback } from "react";
import {
  ArrowRight, Search, TrendingDown, TrendingUp, Rocket, Star,
  ChevronDown, ChevronRight, Info, RotateCcw, Plus, Trash2,
  BadgeDollarSign, Route, AlertCircle, CheckCircle2,
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Ship {
  id: string;
  name: string;
  manufacturer: string;
  basePrice: number;         // USD
  pledgePrice: number;       // USD — prix store actuel
}

interface Ccu {
  id: string;
  fromId: string;
  toId: string;
  price: number;             // USD
  warbond: boolean;          // true = warbond (moins cher, cash seulement)
  available: boolean;
}

interface ChainStep {
  ccu: Ccu;
  from: Ship;
  to: Ship;
}

// ─── Données placeholder ──────────────────────────────────────────────────────

const SHIPS: Ship[] = [
  { id: "aurora-mr",    name: "Aurora MR",         manufacturer: "RSI",     basePrice: 25,   pledgePrice: 25   },
  { id: "mustang-alpha",name: "Mustang Alpha",      manufacturer: "CNOU",    basePrice: 30,   pledgePrice: 30   },
  { id: "avenger-titan",name: "Avenger Titan",      manufacturer: "AEGIS",   basePrice: 70,   pledgePrice: 70   },
  { id: "arrow",        name: "Arrow",              manufacturer: "AEGIS",   basePrice: 75,   pledgePrice: 75   },
  { id: "nomad",        name: "Nomad",              manufacturer: "CNOU",    basePrice: 75,   pledgePrice: 75   },
  { id: "cutlass-black",name: "Cutlass Black",      manufacturer: "Drake",   basePrice: 100,  pledgePrice: 110  },
  { id: "freelancer",   name: "Freelancer",         manufacturer: "MISC",    basePrice: 110,  pledgePrice: 110  },
  { id: "constellation-andromeda", name: "Constellation Andromeda", manufacturer: "RSI", basePrice: 225, pledgePrice: 250 },
  { id: "carrack",      name: "Carrack",            manufacturer: "AEGIS",   basePrice: 600,  pledgePrice: 650  },
  { id: "600i",         name: "600i Explorer",      manufacturer: "Origin",  basePrice: 400,  pledgePrice: 435  },
  { id: "hammerhead",   name: "Hammerhead",         manufacturer: "AEGIS",   basePrice: 650,  pledgePrice: 725  },
  { id: "merchantman",  name: "Merchantman",        manufacturer: "Banu",    basePrice: 650,  pledgePrice: 700  },
  { id: "polaris",      name: "Polaris",            manufacturer: "RSI",     basePrice: 750,  pledgePrice: 850  },
  { id: "idris-p",      name: "Idris-P",            manufacturer: "AEGIS",   basePrice: 1500, pledgePrice: 1500 },
  { id: "reclaimer",    name: "Reclaimer",          manufacturer: "AEGIS",   basePrice: 400,  pledgePrice: 450  },
  { id: "hull-c",       name: "Hull C",             manufacturer: "MISC",    basePrice: 350,  pledgePrice: 380  },
  { id: "crucible",     name: "Crucible",           manufacturer: "AEGIS",   basePrice: 350,  pledgePrice: 395  },
  { id: "galaxy",       name: "Galaxy",             manufacturer: "RSI",     basePrice: 430,  pledgePrice: 470  },
  { id: "zeus-mk2-es",  name: "Zeus Mk II ES",      manufacturer: "RSI",     basePrice: 185,  pledgePrice: 210  },
  { id: "starlancer-max",name:"StarLancer MAX",     manufacturer: "MISC",    basePrice: 340,  pledgePrice: 375  },
];

// CCU disponibles (prix réels approximatifs)
const CCUS: Ccu[] = [
  // Aurora MR → ...
  { id: "c1",  fromId: "aurora-mr",     toId: "avenger-titan",  price: 45,  warbond: false, available: true  },
  { id: "c2",  fromId: "aurora-mr",     toId: "avenger-titan",  price: 40,  warbond: true,  available: true  },
  { id: "c3",  fromId: "aurora-mr",     toId: "cutlass-black",  price: 75,  warbond: false, available: true  },
  { id: "c4",  fromId: "aurora-mr",     toId: "nomad",          price: 50,  warbond: false, available: true  },

  // Avenger Titan → ...
  { id: "c5",  fromId: "avenger-titan", toId: "arrow",          price: 10,  warbond: false, available: true  },
  { id: "c6",  fromId: "avenger-titan", toId: "cutlass-black",  price: 30,  warbond: false, available: true  },
  { id: "c7",  fromId: "avenger-titan", toId: "cutlass-black",  price: 25,  warbond: true,  available: true  },
  { id: "c8",  fromId: "avenger-titan", toId: "freelancer",     price: 40,  warbond: false, available: true  },

  // Cutlass Black → ...
  { id: "c9",  fromId: "cutlass-black", toId: "freelancer",     price: 15,  warbond: false, available: true  },
  { id: "c10", fromId: "cutlass-black", toId: "constellation-andromeda", price: 120, warbond: false, available: true },
  { id: "c11", fromId: "cutlass-black", toId: "constellation-andromeda", price: 105, warbond: true,  available: true },
  { id: "c12", fromId: "cutlass-black", toId: "hull-c",         price: 240, warbond: false, available: true  },

  // Freelancer → ...
  { id: "c13", fromId: "freelancer",    toId: "constellation-andromeda", price: 105, warbond: false, available: true },
  { id: "c14", fromId: "freelancer",    toId: "zeus-mk2-es",    price: 75,  warbond: false, available: true  },
  { id: "c15", fromId: "freelancer",    toId: "starlancer-max", price: 220, warbond: false, available: true  },

  // Constellation Andromeda → ...
  { id: "c16", fromId: "constellation-andromeda", toId: "600i",          price: 175, warbond: false, available: true },
  { id: "c17", fromId: "constellation-andromeda", toId: "carrack",       price: 370, warbond: false, available: true },
  { id: "c18", fromId: "constellation-andromeda", toId: "reclaimer",     price: 155, warbond: false, available: true },
  { id: "c19", fromId: "constellation-andromeda", toId: "hull-c",        price: 125, warbond: false, available: true },
  { id: "c20", fromId: "constellation-andromeda", toId: "crucible",      price: 125, warbond: false, available: true },
  { id: "c21", fromId: "constellation-andromeda", toId: "starlancer-max",price: 115, warbond: false, available: true },

  // 600i → ...
  { id: "c22", fromId: "600i",          toId: "carrack",        price: 195, warbond: false, available: true },
  { id: "c23", fromId: "600i",          toId: "hammerhead",     price: 225, warbond: false, available: true },
  { id: "c24", fromId: "600i",          toId: "merchantman",    price: 225, warbond: false, available: true },
  { id: "c25", fromId: "600i",          toId: "galaxy",         price: 30,  warbond: false, available: true },

  // Hull C / Crucible / Starlancer → ...
  { id: "c26", fromId: "hull-c",        toId: "galaxy",         price: 80,  warbond: false, available: true },
  { id: "c27", fromId: "hull-c",        toId: "600i",           price: 50,  warbond: false, available: true },
  { id: "c28", fromId: "starlancer-max",toId: "600i",           price: 60,  warbond: false, available: true },
  { id: "c29", fromId: "starlancer-max",toId: "carrack",        price: 255, warbond: false, available: true },

  // Galaxy / Reclaimer → ...
  { id: "c30", fromId: "galaxy",        toId: "carrack",        price: 165, warbond: false, available: true },
  { id: "c31", fromId: "reclaimer",     toId: "carrack",        price: 175, warbond: false, available: true },
  { id: "c32", fromId: "reclaimer",     toId: "hammerhead",     price: 225, warbond: false, available: true },

  // Carrack / Hammerhead → polaris
  { id: "c33", fromId: "carrack",       toId: "polaris",        price: 155, warbond: false, available: true },
  { id: "c34", fromId: "hammerhead",    toId: "polaris",        price: 105, warbond: false, available: true },
  { id: "c35", fromId: "merchantman",   toId: "polaris",        price: 105, warbond: false, available: true },

  // Polaris → Idris
  { id: "c36", fromId: "polaris",       toId: "idris-p",        price: 625, warbond: false, available: false },
];

// ─── Algorithme Dijkstra ──────────────────────────────────────────────────────

interface DijkstraResult {
  cost: number;
  steps: ChainStep[];
}

function findCheapestChain(
  fromId: string,
  toId: string,
  warbondAllowed: boolean,
): DijkstraResult | null {
  const shipMap = new Map(SHIPS.map((s) => [s.id, s]));

  // dist[shipId] = coût minimal pour y arriver
  const dist = new Map<string, number>();
  const prev = new Map<string, { ccu: Ccu; fromId: string } | null>();

  for (const s of SHIPS) {
    dist.set(s.id, Infinity);
    prev.set(s.id, null);
  }
  dist.set(fromId, 0);

  const unvisited = new Set(SHIPS.map((s) => s.id));

  while (unvisited.size > 0) {
    // Nœud non visité avec dist minimale
    let u: string | null = null;
    let minDist = Infinity;
    for (const id of unvisited) {
      const d = dist.get(id) ?? Infinity;
      if (d < minDist) { minDist = d; u = id; }
    }
    if (u === null || minDist === Infinity) break;
    if (u === toId) break;
    unvisited.delete(u);

    // Voisins : CCU partant de u
    const edges = CCUS.filter(
      (c) => c.fromId === u && c.available && (warbondAllowed || !c.warbond),
    );

    for (const ccu of edges) {
      const alt = (dist.get(u) ?? Infinity) + ccu.price;
      if (alt < (dist.get(ccu.toId) ?? Infinity)) {
        dist.set(ccu.toId, alt);
        prev.set(ccu.toId, { ccu, fromId: u });
      }
    }
  }

  const totalCost = dist.get(toId);
  if (totalCost === undefined || totalCost === Infinity) return null;

  // Reconstruit le chemin
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

const fmtUsd = (n: number) => `$${n.toLocaleString("en-US")}`;

// ─── Composants ──────────────────────────────────────────────────────────────

const ShipSelect = ({
  value, onChange, placeholder, exclude,
}: {
  value: string;
  onChange: (id: string) => void;
  placeholder: string;
  exclude?: string;
}) => {
  const [open,   setOpen]   = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => SHIPS.filter(
      (s) => s.id !== exclude &&
        (s.name.toLowerCase().includes(search.toLowerCase()) ||
         s.manufacturer.toLowerCase().includes(search.toLowerCase())),
    ),
    [search, exclude],
  );

  const selected = SHIPS.find((s) => s.id === value);

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
              <span className="text-xs text-muted-foreground">— {fmtUsd(selected.pledgePrice)}</span>
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
                <span className="tabular-nums text-muted-foreground">{fmtUsd(s.pledgePrice)}</span>
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
  const [fromId,          setFromId]          = useState("");
  const [toId,            setToId]            = useState("");
  const [warbondAllowed,  setWarbondAllowed]  = useState(false);
  const [manualChain,     setManualChain]     = useState<string[]>([]);  // ids de la chaine manuelle
  const [addShipId,       setAddShipId]       = useState("");

  // ── Calcul chaîne optimale ──────────────────────────────────────────────────
  const result = useMemo<DijkstraResult | null>(() => {
    if (!fromId || !toId || fromId === toId) return null;
    return findCheapestChain(fromId, toId, warbondAllowed);
  }, [fromId, toId, warbondAllowed]);

  const fromShip  = SHIPS.find((s) => s.id === fromId);
  const toShip    = SHIPS.find((s) => s.id === toId);
  const directBuy = toShip?.pledgePrice ?? 0;
  const savings   = result ? directBuy - (fromShip?.pledgePrice ?? 0) - result.cost : 0;

  // ── Chaîne manuelle ─────────────────────────────────────────────────────────
  const addToManual = useCallback(() => {
    if (!addShipId) return;
    setManualChain((prev) => [...prev, addShipId]);
    setAddShipId("");
  }, [addShipId]);

  const removeFromManual = useCallback((idx: number) => {
    setManualChain((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const manualSteps = useMemo(() => {
    const all = fromId ? [fromId, ...manualChain] : manualChain;
    const steps: { from: Ship; to: Ship; cheapestCcu: Ccu | null }[] = [];
    for (let i = 0; i < all.length - 1; i++) {
      const from = SHIPS.find((s) => s.id === all[i]);
      const to   = SHIPS.find((s) => s.id === all[i + 1]);
      if (!from || !to) continue;
      const ccus = CCUS.filter(
        (c) => c.fromId === from.id && c.toId === to.id && c.available &&
               (warbondAllowed || !c.warbond),
      ).sort((a, b) => a.price - b.price);
      steps.push({ from, to, cheapestCcu: ccus[0] ?? null });
    }
    return steps;
  }, [fromId, manualChain, warbondAllowed]);

  const manualTotal = manualSteps.reduce(
    (acc, s) => acc + (s.cheapestCcu?.price ?? 0), 0,
  );
  const manualSavings = toId
    ? directBuy - (fromShip?.pledgePrice ?? 0) - manualTotal
    : 0;

  const reset = () => {
    setFromId(""); setToId(""); setManualChain([]); setAddShipId("");
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
                  />
                  {fromShip && (
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Prix store : <span className="text-foreground">{fmtUsd(fromShip.pledgePrice)}</span>
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
                  />
                  {toShip && (
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Prix store : <span className="text-foreground">{fmtUsd(toShip.pledgePrice)}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Option warbond */}
              <button
                type="button"
                onClick={() => setWarbondAllowed((v) => !v)}
                className="mt-4 flex cursor-pointer items-center gap-2.5"
              >
                <div className={`relative h-5 w-9 rounded-full border transition-colors duration-200 ${
                  warbondAllowed ? "border-primary bg-primary/20" : "border-border bg-secondary"
                }`}>
                  <span className={`absolute top-[3px] h-3 w-3 rounded-full transition-all duration-200 ${
                    warbondAllowed ? "left-[18px] bg-primary" : "left-[3px] bg-muted-foreground"
                  }`} />
                </div>
                <span className="text-xs text-foreground">
                  Inclure les CCU Warbond
                  <span className="ml-1 text-muted-foreground">(paiement cash uniquement)</span>
                </span>
              </button>
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
                      Aucune chaîne de CCU disponible entre ces deux vaisseaux.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/60">
                      Essayez d'activer les Warbond ou choisissez un autre point de départ.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Résumé économies */}
                    <div className="mb-5 grid grid-cols-3 gap-3">
                      <div className="rounded-md border border-border bg-secondary/30 p-3 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Coût chaîne</p>
                        <p className="mt-1 font-display text-lg font-bold text-foreground tabular-nums">
                          {fmtUsd((fromShip?.pledgePrice ?? 0) + result.cost)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {fmtUsd(fromShip?.pledgePrice ?? 0)} + {fmtUsd(result.cost)} CCU
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
                          <p className="text-[10px] text-muted-foreground">{fromShip?.manufacturer} — {fmtUsd(fromShip?.pledgePrice ?? 0)}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">Départ</span>
                      </div>

                      {result.steps.map((step, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          {/* Flèche CCU */}
                          <div className="flex items-center gap-2 pl-4">
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-primary/30 bg-primary/10">
                              <ChevronRight className="h-3 w-3 text-primary" />
                            </div>
                            <div className="flex flex-1 items-center justify-between rounded-md border border-primary/20 bg-primary/5 px-3 py-1.5">
                              <span className="flex items-center gap-1.5 text-xs text-primary">
                                <BadgeDollarSign className="h-3 w-3" />
                                CCU {step.from.name} → {step.to.name}
                                {step.ccu.warbond && (
                                  <span className="rounded bg-amber-500/20 px-1 text-[9px] text-amber-400">WB</span>
                                )}
                              </span>
                              <span className="font-mono text-xs font-semibold text-primary">{fmtUsd(step.ccu.price)}</span>
                            </div>
                          </div>

                          {/* Vaisseau arrivée */}
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
                              <p className="text-[10px] text-muted-foreground">{step.to.manufacturer} — {fmtUsd(step.to.pledgePrice)}</p>
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

                    {/* Info */}
                    <p className="mt-4 flex items-start gap-1.5 text-[10px] text-muted-foreground/60">
                      <Info className="mt-0.5 h-3 w-3 shrink-0" />
                      Les prix affichés sont indicatifs et basés sur les tarifs store en vigueur.
                      Vérifiez toujours la disponibilité des CCU sur le RSI Store.
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
                Construisez manuellement votre chaîne de CCU pour comparer avec la chaîne optimale.
              </p>

              {/* Départ fixe */}
              {fromId && (
                <div className="mb-2 flex items-center gap-2 rounded-md border border-border/50 bg-secondary/20 px-3 py-2">
                  <Rocket className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="flex-1 text-xs font-medium text-foreground">{fromShip?.name}</span>
                  <span className="text-[10px] text-muted-foreground">Départ</span>
                </div>
              )}

              {/* Étapes manuelles */}
              <div className="flex flex-col gap-1.5">
                {manualChain.map((shipId, idx) => {
                  const ship = SHIPS.find((s) => s.id === shipId);
                  const step = manualSteps[idx];
                  return (
                    <div key={idx} className="flex flex-col gap-1">
                      {step && (
                        <div className="flex items-center gap-1.5 pl-3">
                          <ChevronRight className="h-3 w-3 text-primary/50" />
                          {step.cheapestCcu ? (
                            <span className="text-[10px] text-primary/70 font-mono">
                              CCU disponible — {fmtUsd(step.cheapestCcu.price)}
                              {step.cheapestCcu.warbond && " (WB)"}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] text-destructive/70">
                              <AlertCircle className="h-3 w-3" /> Pas de CCU direct disponible
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-2 rounded-md border border-border/50 bg-secondary/20 px-3 py-2">
                        <Rocket className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="flex-1 text-xs font-medium text-foreground">{ship?.name}</span>
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

              {/* Ajouter un vaisseau */}
              <div className="mt-3 flex gap-2">
                <div className="flex-1">
                  <ShipSelect
                    value={addShipId}
                    onChange={setAddShipId}
                    placeholder="Ajouter un vaisseau…"
                    exclude={fromId}
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

              {/* Résumé chaîne manuelle */}
              {manualSteps.length > 0 && toId && (
                <div className="mt-4 rounded-md border border-border/50 bg-secondary/20 p-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Total CCU</span>
                    <span className="font-mono font-semibold text-foreground">{fmtUsd(manualTotal)}</span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">Coût total</span>
                    <span className="font-mono font-semibold text-foreground">
                      {fmtUsd((fromShip?.pledgePrice ?? 0) + manualTotal)}
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
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Légende</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-400">WB</span>
                  Warbond — paiement uniquement en cash, sans store credit
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[9px] font-bold text-primary">CCU</span>
                  Cross-Chassis Upgrade — mise à niveau d'un vaisseau vers un autre
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CcuPlanner;
