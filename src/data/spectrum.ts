import { apiFetch } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SpectrumPost {
  id: number;
  spectrumId: string;
  type: 'thread' | 'reply';
  threadId: string;
  threadTitle: string;
  forum: string;
  channel: string | null;
  authorHandle: string;
  authorName: string;
  authorRoles: string[];
  category: string | null;
  excerpt: string | null;
  content: string | null;
  locale: string;
  voteCount: number;
  repliesCount: number;
  isPinned: boolean;
  spectrumUrl: string;
  postedAt: string | null;
  importedAt: string;
}

export interface SpectrumPage {
  items: SpectrumPost[];
  total: number;
  page: number;
  pagesize: number;
  pages: number;
}

export interface SpectrumCategory {
  category: string;
  cnt: number;
}

export interface SpectrumAuthor {
  handle: string;
  name: string;
  roles: string[];
  count: number;
}

// ─── API calls ────────────────────────────────────────────────────────────────

export interface FetchSpectrumParams {
  page?: number;
  pagesize?: number;
  search?: string;
  category?: string;
  role?: string;
  pinned?: boolean;
  locale?: string;
}

export function fetchSpectrumPosts(params: FetchSpectrumParams = {}): Promise<SpectrumPage> {
  const qs = new URLSearchParams();
  if (params.page)     qs.set('page',     String(params.page));
  if (params.pagesize) qs.set('pagesize', String(params.pagesize));
  if (params.search)   qs.set('search',   params.search);
  if (params.category) qs.set('category', params.category);
  if (params.role)     qs.set('role',     params.role);
  if (params.pinned)   qs.set('pinned',   '1');
  if (params.locale)   qs.set('locale',   params.locale);
  return apiFetch<SpectrumPage>(`/api/spectrum/posts?${qs.toString()}`);
}

export function fetchSpectrumCategories(): Promise<SpectrumCategory[]> {
  return apiFetch<SpectrumCategory[]>('/api/spectrum/categories');
}

export function fetchSpectrumAuthors(): Promise<SpectrumAuthor[]> {
  return apiFetch<SpectrumAuthor[]>('/api/spectrum/authors');
}

export function fetchSpectrumPost(id: number, locale?: string): Promise<SpectrumPost> {
  const qs = locale ? `?locale=${locale}` : '';
  return apiFetch<SpectrumPost>(`/api/spectrum/posts/${id}${qs}`);
}

// ─── Helpers visuels ─────────────────────────────────────────────────────────

export const CATEGORY_COLORS: Record<string, string> = {
  'Patch Notes':    'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  'Dev Reply':      'text-blue-400 bg-blue-500/10 border-blue-500/30',
  'Roadmap Update': 'text-violet-400 bg-violet-500/10 border-violet-500/30',
  'Bug Fix':        'text-rose-400 bg-rose-500/10 border-rose-500/30',
  'Design Post':    'text-amber-400 bg-amber-500/10 border-amber-500/30',
  'Lore':           'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30',
  'Community':      'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  'Tech Update':    'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
  'Announcements':  'text-sky-400 bg-sky-500/10 border-sky-500/30',
};

export const DEFAULT_CATEGORY_COLOR = 'text-muted-foreground bg-secondary border-border';

export function getCategoryColor(cat: string | null): string {
  return (cat && CATEGORY_COLORS[cat]) ? CATEGORY_COLORS[cat] : DEFAULT_CATEGORY_COLOR;
}

/** Couleur d'avatar déterministe depuis le handle */
const AVATAR_COLORS = [
  'bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500',
  'bg-amber-500', 'bg-indigo-500', 'bg-cyan-500', 'bg-fuchsia-500',
  'bg-teal-500', 'bg-red-500',
];

export function avatarColor(handle: string): string {
  let hash = 0;
  for (let i = 0; i < handle.length; i++) hash = (hash * 31 + handle.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function avatarInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

/** Rôle principal (le premier CIG-pertinent) */
export function primaryRole(roles: string[]): string | null {
  return roles[0] ?? null;
}

const ROLE_COLORS: Record<string, string> = {
  'community manager': 'text-blue-400',
  'lead developer':    'text-red-400',
  'game designer':     'text-emerald-400',
  'narrative':         'text-fuchsia-400',
  'programmer':        'text-teal-400',
  'producer':          'text-indigo-400',
  'director':          'text-cyan-400',
  'artist':            'text-amber-400',
  'qa':                'text-orange-400',
};

export function roleColor(role: string | null): string {
  if (!role) return 'text-muted-foreground';
  const lower = role.toLowerCase();
  for (const [key, color] of Object.entries(ROLE_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return 'text-muted-foreground';
}

export function formatRelative(isoDate: string | null): string {
  if (!isoDate) return '—';
  const diff    = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1)   return "à l'instant";
  if (minutes < 60)  return `il y a ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)    return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7)      return `il y a ${days}j`;
  return new Intl.DateTimeFormat('fr', { day: 'numeric', month: 'short' }).format(new Date(isoDate));
}
