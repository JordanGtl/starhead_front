import { apiFetch } from '@/lib/api';

export interface ShipComponent {
  id: number;
  name: string;
  manufacturer: string;
  type: 'Shield' | 'Power Plant' | 'Cooler' | 'Quantum Drive' | 'Radar';
  size: 'S' | 'M' | 'L';
  grade: 'A' | 'B' | 'C' | 'D';
  description: string;
}

/** Cache synchrone utilisé par search.ts */
export let components: ShipComponent[] = [];

export async function fetchComponents(params?: { q?: string; type?: string; grade?: string; size?: string; manufacturer?: string }): Promise<ShipComponent[]> {
  const qs = new URLSearchParams();
  if (params?.q) qs.set('q', params.q);
  if (params?.type) qs.set('type', params.type);
  if (params?.grade) qs.set('grade', params.grade);
  if (params?.size) qs.set('size', params.size);
  if (params?.manufacturer) qs.set('manufacturer', params.manufacturer);
  const query = qs.toString() ? `?${qs}` : '';
  const data = await apiFetch<ShipComponent[]>(`/api/components${query}`);
  if (!params?.q && !params?.type && !params?.grade && !params?.size && !params?.manufacturer) components = data;
  return data;
}

export async function fetchComponent(id: number): Promise<ShipComponent> {
  return apiFetch<ShipComponent>(`/api/components/${id}`);
}

export const getComponentById = (id: number): ShipComponent | undefined => components.find((c) => c.id === id);
