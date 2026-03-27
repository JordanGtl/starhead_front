import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Newspaper, Play, FileText, ExternalLink, ChevronLeft,
  Loader2, RefreshCw, AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import heroBg from "@/assets/hero-bg.jpg";
import { fetchNews, resolveThumbnail, type NewsItem } from "@/data/news";

// ---------------------------------------------------------------------------
// Catégories RSI comm-link
// ---------------------------------------------------------------------------
const CATEGORIES = [
  { value: "all",          labelKey: "common.all" },
  { value: "transmission", labelKey: "news.catTransmission" },
  { value: "engineering",  labelKey: "news.catEngineering" },
  { value: "spectrum-dispatch", labelKey: "news.catSpectrum" },
  { value: "lore-post",    labelKey: "news.catLore" },
];

const TYPES = [
  { value: "all",   labelKey: "common.all" },
  { value: "post",  labelKey: "news.typePost" },
  { value: "video", labelKey: "news.typeVideo" },
];

// ---------------------------------------------------------------------------
// NewsCard
// ---------------------------------------------------------------------------
function formatPublishedAt(publishedAt: string | null | undefined, locale: string): string {
  if (!publishedAt) return '';
  try {
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(publishedAt));
  } catch {
    return publishedAt;
  }
}

const NewsCard = ({ item }: { item: NewsItem }) => {
  const { t, i18n } = useTranslation();
  const isVideo  = item.type === "video";
  const thumbSrc = resolveThumbnail(item.thumbnail);
  const dateLabel = item.publishedAt
    ? formatPublishedAt(item.publishedAt, i18n.language)
    : (item.dateRaw ?? '');

  return (
    <Link
      to={`/news/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_hsl(var(--primary)/0.1)]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-secondary">
        {thumbSrc ? (
          <img
            src={thumbSrc}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Newspaper className="h-12 w-12 text-muted-foreground/20" />
          </div>
        )}

        {/* Badge type */}
        <div className="absolute left-2 top-2">
          {isVideo ? (
            <span className="flex items-center gap-1 rounded-md bg-rose-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              <Play className="h-2.5 w-2.5 fill-white" />
              {t("news.typeVideo")}
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              <FileText className="h-2.5 w-2.5" />
              {item.category}
            </span>
          )}
        </div>

        {/* Overlay play button for videos */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/80 backdrop-blur-sm">
              <Play className="h-6 w-6 fill-white text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 font-display text-base font-bold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>

        {item.description && (
          <p className="mb-3 text-xs leading-relaxed text-muted-foreground/80 line-clamp-3">
            {item.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            {dateLabel}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            {t("news.readMore")} <ExternalLink className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
};

// ---------------------------------------------------------------------------
// News page
// ---------------------------------------------------------------------------
const PAGE_SIZE = 18;

const News = () => {
  const { t, i18n } = useTranslation();

  const [items, setItems]         = useState<NewsItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [page, setPage]           = useState(1);
  const [hasMore, setHasMore]     = useState(true);
  const [category, setCategory]   = useState("all");
  const [type, setType]           = useState("all");

  const load = useCallback(async (p: number, cat: string, tp: string, reset = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchNews({ page: p, pagesize: PAGE_SIZE, category: cat, type: tp, locale: i18n.language });
      setItems((prev) => reset ? res.items : [...prev, ...res.items]);
      setHasMore(res.hasMore);
    } catch (e: any) {
      setError(e?.message ?? t("news.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Chargement initial et sur changement de filtre ou de langue
  useEffect(() => {
    setPage(1);
    setItems([]);
    load(1, category, type, true);
  }, [category, type, i18n.language]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    load(next, category, type, false);
  };

  const refresh = () => {
    setPage(1);
    setItems([]);
    load(1, category, type, true);
  };

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
            <Newspaper className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("news.commLink")}</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">{t("news.title")}</h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">{t("news.description")}</p>
        </div>
      </div>

      <div className="relative z-10 container pb-8 pt-0">
      {/* Filtres */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* Catégories */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                category === cat.value
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border/50 bg-card/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        {/* Séparateur */}
        <div className="h-6 w-px bg-border/50" />

        {/* Types */}
        <div className="flex gap-2">
          {TYPES.map((tp) => (
            <button
              key={tp.value}
              onClick={() => setType(tp.value)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                type === tp.value
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border/50 bg-card/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {tp.value === "video" && <Play className="h-3 w-3" />}
              {tp.value === "post"  && <FileText className="h-3 w-3" />}
              {t(tp.labelKey)}
            </button>
          ))}
        </div>

        <div className="ml-auto">
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            {t("news.refresh")}
          </button>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Grille */}
      {items.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <NewsCard key={`${item.id}-${idx}`} item={item} />
          ))}
        </div>
      )}

      {/* Loader initial */}
      {loading && items.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Aucun résultat */}
      {!loading && !error && items.length === 0 && (
        <div className="flex flex-col items-center py-20 text-center">
          <Newspaper className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-lg font-medium text-muted-foreground">{t("news.noNews")}</p>
        </div>
      )}

      {/* Bouton charger plus */}
      {!loading && hasMore && items.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMore}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4 rotate-90" />
            {t("news.loadMore")}
          </button>
        </div>
      )}

      {/* Loader "load more" */}
      {loading && items.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      </div>
    </div>
  );
};

export default News;
