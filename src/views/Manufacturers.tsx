'use client';
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, Building2, Loader2, MapPin, Tag, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchManufacturers, localize, manufacturerIndustries, industryLabels, type Manufacturer } from "@/data/manufacturers";
import { useSEO } from "@/hooks/useSEO";
import PageHeader from "@/components/PageHeader";

const Manufacturers = () => {
  const { t, i18n } = useTranslation();
  useSEO({
    title: "Fabricants",
    description: "Entreprises et fabricants de l'univers Star Citizen : RSI, Aegis, Drake, Anvil et bien d'autres.",
    path: "/manufacturers",
  });

  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [search, setSearch]               = useState("");
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);

  useEffect(() => {
    fetchManufacturers()
      .then(setManufacturers)
      .catch(() => setError(t("manufacturers.loadError")))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() =>
    manufacturers.filter(m => {
      const matchSearch = !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        localize(m.description, i18n.language).toLowerCase().includes(search.toLowerCase());
      const matchIndustry = !activeIndustry || (m.industry ?? []).some(i => localize(i, i18n.language) === activeIndustry);
      return matchSearch && matchIndustry;
    }),
  [manufacturers, search, activeIndustry]);

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: t("manufacturers.title"), icon: Building2 }]}
        title={t("manufacturers.title")}
        label={t("manufacturers.title")}
        labelIcon={Building2}
        subtitle={t("manufacturers.description")}
      />

      <div className="container py-8">

        {/* Barre de recherche + filtres */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("manufacturers.searchPlaceholder")}
              className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveIndustry(null)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                !activeIndustry
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("manufacturers.all")}
            </button>
            {manufacturerIndustries.map(ind => (
              <button
                key={ind}
                onClick={() => setActiveIndustry(activeIndustry === ind ? null : ind)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeIndustry === ind
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <Tag className="h-3 w-3" />
                {industryLabels[ind]?.[i18n.language] ?? ind}
              </button>
            ))}
          </div>
          {(search || activeIndustry) && (
            <button
              onClick={() => { setSearch(""); setActiveIndustry(null); }}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Réinitialiser
            </button>
          )}
        </div>

        {/* Compteur */}
        {!loading && !error && (
          <p className="mb-4 text-sm text-muted-foreground">
            {t("manufacturers.count", { count: filtered.length })}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center gap-2 py-24 text-muted-foreground">
            <Building2 className="h-8 w-8 opacity-30" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(m => {
              const logoSrc = m.logoBase64 ?? null;
              return (
                <Link
                  key={m.id}
                  href={`/manufacturers/${m.slug}`}
                  className="group flex items-center gap-4 overflow-hidden rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-card/80"
                >
                  {/* Logo */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-secondary">
                    {logoSrc
                      ? <img src={logoSrc} alt={`Logo ${m.name}`} className="h-10 w-10 object-contain" />
                      : <Building2 className="h-6 w-6 text-muted-foreground/30" />
                    }
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-sm font-semibold text-foreground transition-colors group-hover:text-primary truncate">
                      {m.name}
                    </h3>
                    {m.headquarters && (
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{m.headquarters}</span>
                      </div>
                    )}
                    {(m.industry ?? []).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {(m.industry ?? []).slice(0, 3).map((ind, idx) => (
                          <span key={idx} className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {localize(ind, i18n.language)}
                          </span>
                        ))}
                        {(m.industry ?? []).length > 3 && (
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground/50">
                            +{(m.industry ?? []).length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}

            {filtered.length === 0 && (
              <div className="col-span-full py-20 text-center text-sm text-muted-foreground">
                Aucun fabricant trouvé.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Manufacturers;
