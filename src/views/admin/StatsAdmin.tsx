'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, Eye, Wrench, Database, TrendingUp, RefreshCw,
  Loader2, CheckCircle2, AlertCircle, Rocket, Newspaper,
  Radio, BarChart2, Activity, Tag,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminStats {
  users: {
    total:            number;
    verified:         number;
    verificationRate: number;
    newThisWeek:      number;
    newThisMonth:     number;
    suspended:        number;
    googleLinked:     number;
    discordLinked:    number;
    signupsPerWeek:   { week: string; count: number }[];
  };
  content: {
    topShips:        { id: number; name: string; views: number }[];
    viewsPerDay:     { day: string; views: number }[];
    viewsLast30d:    number;
    newsTotal:       number;
    newsLastWeek:    number;
    spectrumTotal:   number;
    spectrumLastWeek: number;
  };
  tools: {
    breakdown: { key: string; label: string; uses: number }[];
    total:     number;
  };
  data: {
    lastPriceSync:          string | null;
    shipsWithPrice:         number;
    shipsWithoutPrice:      number;
    priceCoverage:          number;
    lastNewsImport:         string | null;
    spectrumPostsToday:     number;
    spectrumPostsThisWeek:  number;
    liveVersion:            string | null;
    latestImportedVersion:  string | null;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (iso: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const fmtShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });

const fmtWeek = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, sub, icon: Icon, accent = false }: {
  label: string;
  value: string | number;
  sub?: string;
  icon: typeof Users;
  accent?: boolean;
}) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <div className="flex items-start justify-between gap-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className={`rounded-md p-1.5 ${accent ? 'bg-primary/10' : 'bg-secondary'}`}>
        <Icon className={`h-3.5 w-3.5 ${accent ? 'text-primary' : 'text-muted-foreground'}`} />
      </div>
    </div>
    <p className="mt-2 font-display text-2xl font-bold text-foreground">{value}</p>
    {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
  </div>
);

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionHeader = ({ icon: Icon, label }: { icon: typeof Users; label: string }) => (
  <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
    <Icon className="h-4 w-4 text-primary" />
    <h2 className="font-display text-sm font-semibold text-foreground">{label}</h2>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const StatsAdmin = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats]     = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    apiFetch<AdminStats>('/api/admin/stats')
      .then(setStats)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!authLoading && !user) { router.push('/'); return; }
    if (!authLoading) load();
  }, [authLoading, user]);

  return (
    <AdminLayout>
      <div className="p-6 space-y-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Statistiques</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Vue d'ensemble de la plateforme</p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Actualiser
          </button>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {error && !loading && (
          <div className="flex h-40 items-center justify-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" /> Erreur de chargement
          </div>
        )}

        {stats && !loading && (
          <>
            {/* ── Utilisateurs ──────────────────────────────────────────── */}
            <section>
              <SectionHeader icon={Users} label="Utilisateurs & Comptes" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
                <StatCard label="Total inscrits"    value={stats.users.total}            icon={Users}       accent />
                <StatCard label="Vérifiés"          value={`${stats.users.verificationRate}%`} sub={`${stats.users.verified} comptes`} icon={CheckCircle2} />
                <StatCard label="Nouveaux (7j)"     value={stats.users.newThisWeek}      icon={TrendingUp}  />
                <StatCard label="Nouveaux (30j)"    value={stats.users.newThisMonth}     icon={TrendingUp}  />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 mb-6">
                <StatCard label="Suspendus"         value={stats.users.suspended}        icon={AlertCircle} />
                <StatCard label="Liés Google"       value={stats.users.googleLinked}     icon={Users}       />
                <StatCard label="Liés Discord"      value={stats.users.discordLinked}    icon={Users}       />
              </div>
              {stats.users.signupsPerWeek.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="mb-3 text-xs font-medium text-muted-foreground">Inscriptions par semaine (8 sem.)</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={stats.users.signupsPerWeek} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="week" tickFormatter={fmtWeek} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12, color: 'hsl(var(--foreground))' }}
                        labelFormatter={fmtWeek}
                        formatter={(v: number) => [v, 'inscriptions']}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            {/* ── Contenu ───────────────────────────────────────────────── */}
            <section>
              <SectionHeader icon={Eye} label="Contenu" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
                <StatCard label="Vues (30j)"           value={stats.content.viewsLast30d.toLocaleString()} icon={Eye}       accent />
                <StatCard label="Articles de news"     value={stats.content.newsTotal}   sub={`+${stats.content.newsLastWeek} cette semaine`} icon={Newspaper} />
                <StatCard label="Posts Spectrum"       value={stats.content.spectrumTotal.toLocaleString()} sub={`+${stats.content.spectrumLastWeek} cette semaine`} icon={Radio} />
                <StatCard label="Vaisseaux consultés"  value={stats.content.topShips.length > 0 ? stats.content.topShips.reduce((a, s) => a + s.views, 0).toLocaleString() : '0'} icon={Rocket} />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {/* Views per day */}
                {stats.content.viewsPerDay.length > 0 && (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="mb-3 text-xs font-medium text-muted-foreground">Vues par jour (30j)</p>
                    <ResponsiveContainer width="100%" height={160}>
                      <LineChart data={stats.content.viewsPerDay} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="day" tickFormatter={fmtShortDate} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                        <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12, color: 'hsl(var(--foreground))' }}
                          labelFormatter={fmtShortDate}
                          formatter={(v: number) => [v, 'vues']}
                        />
                        <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Top ships */}
                {stats.content.topShips.length > 0 && (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="mb-3 text-xs font-medium text-muted-foreground">Top vaisseaux consultés</p>
                    <div className="space-y-2">
                      {stats.content.topShips.map((ship, i) => (
                        <div key={ship.id} className="flex items-center gap-3">
                          <span className="w-4 shrink-0 text-right text-xs text-muted-foreground/50">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate text-xs font-medium text-foreground">{ship.name ?? `Ship #${ship.id}`}</span>
                              <span className="shrink-0 text-xs text-muted-foreground">{ship.views.toLocaleString()}</span>
                            </div>
                            <div className="mt-1 h-1 rounded-full bg-secondary overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary/40"
                                style={{ width: `${(ship.views / (stats.content.topShips[0]?.views || 1)) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* ── Outils ───────────────────────────────────────────────── */}
            <section>
              <SectionHeader icon={Wrench} label="Outils" />
              <div className="mb-4">
                <StatCard label="Utilisations totales" value={stats.tools.total.toLocaleString()} icon={BarChart2} accent />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {stats.tools.breakdown.map(tool => (
                  <div key={tool.key} className="rounded-lg border border-border bg-card p-4 text-center">
                    <p className="text-2xl font-display font-bold text-foreground">{tool.uses.toLocaleString()}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{tool.label}</p>
                    {stats.tools.total > 0 && (
                      <p className="mt-0.5 text-[10px] text-muted-foreground/50">
                        {Math.round(tool.uses / stats.tools.total * 100)}%
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ── Données & Fraîcheur ───────────────────────────────────── */}
            <section>
              <SectionHeader icon={Database} label="Données & Fraîcheur" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
                <StatCard label="Couverture prix"        value={`${stats.data.priceCoverage}%`} sub={`${stats.data.shipsWithPrice} / ${stats.data.shipsWithPrice + stats.data.shipsWithoutPrice} vaisseaux`} icon={Tag} accent />
                <StatCard label="Sans prix"              value={stats.data.shipsWithoutPrice}  icon={AlertCircle} />
                <StatCard label="Posts Spectrum auj."   value={stats.data.spectrumPostsToday} icon={Activity} />
                <StatCard label="Posts Spectrum (7j)"   value={stats.data.spectrumPostsThisWeek} icon={Radio} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                  <p className="text-xs font-medium text-muted-foreground">Versions du jeu</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Version live</span>
                    <span className="font-mono text-xs font-medium text-foreground">{stats.data.liveVersion ?? '—'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Dernière importée</span>
                    <span className="font-mono text-xs font-medium text-foreground">{stats.data.latestImportedVersion ?? '—'}</span>
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                  <p className="text-xs font-medium text-muted-foreground">Dernières synchronisations</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Prix boutique</span>
                    <span className="text-xs text-foreground">{fmtDate(stats.data.lastPriceSync)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">News</span>
                    <span className="text-xs text-foreground">{fmtDate(stats.data.lastNewsImport)}</span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default StatsAdmin;
