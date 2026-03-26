import { apiFetch } from '@/lib/api';

export interface FactionVersion {
  id: number;
  label: string;
}

export interface Faction {
  id: number;
  ref: string;
  name: string | null;
  factionType: 'Lawful' | 'Unlawful' | 'LawEnforcement' | 'PrivateSecurity';
  defaultReaction: 'Hostile' | 'Neutral' | 'Friendly';
  noLegalRights: boolean;
  logo: string | null;
  version: FactionVersion;
}

export interface FactionReputation {
  ref: string;
  logo: string | null;
  displayName: string | null;
  description: string | null;
  geid: string | null;
  lawful: boolean;
  headquarters: string | null;
  founded: string | null;
  leadership: string | null;
  area: string | null;
  focus: string | null;
  alliedRefs: string[];
  enemyRefs: string[];
  hideInDelphiApp: boolean;
  isNpc: boolean;
}

export interface FactionDetail extends Faction {
  file: string | null;
  className: string | null;
  description: string | null;
  ableToArrest: boolean;
  policesCriminality: boolean;
  policesLawfulTrespass: boolean;
  factionReputationRef: string | null;
  alliedFactionRefs: string[];
  enemyFactionRefs: string[];
  reputation: FactionReputation | null;
}

/** Cache synchrone utilisé par search.ts */
export let factions: Faction[] = [];

export async function fetchFactions(params?: {
  q?: string;
  type?: string;
  reaction?: string;
  locale?: string;
}): Promise<Faction[]> {
  const qs = new URLSearchParams();
  if (params?.q) qs.set('q', params.q);
  if (params?.type) qs.set('type', params.type);
  if (params?.reaction) qs.set('reaction', params.reaction);
  if (params?.locale) qs.set('locale', params.locale);
  const query = qs.toString() ? `?${qs}` : '';
  const data = await apiFetch<Faction[]>(`/api/factions${query}`);
  if (!params?.q && !params?.type && !params?.reaction) factions = data;
  return data;
}

export async function fetchFaction(id: number, locale = 'en'): Promise<FactionDetail> {
  return apiFetch<FactionDetail>(`/api/factions/${id}?locale=${locale}`);
}
