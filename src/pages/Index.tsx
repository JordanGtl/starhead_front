import { Crosshair, Cpu, MapPin, Car, Rocket, Building2, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import heroBg from "@/assets/hero-bg.jpg";
import logoWithName from "@/assets/logo_with_name.svg";
import CategoryCard from "@/components/CategoryCard";
import LiveSearchBar from "@/components/LiveSearchBar";

const Index = () => {
  const { t } = useTranslation();

  const categories = [
    { title: t("index.categories.ships.title"), description: t("index.categories.ships.description"), icon: Rocket, count: 200, href: "/ships" },
    { title: t("index.categories.weapons.title"), description: t("index.categories.weapons.description"), icon: Crosshair, count: 150, href: "/weapons" },
    { title: t("index.categories.components.title"), description: t("index.categories.components.description"), icon: Cpu, count: 300, href: "/components" },
    { title: t("index.categories.locations.title"), description: t("index.categories.locations.description"), icon: MapPin, count: 80, href: "/locations" },
    { title: t("index.categories.vehicles.title"), description: t("index.categories.vehicles.description"), icon: Car, count: 30, href: "/vehicles" },
    { title: t("index.categories.manufacturers.title"), description: t("index.categories.manufacturers.description"), icon: Building2, count: 22, href: "/manufacturers" },
    { title: t("index.categories.lore.title"), description: t("index.categories.lore.description"), icon: BookOpen, count: 16, href: "/lore" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-start justify-center -mt-8">
        <div className="absolute inset-0 overflow-hidden">
          <img src={heroBg} alt="Star Citizen space scene" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <img src={logoWithName} alt="StarHead — The Citizen's Database" className="mx-auto w-72 sm:w-96" />
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

      {/* Stats */}
      <section className="border-t border-border bg-card/50">
        <div className="container grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
          {[
            { label: t("index.stats.ships"), value: "200+" },
            { label: t("index.stats.weapons"), value: "150+" },
            { label: t("index.stats.locations"), value: "80+" },
            { label: t("index.stats.components"), value: "300+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl font-bold text-primary">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>{t("index.footerLine1")}</p>
          <p className="mt-1 text-xs">{t("index.footerLine2")}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
