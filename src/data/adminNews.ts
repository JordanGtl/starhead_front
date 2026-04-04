import { apiFetch } from '@/lib/api';
import type { NewsItem } from './news';

export interface AdminNewsItem extends NewsItem {
  hasContent: boolean;
  contentLength: number;
  hasThumbnail: boolean;
  importedAt: string;
  translatedLocales: string[];
}

export interface AdminNewsResponse {
  items: AdminNewsItem[];
  page: number;
  pagesize: number;
  total: number;
  hasMore: boolean;
  stats: {
    total: number;
    withContent: number;
    withThumbnail: number;
  };
}

export interface AdminNewsPayload {
  rsiId?: number;
  title: string;
  description?: string | null;
  category?: string | null;
  type?: string;
  url?: string;
  slug?: string;
  dateRaw?: string | null;
  content?: string | null;
}

export async function fetchAdminNews(params?: {
  page?: number;
  pagesize?: number;
  q?: string;
  category?: string;
  type?: string;
}): Promise<AdminNewsResponse> {
  const qs = new URLSearchParams();
  if (params?.page)     qs.set('page',     String(params.page));
  if (params?.pagesize) qs.set('pagesize', String(params.pagesize));
  if (params?.q)        qs.set('q',        params.q);
  if (params?.category) qs.set('category', params.category);
  if (params?.type)     qs.set('type',     params.type);
  return apiFetch<AdminNewsResponse>(`/api/admin/news?${qs}`);
}

export async function createAdminNews(payload: AdminNewsPayload): Promise<AdminNewsItem> {
  return apiFetch<AdminNewsItem>('/api/admin/news', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateAdminNews(rsiId: number, payload: Partial<AdminNewsPayload>): Promise<AdminNewsItem> {
  return apiFetch<AdminNewsItem>(`/api/admin/news/${rsiId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminNews(rsiId: number): Promise<void> {
  await apiFetch(`/api/admin/news/${rsiId}`, { method: 'DELETE' });
}

export async function syncAdminNewsContent(rsiId: number): Promise<{ success: boolean; contentLength: number }> {
  return apiFetch(`/api/admin/news/${rsiId}/sync-content`, { method: 'POST' });
}

// ---------------------------------------------------------------------------
// Translations
// ---------------------------------------------------------------------------

export interface NewsTranslation {
  locale: string;
  title: string | null;
  description: string | null;
  content: string | null;
  hasContent: boolean;
  updatedAt: string;
}

export async function fetchNewsTranslations(rsiId: number): Promise<NewsTranslation[]> {
  return apiFetch<NewsTranslation[]>(`/api/admin/news/${rsiId}/translations`);
}

export async function upsertNewsTranslation(
  rsiId: number,
  locale: string,
  data: { title?: string | null; description?: string | null; content?: string | null },
): Promise<NewsTranslation> {
  return apiFetch<NewsTranslation>(`/api/admin/news/${rsiId}/translations/${locale}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteNewsTranslation(rsiId: number, locale: string): Promise<void> {
  await apiFetch(`/api/admin/news/${rsiId}/translations/${locale}`, { method: 'DELETE' });
}
