import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft, Cpu, Shield, Zap, Thermometer, Gauge,
  Radar, Target, Fuel, Heart, Package, Tag, Layers,
  AlertCircle, Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  fetchComponent, componentTypeLabel, gradeLabel,
  type ShipComponent,
} from "@/data/components";

// ─── Styles par type ──────────────────────────────────────────────────────────

const TYPE_STYLE: Record<string, {
  bg: string; border: string; iconColor: string; gradientFrom: string;
  Icon: React.ElementType;
}> = {
  Shield:          { bg: "from-blue-500/20 to-blue-600/5",     border: "border-blue-500/30",     iconColor: "text-blue-400",    gradientFrom: "from-blue-500",    Icon: Shield },
  PowerPlant:      { bg: "from-amber-500/20 to-amber-600/5",   border: "border-amber-500/30",    iconColor: "text-amber-400",   gradientFrom: "from-amber-500",   Icon: Zap },
  Cooler:          { bg: "from-cyan-500/20 to-cyan-600/5",     border: "border-cyan-500/30",     iconColor: "text-cyan-400",    gradientFrom: "from-cyan-500",    Icon: Thermometer },
  QuantumDrive:    { bg: "from-violet-500/20 to-violet-600/5", border: "border-violet-500/30",   iconColor: "text-violet-400",  gradientFrom: "from-violet-500",  Icon: Gauge },
  Radar:           { bg: "from-emerald-500/20 to-emerald-600/5",border:"border-emerald-500/30",  iconColor: "text-emerald-400", gradientFrom: "from-emerald-500", Icon: Radar },
  WeaponDefensive: { bg: "from-rose-500/20 to-rose-600/5",     border: "border-rose-500/30",     iconColor: "text-rose-400",    gradientFrom: "from-rose-500",    Icon: Target },
  FuelTank:        { bg: "from-orange-500/20 to-orange-600/5", border: "border-orange-500/30",   iconColor: "text-orange-400",  gradientFrom: "from-orange-500",  Icon: Fuel },
  QuantumFuelTank: { bg: "from-purple-500/20 to-purple-600/5", border: "border-purple-500/30",   iconColor: "text-purple-400",  gradientFrom: "from-purple-500",  Icon: Fuel },
  FuelIntake:      { bg: "from-teal-500/20 to-teal-600/5",     border: "border-teal-500/30",     iconColor: "text-teal-400",    gradientFrom: "from-teal-500",    Icon: Fuel },
};
const DEFAULT_STYLE = {
  bg: "from-primary/20 to-primary/5", border: "border-primary/30",
  iconColor: "text-primary", gradientFrom: "from-primary", Icon: Cpu,
};
const typeStyle = (type: string | null) =>
  (type && TYPE_STYLE[type]) ? TYPE_STYLE[type] : DEFAULT_STYLE;

// ─── Config grade ─────────────────────────────────────────────────────────────

const GRADE_STYLE: Record<string, { badge: string; bar: string; width: string }> = {
  A: { badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",      bar: "bg-amber-400",         width: "100%" },
  B: { badge: "bg-blue-500/10 text-blue-400 border-blue-500/30",         bar: "bg-blue-400",          width: "75%"  },
  C: { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",bar: "bg-emerald-400",       width: "50%"  },
  D: { badge: "bg-muted text-muted-foreground border-border",             bar: "bg-muted-foreground",  width: "25%"  },
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-5 w-32 rounded bg-muted/40" />
    <div className="rounded-xl border border-border/50 bg-card/60 p-6 space-y-4">
      <div className="h-8 w-2/3 rounded bg-muted/40" />
      <div className="h-4 w-1/3 rounded bg-muted/30" />
      <div className="flex gap-2">
        <div className="h-6 w-16 rounded-full bg-muted/30" />
        <div className="h-6 w-16 rounded-full bg-muted/30" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-20 rounded-lg bg-muted/20" />
      ))}
    </div>
  </div>
);

// ─── Carte stat ───────────────────────────────────────────────────────────────

