import { apiFetch } from '@/lib/api';

export const GLOSSARY_CATEGORIES = [
  { value: 'game',     label: 'Jeu & éditeur' },
  { value: 'currency', label: 'Monnaies' },
  { value: 'faction',  label: 'Factions & organisations' },
  { value: 'location', label: 'Lieux' },
  { value: 'ship',     label: 'Vaisseaux' },
  { value: 'mechanic', label: 'Mécaniques de jeu' },
  { value: 'item',     label: 'Items & armes' },
] as const;

export type GlossaryCategory = (typeof GLOSSARY_CATEGORIES)[number]['value'];

export interface GlossaryTermItem {
  id: number;
  term: string;
  category: GlossaryCategory | null;
  createdAt: string;
}

export interface GlossaryListResponse {
  items: GlossaryTermItem[];
  page: number;
  pagesize: number;
  total: number;
  hasMore: boolean;
}

export interface GlossaryTermPayload {
  term: string;
  category?: GlossaryCategory | null;
}

export async function fetchAdminGlossary(params?: {
  page?: number;
  pagesize?: number;
  q?: string;
}): Promise<GlossaryListResponse> {
  const qs = new URLSearchParams();
  if (params?.page)     qs.set('page',     String(params.page));
  if (params?.pagesize) qs.set('pagesize', String(params.pagesize));
  if (params?.q)        qs.set('q',        params.q);
  return apiFetch<GlossaryListResponse>(`/api/admin/glossary-terms?${qs}`);
}

export async function createGlossaryTerm(payload: GlossaryTermPayload): Promise<GlossaryTermItem> {
  return apiFetch<GlossaryTermItem>('/api/admin/glossary-terms', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateGlossaryTerm(id: number, payload: Partial<GlossaryTermPayload>): Promise<GlossaryTermItem> {
  return apiFetch<GlossaryTermItem>(`/api/admin/glossary-terms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteGlossaryTerm(id: number): Promise<void> {
  await apiFetch(`/api/admin/glossary-terms/${id}`, { method: 'DELETE' });
}
