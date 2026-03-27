// Données de raffinage Star Citizen (Alpha 4.x)
// Sources : wiki SC, communauté, mesures en jeu

// ─── Minerais bruts ───────────────────────────────────────────────────────────

export interface Ore {
  id: string;
  name: string;
  shortName: string;
  /** % de matière inerte (non raffinable) dans le minerai brut */
  inertPct: number;
  /** Valeur aUEC / unité raffinée (approximatif, fluctue selon le marché) */
  valuePerUnit: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'exceptional';
  color: string; // tailwind bg/text color
  decays: boolean; // ex: Quantanium se dégrade avec le temps
}

export const ORES: Ore[] = [
  // Exceptionnels
  { id: 'quantanium', name: 'Quantanium',     shortName: 'QNTY', inertPct: 20, valuePerUnit: 103,  rarity: 'exceptional', color: 'text-red-400 bg-red-500/10 border-red-500/30',        decays: true  },
  { id: 'bexalite',   name: 'Bexalite',       shortName: 'BXLT', inertPct: 25, valuePerUnit: 95,   rarity: 'exceptional', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',       decays: false },
  { id: 'taranite',   name: 'Taranite',       shortName: 'TNRT', inertPct: 22, valuePerUnit: 88,   rarity: 'exceptional', color: 'text-violet-400 bg-violet-500/10 border-violet-500/30', decays: false },
  // Rares
  { id: 'laranite',   name: 'Laranite',       shortName: 'LNRT', inertPct: 30, valuePerUnit: 55,   rarity: 'rare',        color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', decays: false },
  { id: 'agricium',   name: 'Agricium',       shortName: 'AGRC', inertPct: 28, valuePerUnit: 48,   rarity: 'rare',        color: 'text-green-400 bg-green-500/10 border-green-500/30',    decays: false },
  { id: 'borase',     name: 'Borase',         shortName: 'BRSE', inertPct: 35, valuePerUnit: 42,   rarity: 'rare',        color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',       decays: false },
  { id: 'hephaestanite', name: 'Hephaestanite', shortName: 'HPHS', inertPct: 32, valuePerUnit: 38, rarity: 'rare',       color: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30', decays: false },
  // Peu communs
  { id: 'gold',       name: 'Or',             shortName: 'GOLD', inertPct: 40, valuePerUnit: 25,   rarity: 'uncommon',    color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',  decays: false },
  { id: 'diamond',    name: 'Diamant',        shortName: 'DIAM', inertPct: 45, valuePerUnit: 22,   rarity: 'uncommon',    color: 'text-sky-300 bg-sky-400/10 border-sky-400/30',           decays: false },
  { id: 'corundum',   name: 'Corundum',       shortName: 'CORU', inertPct: 38, valuePerUnit: 18,   rarity: 'uncommon',    color: 'text-orange-400 bg-orange-500/10 border-orange-500/30',  decays: false },
  { id: 'beryl',      name: 'Béryl',          shortName: 'BRYL', inertPct: 42, valuePerUnit: 15,   rarity: 'uncommon',    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', decays: false },
  // Communs
  { id: 'titanium',   name: 'Titane',         shortName: 'TITM', inertPct: 50, valuePerUnit: 8,    rarity: 'common',      color: 'text-blue-300 bg-blue-400/10 border-blue-400/30',        decays: false },
  { id: 'tungsten',   name: 'Tungstène',      shortName: 'TUNG', inertPct: 52, valuePerUnit: 7,    rarity: 'common',      color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30',        decays: false },
  { id: 'iron',       name: 'Fer',            shortName: 'IRON', inertPct: 55, valuePerUnit: 5,    rarity: 'common',      color: 'text-stone-400 bg-stone-500/10 border-stone-500/30',     decays: false },
  { id: 'quartz',     name: 'Quartz',         shortName: 'QRTZ', inertPct: 58, valuePerUnit: 4,    rarity: 'common',      color: 'text-slate-300 bg-slate-400/10 border-slate-400/30',     decays: false },
  { id: 'aluminum',   name: 'Aluminium',      shortName: 'ALUM', inertPct: 60, valuePerUnit: 3,    rarity: 'common',      color: 'text-slate-400 bg-slate-500/10 border-slate-500/30',     decays: false },
];

// ─── Méthodes de raffinage ────────────────────────────────────────────────────

export interface RefiningMethod {
  id: string;
  name: string;
  description: string;
  /** Rendement : fraction du minerai raffinable effectivement récupérée (0–1) */
  yieldFactor: number;
  /** Durée de base en secondes par SCU de minerai brut */
  secondsPerSCU: number;
  /** Coût en aUEC par SCU de minerai brut */
  costPerSCU: number;
  /** Indicateurs visuels */
  yieldRating:  1 | 2 | 3 | 4 | 5;
  speedRating:  1 | 2 | 3 | 4 | 5;
  costRating:   1 | 2 | 3 | 4 | 5; // 1=cher, 5=pas cher
}

export const REFINING_METHODS: RefiningMethod[] = [
  {
    id: 'clesci',
    name: 'Clesci',
    description: 'Processus standard équilibré. Bon rendement à coût modéré.',
    yieldFactor: 0.70, secondsPerSCU: 300,  costPerSCU: 25,
    yieldRating: 3, speedRating: 4, costRating: 3,
  },
  {
    id: 'dinyx',
    name: 'Dinyx Solventation',
    description: 'Dissolution chimique lente maximisant l\'extraction. Rendement optimal mais durée très longue.',
    yieldFactor: 0.91, secondsPerSCU: 1800, costPerSCU: 55,
    yieldRating: 5, speedRating: 1, costRating: 2,
  },
  {
    id: 'electro',
    name: 'Electrostarolysis',
    description: 'Séparation électrostatique rapide. Sacrifice du rendement pour la vitesse.',
    yieldFactor: 0.69, secondsPerSCU: 120,  costPerSCU: 40,
    yieldRating: 3, speedRating: 5, costRating: 2,
  },
  {
    id: 'ferron',
    name: 'Ferron Exchange',
    description: 'Échange ionique économique mais faible rendement. Idéal pour les minerais bas de gamme.',
    yieldFactor: 0.56, secondsPerSCU: 90,   costPerSCU: 10,
    yieldRating: 1, speedRating: 5, costRating: 5,
  },
  {
    id: 'gaskin',
    name: 'Gaskin Process',
    description: 'Extraction gazeuse à pression contrôlée. Bon compromis vitesse/coût.',
    yieldFactor: 0.64, secondsPerSCU: 240,  costPerSCU: 30,
    yieldRating: 2, speedRating: 4, costRating: 3,
  },
  {
    id: 'kazen',
    name: 'Kazen Winnowing',
    description: 'Séparation par densité (voie sèche). Rendement correct sans produits chimiques.',
    yieldFactor: 0.75, secondsPerSCU: 600,  costPerSCU: 20,
    yieldRating: 4, speedRating: 2, costRating: 4,
  },
  {
    id: 'pyrometric',
    name: 'Pyrometric Chromarolysis',
    description: 'Fusion à haute température suivie de chromatographie. Rendement élevé.',
    yieldFactor: 0.77, secondsPerSCU: 480,  costPerSCU: 45,
    yieldRating: 4, speedRating: 3, costRating: 2,
  },
  {
    id: 'thermolytic',
    name: 'Thermolytic Separation',
    description: 'Décomposition thermique progressive. Bon équilibre rendement/durée/coût.',
    yieldFactor: 0.73, secondsPerSCU: 360,  costPerSCU: 22,
    yieldRating: 3, speedRating: 3, costRating: 4,
  },
  {
    id: 'xcr',
    name: 'XCR Reaction',
    description: 'Réaction expérimentale à rendement variable. Économique mais résultats imprévisibles.',
    yieldFactor: 0.63, secondsPerSCU: 200,  costPerSCU: 15,
    yieldRating: 2, speedRating: 4, costRating: 5,
  },
];

// ─── Stations de raffinage ────────────────────────────────────────────────────

export interface RefineryStation {
  id: string;
  name: string;
  system: string;
  type: string;
}

export const REFINERY_STATIONS: RefineryStation[] = [
  { id: 'cl1',  name: 'CRU-L1 Ambitious Dream Station',   system: 'Stanton', type: 'Lagrange' },
  { id: 'cl5',  name: 'CRU-L5 Beautiful Glen Station',     system: 'Stanton', type: 'Lagrange' },
  { id: 'al1',  name: 'ARC-L1 Wide Forest Station',        system: 'Stanton', type: 'Lagrange' },
  { id: 'al2',  name: 'ARC-L2 Lively Pathway Station',     system: 'Stanton', type: 'Lagrange' },
  { id: 'hm',   name: 'Levski (Delamar)',                   system: 'Stanton', type: 'Astéroïde' },
  { id: 'gh',   name: 'GrimHex (Yela Belt)',                system: 'Stanton', type: 'Astéroïde' },
  { id: 'tdd',  name: 'TDD — Area 18 (ArcCorp)',            system: 'Stanton', type: 'Planète' },
  { id: 'pyro1',name: 'Checkmate Station (Pyro)',           system: 'Pyro',    type: 'Station' },
  { id: 'pyro2',name: 'Pyro Gateway (Pyro I)',              system: 'Pyro',    type: 'Station' },
  { id: 'ruin', name: 'Ruin Station (Pyro)',                system: 'Pyro',    type: 'Station' },
];

// ─── Calculs ──────────────────────────────────────────────────────────────────

export interface RefineResult {
  oreId: string;
  rawSCU: number;
  refinableSCU: number;  // rawSCU × (1 - inertPct)
  outputSCU: number;     // refinableSCU × yieldFactor
  timeSeconds: number;   // rawSCU × secondsPerSCU
  costAUEC: number;      // rawSCU × costPerSCU
  grossValueAUEC: number;
  profitAUEC: number;
}

export function computeRefineResult(
  ore: Ore,
  rawSCU: number,
  method: RefiningMethod,
): RefineResult {
  const refinableSCU  = rawSCU * (1 - ore.inertPct / 100);
  const outputSCU     = refinableSCU * method.yieldFactor;
  const timeSeconds   = rawSCU * method.secondsPerSCU;
  const costAUEC      = rawSCU * method.costPerSCU;
  const grossValueAUEC= outputSCU * ore.valuePerUnit * 100; // valeur en aUEC (100 unités/SCU)
  const profitAUEC    = grossValueAUEC - costAUEC;
  return { oreId: ore.id, rawSCU, refinableSCU, outputSCU, timeSeconds, costAUEC, grossValueAUEC, profitAUEC };
}

export function formatDuration(seconds: number): string {
  if (seconds < 60)   return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m > 0 ? m + 'm' : ''}`;
}

export function formatAUEC(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M aUEC`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k aUEC`;
  return `${Math.round(n)} aUEC`;
}

export const RARITY_LABELS: Record<string, string> = {
  common:      'Commun',
  uncommon:    'Peu commun',
  rare:        'Rare',
  exceptional: 'Exceptionnel',
};

export const RARITY_COLORS: Record<string, string> = {
  common:      'text-slate-400',
  uncommon:    'text-emerald-400',
  rare:        'text-blue-400',
  exceptional: 'text-amber-400',
};
