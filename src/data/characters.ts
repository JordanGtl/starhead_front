// ─── Types primitifs ──────────────────────────────────────────────────────────

export type CharacterStatus  = 'alive' | 'deceased' | 'unknown';
export type CharacterSpecies = 'human' | "xi'an" | 'vanduul' | 'banu' | 'other';
export type FamilyRelation =
  | 'father' | 'mother'
  | 'grandfather' | 'grandmother'
  | 'son' | 'daughter'
  | 'grandson' | 'granddaughter'
  | 'brother' | 'sister'
  | 'spouse';

// ─── Types API ────────────────────────────────────────────────────────────────

export interface CharacterTranslation {
  locale:      string;
  title:       string | null;
  affiliation: string | null;
  description: string | null;
}

export interface BiographySectionTranslation {
  locale:  string;
  title:   string;
  content: string;
}

export interface BiographySection {
  position:     number;
  translations: BiographySectionTranslation[];
}

export interface FamilyMember {
  name:           string;
  relation:       FamilyRelation;
  status?:        CharacterStatus;
  born?:          string;
  died?:          string;
  characterSlug?: string;
}

export interface ApiCharacter {
  id:                  number;
  slug:                string;
  name:                string;
  species:             CharacterSpecies;
  status:              CharacterStatus;
  born?:               string | null;
  died?:               string | null;
  companySlug?:        string | null;
  /** Image effective : base64 uploadée ou URL externe (déjà résolue côté API) */
  image?:              string | null;
  /** Vrai si une image a été uploadée (admin seulement) */
  hasUploadedImage?:   boolean;
  translations:        CharacterTranslation[];
  // Uniquement dans la réponse détail :
  biographySections?:  BiographySection[];
  familyMembers?:      FamilyMember[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Renvoie la traduction pour le locale donné,
 * avec fallback sur 'en' puis la première disponible.
 */
export function pickTranslation(
  character: ApiCharacter,
  lang: string,
): CharacterTranslation | undefined {
  const l = lang.split('-')[0];
  return (
    character.translations.find(t => t.locale === l) ??
    character.translations.find(t => t.locale === 'en') ??
    character.translations[0]
  );
}

/**
 * Renvoie la traduction d'une section biographique pour le locale donné.
 */
export function pickSectionTranslation(
  section: BiographySection,
  lang: string,
): BiographySectionTranslation | undefined {
  const l = lang.split('-')[0];
  return (
    section.translations.find(t => t.locale === l) ??
    section.translations.find(t => t.locale === 'en') ??
    section.translations[0]
  );
}

/**
 * Extrait les affiliations uniques depuis une liste de personnages
 * (prend la valeur EN comme clé de déduplication).
 */
export function extractAffiliations(characters: ApiCharacter[]): string[] {
  const seen = new Set<string>();
  for (const c of characters) {
    const en = c.translations.find(t => t.locale === 'en')?.affiliation;
    if (en) seen.add(en);
  }
  return [...seen].sort();
}
