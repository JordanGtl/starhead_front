import { apiFetch } from '@/lib/api';

export interface Vehicle {
  id: number;
  name: string;
  manufacturer: string;
  type: 'Ground' | 'Hover' | 'Gravlev';
  seats: number | null;
  speed: number | null;
  cargo: number | null;
  hasWeapons: boolean;
  description: string | null;
  image: string | null;
}

/** Cache synchrone utilisé par search.ts */
export let vehicles: Vehicle[] = [];

export async function fetchVehicles(params?: { q?: string; type?: string; manufacturer?: string }): Promise<Vehicle[]> {
  const qs = new URLSearchParams();
  if (params?.q) qs.set('q', params.q);
  if (params?.type) qs.set('type', params.type);
  if (params?.manufacturer) qs.set('manufacturer', params.manufacturer);
  const query = qs.toString() ? `?${qs}` : '';
  const data = await apiFetch<Vehicle[]>(`/api/vehicles${query}`);
  if (!params?.q && !params?.type && !params?.manufacturer) vehicles = data;
  return data;
}