const StatCard = ({
  icon: Icon, label, value,
}: { icon: React.ElementType; label: string; value: React.ReactNode }) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="text-xs">{label}</span>
    </div>
    <p className="mt-1.5 font-display text-sm font-semibold text-foreground">{value}</p>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const ComponentDetail = () => {
  const { id }      = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const navigate    = useNavigate();
  const locale      = i18n.language?.split("-")[0] ?? "en";

  const [component, setComponent] = useState<ShipComponent | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchComponent(Number(id), locale)
      .then(setComponent)
      .catch(() => setError("Composant introuvable."))
      .finally(() => setLoading(false));
  }, [id, locale]);

  // ── Chargement ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container py-8">
        <div className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Cpu className="h-4 w-4" />
          <Link to="/components" className="hover:text-foreground transition-colors">Composants</Link>
          <span className="text-border">/</span>
          <span className="text-foreground/40">…</span>
        </div>
        <Skeleton />
      </div>
    );
  }

  // ── Erreur / introuvable ─────────────────────────────────────────────────────
  if (error || !component) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground/30" />
        <h1 className="font-display text-2xl font-bold text-foreground">Composant introuvable</h1>
        <Link to="/components" className="mt-4 text-sm text-primary hover:underline">
          ← Retour aux composants
        </Link>
      </div>
    );
  }

  const s         = typeStyle(component.type);
  const { Icon }  = s;
  const gl        = gradeLabel(component.grade);
  const gs        = GRADE_STYLE[gl] ?? GRADE_STYLE["D"];
  const typeLabel = componentTypeLabel(component.type);
  const name      = component.name ?? component.internalName;

  // Stats à afficher
  const stats = [
    component.size        != null && { icon: Layers,  label: "Taille",        value: `S${component.size}` },
    component.health      != null && { icon: Heart,   label: "Santé (HP)",    value: component.health.toLocaleString() },
    component.centiSCU    != null && { icon: Package, label: "centiSCU",      value: component.centiSCU.toLocaleString() },
    component.microSCU    != null && { icon: Package, label: "microSCU",      value: component.microSCU.toLocaleString() },
    component.subType               && { icon: Tag,    label: "Sous-type",     value: component.subType },
    component.tags                  && { icon: Tag,    label: "Tags",          value: component.tags },
    component.version               && { icon: Layers, label: "Version",       value: component.version.label },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: React.ReactNode }[];

  return (
    <div className="container py-8">

      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Cpu className="h-3.5 w-3.5 text-primary" />
        <Link to="/components" className="hover:text-foreground transition-colors">Composants</Link>
        <span className="text-border">/</span>
        <span className="text-foreground/60 truncate max-w-xs">{name}</span>
      </div>

      {/* Bouton retour */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Retour
      </button>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="mb-6 overflow-hidden rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm">
        {/* Bande colorée en haut */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${s.gradientFrom} to-transparent`} />

        <div className={`flex items-center gap-4 border-b border-border/40 bg-gradient-to-r ${s.bg} px-6 py-4`}>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${s.border} bg-background/50`}>
            <Icon className={`h-6 w-6 ${s.iconColor}`} />
          </div>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest ${s.iconColor}`}>
              {typeLabel}
            </p>
            <h1 className="font-display text-2xl font-bold leading-tight text-foreground">
              {name}
            </h1>
            {component.shortName && component.shortName !== name && (
              <p className="text-xs text-muted-foreground">{component.shortName}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 px-6 py-4">
          {/* Fabricant */}
          {component.manufacturer && (
            <span className="text-sm font-medium text-primary">{component.manufacturer}</span>
          )}

          {/* Séparateur */}
          {component.manufacturer && (component.size != null || gl !== "?") && (
            <span className="text-border">·</span>
          )}

          {/* Taille */}
          {component.size != null && (
            <Badge variant="outline" className="font-display text-xs">
              <Layers className="mr-1 h-3 w-3" />
              Taille {component.size}
            </Badge>
          )}

          {/* Grade */}
          {gl !== "?" && (
            <span className={`inline-flex rounded border px-2.5 py-0.5 text-xs font-bold ${gs.badge}`}>
              Grade {gl}
            </span>
          )}

          {/* Catégorie */}
          {component.category && (
            <Badge variant="secondary" className="text-xs">{component.category}</Badge>
          )}
        </div>
      </div>

      {/* ── Qualité (barre de grade) ───────────────────────────────────────── */}
      {gl !== "?" && (
        <div className="mb-6 rounded-xl border border-border/50 bg-card/60 p-6">
          <h2 className="mb-4 font-display text-base font-semibold text-foreground">Qualité</h2>
          <div className="space-y-3">
            {(["A", "B", "C", "D"] as const).map((g) => {
              const cfg = GRADE_STYLE[g];
              return (
                <div key={g} className="flex items-center gap-3">
                  <span className={`w-14 shrink-0 rounded border px-2 py-0.5 text-center text-xs font-bold ${
                    g === gl ? cfg.badge : "border-border bg-secondary text-muted-foreground opacity-40"
                  }`}>
                    Grade {g}
                  </span>
                  <div className="flex-1 h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${g === gl ? cfg.bar : "bg-muted/30"}`}
                      style={{ width: g === gl ? cfg.width : "0%" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Le grade indique la qualité du composant : A (optimal) → D (basique).
          </p>
        </div>
      )}

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      {stats.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-4 font-display text-base font-semibold text-foreground">Spécifications</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {stats.map((s) => (
              <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} />
            ))}
          </div>
        </div>
      )}

      {/* ── Description ───────────────────────────────────────────────────── */}
      {component.description && (
        <div className="rounded-xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm">
          <h2 className="mb-3 font-display text-base font-semibold text-foreground">Description</h2>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
            {component.description}
          </p>
        </div>
      )}

      {/* ── Référence interne ─────────────────────────────────────────────── */}
      <div className="mt-4 rounded-lg border border-border/30 bg-card/30 px-4 py-3 text-xs text-muted-foreground/60">
        Réf interne : <code className="font-mono">{component.internalName}</code>
        {component.ref && (
          <> · UUID : <code className="font-mono">{component.ref}</code></>
        )}
      </div>

    </div>
  );
};

export default ComponentDetail;
