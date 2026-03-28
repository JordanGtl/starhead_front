'use client';
import { useState, useEffect } from "react";
import { Crosshair, Cpu, MapPin, Rocket, Building2, MessageSquare, Newspaper, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";


import CategoryCard from "@/components/CategoryCard";
import LiveSearchBar from "@/components/LiveSearchBar";
import { useSEO } from "@/hooks/useSEO";
import { fetchSpectrumPosts, avatarColor, avatarInitials, formatRelative, type SpectrumPost } from "@/data/spectrum";
import { fetchNews, resolveThumbnail, type NewsItem } from "@/data/news";

const Index = () => {
  const { t, i18n } = useTranslation();
  useSEO({ title: undefined, description: "StarHead est la base de données ultime pour Star Citizen : vaisseaux, composants, armures, lieux et blueprints de craft.", path: "/" });

  const [spectrumPosts, setSpectrumPosts] = useState<SpectrumPost[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetchSpectrumPosts({ pagesize: 3, locale: i18n.language }).then(r => setSpectrumPosts(r.items)).catch(() => {});
    fetchNews({ pagesize: 3, locale: i18n.language }).then(r => setNewsItems(r.items)).catch(() => {});
  }, [i18n.language]);

  const categories = [
    { title: t("index.categories.ships.title"), description: t("index.categories.ships.description"), icon: Rocket, count: 200, href: "/ships" },
    { title: t("index.categories.weapons.title"), description: t("index.categories.weapons.description"), icon: Crosshair, count: 150, href: "/weapons" },
    { title: t("index.categories.components.title"), description: t("index.categories.components.description"), icon: Cpu, count: 300, href: "/components" },
    { title: t("index.categories.locations.title"), description: t("index.categories.locations.description"), icon: MapPin, count: 80, href: "/locations" },
    { title: t("index.categories.manufacturers.title"), description: t("index.categories.manufacturers.description"), icon: Building2, count: 22, href: "/manufacturers" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex h-[520px] items-center justify-center -mt-8">
        <div className="absolute inset-0 overflow-hidden">
          <img src="/hero-bg.jpg" alt="Star Citizen space scene" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <img src="/logo_with_name.svg" alt="StarHead — The Citizen's Database" className="mx-auto w-72 sm:w-96" />
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
            {t("index.heroDescription")}
          </p>

          <div className="mx-auto mt-8 max-w-xl">
            <LiveSearchBar />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container pt-0 pb-4">
        <h2 className="mb-2 font-display text-2xl font-bold text-foreground">{t("index.dbTitle")}</h2>
        <p className="mb-8 text-muted-foreground">{t("index.dbSubtitle")}</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.href} {...cat} />
          ))}
        </div>
      </section>

      {/* Spectrum + News */}
      {(spectrumPosts.length > 0 || newsItems.length > 0) && (
        <section className="container py-8">
          <div className="grid gap-8 lg:grid-cols-2">

            {/* Derniers messages Spectrum */}
            {spectrumPosts.length > 0 && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-display text-xl font-bold">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Derniers messages Spectrum
                  </h2>
                  <Link href="/spectrum" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                    Voir tout <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  {spectrumPosts.map(post => (
                    <Link
                      key={post.id}
                      href={`/spectrum/${post.id}`}
                      className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/60 p-4 hover:border-primary/30 hover:bg-card/80 transition-colors"
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarColor(post.authorHandle)}`}>
                        {avatarInitials(post.authorName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{post.threadTitle}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{post.authorName} · {formatRelative(post.postedAt)}</p>
                        {post.excerpt && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/80">{post.excerpt}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Dernières actualités */}
            {newsItems.length > 0 && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-display text-xl font-bold">
                    <Newspaper className="h-5 w-5 text-primary" />
                    Dernières actualités
                  </h2>
                  <Link href="/news" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                    Voir tout <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  {newsItems.map(item => (
                    <Link
                      key={item.id ?? item.slug}
                      href={`/news/${item.id}`}
                      className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/60 p-4 hover:border-primary/30 hover:bg-card/80 transition-colors"
                    >
                      {resolveThumbnail(item.thumbnail) && (
                        <img
                          src={resolveThumbnail(item.thumbnail)!}
                          alt={item.title}
                          className="h-16 w-24 shrink-0 rounded object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium text-foreground">{item.title}</p>
                        {item.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/80">{item.description}</p>}
                      </div>
                    </Link>
                  ))}
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
