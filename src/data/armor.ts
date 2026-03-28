import { apiFetch } from '@/lib/api';

export interface ArmorItem {
  id:           number;
  ref:          string;
  internalName: string;
  name:         string | null;
  type:         string | null;
  subType:      string | null;
  manufacturer: string | null;
  size:         number | null;
  grade:        string | null;
  health:       number | null;
  isPurchasable: boolean;
}

export const ARMOR_TYPES = [
  'Armor',
  'Char_Armor_Helmet',
  'Char_Armor_Torso',
  'Char_Armor_Arms',
  'Char_Armor_Legs',
  'Char_Armor_Undersuit',
  'Char_Armor_Backpack',
];

export const ARMOR_TYPE_LABELS: Record<string, string> = {
  Armor:                'Armure complète',
  Char_Armor_Helmet:    'Casque',
  Char_Armor_Torso:     'Torse',
  Char_Armor_Arms:      'Bras',
  Char_Armor_Legs:      'Jambes',
  Char_Armor_Undersuit: 'Sous-combinaison',
  Char_Armor_Backpack:  'Sac à dos',
};

export function armorTypeLabel(type: string | null): string {
  if (!type) return 'Inconnu';
  return ARMOR_TYPE_LABELS[type] ?? type;
}

export async function fetchArmor(params?: {
  gameVersion?: number;
  locale?: string;
  type?: string;
  subType?: string;
  q?: string;
  manufacturer?: string;
}): Promise<ArmorItem[]> {
  const qs = new URLSearchParams({
    locale:     params?.locale ?? 'en',
    purchasable: 'true',
    playerName:  'true',
    types:       ARMOR_TYPES.join(','),
  });

  if (params?.gameVersion)  qs.set('gameVersion',  String(params.gameVersion));
  if (params?.type)         qs.set('type',         params.type);
  if (params?.subType)      qs.set('subType',       params.subType);
  if (params?.manufacturer) qs.set('manufacturer',  params.manufacturer);
  if (params?.q)            qs.set('q',             params.q);

  const data = await apiFetch<ArmorItem[]>(`/api/items?${qs}`);
  return data;
}
