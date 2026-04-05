'use client';
import { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import {
  Rocket, Search, Plus, Loader2, ChevronLeft, ChevronRight,
  ChevronDown, ExternalLink, Users, Box, Ruler, Shield,
  Zap, Thermometer, Gauge, Crosshair, Fuel, Radio, Target,
  Upload, Trash2, ImageIcon, Eye, EyeOff,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useVersion } from '@/contexts/VersionContext';
import { apiFetch, API_URL } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminShip {
  id:           number;
  dataId:       number;
  internalName: string;
  image:        string | null;
  isPublished:  boolean;
  name:         string;
  manufacturer: string | null;
  career:       string | null;
  role:         string | null;
  crew:         number | null;
  sizeX:        number | null;
  sizeY:        number | null;
  sizeZ:        number | null;
  size:         string | null;
  cargo:        number | null;
  insuranceBaseWait: number | null;
  versionId:    number | null;
  price:        number | null;
  priceEur:     number | null;
  priceUpdatedAt: string | null;
}

interface LoadoutEntry {
  port:         string;
  itemRef:      string | null;
  itemId:       number | null;
  name:         string | null;
  type:         string | null;
  subType:      string | null;
  size:         number | null;
  manufacturer: string | null;
}

interface Filters {
  manufacturers: string[];
  careers:       string[];
  roles:         string[];
}

interface Page {
  total:    number;
  page:     number;
  pagesize: number;
  items:    AdminShip[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_ICON: Record<string, React.ElementType> = {
  Shield:          Shield,
  PowerPlant:      Zap,
  Cooler:          Thermometer,
  QuantumDrive:    Gauge,
  Radar:           Radio,
  WeaponDefensive: Target,
  FuelTank:        Fuel,
  QuantumFuelTank: Fuel,
  FuelIntake:      Fuel,
  WeaponGun:       Crosshair,
  MissileLauncher: Crosshair,
  Turret:          Crosshair,
};

const TYPE_COLOR: Record<string, string> = {
  Shield:          'text-blue-400',
  PowerPlant:      'text-amber-400',
  Cooler:          'text-cyan-400',
  QuantumDrive:    'text-violet-400',
  Radar:           'text-emerald-400',
  WeaponDefensive: 'text-rose-400',
  FuelTank:        'text-orange-400',
  QuantumFuelTank: 'text-purple-400',
  FuelIntake:      'text-teal-400',
  WeaponGun:       'text-red-400',
  MissileLauncher: 'text-red-400',
  Turret:          'text-red-400',
};

const SIZE_COLORS: Record<string, string> = {
  Small:   'bg-emerald-500/10 text-emerald-400',
  Medium:  'bg-blue-500/10 text-blue-400',
  Large:   'bg-violet-500/10 text-violet-400',
  Capital: 'bg-red-500/10 text-red-400',
};

const TYPE_ORDER = [
  'Shield', 'PowerPlant', 'Cooler', 'QuantumDrive',
  'FuelTank', 'QuantumFuelTank', 'FuelIntake',
  'Radar', 'WeaponDefensive', 'WeaponGun', 'MissileLauncher', 'Turret',
  'EMP', 'QIG', 'Other',
];

// ─── Image panel ──────────────────────────────────────────────────────────────

function ImagePanel({
  ship,
  onImageChange,
}: {
  ship: AdminShip;
  onImageChange: (id: number, image: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const toAbsolute = (url: string | null) =>
    url && url.startsWith('/') ? `${API_URL}${url}` : url;

  const [preview,   setPreview]   = useState<string | null>(toAbsolute(ship.image));
  const [dragOver,  setDragOver]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync preview when ship.image changes (e.g. after parent state update)
  useEffect(() => setPreview(toAbsolute(ship.image)), [ship.image]);

  const handleFile = (file: File) => {
    setError(null);
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setError('Format non autorisé. Utilisez JPEG, PNG, WebP ou GIF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Taille maximale : 5 Mo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUri = e.target?.result as string;
      setPreview(dataUri); // preview locale immédiate (data URI)
      setUploading(true);
      try {
        const res = await apiFetch<{ image: string }>(`/api/admin/ships/${ship.id}/image`, {
          method: 'PUT',
          body: JSON.stringify({ image: dataUri }),
        });
        // L'API renvoie désormais une URL relative, on préfixe avec API_URL
        const imageUrl = `${API_URL}${res.image}?t=${Date.now()}`;
        setPreview(imageUrl);
        onImageChange(ship.id, imageUrl);
      } catch (err: any) {
        setError(err?.message ?? 'Erreur lors de l\'upload.');
        setPreview(ship.image);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer l\'image de ce vaisseau ?')) return;
    setDeleting(true);
    setError(null);
    try {
      await apiFetch(`/api/admin/ships/${ship.id}/image`, { method: 'DELETE' });
      setPreview(null);
      onImageChange(ship.id, null);
    } catch (err: any) {
      setError(err?.message ?? 'Erreur lors de la suppression.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
        Image
      </p>

      {/* Preview */}
      {preview ? (
        <div className="relative w-full max-w-xs overflow-hidden rounded-lg border border-border bg-secondary/20">
          <img
            src={preview}
            alt={ship.name}
            className="h-44 w-full object-cover"
          />
          <div className="absolute inset-0 flex items-end justify-end gap-2 p-2 opacity-0 transition-opacity hover:opacity-100 bg-black/30">
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-md bg-background/80 px-2.5 py-1.5 text-xs font-medium text-foreground backdrop-blur hover:bg-background"
            >
              <Upload className="h-3.5 w-3.5" />
              Remplacer
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
        /* Drop zone */
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex h-36 w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors ${
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-border bg-secondary/20 hover:border-primary/50 hover:bg-secondary/40'
          }`}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground/60">
                Glisser-déposer ou <span className="text-primary">parcourir</span>
              </p>
              <p className="text-[10px] text-muted-foreground/40">JPEG, PNG, WebP, GIF — max 5 Mo</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}

// ─── Loadout panel ────────────────────────────────────────────────────────────

function LoadoutPanel({ shipId, versionId }: { shipId: number; versionId: number | null }) {
  const [entries, setEntries] = useState<LoadoutEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qs = versionId ? `?version=${versionId}` : '';
    apiFetch<LoadoutEntry[]>(`/api/admin/ships/${shipId}/loadout${qs}`)
      .then(setEntries)
      .finally(() => setLoading(false));
  }, [shipId, versionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!entries?.length) {
    return <p className="px-4 py-3 text-xs italic text-muted-foreground/50">Aucun composant trouvé.</p>;
  }

  const byType = entries.reduce<Record<string, LoadoutEntry[]>>((acc, e) => {
    const key = e.type ?? 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  const sortedTypes = Object.keys(byType).sort((a, b) => {
    const ai = TYPE_ORDER.indexOf(a); const bi = TYPE_ORDER.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <div className="space-y-4 px-4 py-4">
      {sortedTypes.map(type => {
        const Icon = TYPE_ICON[type] ?? Rocket;
        const color = TYPE_COLOR[type] ?? 'text-primary';
        return (
          <div key={type}>
            <div className="mb-2 flex items-center gap-2">
              <Icon className={`h-3.5 w-3.5 ${color}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                {type}
              </span>
              <span className="text-[10px] text-muted-foreground/40">({byType[type].length})</span>
            </div>
            <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {byType[type].map((e, i) => {
                const portLabel = e.port.replace(/^hardpoint_/, '').replace(/_/g, ' ');
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-2"
                  >
                    <Icon className={`h-3.5 w-3.5 shrink-0 ${color}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-foreground">
                        {e.name ?? portLabel}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 capitalize">{portLabel}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {e.size != null && (
                        <span className="text-[10px] text-muted-foreground">S{e.size}</span>
                      )}
                      {e.itemId != null && (
                        <Link
                          href={`/components/${e.itemId}`}
                          target="_blank"
                          className="text-[10px] text-primary hover:underline"
                          onClick={e2 => e2.stopPropagation()}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Expanded row ─────────────────────────────────────────────────────────────

function ExpandedRow({
  ship,
  onImageChange,
}: {
  ship: AdminShip;
  onImageChange: (id: number, image: string | null) => void;
}) {
  return (
    <tr className="bg-card">
      <td colSpan={10} className="p-0">
        {/* Info bar */}
        <div className="border-t border-border bg-secondary/5 px-4 py-2.5 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
          <span className="font-mono text-muted-foreground/40">{ship.internalName}</span>
          {ship.sizeX != null && (
            <span className="flex items-center gap-1">
              <Ruler className="h-3 w-3" />
              {ship.sizeX.toFixed(1)} × {ship.sizeY?.toFixed(1) ?? '?'} × {ship.sizeZ?.toFixed(1) ?? '?'} m
            </span>
          )}
          {ship.cargo != null && ship.cargo > 0 && (
            <span className="flex items-center gap-1">
              <Box className="h-3 w-3" />
              {ship.cargo} SCU
            </span>
          )}
          {ship.insuranceBaseWait != null && (
            <span>Assurance : {ship.insuranceBaseWait} min</span>
          )}
          <Link
            href={`/ships/${ship.id}`}
            target="_blank"
            className="ml-auto flex items-center gap-1 text-primary hover:underline"
            onClick={e => e.stopPropagation()}
          >
            <ExternalLink className="h-3 w-3" />
            Voir la fiche
          </Link>
        </div>

        {/* Image + Loadout en deux colonnes */}
        <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
          {/* Image */}
          <div className="border-r border-border/50 bg-secondary/5 px-4 py-4">
            <ImagePanel ship={ship} onImageChange={onImageChange} />
          </div>

          {/* Loadout */}
          <div className="bg-secondary/10">
            <p className="px-4 pt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              Loadout par défaut
            </p>
            <LoadoutPanel shipId={ship.id} versionId={ship.versionId} />
          </div>
        </div>
      </td>
    </tr>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const ShipsAdmin = () => {
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
  const [filterCareer, setFilterCareer]       = useState('');
  const [filterRole, setFilterRole]           = useState('');
  const [filterPublished, setFilterPublished] = useState<'' | 'true' | 'false'>('');

  useEffect(() => {
    if (!authLoading && (!user || !user.roles?.includes('ROLE_ADMIN'))) {
      router.replace('/');
    }
  }, [authLoading, user, router]);

  const load = useCallback(async (p = page, q = search, manuf = filterManuf, career = filterCareer, role = filterRole, pub = filterPublished) => {
    if (!user?.roles?.includes('ROLE_ADMIN')) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), pagesize: '30' });
      if (q)      params.set('q', q);
      if (manuf)  params.set('manufacturer', manuf);
      if (career) params.set('career', career);
      if (role)   params.set('role', role);
      if (pub)    params.set('published', pub);
      if (selectedVersion) params.set('version', String(selectedVersion.id));
      const result = await apiFetch<Page>(`/api/admin/ships?${params}`);
      setData(result);
    } catch (e: any) {
      setError(e?.message ?? 'Erreur lors du chargement des vaisseaux');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterManuf, filterCareer, filterRole, filterPublished, user, selectedVersion]);

  const togglePublish = async (ship: AdminShip) => {
    const newValue = !ship.isPublished;
    // Optimistic update
    setData(prev => prev ? {
      ...prev,
      items: prev.items.map(s => s.id === ship.id ? { ...s, isPublished: newValue } : s),
    } : prev);
    try {
      await apiFetch(`/api/admin/ships/${ship.id}/publish`, {
        method: 'PATCH',
        body: JSON.stringify({ isPublished: newValue }),
      });
    } catch {
      // Rollback on error
      setData(prev => prev ? {
        ...prev,
        items: prev.items.map(s => s.id === ship.id ? { ...s, isPublished: !newValue } : s),
      } : prev);
    }
  };

  // Charger les filtres disponibles
  useEffect(() => {
    if (!user?.roles?.includes('ROLE_ADMIN')) return;
    const qs = selectedVersion ? `?version=${selectedVersion.id}` : '';
    apiFetch<Filters>(`/api/admin/ships/filters${qs}`).then(setFilters).catch(() => {});
  }, [user, selectedVersion]);

  useEffect(() => {
    if (user?.roles?.includes('ROLE_ADMIN')) load();
  }, [user, selectedVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounce recherche
  useEffect(() => {
    if (!user?.roles?.includes('ROLE_ADMIN')) return;
    const t = setTimeout(() => { setPage(1); load(1, search, filterManuf, filterCareer, filterRole, filterPublished); }, 350);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filtre immédiat sur dropdowns
  useEffect(() => {
    if (!user?.roles?.includes('ROLE_ADMIN')) return;
    setPage(1);
    load(1, search, filterManuf, filterCareer, filterRole, filterPublished);
  }, [filterManuf, filterCareer, filterRole, filterPublished]); // eslint-disable-line react-hooks/exhaustive-deps

  const goPage = (p: number) => { setPage(p); load(p, search, filterManuf, filterCareer, filterRole, filterPublished); };

  const updateShipImage = (id: number, image: string | null) => {
    setData(prev => prev ? {
      ...prev,
      items: prev.items.map(s => s.id === id ? { ...s, image } : s),
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
                <Rocket className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Base de données</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground">Vaisseaux</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {data
                  ? `${data.total} vaisseau${data.total > 1 ? 'x' : ''}${selectedVersion ? ` — ${selectedVersion.label}` : ''}`
                  : '…'}
              </p>
            </div>
            <Link
              href="/admin/ships/new"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              <Plus className="h-4 w-4" />
              Ajouter un vaisseau
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container pb-8 pt-0 space-y-4">

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
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

            {/* Manufacturer */}
            {filters?.manufacturers && filters.manufacturers.length > 0 && (
              <select
                value={filterManuf}
                onChange={e => setFilterManuf(e.target.value)}
                className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Tous les fabricants</option>
                {filters.manufacturers.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            )}

            {/* Career */}
            {filters?.careers && filters.careers.length > 0 && (
              <select
                value={filterCareer}
                onChange={e => setFilterCareer(e.target.value)}
                className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Toutes les carrières</option>
                {filters.careers.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}

            {/* Role */}
            {filters?.roles && filters.roles.length > 0 && (
              <select
                value={filterRole}
                onChange={e => setFilterRole(e.target.value)}
                className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Tous les rôles</option>
                {filters.roles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            )}

            {/* Publié / Non publié */}
            <select
              value={filterPublished}
              onChange={e => setFilterPublished(e.target.value as '' | 'true' | 'false')}
              className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="">Tous</option>
              <option value="true">Publiés</option>
              <option value="false">Non publiés</option>
            </select>

            {/* Reset filters */}
            {(filterManuf || filterCareer || filterRole || filterPublished || search) && (
              <button
                onClick={() => {
                  setSearch('');
                  setFilterManuf('');
                  setFilterCareer('');
                  setFilterRole('');
                  setFilterPublished('');
                  setPage(1);
                  load(1, '', '', '', '', '');
                }}
                className="h-10 rounded-lg border border-border bg-card px-3 text-xs text-muted-foreground hover:text-foreground"
              >
                Réinitialiser
              </button>
            )}
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
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Fabricant</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Rôle</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Taille</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                        <Users className="inline h-3.5 w-3.5" />
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                        <Box className="inline h-3.5 w-3.5" />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden xl:table-cell">Carrière</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Prix</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Publié</th>
                      <th className="px-4 py-3 w-8" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data?.items.map(ship => {
                      const isOpen = expanded === ship.id;
                      return (
                        <Fragment key={ship.id}>
                          <tr
                            className="bg-card transition-colors hover:bg-secondary/20 cursor-pointer"
                            onClick={() => setExpanded(isOpen ? null : ship.id)}
                          >
                            <td className="px-4 py-3">
                              <p className="font-semibold text-foreground">{ship.name}</p>
                              <p className="text-[10px] text-muted-foreground/40 font-mono hidden sm:block">{ship.internalName}</p>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <p className="text-xs text-foreground">{ship.manufacturer ?? '—'}</p>
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <p className="text-xs text-muted-foreground">{ship.role ?? '—'}</p>
                            </td>
                            <td className="px-4 py-3 text-center hidden sm:table-cell">
                              {ship.size ? (
                                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${SIZE_COLORS[ship.size] ?? 'bg-secondary text-muted-foreground'}`}>
                                  {ship.size}
                                </span>
                              ) : '—'}
                            </td>
                            <td className="px-4 py-3 text-center hidden sm:table-cell">
                              <span className="text-xs text-muted-foreground">{ship.crew ?? '—'}</span>
                            </td>
                            <td className="px-4 py-3 text-center hidden md:table-cell">
                              <span className="text-xs text-muted-foreground">
                                {ship.cargo != null && ship.cargo > 0 ? `${ship.cargo} SCU` : '—'}
                              </span>
                            </td>
                            <td className="px-4 py-3 hidden xl:table-cell">
                              <p className="text-xs text-muted-foreground">{ship.career ?? '—'}</p>
                            </td>
                            <td className="px-4 py-3 text-right hidden lg:table-cell">
                              {ship.price != null ? (
                                <div className="flex flex-col items-end gap-0.5">
                                  <span className="text-xs font-medium text-foreground">${ship.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                  {ship.priceEur != null && (
                                    <span className="text-[10px] text-muted-foreground/60">{ship.priceEur.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground/30">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => togglePublish(ship)}
                                title={ship.isPublished ? 'Dépublier' : 'Publier'}
                                className={`inline-flex items-center justify-center rounded-full p-1.5 transition-colors ${
                                  ship.isPublished
                                    ? 'text-emerald-400 hover:bg-emerald-500/10'
                                    : 'text-muted-foreground/30 hover:bg-secondary hover:text-muted-foreground'
                                }`}
                              >
                                {ship.isPublished
                                  ? <Eye className="h-4 w-4" />
                                  : <EyeOff className="h-4 w-4" />
                                }
                              </button>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </td>
                          </tr>
                          {isOpen && (
                            <ExpandedRow ship={ship} onImageChange={updateShipImage} />
                          )}
                        </Fragment>
                      );
                    })}
                    {data?.items.length === 0 && (
                      <tr>
                        <td colSpan={10} className="px-4 py-12 text-center text-sm text-muted-foreground">
                          Aucun vaisseau trouvé.
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
                    Page {page} / {totalPages} — {data?.total} résultat{(data?.total ?? 0) > 1 ? 's' : ''}
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

export default ShipsAdmin;
