'use client';
import { useState, useEffect, useCallback } from "react";
import {
  Pencil, Clock, CheckCircle2, XCircle, ChevronLeft, ChevronRight,
  Loader2, Trophy, Filter,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";

interface ProposalItem {
  id: number;
  status: 'pending' | 'approved' | 'rejected';
  proposedChanges: Record<string, { old: string | null; new: string }>;
  reviewerNote: string | null;
  reviewedAt: string | null;
  pointsAwarded: number;
  createdAt: string;
  user: { id: number; name: string; email: string; contributorPoints: number };
  reviewedBy: { id: number; name: string } | null;
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
    pending:  { label: 'En attente', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',        Icon: Clock         },
    approved: { label: 'Acceptée',   color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',  Icon: CheckCircle2  },
    rejected: { label: 'Refusée',    color: 'bg-red-500/10 text-red-400 border-red-500/30',              Icon: XCircle       },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${config.color}`}>
      <config.Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
};

const ReviewModal = ({
  proposal,
  action,
  onConfirm,
  onClose,
}: {
  proposal: ProposalItem;
  action: 'approve' | 'reject';
  onConfirm: (note: string) => Promise<void>;
  onClose: () => void;
}) => {
  const [note, setNote]       = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    await onConfirm(note);
    setLoading(false);
  };

  const isApprove = action === 'approve';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="border-b border-border/60 px-5 py-4">
          <h3 className="font-display text-sm font-bold">
            {isApprove ? 'Accepter la proposition' : 'Refuser la proposition'}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{proposal.item.name}</p>
        </div>

        <div className="px-5 py-4 space-y-3">
          <div className="rounded-lg border border-border/40 bg-background/40 p-3 space-y-1.5">
            {Object.entries(proposal.proposedChanges).map(([field, change]) => (
              <div key={field} className="text-xs flex items-start gap-2">
                <span className="text-muted-foreground font-medium shrink-0">{FIELD_LABEL[field] ?? field} :</span>
                <span className="text-emerald-400 truncate">{change.new}</span>
              </div>
            ))}
          </div>

          {isApprove && (
            <p className="text-xs text-muted-foreground">
              L'utilisateur <span className="font-semibold text-foreground">{proposal.user.name}</span> recevra{' '}
              <span className="text-amber-400 font-semibold">+{Object.keys(proposal.proposedChanges).length} points</span>.
            </p>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Note (optionnelle)
            </label>
            <textarea
              rows={2}
              className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Message pour le contributeur..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border/60 px-5 py-4">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/20 transition-colors">
            Annuler
          </button>
          <button
            onClick={handle}
            disabled={loading}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
              isApprove ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'
            }`}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isApprove ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {isApprove ? 'Accepter' : 'Refuser'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ContributionsAdmin = () => {
  const [data, setData]       = useState<ProposalsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [reviewing, setReviewing] = useState<{ proposal: ProposalItem; action: 'approve' | 'reject' } | null>(null);

  const load = useCallback(async (p: number, s: string) => {
    setLoading(true);
    try {
      const res = await apiFetch<ProposalsPage>(`/api/admin/proposals?page=${p}&pageSize=20&status=${s}`);
      setData(res);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page, statusFilter); }, [page, statusFilter, load]);

  const handleAction = async (proposal: ProposalItem, action: 'approve' | 'reject', note: string) => {
    await apiFetch(`/api/admin/proposals/${proposal.id}/${action}`, {
      method: 'PATCH',
      body: JSON.stringify({ note }),
    });
    setReviewing(null);
    load(page, statusFilter);
  };

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 1;

  return (
    <AdminLayout>
      <div className="relative min-h-screen bg-background">

        {/* Hero */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
          <img src="/hero-bg.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" style={{ objectPosition: "50% 30%" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
        </div>

        <div className="relative container py-10">
          <div className="flex items-center gap-3 mb-8">
            <Pencil className="h-6 w-6 text-primary" />
            <h1 className="font-display text-2xl font-bold">Contributions</h1>
            {data && (
              <span className="ml-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                {data.total}
              </span>
            )}
          </div>

          {/* Filtres */}
          <div className="mb-6 flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            {(['pending', 'approved', 'rejected', 'all'] as const).map(s => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  statusFilter === s
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:bg-muted/20'
                }`}
              >
                {{ pending: 'En attente', approved: 'Acceptées', rejected: 'Refusées', all: 'Toutes' }[s]}
              </button>
            ))}
          </div>

          {/* Liste */}
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="rounded-xl border border-border/50 bg-card/60 p-5 animate-pulse">
                  <div className="h-4 w-64 rounded bg-muted/40" />
                </div>
              ))}
            </div>
          ) : !data || data.items.length === 0 ? (
            <div className="rounded-xl border border-border/50 bg-card/30 py-16 text-center text-muted-foreground">
              Aucune proposition dans cette catégorie.
            </div>
          ) : (
            <div className="space-y-3">
              {data.items.map(p => (
                <div key={p.id} className="rounded-xl border border-border/50 bg-card/60 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center gap-3 px-5 py-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground truncate">{p.item.name}</span>
                        <StatusBadge status={p.status} />
                        {p.status === 'approved' && (
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                            <Trophy className="h-3.5 w-3.5" />+{p.pointsAwarded}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Par <span className="font-semibold text-foreground/70">{p.user.name}</span>
                        {' · '}{new Date(p.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {p.item.manufacturer && ` · ${p.item.manufacturer}`}
                      </p>
                    </div>

                    {p.status === 'pending' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setReviewing({ proposal: p, action: 'reject' })}
                          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          Refuser
                        </button>
                        <button
                          onClick={() => setReviewing({ proposal: p, action: 'approve' })}
                          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                        >
                          Accepter
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Changements */}
                  <div className="border-t border-border/30 px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(p.proposedChanges).map(([field, change]) => (
                        <div key={field} className="rounded-lg border border-border/40 bg-background/40 px-3 py-1.5 text-xs">
                          <span className="text-muted-foreground font-medium">{FIELD_LABEL[field] ?? field}</span>
                          <div className="mt-0.5 flex items-center gap-1.5">
                            {change.old && (
                              <span className="text-red-400/70 line-through truncate max-w-[120px]">{change.old}</span>
                            )}
                            {change.old && <span className="text-muted-foreground/40">→</span>}
                            <span className="text-emerald-400 truncate max-w-[120px]">{change.new}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Note admin */}
                  {p.reviewerNote && (
                    <div className="border-t border-border/30 bg-muted/10 px-5 py-2.5">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground/70">Note :</span> {p.reviewerNote}
                        {p.reviewedBy && <span className="ml-2 text-muted-foreground/50">— {p.reviewedBy.name}</span>}
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
              <span className="text-sm text-muted-foreground">Page {page} / {totalPages}</span>
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

      {reviewing && (
        <ReviewModal
          proposal={reviewing.proposal}
          action={reviewing.action}
          onConfirm={(note) => handleAction(reviewing.proposal, reviewing.action, note)}
          onClose={() => setReviewing(null)}
        />
      )}
    </AdminLayout>
  );
};

export default ContributionsAdmin;
