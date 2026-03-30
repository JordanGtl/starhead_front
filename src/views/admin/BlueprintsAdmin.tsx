'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ScrollText, Search, RefreshCw, Loader2, ChevronLeft, ChevronRight,
  Globe, Pencil, Sparkles, Check, X, Trash2, ChevronDown, Package,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useVersion } from '@/contexts/VersionContext';
import { apiFetch } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BpTranslation {
  locale: string;
  name: string | null;
}

interface AdminBlueprint {
  id: number;
  blueprintId: number;
  ref: string;
  internalName: string | null;
  blueprintType: string | null;
  outputRef: string | null;
  outputType: string | null;
  outputSubType: string | null;
  outputManufacturer: string | null;
  craftTimeSec: number | null;
  ingredientCount: number;
  version: { id: number; label: string };
  translations: BpTranslation[];
}

interface Ingredient {
  ref: string;
  name: string | null;
  internalName: string | null;
  type: string | null;
  subType: string | null;
  manufacturer: string | null;
  size: number | null;
  grade: number | null;
  quantity: number | null;
  unit: string | null;
  minQuality: number | null;
  tier: number;
  isMandatory: boolean;
  resolved: boolean;
}

interface Page {
  total: number;
  page: number;
  pagesize: number;
  items: AdminBlueprint[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LOCALES = ['en', 'fr', 'de', 'es'];

function getName(bp: AdminBlueprint, locale = 'en') {
  return (
    bp.translations.find(t => t.locale === locale)?.name ??
    bp.translations.find(t => t.locale === 'en')?.name ??
    bp.internalName ??
    bp.ref
  );
}

function formatCraftTime(sec: number | null): string {
  if (!sec) return '—';
  if (sec < 60) return `${sec}s`;
  if (sec < 3600) return `${Math.round(sec / 60)}min`;
  return `${(sec / 3600).toFixed(1)}h`;
}

const TYPE_COLORS: Record<string, string> = {
  Ship:        'bg-blue-500/10 text-blue-400',
  Weapon:      'bg-red-500/10 text-red-400',
  Component:   'bg-purple-500/10 text-purple-400',
  Armor:       'bg-orange-500/10 text-orange-400',
  Consumable:  'bg-green-500/10 text-green-400',
};

// ─── Translation panel ────────────────────────────────────────────────────────

function TranslationPanel({
  bp,
  onUpdate,
}: {
  bp: AdminBlueprint;
  onUpdate: (updated: AdminBlueprint) => void;
}) {
  const [activeLocale, setActiveLocale] = useState('fr');
  const [editName, setEditName]         = useState('');
  const [editing, setEditing]           = useState(false);
  const [saving, setSaving]             = useState(false);
  const [generating, setGenerating]     = useState(false);

  const tr = bp.translations.find(t => t.locale === activeLocale);

  const startEdit = () => {
    setEditName(tr?.name ?? '');
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const save = async () => {
    setSaving(true);
    try {
      await apiFetch(`/api/admin/blueprints/${bp.id}/translations/${activeLocale}`, {
        method: 'PUT',
        body: JSON.stringify({ name: editName }),
      });
      const fresh = await apiFetch<BpTranslation[]>(`/api/admin/blueprints/${bp.id}/translations`);
      onUpdate({ ...bp, translations: fresh });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const generate = async () => {
    setGenerating(true);
    try {
      const t = await apiFetch<BpTranslation>(
        `/api/admin/blueprints/${bp.id}/translate/${activeLocale}`,
        { method: 'POST' }
      );
      const fresh = bp.translations.filter(x => x.locale !== activeLocale);
      onUpdate({ ...bp, translations: [...fresh, t] });
    } finally {
      setGenerating(false);
    }
  };

  const del = async () => {
    if (!confirm(`Supprimer la traduction "${activeLocale}" ?`)) return;
    await apiFetch(`/api/admin/blueprints/${bp.id}/translations/${activeLocale}`, { method: 'DELETE' });
    onUpdate({ ...bp, translations: bp.translations.filter(t => t.locale !== activeLocale) });
    setEditing(false);
  };

  return (
    <div className="border-t border-border bg-secondary/10 px-4 py-4 space-y-4">
      {/* Locale tabs */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Traductions
        </p>
        <div className="flex items-center gap-1">
          {LOCALES.map(loc => {
            const has = !!bp.translations.find(t => t.locale === loc)?.name;
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
              title="Générer avec Gemini"
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
            {tr?.name && !editing && (
              <button onClick={del} className="rounded p-1 text-muted-foreground/40 transition-colors hover:text-red-400">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {editing ? (
          <div className="mt-2 space-y-2">
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              placeholder="Nom"
              className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
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
          <p className="mt-2 text-sm font-semibold text-foreground">{tr.name}</p>
        ) : (
          <p className="mt-2 text-xs italic text-muted-foreground/50">Aucune traduction pour cette langue.</p>
        )}
      </div>
    </div>
  );
}

// ─── Ingredients panel ────────────────────────────────────────────────────────

function IngredientCard({ ing }: { ing: Ingredient }) {
  const displayName = ing.name ?? ing.internalName ?? ing.ref;
  const badges: string[] = [];
  if (ing.type) badges.push(ing.type);
  if (ing.subType) badges.push(ing.subType);

  return (
    <div className={`rounded-lg border px-3 py-2 ${
      ing.resolved
        ? 'border-border bg-card'
        : 'border-dashed border-border/50 bg-secondary/20'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-foreground">{displayName}</p>
          {ing.manufacturer && (
            <p className="text-[10px] text-muted-foreground/60">{ing.manufacturer}</p>
          )}
          {!ing.resolved && (
            <p className="text-[10px] text-yellow-500/70 font-mono">{ing.ref}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {ing.quantity != null && (
            <span className="text-xs font-semibold text-primary">
              ×{ing.quantity}{ing.unit ? ` ${ing.unit}` : ''}
            </span>
          )}
          {(ing.size != null || ing.grade != null) && (
            <span className="text-[10px] text-muted-foreground">
              {ing.size != null ? `S${ing.size}` : ''}{ing.grade != null ? ` G${ing.grade}` : ''}
            </span>
          )}
        </div>
      </div>
      {badges.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {badges.map(b => (
            <span key={b} className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {b}
            </span>
          ))}
          {ing.minQuality != null && (
            <span className="rounded bg-yellow-500/10 px-1.5 py-0.5 text-[10px] text-yellow-400">
              min {ing.minQuality}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function IngredientsPanel({ bpId }: { bpId: number }) {
  const [ingredients, setIngredients] = useState<Ingredient[] | null>(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    apiFetch<Ingredient[]>(`/api/admin/blueprints/${bpId}/ingredients`)
      .then(setIngredients)
      .finally(() => setLoading(false));
  }, [bpId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!ingredients?.length) {
    return <p className="px-4 py-3 text-xs italic text-muted-foreground/50">Aucun ingrédient trouvé.</p>;
  }

  const tiers = [...new Set(ingredients.map(i => i.tier))].sort((a, b) => a - b);
  const unresolved = ingredients.filter(i => !i.resolved).length;

  return (
    <div className="space-y-4 px-4 py-3">
      {unresolved > 0 && (
        <p className="text-[11px] text-yellow-500/70">
          {unresolved} ingrédient{unresolved > 1 ? 's' : ''} non résolu{unresolved > 1 ? 's' : ''} (item non importé)
        </p>
      )}
      {tiers.map(tier => {
        const mandatory = ingredients.filter(i => i.tier === tier && i.isMandatory);
        const optional  = ingredients.filter(i => i.tier === tier && !i.isMandatory);
        return (
          <div key={tier}>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              Tier {tier}
            </p>
            {mandatory.length > 0 && (
              <div className="mb-2">
                <p className="mb-1.5 text-[10px] text-green-400/70">Obligatoires ({mandatory.length})</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {mandatory.map(ing => <IngredientCard key={ing.ref + ing.tier} ing={ing} />)}
                </div>
              </div>
            )}
            {optional.length > 0 && (
              <div>
                <p className="mb-1.5 text-[10px] text-yellow-400/70">Optionnels ({optional.length})</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {optional.map(ing => <IngredientCard key={ing.ref + ing.tier} ing={ing} />)}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Expanded row ─────────────────────────────────────────────────────────────

function ExpandedRow({
  bp,
  onUpdate,
}: {
  bp: AdminBlueprint;
  onUpdate: (updated: AdminBlueprint) => void;
}) {
  const [tab, setTab] = useState<'translations' | 'ingredients'>('translations');

  return (
    <tr className="bg-card">
      <td colSpan={7} className="p-0">
        {/* Detail header */}
        <div className="border-t border-border bg-secondary/5 px-4 py-2 flex items-center gap-3 text-[11px] text-muted-foreground">
          {bp.outputManufacturer && (
            <span>{bp.outputManufacturer}</span>
          )}
          {bp.outputSubType && (
            <span className="text-muted-foreground/50">{bp.outputSubType}</span>
          )}
          <span className="font-mono text-muted-foreground/40">{bp.ref}</span>
        </div>

        {/* Tabs */}
        <div className="border-b border-border flex items-center gap-1 px-4 pt-1">
          <button
            onClick={() => setTab('translations')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
              tab === 'translations' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Globe className="h-3 w-3" />
            Traductions
          </button>
          <button
            onClick={() => setTab('ingredients')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
              tab === 'ingredients' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Package className="h-3 w-3" />
            Ingrédients ({bp.ingredientCount})
          </button>
        </div>

        {tab === 'translations' ? (
          <TranslationPanel bp={bp} onUpdate={onUpdate} />
        ) : (
          <div className="bg-secondary/10">
            <IngredientsPanel bpId={bp.id} />
          </div>
        )}
      </td>
    </tr>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const BlueprintsAdmin = () => {
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
      const result = await apiFetch<Page>(`/api/admin/blueprints?${params}`);
      setData(result);
    } catch (e: any) {
      setError(e?.message ?? 'Erreur lors du chargement des blueprints');
    } finally {
      setLoading(false);
    }
  }, [page, search, user, selectedVersion]);

  useEffect(() => {
    if (user?.roles?.includes('ROLE_ADMIN')) load();
  }, [user, selectedVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounce search
  useEffect(() => {
    if (!user?.roles?.includes('ROLE_ADMIN')) return;
    const t = setTimeout(() => { setPage(1); load(1, search); }, 350);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const goPage = (p: number) => { setPage(p); load(p, search); };

  const updateBlueprint = (updated: AdminBlueprint) => {
    setData(prev => prev ? {
      ...prev,
      items: prev.items.map(b => b.id === updated.id ? updated : b),
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
                <ScrollText className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Base de données</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground">Blueprints</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {data
                  ? `${data.total} blueprint${data.total > 1 ? 's' : ''}${selectedVersion ? ` — ${selectedVersion.label}` : ''}`
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
              placeholder="Rechercher par nom, type, fabricant…"
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
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nom</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Output</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Craft</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                        <Package className="inline h-3.5 w-3.5" />
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <Globe className="inline h-3.5 w-3.5" />
                      </th>
                      <th className="px-4 py-3 w-8" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data?.items.map(bp => {
                      const isOpen = expanded === bp.id;
                      const translatedCount = bp.translations.filter(t => t.name).length;
                      return (
                        <>
                          <tr
                            key={bp.id}
                            className="bg-card transition-colors hover:bg-secondary/20 cursor-pointer"
                            onClick={() => setExpanded(isOpen ? null : bp.id)}
                          >
                            <td className="px-4 py-3">
                              <p className="font-semibold text-foreground">{getName(bp)}</p>
                              <p className="text-[10px] text-muted-foreground/50 font-mono">{bp.internalName}</p>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              {bp.blueprintType && (
                                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_COLORS[bp.blueprintType] ?? 'bg-secondary text-muted-foreground'}`}>
                                  {bp.blueprintType}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <p className="text-xs text-foreground">{bp.outputType}</p>
                              {bp.outputManufacturer && (
                                <p className="text-[10px] text-muted-foreground/60">{bp.outputManufacturer}</p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right hidden sm:table-cell">
                              <span className="text-xs text-muted-foreground">{formatCraftTime(bp.craftTimeSec)}</span>
                            </td>
                            <td className="px-4 py-3 text-right hidden sm:table-cell">
                              <span className="text-xs text-muted-foreground">{bp.ingredientCount}</span>
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
                            <ExpandedRow
                              key={`${bp.id}-expanded`}
                              bp={bp}
                              onUpdate={updateBlueprint}
                            />
                          )}
                        </>
                      );
                    })}
                    {data?.items.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                          Aucun blueprint trouvé.
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

export default BlueprintsAdmin;
