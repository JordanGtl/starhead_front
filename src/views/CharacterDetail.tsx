'use client';
import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { UserCircle2, BookOpen, ChevronLeft, Building2, ExternalLink, GitFork } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CHARACTERS, getCharacterBySlug, localizeChar, type Character, type FamilyMember, type FamilyRelation, type CharacterStatus, type CharacterSpecies } from "@/data/characters";
import { useSEO } from "@/hooks/useSEO";
import PageHeader from "@/components/PageHeader";

// ─── Config maps ──────────────────────────────────────────────────────────────

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

// ─── Family tree ──────────────────────────────────────────────────────────────

const relationKeyMap: Record<FamilyRelation, string> = {
  father:       'characters.relFather',
  mother:       'characters.relMother',
  grandfather:  'characters.relGrandfather',
  grandmother:  'characters.relGrandmother',
  son:          'characters.relSon',
  daughter:     'characters.relDaughter',
  grandson:     'characters.relGrandson',
  granddaughter:'characters.relGranddaughter',
  brother:      'characters.relBrother',
  sister:       'characters.relSister',
  spouse:       'characters.relSpouse',
};

const statusDotColor: Record<CharacterStatus, string> = {
  alive:    'bg-emerald-400',
  deceased: 'bg-red-400',
  unknown:  'bg-amber-400',
};

type FamilyNodeData =
  | (FamilyMember & { isSubject?: false })
  | { isSubject: true; name: string; slug: string; image?: string };

const FamilyNode = ({ data }: { data: FamilyNodeData }) => {
  const { t } = useTranslation();

  const isSubject = data.isSubject === true;

  // Resolve image: subject image passed directly; linked member → look up in CHARACTERS
  const linkedChar = !isSubject && (data as FamilyMember).characterSlug
    ? CHARACTERS.find(c => c.slug === (data as FamilyMember).characterSlug)
    : null;
  const image = isSubject
    ? (data as { image?: string }).image
    : linkedChar?.image ?? undefined;

  const status = !isSubject ? (data as FamilyMember).status : undefined;
  const dot    = status ? statusDotColor[status] : null;
  const born   = !isSubject ? (data as FamilyMember).born : undefined;
  const died   = !isSubject ? (data as FamilyMember).died : undefined;

  const inner = (
    <div className={`group flex w-28 flex-col overflow-hidden rounded-xl border transition-colors ${
      isSubject
        ? 'border-primary bg-primary/10 cursor-default'
        : linkedChar
          ? 'border-border bg-card hover:border-primary/40'
          : 'border-border bg-card'
    }`}>
      {/* Photo */}
      <div className="relative flex h-28 w-full shrink-0 items-center justify-center overflow-hidden bg-secondary">
        {image ? (
          <img
            src={image}
            alt={data.name}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <UserCircle2 className="h-10 w-10 text-muted-foreground/20" />
        )}
        {/* Status dot */}
        {dot && (
          <span className={`absolute right-2 top-2 h-2 w-2 rounded-full ring-1 ring-background ${dot}`} />
        )}
        {/* Subject star badge */}
        {isSubject && (
          <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">★</span>
        )}
      </div>

      {/* Infos */}
      <div className="flex flex-col gap-0.5 px-2 py-2 text-center">
        <span className={`text-[11px] font-semibold leading-tight line-clamp-2 ${isSubject ? 'text-primary' : 'text-foreground'}`}>
          {data.name}
        </span>
        <span className="text-[10px] text-muted-foreground leading-tight">
          {isSubject ? '—' : t(relationKeyMap[(data as FamilyMember).relation])}
        </span>
        {(born || died) && (
          <span className="font-mono text-[9px] text-muted-foreground/50 leading-tight">
            {born ?? '?'}{died ? ` — ${died}` : ''}
          </span>
        )}
      </div>
    </div>
  );

  if (!isSubject && linkedChar) {
    return <Link href={`/characters/${linkedChar.slug}`}>{inner}</Link>;
  }
  return inner;
};

const VLine = () => (
  <div className="flex justify-center py-1">
    <div className="h-6 w-px bg-border" />
  </div>
);

const HLine = () => (
  <div className="h-px w-8 self-center shrink-0 bg-border" />
);

