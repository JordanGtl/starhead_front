'use client';
import { useState, useRef } from 'react';
import {
  Building2, Plus, X, Check, Loader2,
  ImageIcon, History, GripVertical, Users,
} from 'lucide-react';
import { SUPPORTED_LANGS } from '@/config/languages';
import {
  ManufacturerFormData, TimelineEventForm,
  EMPTY_TIMELINE_EVENT, EMPTY_RELATION, EMPTY_INDUSTRY_TAG,
} from '@/lib/manufacturer-admin';

export default function ManufacturerForm({
  initialData, title, onSave, onCancel,
}: {
  initialData: ManufacturerFormData;
  title:       string;
  onSave:      (data: ManufacturerFormData) => Promise<void>;
  onCancel:    () => void;
}) {
  const [data, setData] = useState<ManufacturerFormData>(initialData);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const setField = <K extends keyof ManufacturerFormData>(k: K, v: ManufacturerFormData[K]) =>
    setData(d => ({ ...d, [k]: v }));

  const setLocalized = (field: 'description' | 'lore', lang: string, v: string) =>
    setData(d => ({ ...d, [field]: { ...d[field], [lang]: v } }));

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = ev => setField('logoBase64', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Timeline helpers
  const setEvent = (i: number, patch: Partial<TimelineEventForm>) =>
    setField('timeline', data.timeline.map((e, idx) => idx === i ? { ...e, ...patch } : e));

  const setEventLocalized = (i: number, field: 'title' | 'description', lang: string, v: string) =>
    setField('timeline', data.timeline.map((e, idx) =>
      idx === i ? { ...e, [field]: { ...e[field], [lang]: v } } : e
    ));
  const addEvent    = () => setField('timeline', [...data.timeline, EMPTY_TIMELINE_EVENT()]);
  const removeEvent = (i: number) => setField('timeline', data.timeline.filter((_, idx) => idx !== i));

  // Relations helpers
  const setRelationName = (i: number, v: string) =>
    setField('relations', data.relations.map((r, idx) => idx === i ? { ...r, name: v } : r));
  const setRelationLocalized = (i: number, lang: string, v: string) =>
    setField('relations', data.relations.map((r, idx) =>
      idx === i ? { ...r, description: { ...r.description, [lang]: v } } : r
    ));
  const addRelation    = () => setField('relations', [...data.relations, EMPTY_RELATION()]);
  const removeRelation = (i: number) => setField('relations', data.relations.filter((_, idx) => idx !== i));

  // Industry helpers
  const setTagLocalized = (i: number, lang: string, v: string) =>
    setField('industry', data.industry.map((t, idx) =>
      idx === i ? { ...t, [lang]: v } : t
    ));
  const addTag    = () => setField('industry', [...data.industry, EMPTY_INDUSTRY_TAG()]);
  const removeTag = (i: number) => setField('industry', data.industry.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!data.name.trim()) return;
    setSaving(true);
    try { await onSave(data); } finally { setSaving(false); }
  };

  const logoPreview = data.logoBase64 || data.logo || null;

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>

      {/* Logo upload */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 shrink-0 flex items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary">
          {logoPreview
            ? <img src={logoPreview} alt="" className="h-12 w-12 object-contain" />
            : <Building2 className="h-6 w-6 text-muted-foreground/30" />
          }
        </div>
        <div className="space-y-1">
          <button type="button" onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
            <ImageIcon className="h-3.5 w-3.5" />
            {data.logoBase64 ? 'Changer le logo' : 'Ajouter un logo'}
          </button>
          {data.logoBase64 && (
            <button type="button" onClick={() => setField('logoBase64', '')}
              className="block text-[10px] text-muted-foreground/50 hover:text-red-400 transition-colors">
              Supprimer
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={handleLogoFile} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Nom *</label>
          <input value={data.name} onChange={e => setField('name', e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Slug</label>
          <input value={data.slug} onChange={e => setField('slug', e.target.value)} placeholder="auto-généré"
            className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Fondée</label>
          <input value={data.founded} onChange={e => setField('founded', e.target.value)} placeholder="ex : 2541"
            className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Siège social</label>
          <input value={data.headquarters} onChange={e => setField('headquarters', e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div className="sm:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[11px] font-medium text-muted-foreground">Secteurs</label>
            <button type="button" onClick={addTag}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="h-3 w-3" /> Ajouter
            </button>
          </div>
          {data.industry.length === 0 && (
            <p className="text-xs text-muted-foreground/40 italic">Aucun secteur.</p>
          )}
          <div className="space-y-1.5">
            {data.industry.map((tag, i) => (
              <div key={i} className="flex items-center gap-2">
                {SUPPORTED_LANGS.map(lang => (
                  <input key={lang.code} value={tag[lang.code] ?? ''} onChange={e => setTagLocalized(i, lang.code, e.target.value)}
                    placeholder={lang.code.toUpperCase()}
                    className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none" />
                ))}
                <button type="button" onClick={() => removeTag(i)}
                  className="shrink-0 rounded p-1 text-muted-foreground/40 hover:text-red-400 transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium text-muted-foreground">Description</label>
        <div className={`grid gap-2 grid-cols-${SUPPORTED_LANGS.length}`}>
          {SUPPORTED_LANGS.map(lang => (
            <div key={lang.code}>
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">{lang.code.toUpperCase()}</span>
              <textarea value={data.description[lang.code] ?? ''} onChange={e => setLocalized('description', lang.code, e.target.value)} rows={3}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none resize-none" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium text-muted-foreground">Histoire (lore)</label>
        <div className={`grid gap-2 grid-cols-${SUPPORTED_LANGS.length}`}>
          {SUPPORTED_LANGS.map(lang => (
            <div key={lang.code}>
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">{lang.code.toUpperCase()}</span>
              <textarea value={data.lore[lang.code] ?? ''} onChange={e => setLocalized('lore', lang.code, e.target.value)} rows={5}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none resize-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="border-t border-border pt-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Chronologie</span>
          </div>
          <button type="button" onClick={addEvent}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
            <Plus className="h-3 w-3" />
            Ajouter
          </button>
        </div>
        {data.timeline.length === 0 && (
          <p className="text-xs text-muted-foreground/40 italic">Aucun événement — cliquez sur "Ajouter" pour commencer.</p>
        )}
        <div className="space-y-2">
          {data.timeline.map((event, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg border border-border bg-background p-3">
              <GripVertical className="mt-2 h-4 w-4 shrink-0 text-muted-foreground/30" />
              <div className="flex-1 grid gap-2">
                <input
                  value={event.date}
                  onChange={e => setEvent(i, { date: e.target.value })}
                  placeholder="2945"
                  className="h-8 w-32 rounded-md border border-border bg-card px-2 text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                />
                <div className={`grid gap-2 grid-cols-${SUPPORTED_LANGS.length}`}>
                  {SUPPORTED_LANGS.map(lang => (
                    <div key={lang.code}>
                      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">{lang.code.toUpperCase()}</span>
                      <input value={event.title[lang.code] ?? ''} onChange={e => setEventLocalized(i, 'title', lang.code, e.target.value)}
                        placeholder="Titre"
                        className="h-8 w-full rounded-md border border-border bg-card px-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none" />
                    </div>
                  ))}
                  {SUPPORTED_LANGS.map(lang => (
                    <div key={lang.code}>
                      <textarea value={event.description[lang.code] ?? ''} onChange={e => setEventLocalized(i, 'description', lang.code, e.target.value)}
                        placeholder={`Description (${lang.code.toUpperCase()})…`} rows={2}
                        className="w-full rounded-md border border-border bg-card px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none resize-none" />
                    </div>
                  ))}
                </div>
              </div>
              <button type="button" onClick={() => removeEvent(i)}
                className="mt-1 rounded p-1 text-muted-foreground/40 transition-colors hover:text-red-400">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Relations & partenariats */}
      <div className="border-t border-border pt-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Relations & partenariats</span>
          </div>
          <button type="button" onClick={addRelation}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
            <Plus className="h-3 w-3" />
            Ajouter
          </button>
        </div>
        {data.relations.length === 0 && (
          <p className="text-xs text-muted-foreground/40 italic">Aucune relation — cliquez sur "Ajouter" pour commencer.</p>
        )}
        <div className="space-y-2">
          {data.relations.map((rel, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg border border-border bg-background p-3">
              <GripVertical className="mt-2 h-4 w-4 shrink-0 text-muted-foreground/30" />
              <div className="flex-1 grid gap-2">
                <input
                  value={rel.name}
                  onChange={e => setRelationName(i, e.target.value)}
                  placeholder="Nom de l'entité (ex : UEE Navy)"
                  className="h-8 rounded-md border border-border bg-card px-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                />
                <div className={`grid gap-2 grid-cols-${SUPPORTED_LANGS.length}`}>
                  {SUPPORTED_LANGS.map(lang => (
                    <div key={lang.code}>
                      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">{lang.code.toUpperCase()}</span>
                      <textarea value={rel.description[lang.code] ?? ''} onChange={e => setRelationLocalized(i, lang.code, e.target.value)}
                        placeholder={`Description (${lang.code.toUpperCase()})…`} rows={2}
                        className="w-full rounded-md border border-border bg-card px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none resize-none" />
                    </div>
                  ))}
                </div>
              </div>
              <button type="button" onClick={() => removeRelation(i)}
                className="mt-1 rounded p-1 text-muted-foreground/40 transition-colors hover:text-red-400">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button onClick={handleSave} disabled={saving || !data.name.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Enregistrer
        </button>
        <button onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Annuler
        </button>
      </div>
    </div>
  );
}
