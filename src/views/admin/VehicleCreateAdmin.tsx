'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Car, ArrowLeft, Loader2, Check, AlertCircle, ImageIcon, Trash2, Upload,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useVersion } from '@/contexts/VersionContext';
import { apiFetch } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';

const MOVEMENT_CLASSES = [
  { value: 'ArcadeWheeled', label: 'Terrestre (ArcadeWheeled)' },
  { value: 'ArcadeHover',   label: 'Hoveur (ArcadeHover)' },
];

interface Filters {
  manufacturers:   string[];
  roles:           string[];
  movementClasses: string[];
}

export default function VehicleCreateAdmin() {
  const { user, authLoading } = useAuth();
  const { selectedVersion }   = useVersion();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [filters,    setFilters]    = useState<Filters | null>(null);

  // ── Form fields ──
  const [name,          setName]          = useState('');
  const [internalName,  setInternalName]  = useState('');
  const [movementClass, setMovementClass] = useState('ArcadeWheeled');
  const [manufacturer,  setManufacturer]  = useState('');
  const [role,          setRole]          = useState('');
  const [crewSize,      setCrewSize]      = useState('');
  const [cargo,         setCargo]         = useState('');
  const [description,   setDescription]   = useState('');
  const [priceUsd,      setPriceUsd]      = useState('');
  const [priceEur,      setPriceEur]      = useState('');
  const [isPublished,   setIsPublished]   = useState(false);

  // ── Image ──
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [imageError,   setImageError]   = useState<string | null>(null);
  const [dragOver,     setDragOver]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Auth guard ──
  useEffect(() => {
    if (!authLoading && (!user || !user.roles?.includes('ROLE_ADMIN'))) {
      router.replace('/');
    }
  }, [authLoading, user, router]);

  // ── Fetch existing roles depuis les filtres véhicules ──
  useEffect(() => {
    if (!user?.roles?.includes('ROLE_ADMIN')) return;
    apiFetch<Filters>('/api/admin/vehicles/filters')
      .then(setFilters)
      .catch(() => {});
  }, [user]);

  // ── Auto-fill internalName ──
  const internalNameTouched = useRef(false);
  useEffect(() => {
    if (!internalNameTouched.current) setInternalName(name);
  }, [name]);

  // ── Image handling ──
  const handleFile = (file: File) => {
    setImageError(null);
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) { setImageError('Format non autorisé. Utilisez JPEG, PNG, WebP ou GIF.'); return; }
    if (file.size > 5 * 1024 * 1024) { setImageError('Taille maximale : 5 Mo.'); return; }
    const reader = new FileReader();
    reader.onload = e => setImageDataUri(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) { setError('Le nom d\'affichage est requis.'); return; }

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        name:          name.trim(),
        internalName:  internalName.trim() || name.trim(),
        movementClass,
        isPublished,
      };
      if (selectedVersion?.id) payload.versionId   = selectedVersion.id;
      if (manufacturer.trim()) payload.manufacturer = manufacturer.trim();
      if (role.trim())         payload.role         = role.trim();
      if (description.trim())  payload.description  = description.trim();
      if (crewSize !== '')     payload.crewSize     = parseInt(crewSize, 10);
      if (cargo !== '')        payload.cargo        = parseFloat(cargo);
      if (priceUsd !== '')     payload.price        = parseFloat(priceUsd);
      if (priceEur !== '')     payload.priceEur     = parseFloat(priceEur);
      if (imageDataUri)        payload.image        = imageDataUri;

      await apiFetch('/api/admin/ships', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      router.push('/admin/vehicles');
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

  return (
    <AdminLayout>
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border bg-background">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[18vh] overflow-hidden">
          <img src="/hero-bg.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" style={{ objectPosition: '50% 30%' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
        </div>
        <div className="relative z-10 flex min-h-[16vh] items-center">
          <div className="container pb-2 pt-8 flex items-end justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Base de données</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground">Nouveau véhicule</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedVersion ? `Version : ${selectedVersion.label}` : 'Aucune version sélectionnée'}
              </p>
            </div>
            <Link
              href="/admin/vehicles"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container max-w-3xl py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Image ── */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Image</h2>

            {imageDataUri ? (
              <div className="relative w-full max-w-sm overflow-hidden rounded-lg border border-border bg-secondary/20">
                <img src={imageDataUri} alt="Aperçu" className="h-44 w-full object-cover" />
                <div className="absolute inset-0 flex items-end justify-end gap-2 p-2 opacity-0 transition-opacity hover:opacity-100 bg-black/30">
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-md bg-background/80 px-2.5 py-1.5 text-xs font-medium text-foreground backdrop-blur hover:bg-background"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Remplacer
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageDataUri(null)}
                    className="inline-flex items-center gap-1.5 rounded-md bg-red-500/80 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Supprimer
                  </button>
                </div>
              </div>
            ) : (
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
                className={`flex h-36 w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors ${
                  dragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-secondary/20 hover:border-primary/50 hover:bg-secondary/40'
                }`}
              >
                <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground/60">
                  Glisser-déposer ou <span className="text-primary">parcourir</span>
                </p>
                <p className="text-[10px] text-muted-foreground/40">JPEG, PNG, WebP, GIF — max 5 Mo</p>
              </div>
            )}

            {imageError && <p className="text-xs text-red-400">{imageError}</p>}

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
          </section>

          {/* ── Identité ── */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Identité</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  Nom d'affichage <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex. Anvil Ballista"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Nom interne</label>
                <input
                  type="text"
                  value={internalName}
                  onChange={e => { internalNameTouched.current = true; setInternalName(e.target.value); }}
                  placeholder="Ex. ANVL_Ballista"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Type</label>
                <select
                  value={movementClass}
                  onChange={e => setMovementClass(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                >
                  {MOVEMENT_CLASSES.map(mc => (
                    <option key={mc.value} value={mc.value}>{mc.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Fabricant</label>
                <input
                  type="text"
                  list="manufacturers-list"
                  value={manufacturer}
                  onChange={e => setManufacturer(e.target.value)}
                  placeholder="Ex. Anvil Aerospace"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
                <datalist id="manufacturers-list">
                  {filters?.manufacturers.map(m => <option key={m} value={m} />)}
                </datalist>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Rôle</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              >
                <option value="">— Non défini —</option>
                {filters?.roles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="Description du véhicule…"
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </section>

          {/* ── Caractéristiques ── */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Caractéristiques</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Équipage</label>
                <input
                  type="number" min={1} value={crewSize}
                  onChange={e => setCrewSize(e.target.value)}
                  placeholder="—"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Cargo (SCU)</label>
                <input
                  type="number" min={0} step={0.1} value={cargo}
                  onChange={e => setCargo(e.target.value)}
                  placeholder="—"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
            </div>
          </section>

          {/* ── Prix catalogue ── */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Prix catalogue</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Prix USD ($)</label>
                <input
                  type="number" min={0} step={0.01} value={priceUsd}
                  onChange={e => setPriceUsd(e.target.value)}
                  placeholder="—"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Prix EUR (€)</label>
                <input
                  type="number" min={0} step={0.01} value={priceEur}
                  onChange={e => setPriceEur(e.target.value)}
                  placeholder="—"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
            </div>
          </section>

          {/* ── Publication ── */}
          <section className="rounded-xl border border-border bg-card p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setIsPublished(v => !v)}
                className={`relative h-5 w-9 flex-shrink-0 rounded-full transition-colors ${isPublished ? 'bg-primary' : 'bg-secondary'}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${isPublished ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Publié</p>
                <p className="text-xs text-muted-foreground">Visible dans les listes publiques et les outils</p>
              </div>
            </label>
          </section>

          {/* ── Erreur globale ── */}
          {error && (
            <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/vehicles"
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Annuler
            </Link>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Créer le véhicule
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
}
