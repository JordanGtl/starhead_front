import { apiFetch } from '@/lib/api';

export interface Weapon {
  id: number;
  name: string;
  manufacturer: string;
  type: string;
  size: number | null;       // null = Personal (FPS)
  category: 'Ship' | 'FPS';
  damage: number | null;
  rof: number | null;
  range: number | null;
  dps: number | null;
  speed?: number | null;
  ammo?: number | null;      // null = Unlimited
  powerDraw?: number | null;
  heatPerShot?: number | null;
  mass?: number | null;
  description: string | null;
  lore?: string | null;
}

/** Cache synchrone utilisé par search.ts */
export let weapons: Weapon[] = [];

export async function fetchWeapons(params?: { q?: string; type?: string; category?: string }): Promise<Weapon[]> {
  const qs = new URLSearchParams();
  if (params?.q) qs.set('q', params.q);
  if (params?.type) qs.set('type', params.type);
  if (params?.category) qs.set('category', params.category);
  const query = qs.toString() ? `?${qs}` : '';
  const data = await apiFetch<Weapon[]>(`/api/weapons${query}`);
  if (!params?.q && !params?.type && !params?.category) weapons = data;
  return data;
}

export async function fetchWeapon(id: number): Promise<Weapon> {
  return apiFetch<Weapon>(`/api/weapons/${id}`);
}

export const getWeaponById = (id: number): Weapon | undefined => weapons.find((w) => w.id === id);
