'use client';
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowLeft, Truck, Loader2, Users, Package, Ruler,
  Crosshair, Check, Share2, Shield, Zap, Gauge,
  ChevronDown, Radio, Target, Fuel, Rocket,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { apiFetch, API_URL } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { useSEO } from "@/hooks/useSEO";
import { movementClassToType } from "@/data/vehicles";

// ─── Types (identiques à ShipDetail) ─────────────────────────────────────────

interface LoadoutEntry {
  port:         string;
  itemRef:      string | null;
  itemId:       number | null;
  name:         string | null;
  type:         string | null;
  subType:      string | null;
  size:         number | null;
  manufacturer: string | null;
  stats: {
    health:       number | null;
    powerOutput:  number | null;
    powerDraw:    number | null;
    shieldHealth: number | null;
    shieldRegen:  number | null;
    qdSpeed:      number | null;
    qdSpoolUp:    number | null;
    weaponDps:    number | null;
  } | null;
}

interface VehicleDetail {
  id:            number;
  name:          string;
  manufacturer:  string | null;
  movementClass: string | null;
  role:          string | null;
  minCrew:       number | null;
  maxCrew:       number | null;
  cargo:         number | null;
  sizeX:         number | null;
  sizeY:         number | null;
  sizeZ:         number | null;
  isInGame:      boolean;
  description:   string | null;
  image:         string | null;
  loadout:       LoadoutEntry[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_ICON: Record<string, React.ElementType> = {
  Shield: Shield, PowerPlant: Zap, Cooler: Zap,
  WeaponGun: Crosshair, MissileLauncher: Crosshair, Turret: Crosshair,
  Radar: Radio, WeaponDefensive: Target, FuelTank: Fuel, QuantumFuelTank: Fuel,
};
const TYPE_COLOR: Record<string, string> = {
  Shield: 'text-blue-400', PowerPlant: 'text-amber-400', Cooler: 'text-cyan-400',
  WeaponGun: 'text-red-400', MissileLauncher: 'text-red-400', Turret: 'text-red-400',
  Radar: 'text-emerald-400', WeaponDefensive: 'text-rose-400',
  FuelTank: 'text-orange-400', QuantumFuelTank: 'text-purple-400',
};

// ─── Spec tile ────────────────────────────────────────────────────────────────

const Spec = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null }) => {
  if (value == null) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-1 font-mono text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
};

// ─── Loadout row ──────────────────────────────────────────────────────────────

