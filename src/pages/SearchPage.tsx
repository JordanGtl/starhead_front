import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Rocket, Crosshair, MapPin, Car, Cpu, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { globalSearch, SearchCategory, SearchResult } from "@/data/search";
import { Badge } from "@/components/ui/badge";

const categoryColors: Record<string, string> = {
  ships: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  weapons: "bg-red-500/10 text-red-400 border-red-500/20",
  components: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  locations: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  vehicles: "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

const SearchResultCard = ({ result }: { result: SearchResult }) => (
  <Link
    to={result.link}
    className="group block rounded-lg border border-border bg-card p-4 card-hover"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-sm font-semibold text-foreground truncate">{result.name}</h3>
          <span className={`inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${categoryColors[result.category]}`}>
            {result.categoryLabel}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-primary">{result.subtitle}</p>
        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-1">{result.description}</p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
    <div className="mt-3 flex flex-wrap gap-1.5">
      {Object.entries(result.meta).map(([key, val]) => (
        <span key={key} className="rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
          {key}: <span className="text-foreground">{val}</span>
        </span>
      ))}
    </div>
  </Link>
);

const SearchPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = (searchParams.get("cat") as SearchCategory) || "all";

  const categoryFilters: { value: SearchCategory; label: string; icon: typeof Rocket }[] = [
    { value: "all", label: t("search.all"), icon: Search },
    { value: "ships", label: t("nav.ships"), icon: Rocket },
    { value: "weapons", label: t("nav.weapons"), icon: Crosshair },
    { value: "components", label: t("nav.components"), icon: Cpu },
    { value: "locations", label: t("nav.locations"), icon: MapPin },
    { value: "vehicles", label: t("nav.vehicles"), icon: Car },
  ];

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<SearchCategory>(initialCategory);

  // Sync URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (category !== "all") params.cat = category;
    setSearchParams(params, { replace: true });
  }, [query, category, setSearchParams]);

  const results = useMemo(() => globalSearch(query, category), [query, category]);

  const categoryCounts = useMemo(() => {
    if (!query) return {};
    const all = globalSearch(query, "all");
    const counts: Record<string, number> = {};
    all.forEach(r => { counts[r.category] = (counts[r.category] || 0) + 1; });
    counts.all = all.length;
    return counts;
  }, [query]);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">{t("search.title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("search.subtitle")}</p>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search.placeholder")}
          autoFocus
          className="h-12 w-full rounded-lg border border-border bg-card pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Category Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categoryFilters.map((f) => {
          const count = categoryCounts[f.value] ?? 0;
          const Icon = f.icon;
          return (
            <button
              key={f.value}
              onClick={() => setCategory(f.value)}
              className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-display text-xs font-medium transition-colors ${
                category === f.value
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/20 hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {f.label}
              {query && <span className="ml-1 rounded-full bg-secondary px-1.5 text-[10px]">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {!query ? (
        <div className="py-20 text-center text-muted-foreground">
          <Search className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
          <p>{t("search.startTyping")}</p>
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
  );
};

export default SearchPage;
