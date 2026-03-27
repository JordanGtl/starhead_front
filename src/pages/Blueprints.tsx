import { useState, useMemo } from "react";
import { Search, ScrollText, Hammer, Cpu, Rocket, Crosshair, Car, FlaskConical, Clock, Package, MapPin, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BlueprintCategory = "all" | "ships" | "weapons" | "components" | "vehicles" | "consumables";

interface Material {
  name: string;
  quantity: number;
  unit?: string;
}

interface Blueprint {
  id: string;
  name: string;
  category: BlueprintCategory;
  subcategory?: string;
  craftTime: number;   // minutes
  outputQty: number;
  location: string;
  materials: Material[];
  tier: 1 | 2 | 3 | 4;
}

// ---------------------------------------------------------------------------
// Données placeholder
// ---------------------------------------------------------------------------

const BLUEPRINTS: Blueprint[] = [
  {
    id: "bp-1",
    name: "Arrêtoir de carburant S1",
    category: "components",
    subcategory: "Refroidissement",
    craftTime: 15,
    outputQty: 1,
    location: "ARC-L1",
    tier: 1,
    materials: [
      { name: "Aluminium", quantity: 4 },
      { name: "Cuivre", quantity: 2 },
      { name: "Titane", quantity: 1 },
    ],
  },
  {
    id: "bp-2",
    name: "Bouclier de champ de force S2",
    category: "components",
    subcategory: "Boucliers",
    craftTime: 45,
    outputQty: 1,
    location: "Lorville",
    tier: 2,
    materials: [
      { name: "Acier", quantity: 8 },
      { name: "Or", quantity: 3 },
      { name: "Laranite", quantity: 2 },
    ],
  },
  {
    id: "bp-3",
    name: "Répulseur Banu Multimarchandise",
    category: "ships",
    subcategory: "Vaisseaux",
    craftTime: 480,
    outputQty: 1,
    location: "Nouveau Babbage",
    tier: 3,
    materials: [
      { name: "Acier", quantity: 120 },
      { name: "Aluminium", quantity: 80 },
      { name: "Titane", quantity: 40 },
      { name: "Quantanium", quantity: 5 },
    ],
  },
  {
    id: "bp-4",
    name: "Pistolet Saleco Arclight III",
    category: "weapons",
    subcategory: "Pistolets",
    craftTime: 30,
    outputQty: 1,
    location: "Area 18",
    tier: 2,
    materials: [
      { name: "Acier", quantity: 6 },
      { name: "Cuivre", quantity: 4 },
      { name: "Plastique", quantity: 2 },
    ],
  },
  {
    id: "bp-5",
    name: "Multitool Greycat Industrial",
    category: "consumables",
    subcategory: "Outils",
    craftTime: 20,
    outputQty: 1,
    location: "ARC-L1",
    tier: 1,
    materials: [
      { name: "Aluminium", quantity: 3 },
      { name: "Plastique", quantity: 5 },
    ],
  },
  {
    id: "bp-6",
    name: "Moteur quantique Drift QDrive",
    category: "components",
    subcategory: "Moteurs quantiques",
    craftTime: 90,
    outputQty: 1,
    location: "MIC-L1",
    tier: 3,
    materials: [
      { name: "Or", quantity: 10 },
      { name: "Laranite", quantity: 6 },
      { name: "Titane", quantity: 8 },
      { name: "Quantanium", quantity: 3 },
    ],
  },
  {
    id: "bp-7",
    name: "Pistolet mitrailleur Gemini S71",
    category: "weapons",
    subcategory: "Fusils",
    craftTime: 35,
    outputQty: 1,
    location: "Lorville",
    tier: 2,
    materials: [
      { name: "Acier", quantity: 10 },
      { name: "Cuivre", quantity: 3 },
    ],
  },
  {
    id: "bp-8",
    name: "Cyclone RC",
    category: "vehicles",
    subcategory: "Véhicules terrestres",
    craftTime: 120,
    outputQty: 1,
    location: "Nouveau Babbage",
    tier: 2,
    materials: [
      { name: "Aluminium", quantity: 30 },
      { name: "Plastique", quantity: 20 },
      { name: "Acier", quantity: 15 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Config catégories
// ---------------------------------------------------------------------------

const CATEGORIES: { value: BlueprintCategory; labelKey: string; icon: React.ElementType }[] = [
  { value: "all",          labelKey: "blueprint.catAll",          icon: ScrollText    },
  { value: "ships",        labelKey: "blueprint.catShips",        icon: Rocket        },
  { value: "vehicles",     labelKey: "blueprint.catVehicles",     icon: Car           },
  { value: "weapons",      labelKey: "blueprint.catWeapons",      icon: Crosshair     },
  { value: "components",   labelKey: "blueprint.catComponents",   icon: Cpu           },
  { value: "consumables",  labelKey: "blueprint.catConsumables",  icon: FlaskConical  },
];

const TIER_COLORS: Record<number, string> = {
  1: "border-slate-500/40 text-slate-400 bg-slate-500/10",
  2: "border-blue-500/40 text-blue-400 bg-blue-500/10",
  3: "border-violet-500/40 text-violet-400 bg-violet-500/10",
  4: "border-amber-500/40 text-amber-400 bg-amber-500/10",
};

// ---------------------------------------------------------------------------
// Composant carte blueprint
// ---------------------------------------------------------------------------

const BlueprintCard = ({ bp }: { bp: Blueprint }) => {
  const hours   = Math.floor(bp.craftTime / 60);
  const minutes = bp.craftTime % 60;
  const timeStr = hours > 0 ? `${hours}h${minutes > 0 ? ` ${minutes}min` : ""}` : `${minutes} min`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_hsl(var(--primary)/0.1)]">
      {/* Accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-border/50 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`inline-flex rounded border px-1.5 py-0.5 text-[10px] font-semibold ${TIER_COLORS[bp.tier]}`}>
              T{bp.tier}
            </span>
            {bp.subcategory && (
              <span className="text-[10px] text-muted-foreground">{bp.subcategory}</span>
            )}
          </div>
          <h3 className="mt-1 font-display text-sm font-semibold text-foreground leading-tight">
            {bp.name}
          </h3>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 text-right">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {timeStr}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Package className="h-3 w-3" />
            ×{bp.outputQty}
          </span>
        </div>
      </div>

      {/* Matériaux */}
      <div className="flex flex-1 flex-col px-4 py-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Matériaux requis
        </p>
        <ul className="flex flex-col gap-1.5">
          {bp.materials.map((m) => (
            <li key={m.name} className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-foreground/80">
                <Hammer className="h-3 w-3 shrink-0 text-muted-foreground/50" />
                {m.name}
              </span>
              <span className="text-xs font-medium tabular-nums text-primary">
                ×{m.quantity}{m.unit ? ` ${m.unit}` : ""}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border/50 px-4 py-2">
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {bp.location}
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const Blueprints = () => {
  const { t } = useTranslation();
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState<BlueprintCategory>("all");

  const filtered = useMemo(() => {
    return BLUEPRINTS.filter((bp) => {
      const matchCat    = category === "all" || bp.category === category;
      const matchSearch = !search || bp.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category]);

  const counts: Record<string, number> = { all: BLUEPRINTS.length };
  for (const bp of BLUEPRINTS) {
    counts[bp.category] = (counts[bp.category] ?? 0) + 1;
  }

  return (
    <div className="relative min-h-screen bg-background">

      {/* Image de fond */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
        <img
          src={heroBg}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-30"
          style={{ objectPosition: "50% 30%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex min-h-[18vh] items-center">
        <div className="container pb-2 pt-8">
          <div className="mb-1 flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Base de données
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">Blueprints</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Plans de fabrication disponibles dans l'univers
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div className="relative z-10 container pb-8 pt-0">

        {/* Filtres catégorie */}
        <div className="mb-5 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const Icon     = cat.icon;
            const isActive = category === cat.value;
            const count    = counts[cat.value] ?? 0;
            const label    = t(cat.labelKey, {
              defaultValue: cat.value === "all" ? "Tous" : cat.value,
            });
            return (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-display text-xs font-medium transition-colors ${
                  isActive
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/20 hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                <span className={`ml-0.5 rounded-full px-1.5 text-[10px] ${isActive ? "bg-primary/20" : "bg-secondary"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un blueprint…"
            className="h-10 w-full rounded-lg border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Résultats */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <ScrollText className="mx-auto mb-3 h-12 w-12 opacity-20" />
            <p className="text-sm">Aucun blueprint trouvé</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-xs text-muted-foreground">
              {filtered.length} blueprint{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((bp) => (
                <BlueprintCard key={bp.id} bp={bp} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Blueprints;
