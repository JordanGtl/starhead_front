'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTranslationJob } from '@/hooks/useTranslationJob';
import { useRouter } from 'next/navigation';
import {
  Swords, Search, RefreshCw, Loader2, ChevronLeft, ChevronRight,
  Globe, Pencil, Sparkles, Check, X, Trash2, ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useVersion } from '@/contexts/VersionContext';
import { apiFetch } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Translation {
  locale: string;
  name: string | null;
  description: string | null;
}

interface AdminFaction {
  id: number;
  ref: string;
  className: string | null;
  factionType: string;
  defaultReaction: string;
  noLegalRights: boolean;
  version: { id: number; label: string };
  translations: Translation[];
}

interface Page {
  total: number;
  page: number;
  pagesize: number;
  items: AdminFaction[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const REACTION_COLORS: Record<string, string> = {
  Friendly: 'bg-green-500/10 text-green-400 border-green-500/20',
  Neutral:  'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Hostile:  'bg-red-500/10 text-red-400 border-red-500/20',
};

const TYPE_COLORS: Record<string, string> = {
  Lawful:          'bg-blue-500/10 text-blue-400',
  LawEnforcement:  'bg-cyan-500/10 text-cyan-400',
  PrivateSecurity: 'bg-purple-500/10 text-purple-400',
  Unlawful:        'bg-orange-500/10 text-orange-400',
};

const LOCALES = ['en', 'fr', 'de', 'es'];

function getName(faction: AdminFaction, locale = 'en') {
  return (
    faction.translations.find(t => t.locale === locale)?.name ??
    faction.translations.find(t => t.locale === 'en')?.name ??
    faction.className ??
    faction.ref
  );
}

function getTranslation(faction: AdminFaction, locale: string): Translation | undefined {
  return faction.translations.find(t => t.locale === locale);
}

// ─── Translation panel ────────────────────────────────────────────────────────

function TranslationPanel({ faction, onUpdate }: { faction: AdminFaction; onUpdate: (updated: AdminFaction) => void }) {
  const [activeLocale, setActiveLocale] = useState('fr');
  const [editName, setEditName]         = useState('');
  const [editDesc, setEditDesc]         = useState('');
  const [editing, setEditing]           = useState(false);
  const [saving, setSaving] = useState(false);

  const tr = getTranslation(faction, activeLocale);

  const startEdit = () => {
    setEditName(tr?.name ?? '');
    setEditDesc(tr?.description ?? '');
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const save = async () => {
    setSaving(true);
    try {
      await apiFetch(`/api/admin/factions/${faction.id}/translations/${activeLocale}`, {
        method: 'PUT',
        body: JSON.stringify({ name: editName, description: editDesc }),
      });
      const fresh = await apiFetch<Translation[]>(`/api/admin/factions/${faction.id}/translations`);
      onUpdate({ ...faction, translations: fresh });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const { translating: generating, start: startTranslation } = useTranslationJob({
    onDone: async () => {
      const fresh = await apiFetch<Translation[]>(`/api/admin/factions/${faction.id}/translations`);
      onUpdate({ ...faction, translations: fresh });
    },
    onError: () => {},
  });

  const generate = () => startTranslation(`/api/admin/factions/${faction.id}/translate/${activeLocale}`);

  const del = async () => {
    if (!confirm(`Supprimer la traduction "${activeLocale}" ?`)) return;
    await apiFetch(`/api/admin/factions/${faction.id}/translations/${activeLocale}`, { method: 'DELETE' });
    onUpdate({ ...faction, translations: faction.translations.filter(t => t.locale !== activeLocale) });
    setEditing(false);
  };

  return (
    <div className="border-t border-border bg-secondary/10 px-4 py-4">
      {/* Locale tabs */}
      <div className="mb-3 flex items-center gap-1">
        {LOCALES.map(loc => {
          const has = !!getTranslation(faction, loc)?.name;
          return (
            <button
              key={loc}
              onClick={() => { setActiveLocale(loc); setEditing(false); }}
              className={`rounded px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${
                activeLocale === loc
                  ? 'bg-primary/10 text-primary'
                  : has
                  ? 'text-foreground hover:bg-secondary'
                  : 'text-muted-foreground/40 hover:bg-secondary hover:text-muted-foreground'
              }`}
            >
              {loc}
              {has && <span className="ml-1 inline-block h-1 w-1 rounded-full bg-current opacity-60" />}
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={generate}
            disabled={generating}
            title="Générer la traduction"
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10 disabled:opacity-40"
          >
            {generating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
            Générer
          </button>
          {!editing && (
            <button
              onClick={startEdit}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Pencil className="h-3 w-3" />
              Modifier
            </button>
          )}
          {tr && !editing && (
            <button onClick={del} className="rounded p-1 text-muted-foreground/40 transition-colors hover:text-red-400">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {editing ? (
        <div className="space-y-2">
          <input
            value={editName}
            onChange={e => setEditName(e.target.value)}
            placeholder="Nom"
            className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <textarea
            value={editDesc}
            onChange={e => setEditDesc(e.target.value)}
            placeholder="Description"
            rows={3}
            className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
              Enregistrer
            </button>
            <button onClick={cancelEdit} className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      ) : tr?.name ? (
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{tr.name}</p>
          {tr.description && <p className="text-xs text-muted-foreground line-clamp-3">{tr.description}</p>}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground/50 italic">Aucune traduction pour cette langue.</p>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const FactionsAdmin = () => {
  const { user, authLoading } = useAuth();
  const { selectedVersion }   = useVersion();
  const router = useRouter();

  const [data, setData]         = useState<Page | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const [expanded, setExpanded] = useState<number | null>(null);

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
      if (selectedVersion) params.set('version', String(selectedVersion.id));
      const result = await apiFetch<Page>(`/api/admin/factions?${params}`);
      setData(result);
    } catch (e: any) {
      setError(e?.message ?? 'Erreur lors du chargement des factions');
    } finally {
      setLoading(false);
    }
  }, [page, search, user, selectedVersion]);

  useEffect(() => {
    if (user?.roles?.includes('ROLE_ADMIN') && selectedVersion) load();
  }, [user, selectedVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounce search
  useEffect(() => {
    if (!user?.roles?.includes('ROLE_ADMIN')) return;
    const t = setTimeout(() => { setPage(1); load(1, search); }, 350);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const goPage = (p: number) => { setPage(p); load(p, search); };

  const updateFaction = (updated: AdminFaction) => {
    setData(prev => prev ? {
      ...prev,
      items: prev.items.map(f => f.id === updated.id ? updated : f),
    } : prev);
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
                <Swords className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Base de données</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground">Factions</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {data
                  ? `${data.total} faction${data.total > 1 ? 's' : ''}${selectedVersion ? ` — ${selectedVersion.label}` : ''}`
                  : '…'}
              </p>
            </div>
            <button
              onClick={() => load()}
              disabled={loading}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container pb-8 pt-0 space-y-4">

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par nom, classe ou ref…"
              className="h-10 w-full max-w-sm rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {loading && !data ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Faction</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Réaction</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <Globe className="inline h-3.5 w-3.5" />
                      </th>
                      <th className="px-4 py-3 w-8" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data?.items.map(f => {
                      const isOpen = expanded === f.id;
                      const translatedCount = f.translations.filter(t => t.name).length;
                      return (
                        <>
                          <tr
                            key={f.id}
                            className="bg-card transition-colors hover:bg-secondary/20 cursor-pointer"
                            onClick={() => setExpanded(isOpen ? null : f.id)}
                          >
                            <td className="px-4 py-3">
                              <p className="font-semibold text-foreground">{getName(f)}</p>
                              <p className="text-[10px] text-muted-foreground/50 font-mono">{f.ref}</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_COLORS[f.factionType] ?? 'bg-secondary text-muted-foreground'}`}>
                                {f.factionType}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${REACTION_COLORS[f.defaultReaction] ?? 'bg-secondary text-muted-foreground border-border'}`}>
                                {f.defaultReaction}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-xs text-muted-foreground">
                                {translatedCount}/{LOCALES.length}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </td>
                          </tr>
                          {isOpen && (
                            <tr key={`${f.id}-panel`} className="bg-card">
                              <td colSpan={5} className="p-0">
                                <TranslationPanel faction={f} onUpdate={updateFaction} />
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                    {data?.items.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                          Aucune faction trouvée.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">
                    Page {page} / {totalPages}
                  </span>
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

export default FactionsAdmin;