const LoadoutRow = ({ entry, t }: { entry: LoadoutEntry; t: (k: string) => string }) => {
  const [open, setOpen] = useState(false);
  const Icon  = (entry.type && TYPE_ICON[entry.type])  ? TYPE_ICON[entry.type]  : Rocket;
  const color = (entry.type && TYPE_COLOR[entry.type]) ? TYPE_COLOR[entry.type] : 'text-primary';
  const portLabel = entry.port.replace(/^hardpoint_/, '').replace(/_/g, ' ');
  const s = entry.stats;
  const hasStats = s && (s.health != null || s.powerOutput != null || s.powerDraw != null);

  return (
    <div className="rounded-md border border-border bg-secondary/40 overflow-hidden">
      <div className="flex items-center gap-3 px-3 py-2.5">
        <Icon className={`h-4 w-4 shrink-0 ${color}`} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{entry.name ?? portLabel}</p>
          <p className="text-[11px] text-muted-foreground capitalize">{portLabel}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {entry.size != null && <span className="text-xs text-muted-foreground">S{entry.size}</span>}
          {entry.itemId != null && (
            <Link href={`/components/${entry.itemId}`} className="text-[10px] text-primary hover:underline">Détail →</Link>
          )}
          {hasStats && (
            <button onClick={() => setOpen(v => !v)} className="rounded p-0.5 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>
      {open && hasStats && (
        <div className="border-t border-border/50 bg-secondary/60 px-3 py-2 flex flex-wrap gap-x-4 gap-y-1.5">
          {s!.powerOutput != null && (
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-amber-400" />
              <span className="text-[11px] text-muted-foreground">Produite</span>
              <span className="font-mono text-[11px] font-semibold text-amber-400">{s!.powerOutput} W</span>
            </div>
          )}
          {s!.powerDraw != null && (
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-red-400" />
              <span className="text-[11px] text-muted-foreground">Consommée</span>
              <span className="font-mono text-[11px] font-semibold text-red-400">{s!.powerDraw} W</span>
            </div>
          )}
          {s!.health != null && (
            <div className="flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-rose-400" />
              <span className="text-[11px] text-muted-foreground">Vie</span>
              <span className="font-mono text-[11px] font-semibold text-foreground">{s!.health.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const VehicleDetail = () => {
  const { id }  = useParams<{ id: string }>();
  const { t }   = useTranslation();

  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [copied,  setCopied]  = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    // Les véhicules sont dans ShipDef — on utilise /api/ships/{id}
    apiFetch<VehicleDetail>(`/api/ships/${id}`)
      .then(setVehicle)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  useSEO({
    title:       vehicle?.name,
    description: vehicle
      ? `${vehicle.name} — ${movementClassToType(vehicle.movementClass)} par ${vehicle.manufacturer ?? ''}. Spécifications sur StarHead.`
      : undefined,
    path: id ? `/vehicles/${id}` : undefined,
  });

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (error || !vehicle) return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <Truck className="mb-4 h-12 w-12 text-muted-foreground/20" />
      <h1 className="font-display text-2xl font-bold text-foreground">{t("vehicleDetail.notFound")}</h1>
      <Link href="/vehicles" className="mt-4 text-primary hover:underline">← {t("vehicleDetail.backToVehicles")}</Link>
    </div>
  );

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: vehicle.name, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const displayType = movementClassToType(vehicle.movementClass);
  const imageUrl = vehicle.image
    ? (vehicle.image.startsWith('/') ? `${API_URL}${vehicle.image}` : vehicle.image)
    : null;

  // Grouper le loadout par type
  const loadoutByType = vehicle.loadout.reduce<Record<string, LoadoutEntry[]>>((acc, e) => {
    const key = e.type ?? 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});
  const typeOrder = ['Shield', 'PowerPlant', 'Cooler', 'FuelTank', 'Radar', 'WeaponDefensive', 'WeaponGun', 'MissileLauncher', 'Turret', 'Other'];
  const sortedTypes = Object.keys(loadoutByType).sort((a, b) => {
    const ai = typeOrder.indexOf(a); const bi = typeOrder.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <div className="relative min-h-screen bg-background">

      {/* Bande de fond */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28vh] overflow-hidden">
        <img
          src={imageUrl ?? '/hero-bg.jpg'}
          alt="" aria-hidden="true"
          className="h-full w-full object-cover opacity-40"
          style={!imageUrl ? { objectPosition: '50% 30%' } : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex min-h-[20vh] items-center">
        <div className="container pb-2 pt-8">
          <Link href="/vehicles" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            {t("vehicleDetail.backToVehicles")}
          </Link>

          <div className="flex items-end justify-between gap-4">
            <div>
              {vehicle.manufacturer && (
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                  {vehicle.manufacturer}
                </p>
              )}
              <h1 className="font-display text-4xl font-bold text-foreground">{vehicle.name}</h1>
              <div className="mt-3 flex flex-wrap gap-2">
                {vehicle.isInGame
                  ? <Badge className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400"><Truck className="mr-1 h-3 w-3" />En jeu</Badge>
                  : <Badge className="border-amber-500/40 bg-amber-500/10 text-amber-400">Concept</Badge>
                }
                {displayType  && <Badge variant="outline">{displayType}</Badge>}
                {vehicle.role && <Badge variant="outline">{vehicle.role}</Badge>}
                {vehicle.minCrew != null && (
                  <Badge variant="outline"><Users className="mr-1 h-3 w-3" />{vehicle.minCrew}</Badge>
                )}
                {vehicle.cargo != null && vehicle.cargo > 0 && (
                  <Badge variant="outline"><Package className="mr-1 h-3 w-3" />{vehicle.cargo} SCU</Badge>
                )}
              </div>
            </div>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/80 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur transition-all hover:text-foreground hover:border-border/80"
            >
              {copied
                ? <><Check className="h-4 w-4 text-emerald-400" /><span className="hidden sm:inline text-emerald-400">Copié !</span></>
                : <><Share2 className="h-4 w-4" /><span className="hidden sm:inline">Partager</span></>
              }
            </button>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="relative z-10 container pb-8 pt-0 space-y-8">

        {/* Specs + Description */}
        <div className="rounded-xl border border-border bg-card">
          <div className="grid divide-y divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            <div className="p-6">
              <div className="grid grid-cols-3 gap-3">
                <Spec icon={Truck}   label={t("common.type")}        value={displayType} />
                <Spec icon={Users}   label={t("vehicles.seats")}     value={vehicle.minCrew != null ? String(vehicle.minCrew) : null} />
                <Spec icon={Package} label={t("vehicles.cargo")}     value={vehicle.cargo != null ? `${vehicle.cargo} SCU` : null} />
                <Spec icon={Ruler}   label={t("shipDetail.length")}  value={vehicle.sizeX != null ? `${vehicle.sizeX.toFixed(1)} m` : null} />
                <Spec icon={Ruler}   label={t("shipDetail.beam")}    value={vehicle.sizeY != null ? `${vehicle.sizeY.toFixed(1)} m` : null} />
                <Spec icon={Ruler}   label={t("shipDetail.height")}  value={vehicle.sizeZ != null ? `${vehicle.sizeZ.toFixed(1)} m` : null} />
              </div>
            </div>
            <div className="p-6">
              {vehicle.description
                ? <p className="text-sm leading-relaxed text-muted-foreground">{vehicle.description}</p>
                : <p className="text-sm italic text-muted-foreground/40">Aucune description disponible.</p>
              }
            </div>
          </div>
        </div>

        {/* Loadout */}
        {vehicle.loadout.length > 0 && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 bg-secondary/40">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {t("shipDetail.defaultComponents")}
                <span className="ml-2 font-normal text-muted-foreground/40">({vehicle.loadout.length})</span>
              </p>
            </div>
            <div className="p-4 space-y-5">
              {sortedTypes.map(type => (
                <div key={type}>
                  <div className="mb-2 flex items-center gap-2">
                    {(() => { const Icon = TYPE_ICON[type] ?? Rocket; return <Icon className={`h-3.5 w-3.5 ${TYPE_COLOR[type] ?? 'text-primary'}`} />; })()}
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{type}</span>
                    <span className="text-[10px] text-muted-foreground/40">({loadoutByType[type].length})</span>
                  </div>
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {loadoutByType[type].map((e, i) => <LoadoutRow key={i} entry={e} t={t} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VehicleDetail;
