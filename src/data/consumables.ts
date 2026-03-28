import { apiFetch } from '@/lib/api';

export interface ConsumableItem {
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

export const CONSUMABLE_TYPES = [
  'FPS_Consumable',
  'Medicine',
  'Food',
] as const;

export const CONSUMABLE_TYPE_LABELS: Record<string, string> = {
  FPS_Consumable: 'Consommable',
  Medicine:       'Médicament',
  Food:           'Nourriture',
};

export const CONSUMABLE_SUBTYPE_LABELS: Record<string, string> = {
  Drink:       'Boisson',
  Food:        'Aliment',
  Drug:        'Drogue',
  Medical:     'Médical',
  Armor:       'Armure',
  Stimulant:   'Stimulant',
  Healing:     'Soin',
};

export function consumableTypeLabel(type: string | null): string {
  if (!type) return 'Inconnu';
  return CONSUMABLE_TYPE_LABELS[type] ?? type;
}

export function consumableSubtypeLabel(subType: string | null): string {
  if (!subType || subType.toLowerCase() === 'undefined') return '';
  return CONSUMABLE_SUBTYPE_LABELS[subType] ?? subType;
}

export async function fetchConsumables(params?: {
  gameVersion?: number;
  locale?: string;
  type?: string;
  subType?: string;
  manufacturer?: string;
  q?: string;
}): Promise<ConsumableItem[]> {
  const qs = new URLSearchParams({
    locale:     params?.locale ?? 'fr',
    purchasable: 'true',
    playerName:  'true',
    types:       CONSUMABLE_TYPES.join(','),
  });

  if (params?.gameVersion)  qs.set('gameVersion',  String(params.gameVersion));
  if (params?.type)         qs.set('type',         params.type);
  if (params?.subType)      qs.set('subType',       params.subType);
  if (params?.manufacturer) qs.set('manufacturer',  params.manufacturer);
  if (params?.q)            qs.set('q',             params.q);

  return apiFetch<ConsumableItem[]>(`/api/items?${qs}`);
}
