import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Rocket, Crosshair, MapPin, Car, Cpu, Building2, BookOpen, Users, ArrowRight, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { apiSearch, type SearchCategory, type SearchResult } from "@/data/search";
import heroBg from "@/assets/hero-bg.jpg";

// ─── Couleurs par catégorie ───────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  ships:         "bg-blue-500/10 text-blue-400 border-blue-500/20",
  weapons:       "bg-red-500/10 text-red-400 border-red-500/20",
  components:    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  locations:     "bg-green-500/10 text-green-400 border-green-500/20",
  vehicles:      "bg-violet-500/10 text-violet-400 border-violet-500/20",
  manufacturers: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  lore:          "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  factions:      "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

// ─── Carte de résultat ────────────────────────────────────────────────────────

const SearchResultCard = ({ result }: { result: SearchResult }) => (
  <Link
    to={result.link}
    className="group block rounded-lg border border-border bg-card p-4 card-hover"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-sm font-semibold text-foreground truncate">{result.name}</h3>
          <span className={`inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${categoryColors[result.category] ?? "bg-secondary text-muted-foreground border-border"}`}>
            {result.categoryLabel}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-primary">{result.subtitle}</p>
        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-1">{result.description}</p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
    {Object.keys(result.meta).length > 0 && (
      <div className="mt-3 flex flex-wrap gap-1.5">
        {Object.entries(result.meta).map(([key, val]) => val ? (
          <span key={key} className="rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
            {key}: <span className="text-foreground">{val}</span>
          </span>
        ) : null)}
      </div>
    )}
  </Link>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const SearchPage = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.split('-')[0] ?? 'en';
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery]       = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState<SearchCategory>((searchParams.get("cat") as SearchCategory) || "all");

  // Tous les résultats (cat=all) pour les compteurs
  const [allResults, setAllResults]   = useState<SearchResult[]>([]);
  const [loading, setLoading]         = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categoryFilters: { value: SearchCategory; label: string; icon: React.ElementType }[] = [
    { value: "all",           label: t("search.all"),           icon: Search    },
    { value: "ships",         label: t("nav.ships"),            icon: Rocket    },
    { value: "weapons",       label: t("nav.weapons"),          icon: Crosshair },
    { value: "components",    label: t("nav.components"),       icon: Cpu       },
    { value: "locations",     label: t("nav.locations"),        icon: MapPin    },
    { value: "vehicles",      label: t("nav.vehicles"),         icon: Car       },
    { value: "manufacturers", label: t("nav.manufacturers"),    icon: Building2 },
    { value: "lore",          label: t("nav.lore"),             icon: BookOpen  },
    { value: "factions",      label: t("nav.factions"),         icon: Users     },
  ];

  // Sync URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (category !== "all") params.cat = category;
    setSearchParams(params, { replace: true });
  }, [query, category, setSearchParams]);

  // Fetch all results avec debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.trim().length < 2) {
      setAllResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await apiSearch(query.trim(), "all", locale);
        setAllResults(results);
      } catch {
        setAllResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, locale]);

  // Filtre local par catégorie (pas de re-fetch)
  const results = category === "all"
    ? allResults
    : allResults.filter(r => r.category === category);

  // Compteurs par catégorie
  const categoryCounts: Record<string, number> = { all: allResults.length };
  for (const r of allResults) {
    categoryCounts[r.category] = (categoryCounts[r.category] ?? 0) + 1;
  }

  return (
    <div className="relative min-h-screen bg-background">

      {/* Image de fond */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
        <img src={heroBg} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" style={{ objectPosition: "50% 30%" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex min-h-[18vh] items-center">
        <div className="container pb-2 pt-8">
          <div className="mb-1 flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("search.title")}</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">{t("search.subtitle")}</h1>
        </div>
      </div>

      <div className="relative z-10 container pb-8 pt-0">

      {/* Barre de recherche */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search.placeholder")}
          autoFocus
          className="h-12 w-full rounded-lg border border-border bg-card pl-12 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Filtres catégorie */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categoryFilters.map((f) => {
          const count = categoryCounts[f.value] ?? 0;
          const Icon = f.icon;
          const isActive = category === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setCategory(f.value)}
              className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-display text-xs font-medium transition-colors ${
                isActive
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/20 hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {f.label}
              {query.trim().length >= 2 && (
                <span className={`ml-1 rounded-full px-1.5 text-[10px] ${isActive ? "bg-primary/20" : "bg-secondary"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Résultats */}
      {!query || query.trim().length < 2 ? (
        <div className="py-20 text-center text-muted-foreground">
          <Search className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
          <p>{t("search.startTyping")}</p>
        </div>
      ) : loading ? (
        <div className="py-20 text-center text-muted-foreground">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-muted-foreground/50" />
          <p className="text-sm">{t("search.searching", { defaultValue: "Recherche en cours…" })}</p>
        </div>
      ) : results.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <p>{t("search.noResults", { query })}</p>
          <p className="mt-1 text-xs">{t("search.tryOtherTerms")}</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {t("search.resultsFound", { count: results.length })}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((r) => (
              <SearchResultCard key={`${r.category}-${r.id}`} result={r} />
            ))}
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default SearchPage;
