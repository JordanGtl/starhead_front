import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Newspaper, Play, FileText, ExternalLink, ArrowLeft,
  Loader2, AlertCircle, Calendar,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import heroBg from "@/assets/hero-bg.jpg";
import { fetchNewsItem, resolveThumbnail, type NewsItem } from "@/data/news";
import i18n from "@/i18n";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const CategoryBadge = ({ item }: { item: NewsItem }) => {
  const { t } = useTranslation();
  const isVideo = item.type === "video";
  return isVideo ? (
    <span className="flex items-center gap-1.5 rounded-md bg-rose-500/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
      <Play className="h-3 w-3 fill-white" />
      {t("news.typeVideo")}
    </span>
  ) : (
    <span className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      <FileText className="h-3 w-3" />
      {item.category}
    </span>
  );
};

// ---------------------------------------------------------------------------
// NewsDetail page
// ---------------------------------------------------------------------------
const NewsDetail = () => {
  const { rsiId } = useParams<{ rsiId: string }>();
  const { t } = useTranslation();

  const [item, setItem]       = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!rsiId) return;
    setLoading(true);
    setError(null);
    fetchNewsItem(rsiId, i18n.language)
      .then(setItem)
      .catch((e: any) => setError(e?.message ?? t("news.loadError")))
      .finally(() => setLoading(false));
  }, [rsiId, t, i18n.language]);

  // --- Loading ---
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // --- Error ---
  if (error || !item) {
    return (
      <div className="container py-12">
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-destructive">
          <AlertCircle className="h-6 w-6 shrink-0" />
          <span>{error ?? t("news.loadError")}</span>
        </div>
        <Link
          to="/news"
          className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("news.backToNews")}
        </Link>
      </div>
    );
  }

  const thumbSrc = resolveThumbnail(item.thumbnail);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Image de fond */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[14vh] overflow-hidden">
        <img src={heroBg} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" style={{ objectPosition: "50% 30%" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      </div>

      <div className="relative z-10 container pb-8 pt-6">
        <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <Link
          to="/news"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("news.backToNews")}
        </Link>

      <article>
        {/* Hero thumbnail */}
        {thumbSrc && (
          <div className="mb-8 overflow-hidden rounded-xl border border-border bg-secondary">
            <img
              src={thumbSrc}
              alt={item.title}
              className="h-full max-h-[480px] w-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <CategoryBadge item={item} />
            {item.dateRaw && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {item.dateRaw}
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {item.title}
          </h1>

          {item.description && (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          )}

          {/* Lien RSI */}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            {t("news.viewOnRsi")}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </header>

        {/* Séparateur */}
        <div className="mb-8 h-px bg-border" />

        {/* Contenu de l'article */}
        {item.content ? (
          <div
            className="news-content prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        ) : (
          /* Pas encore scrapé → redirection vers RSI */
          <div className="flex flex-col items-center rounded-xl border border-border bg-secondary/50 py-16 text-center">
            <Newspaper className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="mb-2 text-base font-medium text-muted-foreground">
              {t("news.contentNotAvailable")}
            </p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              {t("news.readOnRsi")}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </article>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
