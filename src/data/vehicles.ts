import { apiFetch } from '@/lib/api';

/** movementClass values that identify ground/hover vehicles */
export const VEHICLE_MOVEMENT_CLASSES = ['ArcadeWheeled', 'ArcadeHover'] as const;
export type VehicleMovementClass = typeof VEHICLE_MOVEMENT_CLASSES[number];

/** Human-readable type derived from movementClass */
export function movementClassToType(mc: string | null): string {
  switch (mc) {
    case 'ArcadeWheeled': return 'Ground';
    case 'ArcadeHover':   return 'Hover';
    default:              return mc ?? 'Unknown';
  }
}

export interface Vehicle {
  id:            number;
  name:          string;
  manufacturer:  string | null;
  movementClass: string | null;
  role:          string | null;
  minCrew:       number | null;
  maxCrew:       number | null;
  cargo:         number | null;
  price:         number | null;
  priceEur:      number | null;
  image:         string | null;
  description:   string | null;
}

/** Cache synchrone utilisé par search.ts */
export let vehicles: Vehicle[] = [];

export async function fetchVehicles(params?: { q?: string; movementClass?: string; manufacturer?: string }): Promise<Vehicle[]> {
  const qs = new URLSearchParams();
  if (params?.q)             qs.set('q', params.q);
  if (params?.movementClass) qs.set('movementClass', params.movementClass);
  if (params?.manufacturer)  qs.set('manufacturer', params.manufacturer);
  const query = qs.toString() ? `?${qs}` : '';
  const data = await apiFetch<Vehicle[]>(`/api/vehicles${query}`);
  if (!params?.q && !params?.movementClass && !params?.manufacturer) vehicles = data;
  return data;
}
