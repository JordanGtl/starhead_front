'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookMarked, Search, Plus, Pencil, Trash2, Loader2,
  RefreshCw, Check, X, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import {
  fetchAdminGlossary,
  createGlossaryTerm,
  updateGlossaryTerm,
  deleteGlossaryTerm,
  GLOSSARY_CATEGORIES,
  type GlossaryTermItem,
  type GlossaryCategory,
} from '@/data/adminGlossary';

const PAGE_SIZE = 50;

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  GLOSSARY_CATEGORIES.map(({ value, label }) => [value, label]),
);

// ── Formulaire inline ─────────────────────────────────────────────────────────

interface TermFormProps {
  initial?: { term: string; category: GlossaryCategory | null };
  onSave: (term: string, category: GlossaryCategory | null) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

const TermForm = ({ initial, onSave, onCancel, saving }: TermFormProps) => {
  const [term, setTerm]         = useState(initial?.term ?? '');
  const [category, setCategory] = useState<GlossaryCategory | null>(initial?.category ?? null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) return;
    await onSave(term.trim(), category);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2 p-3 bg-secondary/30 rounded-lg">
      <input
        autoFocus
        type="text"
        value={term}
        onChange={e => setTerm(e.target.value)}
        placeholder="Terme exact…"
        className="flex-1 min-w-40 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <select
        value={category ?? ''}
        onChange={e => setCategory((e.target.value as GlossaryCategory) || null)}
        className="rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="">— Catégorie —</option>
        {GLOSSARY_CATEGORIES.map(c => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={saving || !term.trim()}
        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
        Enregistrer
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" />
        Annuler
      </button>
    </form>
  );
};

// ── Page principale ───────────────────────────────────────────────────────────

const GlossaryAdmin = () => {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  const [items, setItems]     = useState<GlossaryTermItem[]>([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [q, setQ]             = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');

  const [adding, setAdding]         = useState(false);
  const [savingAdd, setSavingAdd]   = useState(false);
  const [editingId, setEditingId]   = useState<number | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const [error, setError]   = useState<string | null>(null);

  // Guard admin
  useEffect(() => {
    if (!authLoading && (!user || !user.roles?.includes('ROLE_ADMIN'))) {
      router.replace('/');
    }
  }, [authLoading, user, router]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQ(q);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminGlossary({ page, pagesize: PAGE_SIZE, q: debouncedQ });
      setItems(data.items);
      setTotal(data.total);
    } catch {
      setError('Impossible de charger le glossaire.');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedQ]);

  useEffect(() => {
    if (user?.roles?.includes('ROLE_ADMIN')) load();
  }, [user, load]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleAdd = async (term: string, category: GlossaryCategory | null) => {
    setSavingAdd(true);
    setError(null);
    try {
      const created = await createGlossaryTerm({ term, category });
      setItems(prev => [created, ...prev]);
      setTotal(prev => prev + 1);
      setAdding(false);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Erreur lors de la création.';
      setError(msg);
    } finally {
      setSavingAdd(false);
    }
  };

  const handleEdit = async (term: string, category: GlossaryCategory | null) => {
    if (!editingId) return;
    setSavingEdit(true);
    setError(null);
    try {
      const updated = await updateGlossaryTerm(editingId, { term, category });
      setItems(prev => prev.map(x => x.id === editingId ? updated : x));
      setEditingId(null);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Erreur lors de la modification.';
      setError(msg);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    setError(null);
    try {
      await deleteGlossaryTerm(id);
      setItems(prev => prev.filter(x => x.id !== id));
      setTotal(prev => prev - 1);
    } catch {
      setError('Erreur lors de la suppression.');
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (authLoading || !user?.roles?.includes('ROLE_ADMIN')) return null;

  return (
    <AdminLayout>
      <div className="relative min-h-screen bg-background">

        {/* Fond décoratif */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
          <img src="/hero-bg.jpg" alt="" aria-hidden className="h-full w-full object-cover opacity-30" style={{ objectPosition: '50% 30%' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex min-h-[18vh] items-center">
          <div className="container pb-2 pt-8 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Administration</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground">Glossaire</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {total} terme{total > 1 ? 's' : ''} protégé{total > 1 ? 's' : ''} de la traduction automatique
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={load}
                disabled={loading}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
              <button
                onClick={() => { setAdding(true); setEditingId(null); }}
                disabled={adding}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Ajouter un terme
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container pb-8 pt-0 space-y-4">

          {/* Barre de recherche */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Rechercher un terme ou une catégorie…"
              className="w-full rounded-lg border border-border bg-card pl-9 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Erreur */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Formulaire ajout */}
          {adding && (
            <TermForm
              onSave={handleAdd}
              onCancel={() => setAdding(false)}
              saving={savingAdd}
            />
          )}

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <BookMarked className="mb-4 h-12 w-12 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">
                {debouncedQ ? 'Aucun terme ne correspond à votre recherche.' : 'Aucun terme dans le glossaire.'}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Terme</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Catégorie</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ajouté le</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map(item => (
                    <>
                      <tr key={item.id} className="bg-card transition-colors hover:bg-secondary/20">
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm font-medium text-foreground">{item.term}</span>
                        </td>
                        <td className="px-4 py-3">
                          {item.category ? (
                            <span className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                              {CATEGORY_LABELS[item.category] ?? item.category}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => { setEditingId(item.id); setAdding(false); setConfirmDelete(null); }}
                              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                              title="Modifier"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            {confirmDelete === item.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  disabled={deletingId === item.id}
                                  className="rounded-md p-1.5 text-red-400 transition-colors hover:bg-red-500/10"
                                  title="Confirmer la suppression"
                                >
                                  {deletingId === item.id
                                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    : <Check className="h-3.5 w-3.5" />
                                  }
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setConfirmDelete(item.id); setEditingId(null); }}
                                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
                                title="Supprimer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {editingId === item.id && (
                        <tr key={`edit-${item.id}`} className="bg-secondary/10">
                          <td colSpan={4} className="px-4 py-2">
                            <TermForm
                              initial={{ term: item.term, category: item.category }}
                              onSave={handleEdit}
                              onCancel={() => setEditingId(null)}
                              saving={savingEdit}
                            />
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Page {page} / {totalPages} — {total} termes
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1 || loading}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || loading}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default GlossaryAdmin;
