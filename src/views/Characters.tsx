'use client';
import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, UserCircle2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CHARACTERS, localizeChar, characterAffiliations, type Character, type CharacterStatus, type CharacterSpecies } from "@/data/characters";
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

const CharacterCard = ({ character }: { character: Character }) => {
  const { t, i18n } = useTranslation();
  const lang   = i18n.language.startsWith("fr") ? "fr" : "en";
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
          {localizeChar(character.title, lang)}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground/70 line-clamp-1">
          {localizeChar(character.affiliation, lang)}
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
          {localizeChar(character.description, lang)}
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

  const [search, setSearch]               = useState("");
  const [activeStatus, setActiveStatus]   = useState<CharacterStatus | null>(null);
  const [activeSpecies, setActiveSpecies] = useState<CharacterSpecies | null>(null);
  const [activeAffil, setActiveAffil]     = useState<string | null>(null);

  const affiliations = useMemo(() => characterAffiliations(CHARACTERS), []);

  const filtered = useMemo(() =>
    CHARACTERS.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !search
        || c.name.toLowerCase().includes(q)
        || localizeChar(c.title, lang).toLowerCase().includes(q)
        || localizeChar(c.affiliation, lang).toLowerCase().includes(q)
        || localizeChar(c.description, lang).toLowerCase().includes(q);
      const matchStatus  = !activeStatus  || c.status  === activeStatus;
      const matchSpecies = !activeSpecies || c.species === activeSpecies;
      const matchAffil   = !activeAffil   || c.affiliation.en === activeAffil;
      return matchSearch && matchStatus && matchSpecies && matchAffil;
    }),
  [search, activeStatus, activeSpecies, activeAffil, lang]);

  const hasFilters = !!search || !!activeStatus || !!activeSpecies || !!activeAffil;

  const clearFilters = () => {
    setSearch("");
    setActiveStatus(null);
    setActiveSpecies(null);
    setActiveAffil(null);
  };

  const statuses: CharacterStatus[]   = ["alive", "deceased", "unknown"];
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
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              {t("characters.reset")}
            </button>
          )}
        </div>

        {/* Filters row */}
        <div className="mb-6 flex flex-wrap gap-4">

          {/* Status */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("characters.filterStatus")}
            </span>
            {statuses.map(s => {
              const cfg = statusConfig[s];
              return (
                <button
                  key={s}
                  onClick={() => setActiveStatus(activeStatus === s ? null : s)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
                    activeStatus === s ? cfg.badge : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                  {t(cfg.labelKey)}
                </button>
              );
            })}
          </div>

          {/* Species */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("characters.filterSpecies")}
            </span>
            {speciesList.map(sp => {
              const cfg = speciesConfig[sp];
              return (
                <button
                  key={sp}
                  onClick={() => setActiveSpecies(activeSpecies === sp ? null : sp)}
                  className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
                    activeSpecies === sp ? cfg.color : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(cfg.labelKey)}
                </button>
              );
            })}
          </div>

          {/* Affiliation */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("characters.filterAffiliation")}
            </span>
            {affiliations.map(aff => (
              <button
                key={aff}
                onClick={() => setActiveAffil(activeAffil === aff ? null : aff)}
                className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
                  activeAffil === aff
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {aff}
              </button>
            ))}
          </div>
        </div>

        {/* Counter */}
        <p className="mb-4 text-sm text-muted-foreground">
          {t("characters.count", { count: filtered.length })}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(c => (
              <CharacterCard key={c.id} character={c} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-24 text-center">
            <UserCircle2 className="mb-4 h-12 w-12 text-muted-foreground/20" />
            <p className="text-base font-medium text-muted-foreground">{t("characters.noResult")}</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-3 text-sm text-primary hover:underline">
                {t("characters.reset")}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Characters;
