import { apiFetch } from '@/lib/api';

/** Valeur localisée : soit une chaîne brute (rétrocompat), soit un objet { [langCode]: string } */
export type LocalizedString = string | { [lang: string]: string };

/** Retourne le texte dans la langue demandée, avec fallback fr → première valeur non vide → '' */
export function localize(value: LocalizedString | null | undefined, lang: string): string {
  if (!value) return '';
  if (typeof value === 'string') return value; // rétrocompat données plates
  return value[lang] ?? value['fr'] ?? Object.values(value).find(v => v) ?? '';
}

export interface TimelineEvent {
  date:        string;
  title:       LocalizedString;
  description: LocalizedString | null;
}

export interface RelationItem {
  name:        string;
  description: LocalizedString;
}

export interface SourceItem {
  id:    number;
  title: string;
  url:   string;
}

export interface LoreSection {
  title:   LocalizedString;
  content: LocalizedString;
}

export interface Manufacturer {
  id:           number;
  name:         string;
  slug:         string;
  logo:         string;
  logoBase64:   string | null;
  founded:      string | null;
  headquarters: string | null;
  industry:     LocalizedString[] | null;
  description:  LocalizedString | null;
  lore:         LocalizedString | null;
  timeline:     TimelineEvent[] | null;
  relations:    RelationItem[] | null;
  sources:      SourceItem[] | null;
  loreSections: LoreSection[] | null;
}

/** Clés de filtre invariantes (valeur FR), utilisées pour matcher les tags localisés */
export const manufacturerIndustries = ['Vaisseaux', 'Armes', 'Composants', 'Véhicules', 'Nourriture'];

/** Traductions des tags d'industrie pour l'affichage */
export const industryLabels: Record<string, Record<string, string>> = {
  'Vaisseaux':  { fr: 'Vaisseaux',  en: 'Ships'      },
  'Armes':      { fr: 'Armes',      en: 'Weapons'    },
  'Composants': { fr: 'Composants', en: 'Components' },
  'Véhicules':  { fr: 'Véhicules',  en: 'Vehicles'   },
  'Nourriture': { fr: 'Nourriture', en: 'Food'       },
};

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
