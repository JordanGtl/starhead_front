import { Crosshair, Cpu, MapPin, Car, Rocket, Building2, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import logoWithName from "@/assets/logo_with_name.svg";
import CategoryCard from "@/components/CategoryCard";
import LiveSearchBar from "@/components/LiveSearchBar";

const categories = [
  { title: "Vaisseaux", description: "Tous les vaisseaux spatiaux du 'verse", icon: Rocket, count: 200, href: "/ships" },
  { title: "Armes", description: "Armes embarquées et personnelles", icon: Crosshair, count: 150, href: "/weapons" },
  { title: "Composants", description: "Boucliers, propulseurs, quantum drives", icon: Cpu, count: 300, href: "/components" },
  { title: "Lieux", description: "Planètes, stations et points d'intérêt", icon: MapPin, count: 80, href: "/locations" },
  { title: "Véhicules", description: "Véhicules terrestres et hover", icon: Car, count: 30, href: "/vehicles" },
  { title: "Entreprises", description: "Constructeurs, fabricants et corporations", icon: Building2, count: 22, href: "/manufacturers" },
  { title: "Lore", description: "Histoire, factions et technologies du 'verse", icon: BookOpen, count: 16, href: "/lore" },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <img src={heroBg} alt="Star Citizen space scene" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <img src={logoWithName} alt="StarHead — The Citizen's Database" className="mx-auto w-72 sm:w-96" />
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
            La base de données ultime pour Star Citizen. Vaisseaux, armes, composants et plus encore.
          </p>

          <div className="mx-auto mt-8 max-w-xl">
            <LiveSearchBar />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <h2 className="mb-2 font-display text-2xl font-bold text-foreground">Base de Données</h2>
        <p className="mb-8 text-muted-foreground">Explorez toutes les catégories du 'verse</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.title} {...cat} />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-border bg-card/50">
        <div className="container grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
          {[
            { label: "Vaisseaux", value: "200+" },
            { label: "Armes", value: "150+" },
            { label: "Lieux", value: "80+" },
            { label: "Composants", value: "300+" },
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
          <p>StarHead — Base de données communautaire Star Citizen</p>
          <p className="mt-1 text-xs">Non affilié à Cloud Imperium Games</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
