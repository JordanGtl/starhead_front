'use client';
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, Building2, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchManufacturers, manufacturerIndustries, type Manufacturer } from "@/data/manufacturers";
import { Badge } from "@/components/ui/badge";
import { useSEO } from "@/hooks/useSEO";

const Manufacturers = () => {
  const { t } = useTranslation();
  useSEO({ title: "Fabricants", description: "Entreprises et fabricants de l'univers Star Citizen : RSI, Aegis, Drake, Anvil et bien d'autres.", path: "/manufacturers" });
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchManufacturers()
      .then(setManufacturers)
      .catch(() => setError(t("manufacturers.loadError")))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return manufacturers.filter((m) => {
      const matchSearch =
        !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        (m.description ?? "").toLowerCase().includes(search.toLowerCase());
      const matchIndustry = !activeIndustry || (m.industry ?? []).includes(activeIndustry);
      return matchSearch && matchIndustry;
    });
  }, [manufacturers, search, activeIndustry]);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Image de fond sur toute la page */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
        <img src="/hero-bg.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" style={{ objectPosition: '50% 30%' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex min-h-[18vh] items-center">
        <div className="container pb-2 pt-8">
          <div className="mb-1 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("manufacturers.title")}</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">{t("manufacturers.title")}</h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">{t("manufacturers.description")}</p>
        </div>
      </div>

      <div className="relative z-10 container pb-8 pt-0">

        {/* Search + filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("manufacturers.searchPlaceholder")}
              className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveIndustry(null)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                !activeIndustry
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {t("manufacturers.all")}
            </button>
            {manufacturerIndustries.map((ind) => (
              <button
                key={ind}
                onClick={() => setActiveIndustry(activeIndustry === ind ? null : ind)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeIndustry === ind
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* États */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {t("manufacturers.loading")}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-destructive">
            <Building2 className="h-8 w-8 opacity-50" />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="mb-4 text-sm text-muted-foreground">{t("manufacturers.count", { count: filtered.length })}</p>

            {/* Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((m) => (
                <Link
                  key={m.id}
                  href={`/manufacturers/${m.slug}`}
                  className="group flex overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/50"
                >
                  {/* Logo */}
                  <div className="relative flex w-24 shrink-0 items-center justify-center border-r border-border text-white overflow-hidden">
                    <img
                      src="/background-1.png"
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="relative z-10 flex items-center justify-center">
                      {m.logoBase64 ? (
                        <img
                          src={m.logoBase64}
                          alt={`Logo ${m.name}`}
                          className="max-h-16 w-20 object-contain"
                        />
                      ) : (
                        <span className="text-4xl">{m.logo}</span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
                    <div>
                      <h3 className="font-display text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                        {m.name}
                      </h3>
                      <p className="mb-2 text-xs text-muted-foreground">{m.headquarters}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{m.description}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(m.industry ?? []).map((ind) => (
                        <Badge key={ind} variant="secondary" className="text-[10px]">
                          {ind}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Manufacturers;
