import { apiFetch } from '@/lib/api';

// ── Child entity types (detail only) ─────────────────────────────────────────

export interface ShieldData {
  maxShieldHealth: number | null;
  maxShieldRegen: number | null;
  decayRatio: number | null;
  downedRegenDelay: number | null;
  damagedRegenDelay: number | null;
  reservePoolMaxHealthRatio: number | null;
  reservePoolRegenRateRatio: number | null;
  reservePoolDrainRateRatio: number | null;
  resistance: { damageType: string; min: number; max: number }[] | null;
  absorption: { damageType: string; min: number; max: number }[] | null;
}

export interface PowerPlantData {
  powerOutput: number | null;
  emSignature: number | null;
  overheatTemp: number | null;
  overheatWarning: number | null;
  overheatRecovery: number | null;
}

export interface QuantumDriveData {
  driveSpeed: number | null;
  spoolUpTime: number | null;
  cooldownTime: number | null;
  fuelPerSCU: number | null;
  calibrationRate: number | null;
  minCalibration: number | null;
  maxCalibration: number | null;
  calibrationAngleLimit: number | null;
  quantumFuelRequirement: number | null;
  emSignature: number | null;
  overheatTemp: number | null;
}

export interface CoolerData {
  coolingRate: number | null;
  powerDraw: number | null;
  emSignature: number | null;
  irSignature: number | null;
  overheatTemp: number | null;
  overheatWarning: number | null;
  overheatRecovery: number | null;
}

export interface ShipWeaponData {
  fireModes: Record<string, unknown>[] | null;
  ammoSpeed: number | null;
  ammoLifetime: number | null;
  effectiveRange: number | null;
  ammoDamage: Record<string, unknown> | null;
  emSignature: number | null;
  overheatTemp: number | null;
  overheatWarning: number | null;
}

export interface MissileData {
  maxLifetime: number | null;
  armTime: number | null;
  igniteTime: number | null;
  explosionMinRadius: number | null;
  explosionMaxRadius: number | null;
  explosionDamage: Record<string, unknown> | null;
  linearSpeed: number | null;
  lockTime: number | null;
  lockingAngle: number | null;
  lockRangeMin: number | null;
  lockRangeMax: number | null;
  trackingSignalType: string | null;
}

export interface MissileRackData {
  missileCount: number | null;
  missileSizeMin: number | null;
  missileSizeMax: number | null;
  launchDelay: number | null;
}

/** Composant de vaisseau tel que retourné par GET /api/items */
export interface ShipComponent {
  id: number;
  ref: string;
  internalName: string;
  name: string | null;
  shortName: string | null;
  description: string | null;
  category: string | null;
  type: string | null;
  subType: string | null;
  size: number | null;
  grade: number | null;       // 1=A, 2=B, 3=C, 4=D
  manufacturer: string | null;
  tags: string | null;
  isPurchasable: boolean;
  hasPlayerName: boolean;
  health: number | null;
  centiSCU: number | null;
  microSCU: number | null;
  version: { id: number; label: string } | null;
  // Détail uniquement (GET /api/items/:id)
  shield?: ShieldData | null;
  powerPlant?: PowerPlantData | null;
  quantumDrive?: QuantumDriveData | null;
  cooler?: CoolerData | null;
  shipWeapon?: ShipWeaponData | null;
  missile?: MissileData | null;
  missileRack?: MissileRackData | null;
}

/** Types de composants de vaisseaux à inclure */
export const COMPONENT_TYPES = [
  'Shield',
  'PowerPlant',
  'Cooler',
  'QuantumDrive',
  'Radar',
  'WeaponDefensive',
  'FuelTank',
  'QuantumFuelTank',
  'FuelIntake',
] as const;

export type ComponentType = typeof COMPONENT_TYPES[number];

/** Libellés d'affichage pour chaque type */
export const COMPONENT_TYPE_LABELS: Record<string, string> = {
  Shield:          'Shield',
  PowerPlant:      'Power Plant',
  Cooler:          'Cooler',
  QuantumDrive:    'Quantum Drive',
  Radar:           'Radar',
  WeaponDefensive: 'Countermeasures',
  FuelTank:        'Fuel Tank',
  QuantumFuelTank: 'Quantum Tank',
  FuelIntake:      'Fuel Intake',
};

export const componentTypeLabel = (type: string | null): string =>
  type ? (COMPONENT_TYPE_LABELS[type] ?? type) : '—';

/** Correspondance grade numérique → lettre */
export const gradeLabel = (grade: number | null): 'A' | 'B' | 'C' | 'D' | '?' => {
  if (grade === 1) return 'A';
  if (grade === 2) return 'B';
  if (grade === 3) return 'C';
  if (grade === 4) return 'D';
  return '?';
};

/** Cache synchrone utilisé par search.ts */
export let components: ShipComponent[] = [];

export async function fetchComponents(params?: {
  q?: string;
  type?: string;
  grade?: number;
  size?: number;
  manufacturer?: string;
  gameVersion?: number;
  locale?: string;
}): Promise<ShipComponent[]> {
  const qs = new URLSearchParams({
    types:       COMPONENT_TYPES.join(','),
    locale:      params?.locale ?? 'en',
    purchasable: 'true',
    playerName:  'true',
  });

  if (params?.gameVersion) qs.set('gameVersion', String(params.gameVersion));
  if (params?.type)        qs.set('type',        params.type);
  if (params?.grade)       qs.set('grade',       String(params.grade));
  if (params?.size)        qs.set('size',         String(params.size));
  if (params?.manufacturer) qs.set('manufacturer', params.manufacturer);
  if (params?.q)           qs.set('q',            params.q);

  const data = await apiFetch<ShipComponent[]>(`/api/items?${qs}`);

  if (!params?.type && !params?.q && !params?.size && !params?.grade && !params?.manufacturer) {
    components = data;
  }

  return data;
}

export async function fetchComponent(id: number, locale = 'en'): Promise<ShipComponent> {
  return apiFetch<ShipComponent>(`/api/items/${id}?locale=${locale}`);
}

export const getComponentById = (id: number): ShipComponent | undefined =>
  components.find((c) => c.id === id);
