import { apiFetch } from '@/lib/api';

export interface Location {
  id: number;
  name: string | null;
  internal?: string | null;
  type: 'Planet' | 'Moon' | 'Station' | 'City' | 'Outpost' | 'Asteroid Belt' | 'Lagrange Point' | 'Star' | 'Rest Stop' | string | null;
  system: string | null;
  parent?: string | null;
  atmosphere?: string | null;
  gravity?: string | null;
  description: string | null;
  orbitAngle?: number | null;
  orbitRadius?: number | null;
  size?: number | null;
  color?: string | null;
}

export interface StarSystem {
  id: string;
  name: string;
  position: [number, number, number];
  starColor: string;
  starSize: number;
  description: string;
}

/** Données statiques des systèmes stellaires (utilisées pour la carte) */
export const starSystems: StarSystem[] = [
  { id: 'stanton', name: 'Stanton', position: [0, 0, 0], starColor: '#FFD93D', starSize: 2, description: 'Système civilisé, siège des 4 grandes corporations.' },
  { id: 'pyro', name: 'Pyro', position: [40, 5, -15], starColor: '#FF6B35', starSize: 1.6, description: 'Système sans loi, dangereusement instable.' },
  { id: 'nyx', name: 'Nyx', position: [-35, -8, 20], starColor: '#A78BFA', starSize: 1.4, description: 'Système isolé, refuge de dissidents politiques.' },
  { id: 'terra', name: 'Terra', position: [25, -12, 35], starColor: '#34D399', starSize: 1.8, description: 'Système politique majeur de l\'UEE, rival de Sol.' },
  { id: 'magnus', name: 'Magnus', position: [-20, 10, -30], starColor: '#60A5FA', starSize: 1.2, description: 'Système industriel en déclin, chantiers navals abandonnés.' },
];

/** Cache synchrone utilisé par search.ts */
export let locations: Location[] = [];

export async function fetchLocations(params?: { q?: string; type?: string; system?: string; gameVersion?: number; parent?: string }): Promise<Location[]> {
  const qs = new URLSearchParams();
  if (params?.q) qs.set('q', params.q);
  if (params?.type) qs.set('type', params.type);
  if (params?.system) qs.set('system', params.system);
  if (params?.gameVersion) qs.set('gameVersion', String(params.gameVersion));
  if (params?.parent) qs.set('parent', params.parent);
  const query = qs.toString() ? `?${qs}` : '';
  const data = await apiFetch<Location[]>(`/api/locations${query}`);
  if (!params?.q && !params?.type && !params?.system) locations = data;
  return data;
}

export async function fetchLocation(id: number, locale = 'en'): Promise<Location> {
  return apiFetch<Location>(`/api/locations/${id}?locale=${locale}`);
}

export async function fetchLocationChildren(id: number, locale = 'en'): Promise<Location[]> {
  return apiFetch<Location[]>(`/api/locations/${id}/children?locale=${locale}`);
}

export const getLocationById = (id: number): Location | undefined => locations.find((l) => l.id === id);
