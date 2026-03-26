import { apiFetch } from '@/lib/api';

export interface Manufacturer {
  id: number;
  name: string;
  slug: string;
  logo: string;
  logoBase64: string | null;
  founded: string | null;
  headquarters: string | null;
  industry: string[] | null;
  description: string | null;
  lore: string | null;
}

export const manufacturerIndustries = ['Vaisseaux', 'Armes', 'Composants', 'Véhicules', 'Nourriture'];

/** Cache synchrone utilisé par search.ts — alimenté au premier fetch */
export let manufacturers: Manufacturer[] = [];

export async function fetchManufacturers(query?: string): Promise<Manufacturer[]> {
  const params = query ? `?q=${encodeURIComponent(query)}` : '';
  const data = await apiFetch<Manufacturer[]>(`/api/manufacturers${params}`);
  if (!query) manufacturers = data; // on ne met en cache que la liste complète
  return data;
}

export async function fetchManufacturer(slug: string): Promise<Manufacturer> {
  return apiFetch<Manufacturer>(`/api/manufacturers/by-slug/${slug}`);
}
