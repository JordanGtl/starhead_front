import { apiFetch, API_URL } from '@/lib/api';

/** Résout une URL thumbnail : chemin relatif (/api/news/…) → URL absolue */
export function resolveThumbnail(thumbnail: string | null): string | null {
  if (!thumbnail) return null;
  if (thumbnail.startsWith('http')) return thumbnail;           // URL RSI absolue
  return `${API_URL}${thumbnail}`;                              // chemin relatif → absolu
}

export interface NewsItem {
  id: number | null;
  title: string;
  description: string | null;
  thumbnail: string | null;
  type: 'post' | 'video' | string;
  category: string;
  url: string;
  slug: string;
  dateRaw: string;
  publishedAt?: string | null;
  content?: string | null;
  importedAt?: string;
}

export interface NewsResponse {
  items: NewsItem[];
  page: number;
  pagesize: number;
  total: number;
  hasMore: boolean;
  error?: string;
}

export async function fetchNews(params?: {
  page?: number;
  pagesize?: number;
  category?: string;
  type?: string;
  locale?: string;
}): Promise<NewsResponse> {
  const qs = new URLSearchParams();
  if (params?.page)                           qs.set('page',     String(params.page));
  if (params?.pagesize)                       qs.set('pagesize', String(params.pagesize));
  if (params?.category)                       qs.set('category', params.category);
  if (params?.type)                           qs.set('type',     params.type);
  if (params?.locale && params.locale !== 'en') qs.set('locale', params.locale);
  return apiFetch<NewsResponse>(`/api/news?${qs}`);
}

export async function fetchNewsItem(rsiId: number | string, locale?: string): Promise<NewsItem> {
  const qs = locale && locale !== 'en' ? `?locale=${locale}` : '';
  return apiFetch<NewsItem>(`/api/news/${rsiId}${qs}`);
}
