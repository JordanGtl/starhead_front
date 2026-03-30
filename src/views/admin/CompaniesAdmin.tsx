'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2, Search, RefreshCw, Loader2, Plus, Pencil, Trash2,
  Check, X, ChevronLeft, ChevronRight, MapPin, Calendar, Tag,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminManufacturer {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  founded: string | null;
  headquarters: string | null;
  industry: string[];
  description: string | null;
  lore: string | null;
}

interface Page {
  total: number;
  page: number;
  pagesize: number;
  items: AdminManufacturer[];
}

// ─── Form ─────────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: '', slug: '', logo: '', founded: '', headquarters: '',
  industry: '', description: '', lore: '',
};

type FormData = typeof EMPTY_FORM;

function toForm(m: AdminManufacturer): FormData {
  return {
    name:         m.name,
    slug:         m.slug,
    logo:         m.logo ?? '',
    founded:      m.founded ?? '',
    headquarters: m.headquarters ?? '',
    industry:     (m.industry ?? []).join(', '),
    description:  m.description ?? '',
    lore:         m.lore ?? '',
  };
}

function fromForm(f: FormData): Partial<AdminManufacturer> {
  return {
    name:         f.name.trim() || undefined,
    slug:         f.slug.trim() || undefined,
    logo:         f.logo.trim() || null,
    founded:      f.founded.trim() || null,
    headquarters: f.headquarters.trim() || null,
    industry:     f.industry.trim() ? f.industry.split(',').map(s => s.trim()).filter(Boolean) : [],
    description:  f.description.trim() || null,
    lore:         f.lore.trim() || null,
  };
}

// ─── Edit / Create panel ──────────────────────────────────────────────────────

function ManufacturerForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: FormData;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormData>(initial);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Nom *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Slug</label>
          <input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="auto-généré"
            className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Logo (URL)</label>
          <input value={form.logo} onChange={e => set('logo', e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Fondée</label>
          <input value={form.founded} onChange={e => set('founded', e.target.value)} placeholder="ex : 2541"
            className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Siège social</label>
          <input value={form.headquarters} onChange={e => set('headquarters', e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Secteurs (séparés par des virgules)</label>
          <input value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="ex : Armement, Vaisseaux"
            className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Description</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none resize-none" />
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Lore</label>
        <textarea value={form.lore} onChange={e => set('lore', e.target.value)} rows={4}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none resize-none" />
      </div>
      <div className="flex items-center gap-2 pt-1">
        <button onClick={handleSave} disabled={saving || !form.name.trim()}
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

// ─── Main component ───────────────────────────────────────────────────────────

const CompaniesAdmin = () => {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  const [data, setData]         = useState<Page | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const [editing, setEditing]   = useState<number | null>(null);   // id or -1 for new
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !user.roles?.includes('ROLE_ADMIN'))) {
      router.replace('/');
    }
  }, [authLoading, user, router]);

  const load = useCallback(async (p = page, q = search) => {
    if (!user?.roles?.includes('ROLE_ADMIN')) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), pagesize: '30' });
      if (q) params.set('q', q);
      setData(await apiFetch<Page>(`/api/admin/manufacturers?${params}`));
    } catch (e: any) {
      setError(e?.message ?? 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [page, search, user]);

  useEffect(() => {
    if (user?.roles?.includes('ROLE_ADMIN')) load();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user?.roles?.includes('ROLE_ADMIN')) return;
    const t = setTimeout(() => { setPage(1); load(1, search); }, 350);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const goPage = (p: number) => { setPage(p); load(p, search); };

  const handleSave = async (id: number | null, form: FormData) => {
    const body = JSON.stringify(fromForm(form));
    if (id === null) {
      const created = await apiFetch<AdminManufacturer>('/api/admin/manufacturers', { method: 'POST', body });
      setData(prev => prev ? { ...prev, total: prev.total + 1, items: [created, ...prev.items] } : prev);
    } else {
      const updated = await apiFetch<AdminManufacturer>(`/api/admin/manufacturers/${id}`, { method: 'PATCH', body });
      setData(prev => prev ? { ...prev, items: prev.items.map(m => m.id === id ? updated : m) } : prev);
    }
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette entreprise ?')) return;
    setDeleting(id);
    try {
      await apiFetch(`/api/admin/manufacturers/${id}`, { method: 'DELETE' });
      setData(prev => prev ? { ...prev, total: prev.total - 1, items: prev.items.filter(m => m.id !== id) } : prev);
    } finally {
      setDeleting(null);
    }
  };

  if (authLoading || !user?.roles?.includes('ROLE_ADMIN')) return null;

  const totalPages = data ? Math.ceil(data.total / data.pagesize) : 1;

  return (
    <AdminLayout>
      <div className="relative min-h-screen bg-background">

        {/* Image de fond */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
          <img src="/hero-bg.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" style={{ objectPosition: '50% 30%' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex min-h-[18vh] items-center">
          <div className="container pb-2 pt-8 flex items-end justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Base de données</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground">Entreprises</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {data ? `${data.total} entreprise${data.total > 1 ? 's' : ''}` : '…'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(-1)}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Nouvelle entreprise
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
              <p className="mb-4 text-sm font-semibold text-foreground">Nouvelle entreprise</p>
              <ManufacturerForm
                initial={EMPTY_FORM}
                onSave={form => handleSave(null, form)}
                onCancel={() => setEditing(null)}
              />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou slug…"
              className="h-10 w-full max-w-sm rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
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
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Entreprise</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Siège / Fondée</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Secteurs</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data?.items.map(m => (
                      <>
                        <tr key={m.id} className="bg-card transition-colors hover:bg-secondary/20">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-secondary">
                                {m.logo
                                  ? <img src={m.logo} alt={m.name} className="h-7 w-7 object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                  : <Building2 className="h-4 w-4 text-muted-foreground/40" />
                                }
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{m.name}</p>
                                <p className="text-[10px] text-muted-foreground/50 font-mono">{m.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <div className="space-y-0.5 text-xs text-muted-foreground">
                              {m.headquarters && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3 shrink-0" />{m.headquarters}
                                </div>
                              )}
                              {m.founded && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3 shrink-0" />{m.founded}
                                </div>
                              )}
                              {!m.headquarters && !m.founded && <span className="text-muted-foreground/30">—</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {m.industry?.length
                                ? m.industry.map(ind => (
                                    <span key={ind} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                                      <Tag className="h-2.5 w-2.5" />{ind}
                                    </span>
                                  ))
                                : <span className="text-muted-foreground/30 text-xs">—</span>
                              }
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => setEditing(editing === m.id ? null : m.id)}
                                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => handleDelete(m.id)} disabled={deleting === m.id}
                                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40">
                                {deleting === m.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Formulaire d'édition inline */}
                        {editing === m.id && (
                          <tr key={`${m.id}-edit`} className="bg-card">
                            <td colSpan={4} className="border-t border-primary/20 bg-primary/5 px-5 py-4">
                              <ManufacturerForm
                                initial={toForm(m)}
                                onSave={form => handleSave(m.id, form)}
                                onCancel={() => setEditing(null)}
                              />
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                    {data?.items.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-12 text-center text-sm text-muted-foreground">
                          Aucune entreprise trouvée.
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

export default CompaniesAdmin;
