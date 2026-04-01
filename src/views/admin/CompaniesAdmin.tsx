'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2, Search, RefreshCw, Loader2, Plus, Pencil, Trash2,
  ChevronLeft, ChevronRight, MapPin, Calendar, Tag,
  Download, Upload, AlertCircle, CheckCircle2, X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import { SUPPORTED_LANGS } from '@/config/languages';
import { AdminManufacturer, Page, normalizeLocalized } from '@/lib/manufacturer-admin';

// ─── Logo display helper ───────────────────────────────────────────────────────

const LogoAvatar = ({ m, size = 'md' }: { m: AdminManufacturer; size?: 'sm' | 'md' }) => {
  const src = m.logoBase64 ?? m.logo ?? null;
  const dim = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const imgDim = size === 'sm' ? 'h-6 w-6' : 'h-7 w-7';
  return (
    <div className={`${dim} shrink-0 flex items-center justify-center overflow-hidden rounded-lg border border-border bg-secondary`}>
      {src
        ? <img src={src} alt={m.name} className={`${imgDim} object-contain`} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        : <Building2 className="h-4 w-4 text-muted-foreground/30" />
      }
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const CompaniesAdmin = () => {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  const [data, setData]         = useState<Page | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const [deleting, setDeleting]   = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ created: number; updated: number; errors: string[] } | null>(null);

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

  const handleExport = async () => {
    setExporting(true);
    try {
      const exported = await apiFetch<object[]>('/api/admin/manufacturers/export');
      const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `manufacturers-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = async (ev) => {
      let parsed: unknown;
      try { parsed = JSON.parse(ev.target?.result as string); } catch {
        alert('Fichier JSON invalide.');
        return;
      }
      if (!Array.isArray(parsed)) { alert('Le fichier doit contenir un tableau JSON.'); return; }
      setImporting(true);
      setImportResult(null);
      try {
        const result = await apiFetch<{ created: number; updated: number; errors: string[] }>(
          '/api/admin/manufacturers/import',
          { method: 'POST', body: JSON.stringify(parsed) },
        );
        setImportResult(result);
        load(1, search);
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(file);
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

        {/* Hero background */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
          <img src="/hero-bg.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" style={{ objectPosition: '50% 30%' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex min-h-[18vh] items-center">
          <div className="container pb-2 pt-8 flex items-end justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Base de données</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground">Entreprises</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {data ? `${data.total} entreprise${data.total > 1 ? 's' : ''}` : '…'}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <Link
                href="/admin/companies/new"
                className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Nouvelle
              </Link>
              <button onClick={handleExport} disabled={exporting}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40">
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Exporter
              </button>
              <label className={`inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:text-foreground ${importing ? 'opacity-40 pointer-events-none' : ''}`}>
                {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Importer
                <input type="file" accept=".json,application/json" className="sr-only" onChange={handleImport} disabled={importing} />
              </label>
              <button onClick={() => load()} disabled={loading}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-10 container pb-8 pt-0 space-y-4">

          {/* Résultat import */}
          {importResult && (
            <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
              importResult.errors.length > 0
                ? 'border-yellow-500/20 bg-yellow-500/5 text-yellow-400'
                : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'
            }`}>
              {importResult.errors.length > 0
                ? <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                : <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
              }
              <div className="flex-1 space-y-0.5">
                <p className="font-medium">
                  Import terminé — {importResult.created} créé{importResult.created > 1 ? 's' : ''}, {importResult.updated} mis à jour
                </p>
                {importResult.errors.map((e, i) => (
                  <p key={i} className="text-xs opacity-70">{e}</p>
                ))}
              </div>
              <button onClick={() => setImportResult(null)} className="shrink-0 opacity-50 hover:opacity-100 transition-opacity">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou slug…"
              className="h-10 w-full max-w-sm rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Contenu */}
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
                      <tr key={m.id} className="bg-card transition-colors hover:bg-secondary/20">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <LogoAvatar m={m} />
                            <div>
                              <p className="font-medium text-foreground">{m.name}</p>
                              <p className="font-mono text-[10px] text-muted-foreground/40">{m.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="space-y-0.5 text-xs text-muted-foreground">
                            {m.headquarters && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-3 w-3 shrink-0" />
                                {m.headquarters}
                              </div>
                            )}
                            {m.founded && (
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3 w-3 shrink-0" />
                                {m.founded}
                              </div>
                            )}
                            {!m.headquarters && !m.founded && (
                              <span className="text-muted-foreground/30">—</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {m.industry?.length
                              ? m.industry.map((ind, idx) => (
                                  <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                    <Tag className="h-2.5 w-2.5 shrink-0" />
                                    {normalizeLocalized(ind as any)[SUPPORTED_LANGS[0].code] || Object.values(normalizeLocalized(ind as any)).find(v => v) || ''}
                                  </span>
                                ))
                              : <span className="text-xs text-muted-foreground/30">—</span>
                            }
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Link
                              href={`/admin/companies/${m.id}/edit`}
                              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(m.id)}
                              disabled={deleting === m.id}
                              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                            >
                              {deleting === m.id
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <Trash2 className="h-3.5 w-3.5" />
                              }
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {data?.items.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-16 text-center text-sm text-muted-foreground">
                          Aucune entreprise trouvée.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground">Page {page} / {totalPages}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => goPage(page - 1)}
                      disabled={page <= 1 || loading}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => goPage(page + 1)}
                      disabled={page >= totalPages || loading}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                    >
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
