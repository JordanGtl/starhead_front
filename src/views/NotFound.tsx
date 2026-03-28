'use client';
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Home, ArrowLeft, Compass } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const NotFound = () => {
  const { t } = useTranslation();
  useSEO({ title: "Page introuvable", path: undefined, noindex: true });
  const pathname = usePathname();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center overflow-hidden -mt-16 pt-16">

      {/* Fond hero atténué */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/hero-bg.jpg"
          alt=""
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/70 to-background" />
      </div>

      {/* Glow central */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-primary/5 blur-3xl" />

      {/* Contenu */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 -mt-20">

        {/* Icône */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
          <Compass className="h-9 w-9 text-primary/70" />
        </div>

        {/* Code 404 */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary mb-3">
          Erreur 404
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
          Page introuvable
        </h1>

        <p className="max-w-sm text-base text-muted-foreground mb-2">
          La coordonnée <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground/80">{pathname}</code> ne correspond à aucune destination connue.
        </p>

        <p className="text-sm text-muted-foreground/60 mb-10">
          La page a peut-être été déplacée, supprimée ou n'existe pas.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30"
          >
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-6 py-2.5 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/40 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Page précédente
          </button>
        </div>
      </div>

      {/* Décoration bas de page */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <p className="text-[11px] text-muted-foreground/30 font-mono tracking-wider">
          STAR-HEAD — NAVIGATION ERROR
        </p>
      </div>
    </div>
  );
};

export default NotFound;
