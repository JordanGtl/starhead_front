import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Settings2, Search, ChevronRight, Users, Package, Crosshair } from "lucide-react";
import { useTranslation } from "react-i18next";
import { shipsDetailed, ShipDetailed } from "@/data/ships-detailed";
import heroBg from "@/assets/hero-bg.jpg";

const SIZE_ORDER: Record<string, number> = { Small: 0, Medium: 1, Large: 2, Capital: 3 };

const SIZE_COLORS: Record<string, string> = {
  Small:   "text-sky-400 bg-sky-500/10 border-sky-500/30",
  Medium:  "text-amber-400 bg-amber-500/10 border-amber-500/30",
  Large:   "text-rose-400 bg-rose-500/10 border-rose-500/30",
  Capital: "text-purple-400 bg-purple-500/10 border-purple-500/30",
};

const STATUS_DOT: Record<string, string> = {
  "Flight Ready":  "bg-emerald-400",
  "In Concept":    "bg-amber-400",
  "In Production": "bg-blue-400",
};

const ShipCard = ({ ship, onSelect }: { ship: ShipDetailed; onSelect: (id: string) => void }) => {
  const { t } = useTranslation();
  const sizeColor  = SIZE_COLORS[ship.size]  ?? "text-muted-foreground bg-secondary border-border";
  const statusDot  = STATUS_DOT[ship.status] ?? "bg-muted";
  const weaponSlots = ship.hardpoints.filter(hp => hp.type === "Weapon" || hp.type === "Turret").length;
  const missileSlots = ship.hardpoints.filter(hp => hp.type === "Missile").length;

  return (
    <button
      onClick={() => onSelect(ship.id)}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card text-left transition-all duration-200 hover:border-primary/50 hover:shadow-[0_0_20px_hsl(var(--primary)/0.08)]"
    >
      {/* Header */}
      <div className="relative flex items-start justify-between p-4 pb-3">
        <div className="flex-1 min-w-0">
          <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground truncate">
            {ship.manufacturer}
          </p>
          <h3 className="font-display text-base font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
            {ship.name}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{ship.role}</p>
        </div>
        <div className={`flex items-center gap-1 ml-2 shrink-0`}>
          <div className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
          <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${sizeColor}`}>
            {ship.size}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 border-t border-border/50 px-4 py-2.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {ship.crew}
        </span>
        <span className="flex items-center gap-1">
          <Package className="h-3 w-3" />
          {ship.cargo} SCU
        </span>
        <span className="flex items-center gap-1">
          <Crosshair className="h-3 w-3" />
          {weaponSlots}W {missileSlots > 0 ? `/ ${missileSlots}M` : ''}
        </span>
        <span className="ml-auto flex items-center gap-0.5 font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
          {t("tools.loadout.select")} <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
  );
};

// ─── Sizes & roles for filters ────────────────────────────────────────────────
const ALL_SIZES  = Array.from(new Set(shipsDetailed.map(s => s.size))).sort((a, b) => (SIZE_ORDER[a] ?? 9) - (SIZE_ORDER[b] ?? 9));
const ALL_ROLES  = Array.from(new Set(shipsDetailed.map(s => s.role))).sort();
const ALL_MANUFACTURERS = Array.from(new Set(shipsDetailed.map(s => s.manufacturer))).sort();

// ─── Page ─────────────────────────────────────────────────────────────────────

const LoadoutTool = () => {
  const { t }    = useTranslation();
  const navigate = useNavigate();

  const [query, setQuery]     = useState("");
  const [size, setSize]       = useState("all");
  const [role, setRole]       = useState("all");
  const [mfr, setMfr]         = useState("all");

  const filtered = useMemo(() => {
    return shipsDetailed
      .filter(s => {
        if (size !== "all" && s.size !== size) return false;
        if (role !== "all" && s.role !== role) return false;
        if (mfr  !== "all" && s.manufacturer !== mfr) return false;
        if (query) {
          const q = query.toLowerCase();
          return s.name.toLowerCase().includes(q) || s.manufacturer.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        const so = (SIZE_ORDER[a.size] ?? 9) - (SIZE_ORDER[b.size] ?? 9);
        return so !== 0 ? so : a.name.localeCompare(b.name);
      });
  }, [query, size, role, mfr]);

  const handleSelect = (id: string) => {
    navigate(`/ships/${id}/loadout`);
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[22vh] overflow-hidden">
        <img src={heroBg} alt="" aria-hidden className="h-full w-full object-cover opacity-30" style={{ objectPosition: "50% 40%" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex min-h-[20vh] items-center">
        <div className="container pb-2 pt-8">
          <div className="mb-1 flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("tools.hub.overline")}</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">{t("tools.loadout.title")}</h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">{t("tools.loadout.pickShip")}</p>
        </div>
      </div>

      <div className="relative z-10 container pb-12 pt-0">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t("common.search")}
              className="h-9 rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 w-48"
            />
          </div>

          {/* Size */}
          <div className="flex flex-wrap gap-1.5">
            {["all", ...ALL_SIZES].map(s => (
              <button key={s} onClick={() => setSize(s)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
                  size === s ? "border-primary/50 bg-primary/10 text-primary" : "border-border/50 bg-card/50 text-muted-foreground hover:text-foreground"
                }`}>
                {s === "all" ? t("common.all") : s}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-border/50" />

          {/* Role */}
          <select value={role} onChange={e => setRole(e.target.value)}
            className="h-9 rounded-lg border border-border bg-card px-2 text-xs text-foreground focus:border-primary/50 focus:outline-none">
            <option value="all">{t("common.all")} — Rôle</option>
            {ALL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          {/* Manufacturer */}
          <select value={mfr} onChange={e => setMfr(e.target.value)}
            className="h-9 rounded-lg border border-border bg-card px-2 text-xs text-foreground focus:border-primary/50 focus:outline-none">
            <option value="all">{t("common.all")} — {t("common.manufacturer")}</option>
            {ALL_MANUFACTURERS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} {t("common.entries")}</span>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(ship => (
              <ShipCard key={ship.id} ship={ship} onSelect={handleSelect} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-20 text-center">
            <Settings2 className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">{t("common.noResults")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadoutTool;