const FamilyTree = ({ character }: { character: Character }) => {
  const { t } = useTranslation();
  const family = character.family ?? [];

  const ancestors   = family.filter(m => ['grandfather', 'grandmother'].includes(m.relation));
  const parents     = family.filter(m => ['father', 'mother'].includes(m.relation));
  const siblings    = family.filter(m => ['brother', 'sister'].includes(m.relation));
  const spouse      = family.find( m => m.relation === 'spouse');
  const children    = family.filter(m => ['son', 'daughter'].includes(m.relation));
  const grandchildren = family.filter(m => ['grandson', 'granddaughter'].includes(m.relation));

  const subjectData = { isSubject: true as const, name: character.name, slug: character.slug, image: character.image };

  return (
    <div className="rounded-xl border border-border bg-card px-6 py-5">
      <div className="overflow-x-auto">
        <div className="flex flex-col items-center min-w-max mx-auto">

          {/* Grands-parents */}
          {ancestors.length > 0 && (
            <>
              <div className="flex items-end gap-3">
                {ancestors.map((m, i) => (
                  <div key={i} className="flex items-end gap-3">
                    {i > 0 && <HLine />}
                    <FamilyNode data={m} />
                  </div>
                ))}
              </div>
              <VLine />
            </>
          )}

          {/* Parents */}
          {parents.length > 0 && (
            <>
              <div className="flex items-end gap-3">
                {parents.map((m, i) => (
                  <div key={i} className="flex items-end gap-3">
                    {i > 0 && <HLine />}
                    <FamilyNode data={m} />
                  </div>
                ))}
              </div>
              <VLine />
            </>
          )}

          {/* Rangée principale : frères/sœurs — sujet — conjoint */}
          <div className="flex items-center gap-0">
            {siblings.map((m, i) => (
              <div key={i} className="flex items-center gap-0">
                <FamilyNode data={m} />
                <HLine />
              </div>
            ))}
            <FamilyNode data={subjectData} />
            {spouse && (
              <div className="flex items-center gap-0">
                <HLine />
                <FamilyNode data={spouse} />
              </div>
            )}
          </div>

          {/* Enfants */}
          {children.length > 0 && (
            <>
              <VLine />
              <div className="flex items-start gap-3">
                {children.map((m, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {i > 0 && <div className="h-px w-8 self-center shrink-0 bg-border mt-14" />}
                    <FamilyNode data={m} />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Petits-enfants */}
          {grandchildren.length > 0 && (
            <>
              <VLine />
              <div className="flex items-start gap-3">
                {grandchildren.map((m, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {i > 0 && <div className="h-px w-8 self-center shrink-0 bg-border mt-14" />}
                    <FamilyNode data={m} />
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const CharacterDetail = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const lang = i18n.language.startsWith("fr") ? "fr" : "en";

  const character = getCharacterBySlug(slug);

  useSEO({
    title: character?.name,
    description: character
      ? localizeChar(character.description, lang).slice(0, 160)
      : undefined,
    path: slug ? `/characters/${slug}` : undefined,
  });

  if (!character) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <UserCircle2 className="h-10 w-10 opacity-20" />
        <p className="text-sm">{t("characters.notFound")}</p>
        <Link href="/characters" className="text-sm text-primary hover:underline">
          ← {t("characters.backToList")}
        </Link>
      </div>
    );
  }

  const status  = statusConfig[character.status];
  const species = speciesConfig[character.species];
  const hasFamily = !!(character.family && character.family.length > 0);
  const [tab, setTab] = useState<'biography' | 'family'>('biography');

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: t("characters.title"), href: "/characters", icon: UserCircle2 },
          { label: character.name },
        ]}
        title={character.name}
        label={t("characters.title")}
        labelIcon={UserCircle2}
        subtitle={localizeChar(character.title, lang)}
      />

      <div className="container py-8">

        {/* Toggle biographie / arbre — au-dessus du grid, aligné à droite */}
        {hasFamily && (
          <div className="mb-4 flex justify-end">
            <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
              <button
                onClick={() => setTab('biography')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  tab === 'biography'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                {t('characters.biography')}
              </button>
              <button
                onClick={() => setTab('family')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  tab === 'family'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <GitFork className="h-3.5 w-3.5" />
                {t('characters.familyTree')}
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

          {/* ── Colonne gauche ────────────────────────────────────────── */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">

            {/* Portrait */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-secondary flex items-center justify-center">
              {character.image ? (
                <img
                  src={character.image}
                  alt={character.name}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <UserCircle2 className="h-24 w-24 text-muted-foreground/20" />
              )}
            </div>

            {/* Fiche identité */}
            <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
              <div className="flex items-center justify-between gap-2 px-4 py-3">
                <span className="text-xs font-medium text-muted-foreground">{t("characters.labelStatus")}</span>
                <span className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-0.5 text-[11px] font-semibold ${status.badge}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  {t(status.labelKey)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 px-4 py-3">
                <span className="text-xs font-medium text-muted-foreground">{t("characters.labelSpecies")}</span>
                <span className={`inline-flex items-center rounded border px-2.5 py-0.5 text-[11px] font-semibold ${species.color}`}>
                  {t(species.labelKey)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4 px-4 py-3">
                <span className="text-xs font-medium text-muted-foreground shrink-0">{t("characters.labelAffiliation")}</span>
                <span className="text-xs text-foreground text-right">{localizeChar(character.affiliation, lang)}</span>
              </div>
              {(character.born || character.died) && (
                <div className="flex items-center justify-between gap-2 px-4 py-3">
                  <span className="text-xs font-medium text-muted-foreground">{t("characters.labelDates")}</span>
                  <span className="font-mono text-xs text-foreground">
                    {character.born ?? "?"}
                    {character.died && <span className="mx-1 text-muted-foreground">→</span>}
                    {character.died}
                  </span>
                </div>
              )}
            </div>

            {/* Lien entreprise */}
            {character.companySlug && (
              <Link
                href={`/manufacturers/${character.companySlug}`}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40 hover:bg-card/80"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <Building2 className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-muted-foreground">{t("characters.linkedCompany")}</p>
                  <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {localizeChar(character.affiliation, lang)}
                  </p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </Link>
            )}
          </div>

          {/* ── Colonne droite ────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Biographie */}
            {tab === 'biography' && (
              <>
                <div className="rounded-xl border border-border bg-card px-6 py-5">
                  <div className="mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <h2 className="font-display text-base font-semibold text-foreground">
                      {t('characters.biography')}
                    </h2>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {localizeChar(character.description, lang)}
                  </p>
                </div>

                {character.biography?.map((section, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card px-6 py-5">
                    <h3 className="mb-3 flex items-center gap-2.5 font-display text-sm font-semibold text-foreground">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        {i + 1}
                      </span>
                      {localizeChar(section.title, lang)}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {localizeChar(section.content, lang)}
                    </p>
                  </div>
                ))}
              </>
            )}

            {/* Arbre généalogique */}
            {tab === 'family' && hasFamily && (
              <FamilyTree character={character} />
            )}
          </div>
        </div>

        {/* ── Back link ──────────────────────────────────────────────── */}
        <div className="mt-8">
          <Link
            href="/characters"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("characters.backToList")}
          </Link>
        </div>
      </div>
    </>
  );
};

export default CharacterDetail;
