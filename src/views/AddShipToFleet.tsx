'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Rocket, Search, Loader2, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserFleet } from '@/hooks/useUserFleet';
import { apiFetch, API_URL } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import { useSEO } from '@/hooks/useSEO';

interface ShipDefSuggestion {
  id:           number;
  name:         string;
  manufacturer: string | null;
  image:        string | null;
}

export default function AddShipToFleet() {
  const { isAuthenticated, authLoading } = useAuth();
  const router = useRouter();
  const { add } = useUserFleet();

  useSEO({ title: 'Ajouter un vaisseau', noindex: true });

  // ── Search state ──
  const [query,       setQuery]       = useState('');
  const [suggestions, setSuggestions] = useState<ShipDefSuggestion[]>([]);
  const [searching,   setSearching]   = useState(false);
  const [selected,    setSelected]    = useState<ShipDefSuggestion | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Form state ──
  const [customName, setCustomName] = useState('');
  const [notes,      setNotes]      = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  // ── Auth guard ──
  useEffect(() => {
    if (!authLoading && !isAuthenticated && typeof window !== 'undefined') {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // ── Debounced search ──
  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setSearching(true);
    try {
      const data = await apiFetch<ShipDefSuggestion[]>(
        `/api/ships?q=${encodeURIComponent(q.trim())}`,
      );
      setSuggestions(Array.isArray(data) ? data.slice(0, 10) : []);
    } catch {
      setSuggestions([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (selected) return; // Don't search if something is already selected
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search, selected]);

  const handleSelect = (s: ShipDefSuggestion) => {
    setSelected(s);
    setQuery(s.name);
    setSuggestions([]);
    if (!customName) setCustomName(s.name);
  };

  const handleClearSelection = () => {
    setSelected(null);
    setQuery('');
    setCustomName('');
    setSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const name = customName.trim();
    if (!name && !selected) {
      setError('Veuillez sélectionner un vaisseau ou saisir un nom personnalisé.');
      return;
    }

    setSubmitting(true);
    try {
      await add({
        shipDefId:  selected?.id,
        customName: name || undefined,
        notes:      notes.trim() || undefined,
      });
      router.push('/inventory');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        breadcrumb={[
          { label: 'Mon inventaire', href: '/inventory' },
          { label: 'Ajouter un vaisseau' },
        ]}
        title="Ajouter un vaisseau"
        label="Flotte"
        labelIcon={Rocket}
        subtitle="Recherchez un vaisseau du jeu ou ajoutez un concept ship avec un nom personnalisé."
      />

      <div className="container max-w-2xl pb-16 pt-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Ship search ── */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-1 text-sm font-bold uppercase tracking-widest text-foreground/70">
              Vaisseau
            </h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Recherchez dans la base de données ou laissez vide pour un concept ship.
            </p>

            <div className="relative">
              <div className="relative flex items-center">
                <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground/50" />
                <input
                  type="text"
                  value={query}
                  onChange={e => {
                    if (selected) handleClearSelection();
                    setQuery(e.target.value);
                  }}
                  placeholder="Ex. Constellation Andromeda…"
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
                {(searching) && (
                  <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-muted-foreground/50" />
                )}
                {selected && (
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="absolute right-3 text-muted-foreground/50 hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Suggestions dropdown */}
              {suggestions.length > 0 && !selected && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                  {suggestions.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSelect(s)}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-secondary/40 transition-colors"
                    >
                      <div className="h-9 w-12 flex-shrink-0 overflow-hidden rounded bg-secondary/60">
                        {s.image ? (
                          <img src={`${API_URL}${s.image}`} alt={s.name} className="h-full w-full object-cover opacity-70" />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Rocket className="h-4 w-4 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">{s.name}</p>
                        {s.manufacturer && (
                          <p className="truncate text-xs text-muted-foreground/60">{s.manufacturer}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected ship preview */}
            {selected && (
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
                <div className="h-10 w-14 flex-shrink-0 overflow-hidden rounded bg-secondary/60">
                  {selected.image ? (
                    <img src={`${API_URL}${selected.image}`} alt={selected.name} className="h-full w-full object-cover opacity-80" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Rocket className="h-4 w-4 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{selected.name}</p>
                  {selected.manufacturer && (
                    <p className="truncate text-xs text-muted-foreground/60">{selected.manufacturer}</p>
                  )}
                </div>
                <Check className="h-4 w-4 flex-shrink-0 text-primary" />
              </div>
            )}
          </div>

          {/* ── Custom name + notes ── */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/70">
              Informations
            </h2>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Nom personnalisé <span className="font-normal text-muted-foreground/50">(optionnel)</span>
              </label>
              <input
                type="text"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                placeholder={selected ? selected.name : 'Nom de votre vaisseau…'}
                maxLength={120}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Notes <span className="font-normal text-muted-foreground/50">(optionnel)</span>
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Config, objectif d'achat, commentaire…"
                rows={3}
                maxLength={500}
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* ── Error ── */}
          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          {/* ── Actions ── */}
          <div className="flex items-center gap-3">
            <Link
              href="/inventory"
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Annuler
            </Link>
            <button
              type="submit"
              disabled={submitting || (!selected && !customName.trim())}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Ajouter à ma flotte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
