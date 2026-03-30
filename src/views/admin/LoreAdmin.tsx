'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen, Search, RefreshCw, Loader2, Plus, Pencil, Trash2,
  Check, ChevronLeft, ChevronRight, Tag, Calendar,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';

// ─── Types ────────────────────────────────────────────────────────────────────

const CATEGORIES = ['History', 'Factions', 'Species', 'Technology', 'Events'] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_COLORS: Record<Category, string> = {
  History:    'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Factions:   'bg-blue-500/10 text-blue-400 border-blue-500/30',
  Species:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Technology: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  Events:     'bg-red-500/10 text-red-400 border-red-500/30',
};

interface LoreEntry {
  id: number;
  title: string;
  category: string | null;
  summary: string | null;
  content: string | null;
  date: string | null;
}

interface Page {
  total: number;
  page: number;
  pagesize: number;
  items: LoreEntry[];
}

// ─── Form ─────────────────────────────────────────────────────────────────────

const EMPTY_FORM = { title: '', category: '', summary: '', content: '', date: '' };
type FormData = typeof EMPTY_FORM;

function toForm(l: LoreEntry): FormData {
  return {
    title:    l.title,
    category: l.category ?? '',
    summary:  l.summary ?? '',
    content:  l.content ?? '',
    date:     l.date ?? '',
  };
}

function fromForm(f: FormData): Partial<LoreEntry> {
  return {
    title:    f.title.trim() || undefined,
    category: f.category.trim() || null,
    summary:  f.summary.trim() || null,
    content:  f.content.trim() || null,
    date:     f.date.trim() || null,
  };
}

function LoreForm({ initial, onSave, onCancel }: {
  initial: FormData;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormData>(initial);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Titre *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Catégorie</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
            <option value="">— Sélectionner —</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Date (texte libre)</label>
          <input value={form.date} onChange={e => set('date', e.target.value)} placeholder="ex : 2941 SET"
            className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Résumé</label>
        <textarea value={form.summary} onChange={e => set('summary', e.target.value)} rows={2}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none resize-none" />
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Contenu</label>
        <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={8}
          placeholder="Contenu complet de l'entrée…"
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none resize-y" />
      </div>
      <div className="flex items-center gap-2 pt-1">
        <button onClick={handleSave} disabled={saving || !form.title.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Enregistrer
        </button>
        <button onClick={onCancel} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
          Annuler
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const LoreAdmin = () => {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  const [data, setData]           = useState<Page | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [search, setSearch]       = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [page, setPage]           = useState(1);
  const [editing, setEditing]     = useState<number | null>(null); // id or -1 for new
  const [deleting, setDeleting]   = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !user.roles?.includes('ROLE_ADMIN'))) router.replace('/');
  }, [authLoading, user, router]);

  const load = useCallback(async (p = page, q = search, cat = filterCat) => {
    if (!user?.roles?.includes('ROLE_ADMIN')) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), pagesize: '30' });
      if (q)   params.set('q', q);
      if (cat) params.set('category', cat);
      setData(await apiFetch<Page>(`/api/admin/lore?${params}`));
    } catch (e: any) {
      setError(e?.message ?? 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterCat, user]);

  useEffect(() => {
    if (user?.roles?.includes('ROLE_ADMIN')) load();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounce texte
  useEffect(() => {
    if (!user?.roles?.includes('ROLE_ADMIN')) return;
    const t = setTimeout(() => { setPage(1); load(1, search, filterCat); }, 350);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filtre catégorie immédiat
  useEffect(() => {
    if (!user?.roles?.includes('ROLE_ADMIN')) return;
    setPage(1); load(1, search, filterCat);
  }, [filterCat]); // eslint-disable-line react-hooks/exhaustive-deps

  const goPage = (p: number) => { setPage(p); load(p, search, filterCat); };

  const handleSave = async (id: number | null, form: FormData) => {
    const body = JSON.stringify(fromForm(form));
    if (id === null) {
      const created = await apiFetch<LoreEntry>('/api/admin/lore', { method: 'POST', body });
      setData(prev => prev ? { ...prev, total: prev.total + 1, items: [created, ...prev.items] } : prev);
    } else {
      const updated = await apiFetch<LoreEntry>(`/api/admin/lore/${id}`, { method: 'PATCH', body });
      setData(prev => prev ? { ...prev, items: prev.items.map(l => l.id === id ? updated : l) } : prev);
    }
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette entrée de lore ?')) return;
    setDeleting(id);
    try {
      await apiFetch(`/api/admin/lore/${id}`, { method: 'DELETE' });
      setData(prev => prev ? { ...prev, total: prev.total - 1, items: prev.items.filter(l => l.id !== id) } : prev);
    } finally {
      setDeleting(null);
    }
  };

  if (authLoading || !user?.roles?.includes('ROLE_ADMIN')) return null;

  const totalPages = data ? Math.ceil(data.total / data.pagesize) : 1;

  return (
    <AdminLayout>
      <div className="relative min-h-screen bg-background">

        {/* Fond */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
          <img src="/hero-bg.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" style={{ objectPosition: '50% 30%' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex min-h-[18vh] items-center">
          <div className="container pb-2 pt-8 flex items-end justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Base de données</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground">Lore</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {data ? `${data.total} entrée${data.total > 1 ? 's' : ''}` : '…'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditing(-1); }}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Nouvelle entrée
              </button>
              <button onClick={() => load()} disabled={loading}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-10 container pb-8 pt-0 space-y-4">

          {/* Formulaire de création */}
          {editing === -1 && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
              <p className="mb-4 text-sm font-semibold text-foreground">Nouvelle entrée de lore</p>
              <LoreForm
                initial={EMPTY_FORM}
                onSave={form => handleSave(null, form)}
                onCancel={() => setEditing(null)}
              />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
          )}

          {/* Barre de recherche + filtre catégorie */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher par titre ou résumé…"
                className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
              className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
              <option value="">Toutes les catégories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {loading && !data ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Titre</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Catégorie</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Résumé</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Date</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data?.items.map(l => (
                      <>
                        <tr key={l.id} className="bg-card transition-colors hover:bg-secondary/20">
                          <td className="px-4 py-3">
                            <p className="font-medium text-foreground line-clamp-1">{l.title}</p>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            {l.category ? (
                              <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_COLORS[l.category as Category] ?? 'bg-secondary text-muted-foreground border-border'}`}>
                                <Tag className="h-2.5 w-2.5" />{l.category}
                              </span>
                            ) : <span className="text-muted-foreground/30">—</span>}
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell max-w-xs">
                            <p className="line-clamp-2 text-xs text-muted-foreground">{l.summary ?? '—'}</p>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            {l.date ? (
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />{l.date}
                              </span>
                            ) : <span className="text-muted-foreground/30">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => setEditing(editing === l.id ? null : l.id)}
                                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => handleDelete(l.id)} disabled={deleting === l.id}
                                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40">
                                {deleting === l.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {editing === l.id && (
                          <tr key={`${l.id}-edit`}>
                            <td colSpan={5} className="border-t border-primary/20 bg-primary/5 px-5 py-4">
                              <LoreForm
                                initial={toForm(l)}
                                onSave={form => handleSave(l.id, form)}
                                onCancel={() => setEditing(null)}
                              />
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                    {data?.items.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                          Aucune entrée trouvée.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">Page {page} / {totalPages}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => goPage(page - 1)} disabled={page <= 1 || loading}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground disabled:opacity-30">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button onClick={() => goPage(page + 1)} disabled={page >= totalPages || loading}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground disabled:opacity-30">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default LoreAdmin;
