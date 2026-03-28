'use client';
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft, ExternalLink, Radio, Loader2, AlertCircle, Calendar,
} from "lucide-react";
import {
  fetchSpectrumPost,
  getCategoryColor, avatarColor, avatarInitials, primaryRole, roleColor,
  type SpectrumPost,
} from "@/data/spectrum";
import { useSEO } from "@/hooks/useSEO";

// ─── Content renderer ─────────────────────────────────────────────────────────

const PostContent = ({ content }: { content: string | null }) => {
  if (!content) {
    return (
      <p className="text-sm italic text-muted-foreground">
        Contenu non disponible — consulte directement sur Spectrum.
      </p>
    );
  }

  // Si le contenu ressemble à du HTML
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    return (
      <div
        className="spectrum-content prose prose-invert prose-sm max-w-none text-sm leading-relaxed text-foreground/90 [&_a]:text-primary [&_a]:underline [&_a:hover]:text-primary/80 [&_img]:rounded-lg [&_img]:border [&_img]:border-border/40 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-secondary/60 [&_pre]:p-4 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-[10px]"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
      {content}
    </p>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const DetailSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-6 w-48 rounded bg-muted/40" />
    <div className="space-y-3">
      <div className="h-8 w-3/4 rounded bg-muted/40" />
      <div className="h-4 w-1/2 rounded bg-muted/30" />
    </div>
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-3 rounded bg-muted/25" style={{ width: `${70 + Math.random() * 30}%` }} />
      ))}
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const SpectrumPostDetail = () => {
  const { id }         = useParams<{ id: string }>();
  const router         = useRouter();
  const { i18n }       = useTranslation();
  const locale         = i18n.language?.split('-')[0] ?? 'en';

  const [post, setPost]       = useState<SpectrumPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useSEO({
    title: post?.title ?? undefined,
    description: post?.contentPreview ?? post?.content?.slice(0, 160) ?? undefined,
    path: id ? `/spectrum/${id}` : undefined,
    ogType: "article",
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchSpectrumPost(Number(id), locale)
      .then(setPost)
      .catch(() => setError("Impossible de charger ce post."))
      .finally(() => setLoading(false));
  }, [id, locale]);

  const catColor  = getCategoryColor(post?.category ?? null);
  const initials  = post ? avatarInitials(post.authorName) : "?";
  const bgColor   = post ? avatarColor(post.authorHandle) : "bg-muted";
  const role      = post ? primaryRole(post.authorRoles) : null;
  const roleCol   = roleColor(role);

  const formatDate = (iso: string | null) => {
    if (!iso) return "—";
    return new Intl.DateTimeFormat("fr", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(iso));
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[18vh] overflow-hidden">
        <img src="/hero-bg.jpg" alt="" aria-hidden className="h-full w-full object-cover opacity-20" style={{ objectPosition: "50% 60%" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      </div>

      <div className="relative z-10 container max-w-4xl py-8">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Radio className="h-3.5 w-3.5 text-primary" />
          <Link href="/spectrum" className="hover:text-foreground transition-colors">Spectrum Tracker</Link>
          <span className="text-border">/</span>
          <span className="text-foreground/60 truncate max-w-[300px]">
            {loading ? "…" : (post?.threadTitle ?? "Post introuvable")}
          </span>
        </div>

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour
        </button>

        {/* Loading */}
        {loading && <DetailSkeleton />}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center py-24 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-red-400/40" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              onClick={() => router.push("/spectrum")}
              className="mt-4 text-xs text-primary hover:underline"
            >
              Retour au tracker
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && post && (
          <article className="space-y-6">

            {/* Header card */}
            <div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm">
              {/* Meta top */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {post.category && (
                  <span className={`rounded border px-2.5 py-0.5 text-[11px] font-semibold ${catColor}`}>
                    {post.category}
                  </span>
                )}
                {/* Badge de langue */}
                <span className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  post.locale === 'en'
                    ? 'border-border/40 bg-secondary/40 text-muted-foreground'
                    : 'border-primary/30 bg-primary/10 text-primary'
                }`}>
                  {post.locale.toUpperCase()}
                </span>
                <span className="ml-auto text-[11px] text-muted-foreground">
                  {post.channel ?? post.forum}
                </span>
              </div>

              {/* Title */}
              <h1 className="mb-5 font-display text-2xl font-bold leading-snug text-foreground">
                {post.threadTitle}
              </h1>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${bgColor}`}>
                  {initials}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground">{post.authorName}</span>
                    <span className="text-xs text-muted-foreground/60">@{post.authorHandle}</span>
                    {role && <span className={`text-xs font-medium ${roleCol}`}>· {role}</span>}
                  </div>
                  {post.authorRoles.length > 1 && (
                    <div className="mt-0.5 flex flex-wrap gap-1">
                      {post.authorRoles.slice(1).map(r => (
                        <span key={r} className="text-[10px] text-muted-foreground/60 border border-border/40 rounded px-1.5 py-0.5">
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-5 flex flex-wrap items-center gap-5 border-t border-border/30 pt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(post.postedAt)}
                </span>
                <a
                  href={post.spectrumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-1 rounded-lg border border-border/50 bg-secondary/40 px-3 py-1.5 transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  Voir sur Spectrum <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Body */}
            <div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm">
              {post.content === null && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400" />
                  <span className="text-xs text-amber-400/80">Récupération du contenu en cours…</span>
                </div>
              )}
              <PostContent content={post.content} />
            </div>

          </article>
        )}
      </div>
    </div>
  );
};

export default SpectrumPostDetail;
