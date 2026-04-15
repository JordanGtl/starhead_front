'use client';
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Pencil, Clock, CheckCircle2, XCircle, ChevronLeft, ChevronRight,
  Star, Trophy, Package,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { slugify } from "@/lib/slugify";
import { useAuth } from "@/contexts/AuthContext";

interface ProposalItem {
  id: number;
  status: 'pending' | 'approved' | 'rejected';
  proposedChanges: Record<string, { old: string | null; new: string }>;
  reviewerNote: string | null;
  reviewedAt: string | null;
  pointsAwarded: number;
  createdAt: string;
  item: {
    id: number;
    dataId: number;
    internalName: string;
    name: string;
    type: string | null;
    manufacturer: string | null;
  };
}

interface ProposalsPage {
  total: number;
  page: number;
  pageSize: number;
  items: ProposalItem[];
}

const FIELD_LABEL: Record<string, string> = {
  name_fr:        'Nom (FR)',
  name_en:        'Nom (EN)',
  short_name_fr:  'Nom court (FR)',
  short_name_en:  'Nom court (EN)',
  description_fr: 'Description (FR)',
  description_en: 'Description (EN)',
  manufacturer:   'Fabricant',
};

const StatusBadge = ({ status }: { status: ProposalItem['status'] }) => {
  const config = {
    pending:  { label: 'En attente', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',    Icon: Clock         },
    approved: { label: 'Acceptée',   color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', Icon: CheckCircle2 },
    rejected: { label: 'Refusée',    color: 'bg-red-500/10 text-red-400 border-red-500/30',           Icon: XCircle      },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${config.color}`}>
      <config.Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
};

const MyContributions = () => {
  const { user, isAuthenticated, authLoading } = useAuth();
  const [data, setData]       = useState<ProposalsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await apiFetch<ProposalsPage>(`/api/proposals/mine?page=${p}&pageSize=10`);
      setData(res);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated) load(page);
  }, [page, load, isAuthenticated, authLoading]);

  if (authLoading) return null;

  if (!isAuthenticated) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Pencil className="mb-4 h-12 w-12 text-muted-foreground/20" />
        <h1 className="font-display text-2xl font-bold">Connexion requise</h1>
        <p className="mt-2 text-muted-foreground">Connecte-toi pour voir tes contributions.</p>
        <Link href="/auth/login" className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          Se connecter
        </Link>
      </div>
    );
  }

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 1;

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border/50 bg-card/30">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        </div>
        <div className="container relative py-10">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
              <Pencil className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Mes contributions</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Propositions de modifications soumises à la modération
              </p>
            </div>
            {user && (
              <div className="ml-auto flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Points</span>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-amber-400" />
                    <span className="font-display text-xl font-bold text-amber-400 tabular-nums">
                      {user.contributorPoints ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container py-8">

        {/* Stats rapides */}
        {data && (
          <div className="mb-6 grid grid-cols-3 gap-3">
            {[
              { label: 'Total',     value: data.total,                                                        color: 'text-foreground' },
              { label: 'Acceptées', value: data.items.filter(i => i.status === 'approved').length,             color: 'text-emerald-400' },
              { label: 'En attente',value: data.items.filter(i => i.status === 'pending').length,              color: 'text-amber-400' },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-border/50 bg-card/60 px-4 py-3 text-center">
                <p className={`font-display text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Liste */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="rounded-xl border border-border/50 bg-card/60 p-5 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted/40 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-48 rounded bg-muted/40" />
                    <div className="h-2.5 w-32 rounded bg-muted/30" />
                  </div>
                  <div className="h-5 w-20 rounded-full bg-muted/40" />
                </div>
              </div>
            ))}
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card/30 py-16 text-center">
            <Package className="h-10 w-10 text-muted-foreground/20" />
            <p className="font-semibold text-muted-foreground">Aucune contribution pour l'instant</p>
            <p className="text-sm text-muted-foreground/60">Rends-toi sur une page composant pour proposer une modification.</p>
            <Link href="/components" className="mt-2 text-sm text-primary hover:underline">Parcourir les composants →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {data.items.map(p => (
              <div key={p.id} className="rounded-xl border border-border/50 bg-card/60 overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-secondary shrink-0">
                    <Pencil className="h-4.5 w-4.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/components/${p.item.id}/${slugify(p.item.name)}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block">
                      {p.item.name}
                    </Link>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {new Date(p.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {p.item.manufacturer && ` · ${p.item.manufacturer}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {p.status === 'approved' && p.pointsAwarded > 0 && (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                        <Star className="h-3.5 w-3.5" />
                        +{p.pointsAwarded}
                      </span>
                    )}
                    <StatusBadge status={p.status} />
                  </div>
                </div>

                {/* Détail des changements */}
                <div className="border-t border-border/30 px-5 py-3">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(p.proposedChanges).map(([field, change]) => (
                      <div key={field} className="rounded-lg border border-border/40 bg-background/40 px-3 py-1.5 text-xs">
                        <span className="text-muted-foreground font-medium">{FIELD_LABEL[field] ?? field}</span>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          {change.old && (
                            <span className="text-red-400/70 line-through truncate max-w-[100px]">{change.old}</span>
                          )}
                          {change.old && <span className="text-muted-foreground/40">→</span>}
                          <span className="text-emerald-400 truncate max-w-[100px]">{change.new}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Note admin si refusée */}
                {p.reviewerNote && (
                  <div className="border-t border-border/30 bg-muted/10 px-5 py-3">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground/70">Note du modérateur :</span>{' '}
                      {p.reviewerNote}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" /> Précédent
            </button>
            <span className="text-sm text-muted-foreground">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Suivant <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyContributions;
