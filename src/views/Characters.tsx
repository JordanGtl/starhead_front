'use client';
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, UserCircle2, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { apiFetch } from "@/lib/api";
import {
  ApiCharacter, CharacterStatus, CharacterSpecies,
  pickTranslation, extractAffiliations,
} from "@/data/characters";
import { useSEO } from "@/hooks/useSEO";
import PageHeader from "@/components/PageHeader";

// ─── Config maps ─────────────────────────────────────────────────────────────

const statusConfig: Record<CharacterStatus, { labelKey: string; dot: string; badge: string }> = {
  alive:    { labelKey: "characters.alive",    dot: "bg-emerald-400", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  deceased: { labelKey: "characters.deceased", dot: "bg-red-400",     badge: "bg-red-500/10 text-red-400 border-red-500/30" },
  unknown:  { labelKey: "characters.unknown",  dot: "bg-amber-400",   badge: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
};

const speciesConfig: Record<CharacterSpecies, { labelKey: string; color: string }> = {
  human:    { labelKey: "characters.human",   color: "bg-sky-500/10 text-sky-400 border-sky-500/30" },
  "xi'an":  { labelKey: "characters.xian",    color: "bg-violet-500/10 text-violet-400 border-violet-500/30" },
  vanduul:  { labelKey: "characters.vanduul", color: "bg-red-500/10 text-red-400 border-red-500/30" },
  banu:     { labelKey: "characters.banu",    color: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  other:    { labelKey: "characters.other",   color: "bg-secondary text-muted-foreground border-border" },
};

// ─── Card ─────────────────────────────────────────────────────────────────────

const CharacterCard = ({ character }: { character: ApiCharacter }) => {
  const { t, i18n } = useTranslation();
  const lang   = i18n.language.startsWith("fr") ? "fr" : "en";
  const tr     = pickTranslation(character, lang);
  const status  = statusConfig[character.status];
  const species = speciesConfig[character.species];

  return (
    <Link
      href={`/characters/${character.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40"
    >
      {/* Image / placeholder */}
      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-secondary">
        {character.image ? (
          <img
            src={character.image}
            alt={character.name}
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <UserCircle2 className="h-16 w-16 text-muted-foreground/20" />
        )}
        {/* Status dot top-right */}
        <span className={`absolute right-3 top-3 h-2.5 w-2.5 rounded-full ring-2 ring-background ${status.dot}`} title={t(status.labelKey)} />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-sm font-semibold text-foreground transition-colors group-hover:text-primary line-clamp-1">
          {character.name}
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
          {tr?.title ?? '—'}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground/70 line-clamp-1">
          {tr?.affiliation ?? '—'}
        </p>

        {/* Dates */}
        {(character.born || character.died) && (
          <p className="mt-1.5 text-[10px] text-muted-foreground/50">
            {character.born && <span>{character.born}</span>}
            {character.born && character.died && <span className="mx-1">–</span>}
            {character.died && <span>{character.died}</span>}
          </p>
        )}

        {/* Description */}
        <p className="mt-2 flex-1 text-[11px] leading-relaxed text-muted-foreground line-clamp-3">
          {tr?.description ?? '—'}
        </p>

        {/* Badges */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-semibold ${status.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {t(status.labelKey)}
          </span>
          <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold ${species.color}`}>
            {t(species.labelKey)}
          </span>
        </div>
      </div>
    </Link>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const Characters = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("fr") ? "fr" : "en";

  useSEO({
    title: t("characters.title"),
    description: t("characters.description"),
    path: "/characters",
  });

  const [all, setAll]                      = useState<ApiCharacter[]>([]);
  const [loading, setLoading]              = useState(true);
  const [error, setError]                  = useState<string | null>(null);
  const [search, setSearch]                = useState("");
  const [activeStatus, setActiveStatus]    = useState<CharacterStatus | null>(null);
  const [activeSpecies, setActiveSpecies]  = useState<CharacterSpecies | null>(null);
  const [activeAffil, setActiveAffil]      = useState<string | null>(null);

  useEffect(() => {
    apiFetch<ApiCharacter[]>('/api/characters')
      .then(setAll)
      .catch(e => setError(e?.message ?? 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, []);

  const affiliations = useMemo(() => extractAffiliations(all), [all]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return all.filter(c => {
      const tr = pickTranslation(c, lang);
      const matchSearch = !search
        || c.name.toLowerCase().includes(q)
        || (tr?.title ?? '').toLowerCase().includes(q)
        || (tr?.affiliation ?? '').toLowerCase().includes(q)
        || (tr?.description ?? '').toLowerCase().includes(q);
      const matchStatus  = !activeStatus  || c.status  === activeStatus;
      const matchSpecies = !activeSpecies || c.species === activeSpecies;
      const matchAffil   = !activeAffil   || (
        c.translations.find(t => t.locale === 'en')?.affiliation === activeAffil
      );
      return matchSearch && matchStatus && matchSpecies && matchAffil;
    });
  }, [search, activeStatus, activeSpecies, activeAffil, all, lang]);

  const hasFilters = !!search || !!activeStatus || !!activeSpecies || !!activeAffil;

  const clearFilters = () => {
    setSearch("");
    setActiveStatus(null);
    setActiveSpecies(null);
    setActiveAffil(null);
  };

  const statuses: CharacterStatus[]    = ["alive", "deceased", "unknown"];
  const speciesList: CharacterSpecies[] = ["human", "xi'an", "vanduul", "banu"];

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: t("characters.title"), icon: UserCircle2 }]}
        title={t("characters.title")}
        label={t("characters.title")}
        labelIcon={UserCircle2}
        subtitle={t("characters.description")}
      />

      <div className="container py-8">

        {/* Search + reset */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("characters.searchPlaceholder")}
              className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="flex h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground hover:text-foreground">
              <span className="text-xs">{t("characters.reset")}</span>
            </button>
          )}
        </div>

        {/* Filtres statut */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveStatus(null)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${!activeStatus ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground hover:text-foreground'}`}
          >
            {t("characters.all")}
          </button>
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setActiveStatus(activeStatus === s ? null : s)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${activeStatus === s ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground hover:text-foreground'}`}
            >
              {t(`characters.${s}`)}
            </button>
          ))}
        </div>

        {/* Filtres espèce */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {speciesList.map(s => (
            <button
              key={s}
              onClick={() => setActiveSpecies(activeSpecies === s ? null : s)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${activeSpecies === s ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground hover:text-foreground'}`}
            >
              {t(`characters.${s === "xi'an" ? 'xian' : s}`)}
            </button>
          ))}
        </div>

        {/* Filtres affiliation */}
        {affiliations.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-1.5">
            {affiliations.map(a => (
              <button
                key={a}
                onClick={() => setActiveAffil(activeAffil === a ? null : a)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${activeAffil === a ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground hover:text-foreground'}`}
              >
                {a}
              </button>
            ))}
          </div>
        )}

        {/* États */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Count */}
            <p className="mb-4 text-xs text-muted-foreground">
              {t("characters.count", { count: filtered.length })}
            </p>

            {/* Grille */}
            {filtered.length === 0 ? (
              <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 text-muted-foreground">
                <UserCircle2 className="h-10 w-10 opacity-20" />
                <p className="text-sm">{t("characters.noResult")}</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filtered.map(c => (
                  <CharacterCard key={c.id} character={c} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Characters;
