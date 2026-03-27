import { useState, useRef, useEffect } from "react";
import { Search, Rocket, Crosshair, Cpu, MapPin, Car, Building2, BookOpen, Users, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiSearch, type SearchResult, type SearchCategory } from "@/data/search";

const CATEGORY_ICONS: Record<SearchCategory, React.ElementType> = {
  all: Search,
  ships: Rocket,
  weapons: Crosshair,
  components: Cpu,
  locations: MapPin,
  vehicles: Car,
  manufacturers: Building2,
  lore: BookOpen,
  factions: Users,
};

const CATEGORY_COLORS: Record<SearchCategory, string> = {
  all: "text-muted-foreground",
  ships: "text-blue-400",
  weapons: "text-red-400",
  components: "text-yellow-400",
  locations: "text-green-400",
  vehicles: "text-orange-400",
  manufacturers: "text-purple-400",
  lore: "text-cyan-400",
  factions: "text-rose-400",
};

const MAX_SUGGESTIONS = 8;

interface LiveSearchBarProps {
  placeholder?: string;
}

const LiveSearchBar = ({ placeholder }: LiveSearchBarProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.split('-')[0] ?? 'en';
  const defaultPlaceholder = placeholder ?? t("search.livePlaceholder");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Recherche debounce via API
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await apiSearch(query.trim(), "all", locale);
        setSuggestions(results.slice(0, MAX_SUGGESTIONS));
        setOpen(results.length > 0);
      } catch {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, locale]);

  // Fermer si clic en dehors
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reset index quand les suggestions changent
  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      navigate(suggestions[activeIndex].link);
      setOpen(false);
      setQuery("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    navigate(result.link);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder={defaultPlaceholder}
            className="h-12 w-full rounded-lg border border-border bg-card/80 pl-12 pr-12 font-body text-sm text-foreground placeholder:text-muted-foreground backdrop-blur-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            autoComplete="off"
          />
          {loading && (
            <Loader2 className="absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
          {query && (
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
              tabIndex={-1}
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown suggestions */}
      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-border bg-card shadow-xl">
          <ul>
            {suggestions.map((result, i) => {
              const Icon = CATEGORY_ICONS[result.category] ?? Search;
              const colorClass = CATEGORY_COLORS[result.category] ?? "text-muted-foreground";
              return (
                <li key={result.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      activeIndex === i ? "bg-primary/10" : "hover:bg-muted/50"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${colorClass}`} />
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {result.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {result.subtitle}
                      </span>
                    </div>
                    <span className={`shrink-0 text-[10px] font-medium uppercase tracking-wide ${colorClass}`}>
                      {result.categoryLabel}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Lien "Voir tous les résultats" */}
          <button
            type="button"
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            className="flex w-full items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            <span>{t("search.seeAllResults", { query })}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default LiveSearchBar;
