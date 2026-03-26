import { apiFetch } from "@/lib/api";

export interface LoreEntry {
  id: number;
  title: string;
  category: "Histoire" | "Factions" | "Espèces" | "Technologie" | "Événements";
  summary: string;
  content?: string;
  date?: string;
}

export const loreCategories = ["Histoire", "Factions", "Espèces", "Technologie", "Événements"] as const;

/** Cache synchrone utilisé par search.ts — alimenté au premier fetch */
export let loreEntries: LoreEntry[] = [];

export async function fetchLoreEntries(params?: { q?: string; category?: string }): Promise<LoreEntry[]> {
  const qs = new URLSearchParams();
  if (params?.q) qs.set("q", params.q);
  if (params?.category) qs.set("category", params.category);
  const query = qs.toString() ? `?${qs}` : "";
  const data = await apiFetch<LoreEntry[]>(`/api/lore${query}`);
  if (!params?.q && !params?.category) loreEntries = data;
  return data;
}

export async function fetchLoreEntry(id: number): Promise<LoreEntry> {
  return apiFetch<LoreEntry>(`/api/lore/${id}`);
}
