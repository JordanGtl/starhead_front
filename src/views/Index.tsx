'use client';
import { useState, useEffect } from "react";
import {
  Crosshair, Cpu, MapPin, Rocket, Building2,
  MessageSquare, Newspaper, ExternalLink, ScrollText,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

import CategoryCard from "@/components/CategoryCard";
import LiveSearchBar from "@/components/LiveSearchBar";
import { useSEO } from "@/hooks/useSEO";
import { useVersion } from "@/contexts/VersionContext";
import { fetchSpectrumPosts, avatarColor, avatarInitials, formatRelative, type SpectrumPost } from "@/data/spectrum";
import { fetchNews, resolveThumbnail, type NewsItem } from "@/data/news";
import { apiFetch } from "@/lib/api";

interface DbStats {
  ships:         number;
  weapons:       number;
  components:    number;
  locations:     number;
  manufacturers: number;
  blueprints:    number;
}

const Index = () => {
  const { t, i18n }         = useTranslation();
  const { selectedVersion } = useVersion();

  useSEO({
    title: undefined,
    description: "StarHead est la base de données ultime pour Star Citizen : vaisseaux, composants, armures, lieux et blueprints de craft.",
    path: "/",
  });

  const [spectrumPosts, setSpectrumPosts] = useState<SpectrumPost[]>([]);
  const [newsItems, setNewsItems]         = useState<NewsItem[]>([]);
  const [stats, setStats]                 = useState<DbStats | null>(null);

  useEffect(() => {
    fetchSpectrumPosts({ pagesize: 4, locale: i18n.language }).then(r => setSpectrumPosts(r.items)).catch(() => {});
    fetchNews({ pagesize: 3, locale: i18n.language }).then(r => setNewsItems(r.items)).catch(() => {});
    apiFetch<DbStats>('/api/stats').then(setStats).catch(() => {});
  }, [i18n.language]);

  const categories = [
    { title: t("index.categories.ships.title"),         description: t("index.categories.ships.description"),         icon: Rocket,     count: stats?.ships         ?? null, href: "/ships"         },
    { title: t("index.categories.weapons.title"),       description: t("index.categories.weapons.description"),       icon: Crosshair,  count: stats?.weapons       ?? null, href: "/weapons"       },
    { title: t("index.categories.components.title"),    description: t("index.categories.components.description"),    icon: Cpu,        count: stats?.components    ?? null, href: "/components"    },
    { title: t("index.categories.locations.title"),     description: t("index.categories.locations.description"),     icon: MapPin,     count: stats?.locations     ?? null, href: "/locations"     },
    { title: t("index.categories.manufacturers.title"), description: t("index.categories.manufacturers.description"), icon: Building2,  count: stats?.manufacturers ?? null, href: "/manufacturers" },
    { title: t("index.categories.blueprints.title"),    description: t("index.categories.blueprints.description"),    icon: ScrollText, count: stats?.blueprints    ?? null, href: "/blueprints"    },
  ];

  return (
    <div className="min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative flex h-[520px] items-center justify-center -mt-8" aria-label="Hero">
        <div className="absolute inset-0 overflow-hidden">
          <img src="/hero-bg.jpg" alt="" role="presentation" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <img
            src="/logo_with_name.svg"
            alt={t("index.logoAlt")}
            className="mx-auto w-72 sm:w-96"
          />

          {/* h1 visible : la description hero sert de titre principal pour Google + lecteurs d'écran */}
          <h1 className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
            {t("index.heroDescription")}
          </h1>

          <div className="mx-auto mt-8 max-w-xl">
            <LiveSearchBar />
          </div>

          {/* Badge version — affiché dès que selectedVersion est résolu */}
          {selectedVersion && (
            <p className="mt-3 text-xs text-muted-foreground/50">
              {t("index.dataVersion", { version: selectedVersion.label })}
            </p>
          )}
        </div>
      </section>

      {/* ── Catégories ────────────────────────────────────────────────────── */}
      <section className="container pt-0 pb-4">
        <h2 className="mb-2 font-display text-2xl font-bold text-foreground">{t("index.dbTitle")}</h2>
        <p className="mb-8 text-muted-foreground">{t("index.dbSubtitle")}</p>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.href} {...cat} />
          ))}
        </div>
      </section>

      {/* ── Actus & Communauté ────────────────────────────────────────────── */}
      {(spectrumPosts.length > 0 || newsItems.length > 0) && (
        <section className="container py-8">
          <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
            {t("index.communityTitle")}
          </h2>

          <div className="grid gap-8 lg:grid-cols-2">

            {/* ── Spectrum ─────────────────────────────────────────────── */}
            {spectrumPosts.length > 0 && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    {t("index.spectrumTitle")}
                  </h3>
                  <Link href="/spectrum" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                    {t("common.seeAll")} <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <div className="flex flex-col gap-2">
                  {spectrumPosts.map(post => (
                    <Link
                      key={post.id}
                      href={`/spectrum/${post.id}`}
                      className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/50 p-3.5 hover:border-primary/30 hover:bg-card/80 transition-colors"
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarColor(post.authorHandle)}`}>
                        {avatarInitials(post.authorName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{post.threadTitle}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{post.authorName} · {formatRelative(post.postedAt)}</p>
                        {post.excerpt && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/70">{post.excerpt}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ── News ─────────────────────────────────────────────────── */}
            {newsItems.length > 0 && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                    <Newspaper className="h-5 w-5 text-amber-400" />
                    {t("index.newsTitle")}
                  </h3>
                  <Link href="/news" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                    {t("common.seeAll")} <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <div className="flex flex-col gap-2">
                  {newsItems.map((item, index) => {
                    const thumbnail = resolveThumbnail(item.thumbnail);
                    return (
                    <Link
                      key={item.id ?? item.slug}
                      href={`/news/${item.id}`}
                      className={`flex items-start gap-3 rounded-lg border bg-card p-3.5 hover:border-amber-400/30 hover:bg-card/80 transition-colors ${
                        index === 0
                          ? "border-amber-400/20 bg-gradient-to-br from-amber-500/5 to-transparent"
                          : "border-border/60"
                      }`}
                    >
                      {thumbnail && (
                        <img
                          src={thumbnail}
                          alt={item.title}
                          className={`shrink-0 rounded object-cover ${index === 0 ? "h-20 w-28" : "h-14 w-20"}`}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className={`line-clamp-2 font-medium text-foreground ${index === 0 ? "text-sm" : "text-xs"}`}>
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/70">{item.description}</p>
                        )}
                      </div>
                    </Link>
                  );
                  })}
                </div>
              </div>
            )}

          </div>
        </section>
      )}

    </div>
  );
};

export default Index;
