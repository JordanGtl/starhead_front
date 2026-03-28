'use client';
import { useState, useEffect, useCallback, useRef } from "react";
import { Search, Pin, MessageSquare, ThumbsUp, ExternalLink, Radio, X, RefreshCw, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import {
  fetchSpectrumPosts, fetchSpectrumCategories, fetchSpectrumAuthors,
  getCategoryColor, avatarColor, avatarInitials, primaryRole, roleColor, formatRelative,
  type SpectrumPost, type SpectrumCategory, type SpectrumAuthor,
} from "@/data/spectrum";
import { useSEO } from "@/hooks/useSEO";

// ─── Post card ────────────────────────────────────────────────────────────────

const PostCard = ({ post }: { post: SpectrumPost }) => {
  const router    = useRouter();
  const catColor  = getCategoryColor(post.category);
  const initials  = avatarInitials(post.authorName);
  const bgColor   = avatarColor(post.authorHandle);
  const role      = primaryRole(post.authorRoles);
  const roleCol   = roleColor(role);

  return (
    <article
      onClick={() => router.push(`/spectrum/${post.id}`)}
      className="group flex flex-col gap-3 rounded-xl border border-border/50 bg-card/60 p-5 transition-all duration-200 hover:border-primary/30 hover:bg-card/80 hover:shadow-[0_0_24px_hsl(var(--primary)/0.06)] cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${bgColor}`}>
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-semibold text-foreground">{post.authorName}</span>
              <span className="text-xs text-muted-foreground/60">@{post.authorHandle}</span>
              {role && <span className={`text-[10px] font-medium ${roleCol}`}>· {role}</span>}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span>{post.channel ?? post.forum}</span>
              <span className="text-border">·</span>
              <span>{formatRelative(post.postedAt)}</span>
              {post.isPinned && (
                <>
                  <span className="text-border">·</span>
                  <span className="flex items-center gap-0.5 text-amber-400">
                    <Pin className="h-2.5 w-2.5" /> Épinglé
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        {post.category && (
          <span className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-semibold ${catColor}`}>
            {post.category}
          </span>
        )}
      </div>

      {/* Titre */}
      <h3 className="text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
        {post.threadTitle}
      </h3>

      {/* Extrait */}
      {post.excerpt && (
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {post.excerpt}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" />
            {post.voteCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {post.repliesCount.toLocaleString()}
          </span>
        </div>
        <a
          href={post.spectrumUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] text-muted-foreground/60 transition-colors hover:text-primary"
        >
          Voir sur Spectrum <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </article>
  );
};

// ─── Skeleton card ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="flex flex-col gap-3 rounded-xl border border-border/30 bg-card/40 p-5 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-full bg-muted/40 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-32 rounded bg-muted/40" />
        <div className="h-2.5 w-48 rounded bg-muted/30" />
      </div>
      <div className="h-5 w-20 rounded bg-muted/30" />
    </div>
    <div className="h-4 w-3/4 rounded bg-muted/40" />
    <div className="space-y-1.5">
      <div className="h-3 w-full rounded bg-muted/30" />
      <div className="h-3 w-5/6 rounded bg-muted/30" />
      <div className="h-3 w-4/6 rounded bg-muted/30" />
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

const SpectrumTracker = () => {
  const { t, i18n } = useTranslation();
  useSEO({ title: "Spectrum Tracker", description: "Suivez les dernières discussions de la communauté Star Citizen sur Spectrum.", path: "/spectrum" });
  const locale = i18n.language?.split('-')[0] ?? 'en';

  // Données
  const [posts, setPosts]             = useState<SpectrumPost[]>([]);
  const [total, setTotal]             = useState(0);
  const [totalPages, setTotalPages]   = useState(0);
  const [categories, setCategories]   = useState<SpectrumCategory[]>([]);
  const [authors, setAuthors]         = useState<SpectrumAuthor[]>([]);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]             = useState<string | null>(null);

  // Filtres
  const [query, setQuery]           = useState("");
  const [activeCategory, setActiveCat] = useState<string>("");
  const [activeRole, setActiveRole] = useState<string>("");
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [page, setPage]             = useState(1);

  // Debounce search
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async (p: number, append = false) => {
    append ? setLoadingMore(true) : setLoading(true);
    setError(null);
    try {
      const result = await fetchSpectrumPosts({
        page:     p,
        pagesize: PAGE_SIZE,
        search:   query || undefined,
        category: activeCategory || undefined,
        role:     activeRole || undefined,
        pinned:   pinnedOnly || undefined,
        locale,
      });
      setPosts(prev => append ? [...prev, ...result.items] : result.items);
      setTotal(result.total);
      setTotalPages(result.pages);
    } catch {
      setError("Impossible de charger les posts Spectrum.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [query, activeCategory, activeRole, pinnedOnly, locale]);

  // Charge les méta (catégories + auteurs) une seule fois
  useEffect(() => {
    fetchSpectrumCategories().then(setCategories).catch(() => {});
    fetchSpectrumAuthors().then(setAuthors).catch(() => {});
  }, []);

  // Reload complet à chaque changement de filtre ou de langue
  useEffect(() => {
    setPage(1);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => load(1, false), query ? 350 : 0);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [query, activeCategory, activeRole, pinnedOnly, locale]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    load(next, true);
  };

  const refresh = () => { setPage(1); load(1, false); };

  const hasFilters = !!(query || activeCategory || activeRole || pinnedOnly);

  const clearFilters = () => {
    setQuery("");
    setActiveCat("");
    setActiveRole("");
    setPinnedOnly(false);
  };

  // Rôles distincts issus des auteurs
  const distinctRoles = Array.from(
    new Set(authors.flatMap(a => a.roles))
  ).sort();

  const pinned    = posts.filter(p => p.isPinned);
  const unpinned  = posts.filter(p => !p.isPinned);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[22vh] overflow-hidden">
        <img src="/hero-bg.jpg" alt="" aria-hidden className="h-full w-full object-cover opacity-25" style={{ objectPosition: "50% 60%" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex min-h-[20vh] items-center">
        <div className="container pb-2 pt-8">
          <div className="mb-1 flex items-center gap-2">
            <Radio className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              {t("spectrum.overline")}
            </span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl font-bold text-foreground">{t("spectrum.title")}</h1>
              <p className="mt-2 max-w-lg text-sm text-muted-foreground">{t("spectrum.subtitle")}</p>
            </div>
            <button
              onClick={refresh}
              disabled={loading}
              className="mb-1 flex items-center gap-1.5 rounded-lg border border-border/50 bg-card/60 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-40"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              {t("spectrum.refresh")}
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 container pb-16 pt-2">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">

          {/* ── Sidebar ────────────────────────────────────────────────────── */}
          <aside className="flex flex-col gap-4">

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t("common.search")}
                className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {/* Épinglés */}
            <button
              onClick={() => setPinnedOnly(v => !v)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                pinnedOnly
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                  : "border-border/50 bg-card/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Pin className="h-3.5 w-3.5" />
              {t("spectrum.pinnedOnly")}
            </button>

            {/* Catégories */}
            {categories.length > 0 && (
              <div className="rounded-xl border border-border/50 bg-card/60 p-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {t("spectrum.categories")}
                </p>
                <div className="flex flex-col gap-1">
                  {categories.map(({ category, cnt }) => {
                    const active = activeCategory === category;
                    const col    = getCategoryColor(category);
                    return (
                      <button
                        key={category}
                        onClick={() => setActiveCat(active ? "" : category)}
                        className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-all ${
                          active ? `${col} border` : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                        }`}
                      >
                        <span className="font-medium">{category}</span>
                        <span className="text-[10px] opacity-60">{cnt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rôles */}
            {distinctRoles.length > 0 && (
              <div className="rounded-xl border border-border/50 bg-card/60 p-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {t("spectrum.roles")}
                </p>
                <div className="flex flex-col gap-1">
                  {distinctRoles.map(role => {
                    const active = activeRole === role;
                    const col    = roleColor(role);
                    return (
                      <button
                        key={role}
                        onClick={() => setActiveRole(active ? "" : role)}
                        className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-all ${
                          active
                            ? `border border-current/20 bg-current/5 ${col}`
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                        }`}
                      >
                        <span className={`font-medium ${active ? col : ""}`}>{role}</span>
                        <span className="text-[10px] opacity-60">
                          {authors.filter(a => a.roles.includes(role)).reduce((s, a) => s + a.count, 0)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>

          {/* ── Feed ─────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3">

            {/* Barre de statut */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {loading
                  ? <span className="flex items-center gap-1.5"><Loader2 className="h-3 w-3 animate-spin" /> Chargement…</span>
                  : <><span className="font-semibold text-foreground">{total}</span> {t("spectrum.postsCount")}</>
                }
              </p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-3 w-3" /> {t("spectrum.clearFilters")}
                </button>
              )}
            </div>

            {/* Erreur */}
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Skeletons */}
            {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}

            {!loading && (
              <>
                {/* Épinglés */}
                {pinned.length > 0 && (
                  <>
                    <div className="flex items-center gap-2">
                      <Pin className="h-3 w-3 text-amber-400" />
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400/70">
                        {t("spectrum.pinned")}
                      </span>
                    </div>
                    {pinned.map(post => <PostCard key={post.id} post={post} />)}
                    {unpinned.length > 0 && <div className="my-1 border-t border-border/30" />}
                  </>
                )}

                {/* Feed principal */}
                {unpinned.map(post => <PostCard key={post.id} post={post} />)}

                {/* Empty state */}
                {posts.length === 0 && !error && (
                  <div className="flex flex-col items-center py-20 text-center">
                    <Radio className="mb-4 h-12 w-12 text-muted-foreground/20" />
                    <p className="text-sm text-muted-foreground">{t("common.noResults")}</p>
                  </div>
                )}

                {/* Load more */}
                {page < totalPages && (
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-border/50 bg-card/40 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground disabled:opacity-50"
                  >
                    {loadingMore
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Chargement…</>
                      : `Charger plus (${total - posts.length} restants)`
                    }
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpectrumTracker;
