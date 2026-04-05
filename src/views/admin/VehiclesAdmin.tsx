'use client';
import { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import {
  Car, Search, Plus, Loader2, ChevronLeft, ChevronRight,
  ChevronDown, ExternalLink, Users, Box,
  Upload, Trash2, ImageIcon, Eye, EyeOff,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useVersion } from '@/contexts/VersionContext';
import { apiFetch, API_URL } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminVehicle {
  id:            number;
  dataId:        number;
  internalName:  string;
  image:         string | null;
  isPublished:   boolean;
  isInGame:      boolean;
  name:          string;
  manufacturer:  string | null;
  movementClass: string | null;
  role:          string | null;
  crew:          number | null;
  cargo:         number | null;
  versionId:     number | null;
  price:         number | null;
  priceEur:      number | null;
  priceUpdatedAt:string | null;
}

interface Filters {
  manufacturers:   string[];
  roles:           string[];
  movementClasses: string[];
}

interface Page {
  total:    number;
  page:     number;
  pagesize: number;
  items:    AdminVehicle[];
}

const MC_LABEL: Record<string, string> = {
  ArcadeWheeled: 'Terrestre',
  ArcadeHover:   'Hoveur',
};

// ─── Image panel ──────────────────────────────────────────────────────────────

function ImagePanel({
  vehicle,
  onImageChange,
}: {
  vehicle: AdminVehicle;
  onImageChange: (id: number, image: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const toAbsolute = (url: string | null) =>
    url && url.startsWith('/') ? `${API_URL}${url}` : url;

  const [preview,  setPreview]  = useState<string | null>(toAbsolute(vehicle.image));
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setPreview(toAbsolute(vehicle.image)), [vehicle.image]);

  const handleFile = (file: File) => {
    setError(null);
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) { setError('Format non autorisé. Utilisez JPEG, PNG, WebP ou GIF.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Taille maximale : 5 Mo.'); return; }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUri = e.target?.result as string;
      setPreview(dataUri);
      setUploading(true);
      try {
        const res = await apiFetch<{ image: string }>(`/api/admin/vehicles/${vehicle.id}/image`, {
          method: 'PUT',
          body: JSON.stringify({ image: dataUri }),
        });
        const imageUrl = `${API_URL}${res.image}?t=${Date.now()}`;
        setPreview(imageUrl);
        onImageChange(vehicle.id, imageUrl);
      } catch (err: any) {
        setError(err?.message ?? 'Erreur lors de l\'upload.');
        setPreview(vehicle.image);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer l\'image de ce véhicule ?')) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/admin/vehicles/${vehicle.id}/image`, { method: 'DELETE' });
      setPreview(null);
      onImageChange(vehicle.id, null);
    } catch (err: any) {
      setError(err?.message ?? 'Erreur lors de la suppression.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Image</p>

      {preview ? (
        <div className="relative w-full max-w-xs overflow-hidden rounded-lg border border-border bg-secondary/20">
          <img src={preview} alt={vehicle.name} className="h-44 w-full object-cover" />
          <div className="absolute inset-0 flex items-end justify-end gap-2 p-2 opacity-0 transition-opacity hover:opacity-100 bg-black/30">
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-md bg-background/80 px-2.5 py-1.5 text-xs font-medium text-foreground backdrop-blur hover:bg-background"
            >
              <Upload className="h-3.5 w-3.5" /> Remplacer
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 rounded-md bg-red-500/80 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-red-500"
            >
              {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Supprimer
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
          onClick={() => inputRef.current?.click()}
          className={`flex h-36 w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-border bg-secondary/20 hover:border-primary/50 hover:bg-secondary/40'
          }`}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground/60">Glisser-déposer ou <span className="text-primary">parcourir</span></p>
              <p className="text-[10px] text-muted-foreground/40">JPEG, PNG, WebP, GIF — max 5 Mo</p>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />
    </div>
  );
}

// ─── Expanded row ─────────────────────────────────────────────────────────────

function ExpandedRow({
  vehicle,
  onImageChange,
}: {
  vehicle: AdminVehicle;
  onImageChange: (id: number, image: string | null) => void;
}) {
  return (
    <tr className="bg-card">
      <td colSpan={8} className="p-0">
        <div className="border-t border-border bg-secondary/5 px-4 py-2.5 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
          <span className="font-mono text-muted-foreground/40">{vehicle.internalName}</span>
          {vehicle.movementClass && (
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px]">
              {MC_LABEL[vehicle.movementClass] ?? vehicle.movementClass}
            </span>
          )}
          {vehicle.cargo != null && vehicle.cargo > 0 && (
            <span className="flex items-center gap-1"><Box className="h-3 w-3" />{vehicle.cargo} SCU</span>
          )}
          <Link
            href={`/vehicles/${vehicle.id}`}
            target="_blank"
            className="ml-auto flex items-center gap-1 text-primary hover:underline"
            onClick={e => e.stopPropagation()}
          >
            <ExternalLink className="h-3 w-3" />
            Voir la fiche
          </Link>
        </div>

        <div className="px-4 py-4">
          <ImagePanel vehicle={vehicle} onImageChange={onImageChange} />
        </div>
      </td>
    </tr>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const VehiclesAdmin = () => {
  const { user, authLoading } = useAuth();
  const { selectedVersion }   = useVersion();
  const router = useRouter();

  const [data, setData]               = useState<Page | null>(null);
  const [filters, setFilters]         = useState<Filters | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [search, setSearch]           = useState('');
  const [page, setPage]               = useState(1);
  const [expanded, setExpanded]       = useState<number | null>(null);
  const [filterManuf, setFilterManuf]         = useState('');
  const [filterMC, setFilterMC]               = useState('');
  const [filterRole, setFilterRole]           = useState('');
  const [filterPublished, setFilterPublished] = useState<'' | 'true' | 'false'>('');
  const [filterInGame,    setFilterInGame]    = useState<'' | 'true' | 'false'>('');

  useEffect(() => {
    if (!authLoading && (!user || !user.roles?.includes('ROLE_ADMIN'))) {
      router.replace('/');
    }
  }, [authLoading, user, router]);

  const load = useCallback(async (p = page, q = search, manuf = filterManuf, mc = filterMC, role = filterRole, pub = filterPublished, inGame = filterInGame) => {
    if (!user?.roles?.includes('ROLE_ADMIN')) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), pagesize: '30' });
      if (q)      params.set('q', q);
      if (manuf)  params.set('manufacturer', manuf);
      if (mc)     params.set('movementClass', mc);
      if (role)   params.set('role', role);
      if (pub)    params.set('published', pub);
      if (inGame) params.set('inGame', inGame);
      if (selectedVersion) params.set('version', String(selectedVersion.id));
      const result = await apiFetch<Page>(`/api/admin/vehicles?${params}`);
      setData(result);
    } catch (e: any) {
      setError(e?.message ?? 'Erreur lors du chargement des véhicules');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterManuf, filterMC, filterRole, filterPublished, filterInGame, user, selectedVersion]);

  const toggleInGame = async (v: AdminVehicle) => {
    const newValue = !v.isInGame;
    setData(prev => prev ? { ...prev, items: prev.items.map(i => i.id === v.id ? { ...i, isInGame: newValue } : i) } : prev);
    try {
      await apiFetch(`/api/admin/vehicles/${v.id}/in-game`, {
        method: 'PATCH',
        body: JSON.stringify({ isInGame: newValue }),
      });
    } catch {
      setData(prev => prev ? { ...prev, items: prev.items.map(i => i.id === v.id ? { ...i, isInGame: !newValue } : i) } : prev);
    }
  };

  const togglePublish = async (v: AdminVehicle) => {
    const newValue = !v.isPublished;
    setData(prev => prev ? { ...prev, items: prev.items.map(i => i.id === v.id ? { ...i, isPublished: newValue } : i) } : prev);
    try {
      await apiFetch(`/api/admin/vehicles/${v.id}/publish`, {
        method: 'PATCH',
        body: JSON.stringify({ isPublished: newValue }),
      });
    } catch {
      setData(prev => prev ? { ...prev, items: prev.items.map(i => i.id === v.id ? { ...i, isPublished: !newValue } : i) } : prev);
    }
  };

  useEffect(() => {
    if (!user?.roles?.includes('ROLE_ADMIN')) return;
    const qs = selectedVersion ? `?version=${selectedVersion.id}` : '';
    apiFetch<Filters>(`/api/admin/vehicles/filters${qs}`).then(setFilters).catch(() => {});
  }, [user, selectedVersion]);

  useEffect(() => {
    if (user?.roles?.includes('ROLE_ADMIN')) load();
  }, [user, selectedVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user?.roles?.includes('ROLE_ADMIN')) return;
    const t = setTimeout(() => { setPage(1); load(1, search, filterManuf, filterMC, filterRole, filterPublished, filterInGame); }, 350);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user?.roles?.includes('ROLE_ADMIN')) return;
    setPage(1);
    load(1, search, filterManuf, filterMC, filterRole, filterPublished, filterInGame);
  }, [filterManuf, filterMC, filterRole, filterPublished, filterInGame]); // eslint-disable-line react-hooks/exhaustive-deps

  const goPage = (p: number) => { setPage(p); load(p, search, filterManuf, filterMC, filterRole, filterPublished, filterInGame); };

  const updateVehicleImage = (id: number, image: string | null) => {
    setData(prev => prev ? { ...prev, items: prev.items.map(v => v.id === id ? { ...v, image } : v) } : prev);
  };

  if (authLoading || !user?.roles?.includes('ROLE_ADMIN')) return null;

  const totalPages = data ? Math.ceil(data.total / data.pagesize) : 1;

  return (
    <AdminLayout>
      <div className="relative min-h-screen bg-background">

        <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
          <img src="/hero-bg.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" style={{ objectPosition: '50% 30%' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex min-h-[18vh] items-center">
          <div className="container pb-2 pt-8 flex items-end justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Base de données</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground">Véhicules</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {data
                  ? `${data.total} véhicule${data.total > 1 ? 's' : ''}${selectedVersion ? ` — ${selectedVersion.label}` : ''}`
                  : '…'}
              </p>
            </div>
            <Link
              href="/admin/vehicles/new"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              <Plus className="h-4 w-4" />
              Ajouter un véhicule
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container pb-8 pt-0 space-y-4">

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher par nom, fabricant…"
                className="h-10 w-72 rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {filters?.manufacturers && filters.manufacturers.length > 0 && (
              <select value={filterManuf} onChange={e => setFilterManuf(e.target.value)}
                className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                <option value="">Tous les fabricants</option>
                {filters.manufacturers.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            )}

            {filters?.movementClasses && filters.movementClasses.length > 0 && (
              <select value={filterMC} onChange={e => setFilterMC(e.target.value)}
                className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                <option value="">Tous les types</option>
                {filters.movementClasses.map(mc => (
                  <option key={mc} value={mc}>{MC_LABEL[mc] ?? mc}</option>
                ))}
              </select>
            )}

            {filters?.roles && filters.roles.length > 0 && (
              <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
                className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                <option value="">Tous les rôles</option>
                {filters.roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            )}

            <select value={filterPublished} onChange={e => setFilterPublished(e.target.value as '' | 'true' | 'false')}
              className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
              <option value="">Tous</option>
              <option value="true">Publiés</option>
              <option value="false">Non publiés</option>
            </select>

            <select value={filterInGame} onChange={e => setFilterInGame(e.target.value as '' | 'true' | 'false')}
              className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
              <option value="">Tous les statuts</option>
              <option value="true">En jeu</option>
              <option value="false">Concept</option>
            </select>

            {(filterManuf || filterMC || filterRole || filterPublished || filterInGame || search) && (
              <button
                onClick={() => { setSearch(''); setFilterManuf(''); setFilterMC(''); setFilterRole(''); setFilterPublished(''); setFilterInGame(''); setPage(1); load(1, '', '', '', '', '', ''); }}
                className="h-10 rounded-lg border border-border bg-card px-3 text-xs text-muted-foreground hover:text-foreground"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
          )}

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
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nom</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Fabricant</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Rôle</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                        <Users className="inline h-3.5 w-3.5" />
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Prix</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Publié</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">En jeu</th>
                      <th className="px-4 py-3 w-8" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data?.items.map(v => {
                      const isOpen = expanded === v.id;
                      return (
                        <Fragment key={v.id}>
                          <tr
                            className="bg-card transition-colors hover:bg-secondary/20 cursor-pointer"
                            onClick={() => setExpanded(isOpen ? null : v.id)}
                          >
                            <td className="px-4 py-3">
                              <p className="font-semibold text-foreground">{v.name}</p>
                              <p className="text-[10px] text-muted-foreground/40 font-mono hidden sm:block">{v.internalName}</p>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <p className="text-xs text-foreground">{v.manufacturer ?? '—'}</p>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              {v.movementClass ? (
                                <span className="inline-flex rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                                  {MC_LABEL[v.movementClass] ?? v.movementClass}
                                </span>
                              ) : '—'}
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <p className="text-xs text-muted-foreground">{v.role ?? '—'}</p>
                            </td>
                            <td className="px-4 py-3 text-center hidden sm:table-cell">
                              <span className="text-xs text-muted-foreground">{v.crew ?? '—'}</span>
                            </td>
                            <td className="px-4 py-3 text-right hidden lg:table-cell">
                              {v.price != null ? (
                                <div className="flex flex-col items-end gap-0.5">
                                  <span className="text-xs font-medium text-foreground">${v.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                  {v.priceEur != null && (
                                    <span className="text-[10px] text-muted-foreground/60">{v.priceEur.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground/30">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => togglePublish(v)}
                                title={v.isPublished ? 'Dépublier' : 'Publier'}
                                className={`inline-flex items-center justify-center rounded-full p-1.5 transition-colors ${
                                  v.isPublished
                                    ? 'text-emerald-400 hover:bg-emerald-500/10'
                                    : 'text-muted-foreground/30 hover:bg-secondary hover:text-muted-foreground'
                                }`}
                              >
                                {v.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </button>
                            </td>
                            <td className="px-4 py-3 text-center hidden sm:table-cell" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => toggleInGame(v)}
                                title={v.isInGame ? 'Marquer comme concept' : 'Marquer comme en jeu'}
                                className={`inline-flex items-center justify-center rounded-full p-1.5 transition-colors ${
                                  v.isInGame
                                    ? 'text-blue-400 hover:bg-blue-500/10'
                                    : 'text-muted-foreground/30 hover:bg-secondary hover:text-muted-foreground'
                                }`}
                              >
                                <Car className="h-4 w-4" />
                              </button>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </td>
                          </tr>
                          {isOpen && (
                            <ExpandedRow vehicle={v} onImageChange={updateVehicleImage} />
                          )}
                        </Fragment>
                      );
                    })}
                    {data?.items.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                          Aucun véhicule trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">
                    Page {page} / {totalPages} — {data?.total} résultat{(data?.total ?? 0) > 1 ? 's' : ''}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => goPage(page - 1)} disabled={page <= 1 || loading}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button onClick={() => goPage(page + 1)} disabled={page >= totalPages || loading}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30">
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

export default VehiclesAdmin;
