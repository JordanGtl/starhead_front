import { SUPPORTED_LANGS } from '@/config/languages';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LocalizedField { [lang: string]: string; }

export interface TimelineEventForm {
  date:        string;
  title:       LocalizedField;
  description: LocalizedField;
}

export interface RelationItemForm {
  name:        string;
  description: LocalizedField;
}

export type IndustryTagForm = LocalizedField;

export interface ManufacturerFormData {
  name:         string;
  slug:         string;
  logo:         string;
  logoBase64:   string;
  founded:      string;
  headquarters: string;
  description:  LocalizedField;
  lore:         LocalizedField;
  industry:     IndustryTagForm[];
  timeline:     TimelineEventForm[];
  relations:    RelationItemForm[];
}

// Format API (ce que la base retourne)
export interface TimelineEvent {
  date:        string;
  title:       string | LocalizedField;
  description: string | LocalizedField | null;
}

export interface RelationItem {
  name:        string;
  description: string | LocalizedField;
}

export interface AdminManufacturer {
  id:           number;
  name:         string;
  slug:         string;
  logo:         string | null;
  logoBase64:   string | null;
  founded:      string | null;
  headquarters: string | null;
  industry:     (string | LocalizedField)[];
  description:  string | LocalizedField | null;
  lore:         string | LocalizedField | null;
  timeline:     TimelineEvent[];
  relations:    RelationItem[];
}

export interface Page {
  total:    number;
  page:     number;
  pagesize: number;
  items:    AdminManufacturer[];
}

// ─── Helpers i18n ──────────────────────────────────────────────────────────────

export function emptyLocalized(): LocalizedField {
  return Object.fromEntries(SUPPORTED_LANGS.map(l => [l.code, '']));
}

export function normalizeLocalized(v: string | LocalizedField | null | undefined): LocalizedField {
  const base = emptyLocalized();
  if (!v) return base;
  if (typeof v === 'string') return { ...base, [SUPPORTED_LANGS[0].code]: v };
  return { ...base, ...v };
}

export function emptyFormData(): ManufacturerFormData {
  return {
    name: '', slug: '', logo: '', logoBase64: '', founded: '', headquarters: '',
    description: emptyLocalized(), lore: emptyLocalized(),
    industry: [], timeline: [], relations: [],
  };
}

export function toFormData(m: AdminManufacturer): ManufacturerFormData {
  return {
    name:         m.name,
    slug:         m.slug,
    logo:         m.logo         ?? '',
    logoBase64:   m.logoBase64   ?? '',
    founded:      m.founded      ?? '',
    headquarters: m.headquarters ?? '',
    description:  normalizeLocalized(m.description as any),
    lore:         normalizeLocalized(m.lore as any),
    industry:     (m.industry  ?? []).map(t => normalizeLocalized(t as any)),
    timeline:     (m.timeline  ?? []).map(e => ({
      date:        e.date ?? '',
      title:       normalizeLocalized(e.title as any),
      description: normalizeLocalized(e.description as any),
    })),
    relations:    (m.relations ?? []).map(r => ({
      name:        r.name ?? '',
      description: normalizeLocalized(r.description as any),
    })),
  };
}

export function fromFormData(d: ManufacturerFormData): Partial<AdminManufacturer> {
  const hasContent = (f: LocalizedField) => Object.values(f).some(v => v.trim());
  return {
    name:         d.name.trim()         || undefined,
    slug:         d.slug.trim()         || undefined,
    logo:         d.logo.trim()         || null,
    logoBase64:   d.logoBase64.trim()   || null,
    founded:      d.founded.trim()      || null,
    headquarters: d.headquarters.trim() || null,
    description:  hasContent(d.description) ? d.description : null,
    lore:         hasContent(d.lore)        ? d.lore        : null,
    industry:     d.industry.filter(hasContent),
    timeline:     d.timeline
      .filter(e => e.date.trim() && hasContent(e.title))
      .map(e => ({
        date:        e.date,
        title:       e.title,
        description: hasContent(e.description) ? e.description : null,
      })),
    relations:    d.relations
      .filter(r => r.name.trim())
      .map(r => ({ name: r.name, description: r.description })),
  };
}

export const EMPTY_TIMELINE_EVENT = (): TimelineEventForm => ({ date: '', title: emptyLocalized(), description: emptyLocalized() });
export const EMPTY_RELATION        = (): RelationItemForm  => ({ name: '', description: emptyLocalized() });
export const EMPTY_INDUSTRY_TAG    = (): IndustryTagForm   => emptyLocalized();
