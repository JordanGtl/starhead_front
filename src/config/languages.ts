/** Langues supportées par l'application. Ajouter une entrée ici suffit pour propager le support partout. */
export const SUPPORTED_LANGS = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
] as const;

export type LangCode = typeof SUPPORTED_LANGS[number]['code'];
