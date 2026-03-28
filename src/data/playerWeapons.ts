import { apiFetch } from '@/lib/api';

export interface PlayerWeaponItem {
  id:           number;
  ref:          string;
  internalName: string;
  name:         string | null;
  type:         string | null;
  subType:      string | null;
  manufacturer: string | null;
  size:         number | null;
  grade:        number | null;
  health:       number | null;
  isPurchasable: boolean;
}

export const PLAYER_WEAPON_TYPES = [
  'WeaponPersonal',
  'Grenade',
] as const;

export const PLAYER_WEAPON_TYPE_LABELS: Record<string, string> = {
  WeaponPersonal: 'Arme personnelle',
  Grenade:        'Grenade',
};

export const PLAYER_WEAPON_SUBTYPE_LABELS: Record<string, string> = {
  Small:   'Pistolet',
  Medium:  'Fusil',
  Large:   'Arme lourde',
  Knife:   'Couteau',
  Gadget:  'Gadget',
  Grenade: 'Grenade',
  Weapon:  'Arme',
};

export function playerWeaponTypeLabel(type: string | null): string {
  if (!type) return 'Inconnu';
  return PLAYER_WEAPON_TYPE_LABELS[type] ?? type;
}

export function playerWeaponSubtypeLabel(subType: string | null): string {
  if (!subType || subType.toLowerCase() === 'undefined') return '';
  return PLAYER_WEAPON_SUBTYPE_LABELS[subType] ?? subType;
}

export async function fetchPlayerWeapons(params?: {
  gameVersion?: number;
  locale?: string;
  type?: string;
  subType?: string;
  manufacturer?: string;
  q?: string;
}): Promise<PlayerWeaponItem[]> {
  const qs = new URLSearchParams({
    locale:      params?.locale ?? 'en',
    purchasable: 'true',
    playerName:  'true',
    types:       PLAYER_WEAPON_TYPES.join(','),
  });

  if (params?.gameVersion)  qs.set('gameVersion',  String(params.gameVersion));
  if (params?.type)         qs.set('type',         params.type);
  if (params?.subType)      qs.set('subType',       params.subType);
  if (params?.manufacturer) qs.set('manufacturer',  params.manufacturer);
  if (params?.q)            qs.set('q',             params.q);

  return apiFetch<PlayerWeaponItem[]>(`/api/items?${qs}`);
}
