// Données de crafting Star Citizen (Alpha 4.x)
// Source : données connues du jeu — à enrichir au fil des mises à jour

export interface CraftingMaterial {
  id: string;
  name: string;
  category: 'metal' | 'processed' | 'chemical' | 'organic' | 'special';
  color: string; // tailwind text color
}

export interface BlueprintMaterial {
  materialId: string;
  quantity: number;
}

export interface Blueprint {
  id: string;
  name: string;
  category: 'component' | 'weapon_fps' | 'armor' | 'medical' | 'misc';
  subcategory: string;
  description: string;
  craftingTimeSec: number;
  outputQty: number;
  size?: number;      // pour les composants de vaisseau
  grade?: string;     // A B C D
  materials: BlueprintMaterial[];
}

// ─── Matériaux ────────────────────────────────────────────────────────────────

export const MATERIALS: Record<string, CraftingMaterial> = {
  // Métaux
  aluminum:   { id: 'aluminum',   name: 'Aluminium',    category: 'metal',     color: 'text-slate-400' },
  copper:     { id: 'copper',     name: 'Cuivre',       category: 'metal',     color: 'text-amber-600' },
  steel:      { id: 'steel',      name: 'Acier',        category: 'metal',     color: 'text-zinc-400'  },
  titanium:   { id: 'titanium',   name: 'Titane',       category: 'metal',     color: 'text-blue-300'  },
  tungsten:   { id: 'tungsten',   name: 'Tungstène',    category: 'metal',     color: 'text-gray-400'  },
  gold:       { id: 'gold',       name: 'Or',           category: 'metal',     color: 'text-yellow-400' },
  // Transformés
  laranite:   { id: 'laranite',   name: 'Laranite',     category: 'processed', color: 'text-purple-400' },
  corundum:   { id: 'corundum',   name: 'Corundum',     category: 'processed', color: 'text-rose-400'   },
  agricium:   { id: 'agricium',   name: 'Agricium',     category: 'processed', color: 'text-green-400'  },
  rmc:        { id: 'rmc',        name: 'RMC',          category: 'processed', color: 'text-orange-400' },
  bexalite:   { id: 'bexalite',   name: 'Bexalite',     category: 'processed', color: 'text-cyan-400'   },
  taranite:   { id: 'taranite',   name: 'Taranite',     category: 'processed', color: 'text-violet-400' },
  // Chimiques
  fluorine:   { id: 'fluorine',   name: 'Fluorine',     category: 'chemical',  color: 'text-emerald-400' },
  chlorine:   { id: 'chlorine',   name: 'Chlore',       category: 'chemical',  color: 'text-lime-400'   },
  nitrogen:   { id: 'nitrogen',   name: 'Azote',        category: 'chemical',  color: 'text-sky-400'    },
  hydrogen:   { id: 'hydrogen',   name: 'Hydrogène',    category: 'chemical',  color: 'text-indigo-400' },
  // Organiques
  carbon:     { id: 'carbon',     name: 'Carbone',      category: 'organic',   color: 'text-stone-400'  },
  fiber:      { id: 'fiber',      name: 'Fibre synthétique', category: 'organic', color: 'text-teal-400' },
  // Spéciaux
  quantanium: { id: 'quantanium', name: 'Quantanium',   category: 'special',   color: 'text-red-400'    },
  hephaestanite: { id: 'hephaestanite', name: 'Hephaestanite', category: 'special', color: 'text-fuchsia-400' },
  diamond:    { id: 'diamond',    name: 'Diamant',      category: 'special',   color: 'text-white'      },
};

// ─── Blueprints ───────────────────────────────────────────────────────────────

