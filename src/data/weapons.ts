import { apiFetch } from '@/lib/api';

/** Ship weapon as returned by GET /api/items */
export interface Weapon {
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
  grade: number | null;
  manufacturer: string | null;
  tags: string | null;
  health: number | null;
  centiSCU: number | null;
  microSCU: number | null;
  version: { id: number; label: string } | null;
}

/** Cache synchrone utilisé par search.ts */
export let weapons: Weapon[] = [];

/**
 * Récupère les armes de vaisseaux depuis /api/items
 * Catégories incluses : scitem/ships/weapons* (hors /parts)
 */
export async function fetchWeapons(params?: {
  q?: string;
  type?: string;
  subType?: string;
  gameVersion?: number;
  locale?: string;
}): Promise<Weapon[]> {
  const qs = new URLSearchParams({
    categoryPrefix: 'scitem/ships/weapons',
    excludeCategory: 'scitem/ships/weapons/parts',
    locale: params?.locale ?? 'en',
  });

  if (params?.gameVersion) qs.set('gameVersion', String(params.gameVersion));
  if (params?.type)        qs.set('type',        params.type);
  if (params?.subType)     qs.set('subType',      params.subType);
  if (params?.q)           qs.set('q',            params.q);

  const data = await apiFetch<Weapon[]>(`/api/items?${qs}`);

  // Cache uniquement sur un fetch non filtré (hors gameVersion/type/q)
  if (!params?.type && !params?.q && !params?.subType) {
    weapons = data;
  }

  return data;
}

export async function fetchWeapon(id: number, locale = 'en'): Promise<Weapon> {
  return apiFetch<Weapon>(`/api/items/${id}?locale=${locale}`);
}

export const getWeaponById = (id: number): Weapon | undefined =>
  weapons.find((w) => w.id === id);

// ---------------------------------------------------------------------------
// Helpers d'affichage
// ---------------------------------------------------------------------------

/** Libellé lisible pour le type API */
export const WEAPON_TYPE_LABELS: Record<string, string> = {
  WeaponGun:                    'Gun',
  Missile:                      'Missile',
  WeaponMining:                 'Mining',
  TractorBeam:                  'Tractor Beam',
  EMP:                          'EMP',
  SalvageHead:                  'Salvage',
  Bomb:                         'Bomb',
  SpaceMine:                    'Space Mine',
  TowingBeam:                   'Tow Beam',
  QuantumInterdictionGenerator: 'QIG',
};

export const weaponTypeLabel = (type: string | null): string =>
  type ? (WEAPON_TYPE_LABELS[type] ?? type) : '—';
