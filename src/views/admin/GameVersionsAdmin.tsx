'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, Wifi, WifiOff, Calendar, RefreshCw, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';

interface GameVersion {
  id: number;
  label: string;
  isLive: boolean;
  releasedAt: string | null;
  importedAt: string;
  notes: string | null;
  factionCount: number;
}

const GameVersionsAdmin = () => {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const [versions, setVersions]       = useState<GameVersion[]>([]);
  const [loading, setLoading]         = useState(true);
  const [settingLive, setSettingLive] = useState<number | null>(null);

  // Guard admin
  useEffect(() => {
    if (!authLoading && (!user || !user.roles?.includes('ROLE_ADMIN'))) {
      router.replace('/');
    }
  }, [authLoading, user, router]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<GameVersion[]>('/api/game-versions');
      setVersions(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.roles?.includes('ROLE_ADMIN')) load();
  }, [user, load]);

  const setLive = async (v: GameVersion) => {
    if (v.isLive) return;
    setSettingLive(v.id);
    try {
      await apiFetch(`/api/game-versions/${v.id}/set-live`, { method: 'POST' });
      setVersions(prev => prev.map(x => ({ ...x, isLive: x.id === v.id })));
    } finally {
      setSettingLive(null);
    }
  };

  if (authLoading || !user?.roles?.includes('ROLE_ADMIN')) return null;

  const liveVersion   = versions.find(v => v.isLive);
  const otherVersions = versions.filter(v => !v.isLive);

  return (
    <AdminLayout>
      <div className="relative min-h-screen bg-background">

        {/* Image de fond */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
          <img src="/hero-bg.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" style={{ objectPosition: "50% 30%" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex min-h-[18vh] items-center">
          <div className="container pb-2 pt-8 flex items-end justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Administration</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground">Versions du jeu</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {versions.length} version{versions.length > 1 ? 's' : ''} importée{versions.length > 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={load}
              disabled={loading}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container pb-8 pt-0 space-y-6">

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Version live */}
              {liveVersion && (
                <div>
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Version active
                  </p>
                  <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10">
                          <Wifi className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{liveVersion.label}</span>
                            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-semibold text-green-400">
                              LIVE
                            </span>
                          </div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            {liveVersion.releasedAt && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Sortie le {new Date(liveVersion.releasedAt).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Importée le {new Date(liveVersion.importedAt).toLocaleDateString('fr-FR')}
                            </span>
                            <span>{liveVersion.factionCount} factions</span>
                          </div>
                          {liveVersion.notes && (
                            <p className="mt-1.5 text-xs text-muted-foreground">{liveVersion.notes}</p>
                          )}
                        </div>
                      </div>
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* Autres versions */}
              {otherVersions.length > 0 && (
                <div>
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Autres versions
                  </p>
                  <div className="overflow-hidden rounded-xl border border-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-secondary/30">
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Version</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date de sortie</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Importée le</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Factions</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {otherVersions.map(v => (
                          <tr key={v.id} className="bg-card transition-colors hover:bg-secondary/20">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                                  <WifiOff className="h-3.5 w-3.5" />
                                </div>
                                <span className="font-semibold text-foreground">{v.label}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {v.releasedAt
                                ? new Date(v.releasedAt).toLocaleDateString('fr-FR')
                                : <span className="text-muted-foreground/40">—</span>
                              }
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {new Date(v.importedAt).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{v.factionCount}</td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => setLive(v)}
                                disabled={settingLive === v.id}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
                              >
                                {settingLive === v.id
                                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  : <Wifi className="h-3.5 w-3.5" />
                                }
                                Définir comme live
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {versions.length === 0 && (
                <div className="flex flex-col items-center py-20 text-center">
                  <Tag className="mb-4 h-12 w-12 text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground">Aucune version importée</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default GameVersionsAdmin;