export const BLUEPRINTS: Blueprint[] = [
  // === Composants vaisseau — Boucliers ===
  {
    id: 'shield_s1_c',
    name: 'Bouclier S1 Grade C',
    category: 'component', subcategory: 'shield',
    description: 'Générateur de bouclier de taille 1, grade C. Améliore la protection des petits vaisseaux.',
    craftingTimeSec: 600, outputQty: 1, size: 1, grade: 'C',
    materials: [
      { materialId: 'aluminum',  quantity: 40 },
      { materialId: 'copper',    quantity: 20 },
      { materialId: 'rmc',       quantity: 15 },
      { materialId: 'fluorine',  quantity: 8  },
    ],
  },
  {
    id: 'shield_s1_b',
    name: 'Bouclier S1 Grade B',
    category: 'component', subcategory: 'shield',
    description: 'Bouclier de taille 1 hautes performances, grade B. Absorbe davantage de dégâts.',
    craftingTimeSec: 1200, outputQty: 1, size: 1, grade: 'B',
    materials: [
      { materialId: 'titanium',  quantity: 30 },
      { materialId: 'copper',    quantity: 25 },
      { materialId: 'laranite',  quantity: 12 },
      { materialId: 'fluorine',  quantity: 10 },
      { materialId: 'rmc',       quantity: 20 },
    ],
  },
  {
    id: 'shield_s2_c',
    name: 'Bouclier S2 Grade C',
    category: 'component', subcategory: 'shield',
    description: 'Bouclier de taille 2 pour vaisseaux moyens, grade C.',
    craftingTimeSec: 900, outputQty: 1, size: 2, grade: 'C',
    materials: [
      { materialId: 'aluminum',  quantity: 80 },
      { materialId: 'steel',     quantity: 30 },
      { materialId: 'copper',    quantity: 40 },
      { materialId: 'rmc',       quantity: 25 },
      { materialId: 'fluorine',  quantity: 15 },
    ],
  },
  // === Composants vaisseau — Centrales ===
  {
    id: 'powerplant_s1_c',
    name: 'Centrale S1 Grade C',
    category: 'component', subcategory: 'powerplant',
    description: 'Centrale électrique de taille 1, grade C. Alimente les systèmes du vaisseau.',
    craftingTimeSec: 720, outputQty: 1, size: 1, grade: 'C',
    materials: [
      { materialId: 'steel',     quantity: 35 },
      { materialId: 'copper',    quantity: 25 },
      { materialId: 'corundum',  quantity: 10 },
      { materialId: 'hydrogen',  quantity: 12 },
    ],
  },
  {
    id: 'powerplant_s1_b',
    name: 'Centrale S1 Grade B',
    category: 'component', subcategory: 'powerplant',
    description: 'Centrale électrique haute puissance, grade B.',
    craftingTimeSec: 1440, outputQty: 1, size: 1, grade: 'B',
    materials: [
      { materialId: 'titanium',  quantity: 20 },
      { materialId: 'copper',    quantity: 30 },
      { materialId: 'laranite',  quantity: 8  },
      { materialId: 'hydrogen',  quantity: 18 },
      { materialId: 'corundum',  quantity: 15 },
    ],
  },
  {
    id: 'powerplant_s2_c',
    name: 'Centrale S2 Grade C',
    category: 'component', subcategory: 'powerplant',
    description: 'Centrale de taille 2 pour vaisseaux moyens, grade C.',
    craftingTimeSec: 1080, outputQty: 1, size: 2, grade: 'C',
    materials: [
      { materialId: 'steel',     quantity: 60 },
      { materialId: 'copper',    quantity: 50 },
      { materialId: 'corundum',  quantity: 20 },
      { materialId: 'hydrogen',  quantity: 25 },
      { materialId: 'rmc',       quantity: 15 },
    ],
  },
  // === Composants vaisseau — Refroidisseurs ===
  {
    id: 'cooler_s1_c',
    name: 'Refroidisseur S1 Grade C',
    category: 'component', subcategory: 'cooler',
    description: 'Système de refroidissement de taille 1, grade C. Réduit la signature IR.',
    craftingTimeSec: 540, outputQty: 1, size: 1, grade: 'C',
    materials: [
      { materialId: 'aluminum',  quantity: 30 },
      { materialId: 'nitrogen',  quantity: 15 },
      { materialId: 'chlorine',  quantity: 8  },
      { materialId: 'rmc',       quantity: 10 },
    ],
  },
  {
    id: 'cooler_s1_b',
    name: 'Refroidisseur S1 Grade B',
    category: 'component', subcategory: 'cooler',
    description: 'Refroidisseur haute efficacité, grade B. Dissipation thermique améliorée.',
    craftingTimeSec: 960, outputQty: 1, size: 1, grade: 'B',
    materials: [
      { materialId: 'titanium',  quantity: 15 },
      { materialId: 'nitrogen',  quantity: 20 },
      { materialId: 'chlorine',  quantity: 12 },
      { materialId: 'bexalite',  quantity: 6  },
      { materialId: 'aluminum',  quantity: 20 },
    ],
  },
  // === Composants vaisseau — Moteurs quantiques ===
  {
    id: 'qd_s1_c',
    name: 'Moteur Quantique S1 Grade C',
    category: 'component', subcategory: 'quantumdrive',
    description: 'Moteur de voyage quantique de taille 1, grade C.',
    craftingTimeSec: 1200, outputQty: 1, size: 1, grade: 'C',
    materials: [
      { materialId: 'titanium',  quantity: 25 },
      { materialId: 'laranite',  quantity: 15 },
      { materialId: 'quantanium',quantity: 5  },
      { materialId: 'hydrogen',  quantity: 20 },
      { materialId: 'rmc',       quantity: 10 },
    ],
  },
  {
    id: 'qd_s1_a',
    name: 'Moteur Quantique S1 Grade A',
    category: 'component', subcategory: 'quantumdrive',
    description: 'Moteur quantique de pointe, grade A. Vitesse et portée maximales.',
    craftingTimeSec: 3600, outputQty: 1, size: 1, grade: 'A',
    materials: [
      { materialId: 'taranite',   quantity: 20 },
      { materialId: 'quantanium', quantity: 15 },
      { materialId: 'bexalite',   quantity: 18 },
      { materialId: 'titanium',   quantity: 35 },
      { materialId: 'hydrogen',   quantity: 40 },
      { materialId: 'laranite',   quantity: 25 },
    ],
  },
  // === Armes vaisseau ===
  {
    id: 'laser_repeater_s1',
    name: 'Répéteur Laser S1',
    category: 'component', subcategory: 'weapon_ship',
    description: 'Canon laser répéteur de taille 1. Bon équilibre cadence/dégâts.',
    craftingTimeSec: 480, outputQty: 1, size: 1,
    materials: [
      { materialId: 'aluminum',  quantity: 20 },
      { materialId: 'copper',    quantity: 15 },
      { materialId: 'steel',     quantity: 10 },
      { materialId: 'rmc',       quantity: 8  },
    ],
  },
  {
    id: 'laser_cannon_s1',
    name: 'Canon Laser S1',
    category: 'component', subcategory: 'weapon_ship',
    description: 'Canon laser de taille 1. Haute puissance, faible cadence.',
    craftingTimeSec: 720, outputQty: 1, size: 1,
    materials: [
      { materialId: 'steel',     quantity: 25 },
      { materialId: 'copper',    quantity: 20 },
      { materialId: 'laranite',  quantity: 8  },
      { materialId: 'rmc',       quantity: 12 },
    ],
  },
  {
    id: 'neutron_repeater_s2',
    name: 'Répéteur Neutron S2',
    category: 'component', subcategory: 'weapon_ship',
    description: 'Canon à neutrons de taille 2. Excellent contre les boucliers.',
    craftingTimeSec: 1080, outputQty: 1, size: 2,
    materials: [
      { materialId: 'titanium',  quantity: 30 },
      { materialId: 'copper',    quantity: 25 },
      { materialId: 'corundum',  quantity: 18 },
      { materialId: 'laranite',  quantity: 12 },
      { materialId: 'rmc',       quantity: 15 },
    ],
  },
  // === Armes FPS ===
  {
    id: 'fps_rifle_p4',
    name: 'P4 — Carabine Laser',
    category: 'weapon_fps', subcategory: 'rifle',
    description: 'Carabine laser polyvalente. Arme standard des forces de l\'UEE.',
    craftingTimeSec: 360, outputQty: 1,
    materials: [
      { materialId: 'aluminum',  quantity: 15 },
      { materialId: 'steel',     quantity: 20 },
      { materialId: 'copper',    quantity: 10 },
      { materialId: 'rmc',       quantity: 5  },
    ],
  },
  {
    id: 'fps_smg_volt',
    name: 'Volt — SMG',
    category: 'weapon_fps', subcategory: 'smg',
    description: 'Mitraillette compacte à impulsion électromagnétique. Idéale au CQC.',
    craftingTimeSec: 300, outputQty: 1,
    materials: [
      { materialId: 'aluminum',  quantity: 12 },
      { materialId: 'copper',    quantity: 18 },
      { materialId: 'rmc',       quantity: 8  },
      { materialId: 'carbon',    quantity: 6  },
    ],
  },
  {
    id: 'fps_shotgun_devastator',
    name: 'Devastator — Fusil à pompe',
    category: 'weapon_fps', subcategory: 'shotgun',
    description: 'Fusil à pompe à dispersion large. Dévastateur à courte portée.',
    craftingTimeSec: 420, outputQty: 1,
    materials: [
      { materialId: 'steel',     quantity: 30 },
      { materialId: 'aluminum',  quantity: 10 },
      { materialId: 'rmc',       quantity: 12 },
    ],
  },
  {
    id: 'fps_pistol_arc',
    name: 'Arc — Pistolet',
    category: 'weapon_fps', subcategory: 'pistol',
    description: 'Pistolet électrique semi-automatique. Léger et fiable.',
    craftingTimeSec: 240, outputQty: 1,
    materials: [
      { materialId: 'aluminum',  quantity: 8  },
      { materialId: 'copper',    quantity: 12 },
      { materialId: 'rmc',       quantity: 4  },
    ],
  },
  {
    id: 'fps_sniper_atzkav',
    name: 'Atzkav — Sniper',
    category: 'weapon_fps', subcategory: 'sniper',
    description: 'Fusil de précision à longue portée. Nécessite des matériaux rares.',
    craftingTimeSec: 900, outputQty: 1,
    materials: [
      { materialId: 'titanium',  quantity: 20 },
      { materialId: 'steel',     quantity: 25 },
      { materialId: 'laranite',  quantity: 10 },
      { materialId: 'carbon',    quantity: 8  },
      { materialId: 'rmc',       quantity: 10 },
    ],
  },
  // === Armures ===
  {
    id: 'armor_light_core',
    name: 'Armure légère — Torse',
    category: 'armor', subcategory: 'light',
    description: 'Protection thoracique légère. Bon équilibre entre mobilité et protection.',
    craftingTimeSec: 480, outputQty: 1,
    materials: [
      { materialId: 'fiber',     quantity: 20 },
      { materialId: 'aluminum',  quantity: 10 },
      { materialId: 'rmc',       quantity: 8  },
    ],
  },
  {
    id: 'armor_medium_core',
    name: 'Armure moyenne — Torse',
    category: 'armor', subcategory: 'medium',
    description: 'Protection thoracique intermédiaire. Standard militaire.',
    craftingTimeSec: 720, outputQty: 1,
    materials: [
      { materialId: 'steel',     quantity: 20 },
      { materialId: 'fiber',     quantity: 15 },
      { materialId: 'rmc',       quantity: 12 },
      { materialId: 'carbon',    quantity: 8  },
    ],
  },
  {
    id: 'armor_heavy_core',
    name: 'Armure lourde — Torse',
    category: 'armor', subcategory: 'heavy',
    description: 'Protection thoracique maximale. Réduit la mobilité.',
    craftingTimeSec: 1200, outputQty: 1,
    materials: [
      { materialId: 'tungsten',  quantity: 25 },
      { materialId: 'titanium',  quantity: 15 },
      { materialId: 'steel',     quantity: 20 },
      { materialId: 'rmc',       quantity: 20 },
      { materialId: 'fiber',     quantity: 10 },
    ],
  },
  {
    id: 'helmet_light',
    name: 'Casque léger',
    category: 'armor', subcategory: 'light',
    description: 'Casque léger avec visor intégré et système de filtration d\'air.',
    craftingTimeSec: 360, outputQty: 1,
    materials: [
      { materialId: 'fiber',     quantity: 12 },
      { materialId: 'aluminum',  quantity: 8  },
      { materialId: 'copper',    quantity: 5  },
      { materialId: 'rmc',       quantity: 6  },
    ],
  },
  // === Médical / Consommables ===
  {
    id: 'medpen_tier1',
    name: 'MedPen Tier 1',
    category: 'medical', subcategory: 'medpen',
    description: 'Auto-injecteur médical de base. Soigne les blessures légères.',
    craftingTimeSec: 120, outputQty: 3,
    materials: [
      { materialId: 'carbon',    quantity: 5  },
      { materialId: 'fluorine',  quantity: 3  },
      { materialId: 'nitrogen',  quantity: 2  },
    ],
  },
  {
    id: 'medpen_tier2',
    name: 'MedPen Tier 2',
    category: 'medical', subcategory: 'medpen',
    description: 'Auto-injecteur médical avancé. Traite les blessures modérées.',
    craftingTimeSec: 300, outputQty: 2,
    materials: [
      { materialId: 'carbon',    quantity: 10 },
      { materialId: 'fluorine',  quantity: 8  },
      { materialId: 'nitrogen',  quantity: 5  },
      { materialId: 'agricium',  quantity: 3  },
    ],
  },
  {
    id: 'stim_pack',
    name: 'Pack de stimulants',
    category: 'medical', subcategory: 'stim',
    description: 'Boost temporaire des capacités physiques. Effets secondaires importants.',
    craftingTimeSec: 180, outputQty: 2,
    materials: [
      { materialId: 'carbon',    quantity: 8  },
      { materialId: 'nitrogen',  quantity: 4  },
      { materialId: 'chlorine',  quantity: 3  },
    ],
  },
  {
    id: 'repair_kit',
    name: 'Kit de réparation',
    category: 'misc', subcategory: 'repair',
    description: 'Répare les dommages structurels des combinaisons et équipements.',
    craftingTimeSec: 240, outputQty: 1,
    materials: [
      { materialId: 'rmc',       quantity: 15 },
      { materialId: 'steel',     quantity: 8  },
      { materialId: 'aluminum',  quantity: 6  },
    ],
  },
  {
    id: 'battery_pack',
    name: 'Batterie haute capacité',
    category: 'misc', subcategory: 'electronics',
    description: 'Batterie rechargeable pour équipements portables et outils.',
    craftingTimeSec: 180, outputQty: 2,
    materials: [
      { materialId: 'laranite',  quantity: 5  },
      { materialId: 'copper',    quantity: 10 },
      { materialId: 'carbon',    quantity: 4  },
    ],
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  component:   'Composants vaisseau',
  weapon_fps:  'Armes FPS',
  armor:       'Armures',
  medical:     'Médical',
  misc:        'Divers',
};

export const SUBCATEGORY_LABELS: Record<string, string> = {
  shield:       'Bouclier',
  powerplant:   'Centrale',
  cooler:       'Refroidisseur',
  quantumdrive: 'Moteur quantique',
  weapon_ship:  'Arme vaisseau',
  rifle:        'Fusil',
  smg:          'SMG',
  shotgun:      'Fusil à pompe',
  pistol:       'Pistolet',
  sniper:       'Sniper',
  light:        'Légère',
  medium:       'Moyenne',
  heavy:        'Lourde',
  medpen:       'MedPen',
  stim:         'Stimulant',
  repair:       'Réparation',
  electronics:  'Électronique',
};

export const MATERIAL_CATEGORY_LABELS: Record<string, string> = {
  metal:     'Métaux',
  processed: 'Transformés',
  chemical:  'Chimiques',
  organic:   'Organiques',
  special:   'Spéciaux',
};

export function formatCraftingTime(seconds: number): string {
  if (seconds < 60)  return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}
