'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTranslationJob } from '@/hooks/useTranslationJob';
import { useRouter } from 'next/navigation';
import {
  UserCircle2, Search, RefreshCw, Loader2, Plus, Pencil, Trash2,
  Check, ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  Languages, X, Sparkles, Upload, ImageOff,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import {
  ApiCharacter, CharacterTranslation, BiographySection,
  FamilyMember, CharacterStatus, CharacterSpecies, FamilyRelation,
} from '@/data/characters';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUSES: CharacterStatus[] = ['alive', 'deceased', 'unknown'];
const SPECIES:  CharacterSpecies[] = ['human', "xi'an", 'vanduul', 'banu', 'other'];
const RELATIONS: FamilyRelation[]  = [
  'father', 'mother', 'grandfather', 'grandmother',
  'son', 'daughter', 'grandson', 'granddaughter',
  'brother', 'sister', 'spouse',
];
const LOCALES = ['fr', 'en', 'de', 'es', 'it', 'pt', 'ru', 'zh', 'ja'];

const STATUS_LABELS: Record<CharacterStatus, string> = {
  alive: 'En vie', deceased: 'Décédé(e)', unknown: 'Inconnu',
};
const SPECIES_LABELS: Record<CharacterSpecies, string> = {
  human: 'Humain', "xi'an": "Xi'An", vanduul: 'Vanduul', banu: 'Banu', other: 'Autre',
};
const STATUS_COLORS: Record<CharacterStatus, string> = {
  alive:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  deceased: 'bg-red-500/10 text-red-400 border-red-500/30',
  unknown:  'bg-amber-500/10 text-amber-400 border-amber-500/30',
};

// ─── Types form ───────────────────────────────────────────────────────────────

interface CharForm {
  slug:        string;
  name:        string;
  species:     CharacterSpecies;
  status:      CharacterStatus;
  born:        string;
  died:        string;
  companySlug: string;
  biographySections: BiographySection[];
  familyMembers:     FamilyMember[];
}

interface TranslationForm {
  title:       string;
  affiliation: string;
  description: string;
}

const EMPTY_FORM: CharForm = {
  slug: '', name: '', species: 'human', status: 'unknown',
  born: '', died: '', companySlug: '',
  biographySections: [], familyMembers: [],
};

function toForm(c: ApiCharacter): CharForm {
  return {
    slug:        c.slug,
    name:        c.name,
    species:     c.species,
    status:      c.status,
    born:        c.born  ?? '',
    died:        c.died  ?? '',
    companySlug: c.companySlug ?? '',
    biographySections: c.biographySections
      ? c.biographySections.map(s => ({
          position:     s.position,
          translations: s.translations.map(t => ({ ...t })),
        }))
      : [],
    familyMembers: c.familyMembers
      ? c.familyMembers.map(m => ({ ...m }))
      : [],
  };
}

function fromForm(f: CharForm): Record<string, unknown> {
  return {
    slug:        f.slug.trim(),
    name:        f.name.trim(),
    species:     f.species,
    status:      f.status,
    born:        f.born.trim()        || null,
    died:        f.died.trim()        || null,
    companySlug: f.companySlug.trim() || null,
    biographySections: f.biographySections.length > 0 ? f.biographySections : null,
    familyMembers:     f.familyMembers.length     > 0 ? f.familyMembers     : null,
  };
}

// ─── Image upload widget ──────────────────────────────────────────────────────

function ImageUploadWidget({
  characterId,
  currentImage,
  hasUploadedImage,
  onUpdate,
}: {
  characterId: number;
  currentImage?: string | null;
  hasUploadedImage?: boolean;
  onUpdate: (image: string | null, hasUploaded: boolean) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [preview,   setPreview]   = useState<string | null>(currentImage ?? null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Prévisualisation locale immédiate
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:11000';
      const res = await fetch(`${API_URL}/api/admin/characters/${characterId}/image`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? `Erreur ${res.status}`);
      }
      const data = await res.json();
      onUpdate(data.image, true);
    } catch (err: any) {
      setError(err?.message ?? "Erreur lors de l'upload");
      setPreview(currentImage ?? null);
    } finally {
      setUploading(false);
      // Reset l'input pour permettre de re-sélectionner le même fichier
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer le portrait uploadé ?')) return;
    setDeleting(true);
    setError(null);
    try {
      await apiFetch(`/api/admin/characters/${characterId}/image`, { method: 'DELETE' });
      setPreview(null);
      onUpdate(null, false);
    } catch (err: any) {
      setError(err?.message ?? 'Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-start gap-4">
      {/* Prévisualisation */}
      <div className="relative h-24 w-18 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary flex items-center justify-center" style={{ width: '72px' }}>
        {preview ? (
          <img src={preview} alt="portrait" className="h-full w-full object-cover object-top" />
        ) : (
          <UserCircle2 className="h-8 w-8 text-muted-foreground/20" />
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-foreground transition-colors">
          <Upload className="h-3.5 w-3.5" />
          {preview ? 'Remplacer' : 'Uploader un portrait'}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        {hasUploadedImage && (
          <button onClick={handleDelete} disabled={deleting}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 disabled:opacity-50">
            {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageOff className="h-3.5 w-3.5" />}
            Supprimer l'image
          </button>
        )}
        {error && <p className="text-[11px] text-red-400">{error}</p>}
        <p className="text-[10px] text-muted-foreground/50">JPG, PNG, WebP — max 5 Mo</p>
      </div>
    </div>
  );
}

// ─── Biography section editor ─────────────────────────────────────────────────

function BiographyEditor({
  sections, onChange,
}: { sections: BiographySection[]; onChange: (s: BiographySection[]) => void }) {
  const add = () => onChange([
    ...sections,
    { position: sections.length, translations: [] },
  ]);
  const remove = (i: number) => {
    const copy = sections.filter((_, j) => j !== i).map((s, j) => ({ ...s, position: j }));
    onChange(copy);
  };
  const move = (i: number, dir: -1 | 1) => {
    const copy = [...sections];
    const j = i + dir;
    if (j < 0 || j >= copy.length) return;
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy.map((s, k) => ({ ...s, position: k })));
  };
  const updateTranslation = (si: number, locale: string, field: 'title' | 'content', val: string) => {
    const copy = sections.map((s, j) => {
      if (j !== si) return s;
      const existing = s.translations.find(t => t.locale === locale);
      const translations = existing
        ? s.translations.map(t => t.locale === locale ? { ...t, [field]: val } : t)
        : [...s.translations, { locale, title: '', content: '', [field]: val }];
      return { ...s, translations };
    });
    onChange(copy);
  };

  const locales = ['fr', 'en'];

  return (
    <div className="space-y-3">
      {sections.map((s, i) => (
        <div key={i} className="rounded-lg border border-border bg-secondary/10 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Section {i + 1}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30">
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => move(i, 1)} disabled={i === sections.length - 1} className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30">
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => remove(i)} className="rounded p-1 text-red-400 hover:bg-red-500/10">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          {locales.map(locale => {
            const tr = s.translations.find(t => t.locale === locale);
            return (
              <div key={locale} className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-0.5 block text-[10px] font-medium text-muted-foreground">Titre [{locale.toUpperCase()}]</label>
                  <input value={tr?.title ?? ''} onChange={e => updateTranslation(i, locale, 'title', e.target.value)}
                    className="h-8 w-full rounded border border-border bg-card px-2 text-xs text-foreground focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="mb-0.5 block text-[10px] font-medium text-muted-foreground">Contenu [{locale.toUpperCase()}]</label>
                  <textarea value={tr?.content ?? ''} onChange={e => updateTranslation(i, locale, 'content', e.target.value)} rows={3}
                    className="w-full rounded border border-border bg-card px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none resize-y" />
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <button onClick={add}
        className="inline-flex items-center gap-1 rounded border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary">
        <Plus className="h-3.5 w-3.5" /> Ajouter une section
      </button>
    </div>
  );
}

// ─── Family editor ────────────────────────────────────────────────────────────

function FamilyEditor({
  members, onChange,
}: { members: FamilyMember[]; onChange: (m: FamilyMember[]) => void }) {
  const add = () => onChange([...members, { name: '', relation: 'father' }]);
  const remove = (i: number) => onChange(members.filter((_, j) => j !== i));
  const update = <K extends keyof FamilyMember>(i: number, key: K, val: FamilyMember[K] | '') => {
    onChange(members.map((m, j) => j === i ? { ...m, [key]: val || undefined } : m));
  };

  return (
    <div className="space-y-2">
      {members.map((m, i) => (
        <div key={i} className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-2 items-end rounded-lg border border-border bg-secondary/10 p-2">
          <div>
            <label className="mb-0.5 block text-[10px] font-medium text-muted-foreground">Nom</label>
            <input value={m.name} onChange={e => update(i, 'name', e.target.value)}
              className="h-8 w-full rounded border border-border bg-card px-2 text-xs text-foreground focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="mb-0.5 block text-[10px] font-medium text-muted-foreground">Relation</label>
            <select value={m.relation} onChange={e => update(i, 'relation', e.target.value as FamilyRelation)}
              className="h-8 rounded border border-border bg-card px-2 text-xs text-foreground focus:border-primary focus:outline-none">
              {RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-0.5 block text-[10px] font-medium text-muted-foreground">Statut</label>
            <select value={m.status ?? ''} onChange={e => update(i, 'status', e.target.value as CharacterStatus)}
              className="h-8 rounded border border-border bg-card px-2 text-xs text-foreground focus:border-primary focus:outline-none">
              <option value="">—</option>
              {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-0.5 block text-[10px] font-medium text-muted-foreground">Slug lié</label>
            <input value={m.characterSlug ?? ''} onChange={e => update(i, 'characterSlug', e.target.value)}
              placeholder="slug…" className="h-8 w-24 rounded border border-border bg-card px-2 text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="mb-0.5 block text-[10px] font-medium text-muted-foreground">Né</label>
            <input value={m.born ?? ''} onChange={e => update(i, 'born', e.target.value)}
              className="h-8 w-20 rounded border border-border bg-card px-2 text-xs text-foreground focus:border-primary focus:outline-none" />
          </div>
          <button onClick={() => remove(i)} className="mb-0.5 rounded p-1.5 text-red-400 hover:bg-red-500/10">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button onClick={add}
        className="inline-flex items-center gap-1 rounded border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary">
        <Plus className="h-3.5 w-3.5" /> Ajouter un membre
      </button>
    </div>
  );
}

// ─── Character form ───────────────────────────────────────────────────────────

function CharacterForm({
  initial, onSave, onCancel, saving,
}: {
  initial: CharForm;
  onSave: (data: CharForm) => Promise<void>;
  onCancel: () => void;
  saving?: boolean;
}) {
  const [form, setForm] = useState<CharForm>(initial);
  const set = <K extends keyof CharForm>(k: K, v: CharForm[K]) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) return;
    await onSave(form);
  };

  return (
    <div className="space-y-5">
      {/* Identité */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Identité</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Nom *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Slug *</label>
            <input value={form.slug} onChange={e => set('slug', e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm font-mono text-foreground focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Espèce</label>
            <select value={form.species} onChange={e => set('species', e.target.value as CharacterSpecies)}
              className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
              {SPECIES.map(s => <option key={s} value={s}>{SPECIES_LABELS[s]}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Statut</label>
            <select value={form.status} onChange={e => set('status', e.target.value as CharacterStatus)}
              className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
              {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Entreprise liée (slug)</label>
            <input value={form.companySlug} onChange={e => set('companySlug', e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm font-mono text-foreground focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Naissance</label>
            <input value={form.born} onChange={e => set('born', e.target.value)} placeholder="ex : 2546 SEY"
              className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Décès</label>
            <input value={form.died} onChange={e => set('died', e.target.value)} placeholder="ex : 2601 SEY"
              className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Biographie */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sections biographiques</p>
        <BiographyEditor sections={form.biographySections} onChange={v => set('biographySections', v)} />
      </div>

      {/* Famille */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Arbre généalogique</p>
        <FamilyEditor members={form.familyMembers} onChange={v => set('familyMembers', v)} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-border">
        <button onClick={handleSave} disabled={saving || !form.name.trim() || !form.slug.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Enregistrer
        </button>
        <button onClick={onCancel} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
          Annuler
        </button>
      </div>
    </div>
  );
}

// ─── Translation editor ───────────────────────────────────────────────────────

function TranslationEditor({
  characterId, translations, onUpdate,
}: {
  characterId: number;
  translations: CharacterTranslation[];
  onUpdate: (locale: string, data: CharacterTranslation) => void;
}) {
  const [locale, setLocale]       = useState('fr');
  const [form, setForm]           = useState<TranslationForm>({ title: '', affiliation: '', description: '' });
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    const tr = translations.find(t => t.locale === locale);
    setForm({
      title:       tr?.title       ?? '',
      affiliation: tr?.affiliation ?? '',
      description: tr?.description ?? '',
    });
  }, [locale, translations]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const result = await apiFetch<CharacterTranslation>(
        `/api/admin/characters/${characterId}/translations/${locale}`,
        { method: 'PUT', body: JSON.stringify(form) },
      );
      onUpdate(locale, result);
    } catch (e: any) {
      setError(e?.message ?? 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const { translating, start: startTranslation } = useTranslationJob({
    onDone: async () => {
      const result = await apiFetch<CharacterTranslation>(
        `/api/admin/characters/${characterId}/translations/${locale}`,
      );
      onUpdate(locale, result);
      setForm({ title: result.title ?? '', affiliation: result.affiliation ?? '', description: result.description ?? '' });
    },
    onError: (err) => setError(err),
  });

  const handleTranslate = () => {
    setError(null);
    startTranslation(`/api/admin/characters/${characterId}/translate/${locale}`);
  };

  const handleDelete = async () => {
    if (!confirm(`Supprimer la traduction "${locale}" ?`)) return;
    setDeleting(locale);
    try {
      await apiFetch(`/api/admin/characters/${characterId}/translations/${locale}`, { method: 'DELETE' });
      onUpdate(locale, { locale, title: null, affiliation: null, description: null });
    } catch (e: any) {
      setError(e?.message ?? 'Erreur lors de la suppression');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Sélecteur de locale */}
      <div className="flex flex-wrap gap-1">
        {LOCALES.map(l => {
          const exists = translations.some(t => t.locale === l && (t.title || t.description));
          return (
            <button key={l} onClick={() => setLocale(l)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                locale === l
                  ? 'bg-primary text-primary-foreground'
                  : exists
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}>
              {l.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Champs */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Titre [{locale.toUpperCase()}]</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Affiliation [{locale.toUpperCase()}]</label>
          <input value={form.affiliation} onChange={e => setForm(f => ({ ...f, affiliation: e.target.value }))}
            className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Description [{locale.toUpperCase()}]</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none resize-y" />
        </div>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex items-center gap-2">
        <button onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          Sauvegarder
        </button>
        {locale !== 'en' && (
          <button onClick={handleTranslate} disabled={translating}
            title="Traduire automatiquement depuis EN via Gemini"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50">
            {translating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            Auto-traduire
          </button>
        )}
        {translations.some(t => t.locale === locale && (t.title || t.description)) && (
          <button onClick={handleDelete} disabled={deleting === locale}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 disabled:opacity-50">
            {deleting === locale ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Supprimer
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Types API paginated ──────────────────────────────────────────────────────

interface Page {
  total:    number;
  page:     number;
  pagesize: number;
  items:    ApiCharacter[];
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const CharactersAdmin = () => {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  const [data, setData]               = useState<Page | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('');
  const [page, setPage]               = useState(1);
  const [editing, setEditing]         = useState<number | null>(null);   // id ou -1 pour nouveau
  const [editTab, setEditTab]         = useState<'infos' | 'translations'>('infos');
  const [deleting, setDeleting]       = useState<number | null>(null);
  const [saving, setSaving]           = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !user.roles?.includes('ROLE_ADMIN'))) router.replace('/');
  }, [authLoading, user, router]);

  const load = useCallback(async (p = page, q = search, sp = filterSpecies, st = filterStatus) => {
    if (!user?.roles?.includes('ROLE_ADMIN')) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), pagesize: '30' });
      if (q)  params.set('q', q);
      if (sp) params.set('species', sp);
      if (st) params.set('status', st);
      setData(await apiFetch<Page>(`/api/admin/characters?${params}`));
    } catch (e: any) {
      setError(e?.message ?? 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterSpecies, filterStatus, user]);

  useEffect(() => {
    if (user?.roles?.includes('ROLE_ADMIN')) load();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user?.roles?.includes('ROLE_ADMIN')) return;
    const t = setTimeout(() => { setPage(1); load(1, search, filterSpecies, filterStatus); }, 350);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user?.roles?.includes('ROLE_ADMIN')) return;
    setPage(1); load(1, search, filterSpecies, filterStatus);
  }, [filterSpecies, filterStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  const goPage = (p: number) => { setPage(p); load(p, search, filterSpecies, filterStatus); };

  // ── CRUD handlers ────────────────────────────────────────────────────────────

  const handleSave = async (id: number | null, form: CharForm) => {
    setSaving(true);
    try {
      const body = JSON.stringify(fromForm(form));
      if (id === null) {
        const created = await apiFetch<ApiCharacter>('/api/admin/characters', { method: 'POST', body });
        setData(prev => prev ? { ...prev, total: prev.total + 1, items: [created, ...prev.items] } : prev);
      } else {
        const updated = await apiFetch<ApiCharacter>(`/api/admin/characters/${id}`, { method: 'PATCH', body });
        setData(prev => prev ? { ...prev, items: prev.items.map(c => c.id === id ? updated : c) } : prev);
      }
      setEditing(null);
    } catch (e: any) {
      alert(e?.message ?? 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const c = data?.items.find(x => x.id === id);
    if (!confirm(`Supprimer « ${c?.name} » ?`)) return;
    setDeleting(id);
    try {
      await apiFetch(`/api/admin/characters/${id}`, { method: 'DELETE' });
      setData(prev => prev ? { ...prev, total: prev.total - 1, items: prev.items.filter(x => x.id !== id) } : prev);
    } catch (e: any) {
      alert(e?.message ?? 'Erreur lors de la suppression');
    } finally {
      setDeleting(null);
    }
  };

  const handleTranslationUpdate = (charId: number, locale: string, tr: CharacterTranslation) => {
    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map(c => {
          if (c.id !== charId) return c;
          const exists = c.translations.some(t => t.locale === locale);
          const translations = tr.title === null && tr.affiliation === null && tr.description === null
            ? c.translations.filter(t => t.locale !== locale)
            : exists
              ? c.translations.map(t => t.locale === locale ? tr : t)
              : [...c.translations, tr];
          return { ...c, translations };
        }),
      };
    });
  };

  if (authLoading || !user?.roles?.includes('ROLE_ADMIN')) return null;

  const totalPages = data ? Math.ceil(data.total / data.pagesize) : 1;

  return (
    <AdminLayout>
      <div className="relative min-h-screen bg-background">

        {/* Fond */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
          <img src="/hero-bg.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" style={{ objectPosition: '50% 30%' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex min-h-[18vh] items-center">
          <div className="container pb-2 pt-8 flex items-end justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <UserCircle2 className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Base de données</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground">Personnages</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {data ? `${data.total} personnage${data.total > 1 ? 's' : ''}` : '…'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditing(-1); setEditTab('infos'); }}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" /> Nouveau
              </button>
              <button onClick={() => load()} disabled={loading}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-10 container pb-8 pt-0 space-y-4">

          {/* Formulaire de création */}
          {editing === -1 && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
              <p className="mb-4 text-sm font-semibold text-foreground">Nouveau personnage</p>
              <CharacterForm
                initial={EMPTY_FORM}
                onSave={form => handleSave(null, form)}
                onCancel={() => setEditing(null)}
                saving={saving}
              />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
          )}

          {/* Filtres */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher par nom, slug ou affiliation…"
                className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
              <option value="">Tous les statuts</option>
              {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
            <select value={filterSpecies} onChange={e => setFilterSpecies(e.target.value)}
              className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
              <option value="">Toutes les espèces</option>
              {SPECIES.map(s => <option key={s} value={s}>{SPECIES_LABELS[s]}</option>)}
            </select>
          </div>

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
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Espèce</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Langues</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden xl:table-cell">Dates</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data?.items.map(c => (
                      <>
                        <tr key={c.id} className={`bg-card transition-colors hover:bg-secondary/20 ${editing === c.id ? 'bg-primary/5' : ''}`}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {c.image ? (
                                <img src={c.image} alt={c.name} className="h-8 w-8 rounded-full object-cover shrink-0 border border-border" />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                                  <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-foreground">{c.name}</p>
                                <p className="text-[10px] font-mono text-muted-foreground/60">{c.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <span className="text-xs text-muted-foreground">{SPECIES_LABELS[c.species]}</span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[c.status]}`}>
                              {STATUS_LABELS[c.status]}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <div className="flex flex-wrap gap-0.5">
                              {c.translations.map(t => (
                                <span key={t.locale} className="inline-block rounded bg-secondary px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                                  {t.locale}
                                </span>
                              ))}
                              {c.translations.length === 0 && (
                                <span className="text-xs text-muted-foreground/30">—</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden xl:table-cell">
                            <span className="text-xs text-muted-foreground">
                              {c.born ?? '—'}{c.died ? ` → ${c.died}` : ''}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => { setEditing(editing === c.id ? null : c.id); setEditTab('infos'); }}
                                title="Modifier les infos"
                                className={`rounded p-1.5 transition-colors ${editing === c.id && editTab === 'infos' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => { setEditing(editing === c.id && editTab === 'translations' ? null : c.id); setEditTab('translations'); }}
                                title="Gérer les traductions"
                                className={`rounded p-1.5 transition-colors ${editing === c.id && editTab === 'translations' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                                <Languages className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
                                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40">
                                {deleting === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {editing === c.id && editTab === 'infos' && (
                          <tr key={`${c.id}-edit`}>
                            <td colSpan={6} className="border-t border-primary/20 bg-primary/5 px-5 py-5 space-y-5">
                              {/* Portrait upload */}
                              <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Portrait</p>
                                <ImageUploadWidget
                                  characterId={c.id}
                                  currentImage={c.image}
                                  hasUploadedImage={c.hasUploadedImage}
                                  onUpdate={(img, hasUploaded) => {
                                    setData(prev => prev ? {
                                      ...prev,
                                      items: prev.items.map(x => x.id === c.id
                                        ? { ...x, image: img, hasUploadedImage: hasUploaded }
                                        : x),
                                    } : prev);
                                  }}
                                />
                              </div>
                              <CharacterForm
                                initial={toForm(c)}
                                onSave={form => handleSave(c.id, form)}
                                onCancel={() => setEditing(null)}
                                saving={saving}
                              />
                            </td>
                          </tr>
                        )}

                        {editing === c.id && editTab === 'translations' && (
                          <tr key={`${c.id}-tr`}>
                            <td colSpan={6} className="border-t border-primary/20 bg-primary/5 px-5 py-4">
                              <div className="mb-3 flex items-center gap-2">
                                <Languages className="h-4 w-4 text-primary" />
                                <p className="text-sm font-semibold text-foreground">Traductions — {c.name}</p>
                                <button onClick={() => setEditing(null)} className="ml-auto rounded p-1 text-muted-foreground hover:text-foreground">
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              <TranslationEditor
                                characterId={c.id}
                                translations={c.translations}
                                onUpdate={(locale, tr) => handleTranslationUpdate(c.id, locale, tr)}
                              />
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                    {data?.items.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                          Aucun personnage trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">Page {page} / {totalPages}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => goPage(page - 1)} disabled={page <= 1 || loading}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground disabled:opacity-30">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button onClick={() => goPage(page + 1)} disabled={page >= totalPages || loading}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground disabled:opacity-30">
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

export default CharactersAdmin;
