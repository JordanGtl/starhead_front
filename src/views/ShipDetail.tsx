'use client';
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowLeft, Shield, Zap, Thermometer, Gauge, Crosshair,
  Box, Users, Ruler, Fuel, Rocket, Loader2, Target, Radio,
  ChevronDown, Heart, Share2, Wrench, Check,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useVersion } from "@/contexts/VersionContext";
import { apiFetch, API_URL } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { useSEO } from "@/hooks/useSEO";
import { componentTypeLabel, COMPONENT_TYPE_I18N_KEYS } from "@/data/components";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoadoutEntryStats {
  health:       number | null;
  powerOutput:  number | null;
  powerDraw:    number | null;
  shieldHealth: number | null;
  shieldRegen:  number | null;
  qdSpeed:      number | null;
  qdSpoolUp:    number | null;
  weaponDps:    number | null;
}

interface LoadoutEntry {
  port:         string;
  itemRef:      string | null;
  itemId:       number | null;
  name:         string | null;
  type:         string | null;
  subType:      string | null;
  size:         number | null;
  manufacturer: string | null;
  stats:        LoadoutEntryStats | null;
}

interface ShipDetail {
  id:                      number;
  internalName:            string;
  name:                    string;
  manufacturer:            string | null;
  movementClass:           string | null;
  career:                  string | null;
  role:                    string | null;
  minCrew:                 number | null;
  maxCrew:                 number | null;
  cargo:                   number | null;
  sizeX:                   number | null;
  sizeY:                   number | null;
  sizeZ:                   number | null;
  size:                    string | null;
  description:             string | null;
  insuranceBaseWait:       number | null;
  insuranceMandatoryWait:  number | null;
  insuranceExpeditingFee:  number | null;
  image:                   string | null;
  loadout:                 LoadoutEntry[];
  stats:                   ShipStats | null;
  version:                 { id: number; label: string } | null;
}

interface ShipStats {
  powerGenerated: number | null;
  powerConsumed:  number | null;
  qdSpeed:        number | null;
  qdSpoolUp:      number | null;
  shieldHealth:   number | null;
  shieldRegen:    number | null;
  weaponDps:      number | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_ICON: Record<string, React.ElementType> = {
  Shield:          Shield,
  PowerPlant:      Zap,
  Cooler:          Thermometer,
  QuantumDrive:    Gauge,
  Radar:           Radio,
  WeaponDefensive: Target,
  FuelTank:        Fuel,
  QuantumFuelTank: Fuel,
  FuelIntake:      Fuel,
  WeaponGun:       Crosshair,
  MissileLauncher: Crosshair,
  Turret:          Crosshair,
};

const TYPE_COLOR: Record<string, string> = {
  Shield:          'text-blue-400',
  PowerPlant:      'text-amber-400',
  Cooler:          'text-cyan-400',
  QuantumDrive:    'text-violet-400',
  Radar:           'text-emerald-400',
  WeaponDefensive: 'text-rose-400',
  FuelTank:        'text-orange-400',
  QuantumFuelTank: 'text-purple-400',
  FuelIntake:      'text-teal-400',
  WeaponGun:       'text-red-400',
  MissileLauncher: 'text-red-400',
  Turret:          'text-red-400',
};

function crewLabel(min: number | null, max: number | null): string {
  if (!min && !max) return '1';
  if (!max || min === max) return String(min ?? 1);
  return `${min}–${max}`;
}

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
  const Icon = (entry.type && TYPE_ICON[entry.type]) ? TYPE_ICON[entry.type] : Rocket;
  const color = (entry.type && TYPE_COLOR[entry.type]) ? TYPE_COLOR[entry.type] : 'text-primary';
  const portLabel = entry.port.replace(/^hardpoint_/, '').replace(/_/g, ' ');

  const s = entry.stats;
  const hasStats = s && (s.health != null || s.powerOutput != null || s.powerDraw != null);

  return (
    <div className="rounded-md border border-border bg-secondary/40 overflow-hidden">
      {/* Ligne principale */}
      <div className="flex items-center gap-3 px-3 py-2.5">
        <Icon className={`h-4 w-4 shrink-0 ${color}`} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {entry.name ?? portLabel}
          </p>
          <p className="text-[11px] text-muted-foreground capitalize">{portLabel}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {entry.size != null && (
            <span className="text-xs text-muted-foreground">S{entry.size}</span>
          )}
          {entry.itemId != null && (
            <Link href={`/components/${entry.itemId}`} className="text-[10px] text-primary hover:underline">
              Détail →
            </Link>
          )}
          {hasStats && (
            <button
              onClick={() => setOpen(v => !v)}
              className="rounded p-0.5 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Panneau de détail */}
      {open && hasStats && (
        <div className="border-t border-border/50 bg-secondary/60 px-3 py-2 flex flex-wrap gap-x-4 gap-y-1.5">
          {/* Énergie produite en priorité */}
          {s!.powerOutput != null && (
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-amber-400" />
              <span className="text-[11px] text-muted-foreground">Produite</span>
              <span className="font-mono text-[11px] font-semibold text-amber-400">{s!.powerOutput} W</span>
            </div>
          )}
          {/* Énergie consommée */}
          {s!.powerDraw != null && (
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-red-400" />
              <span className="text-[11px] text-muted-foreground">Consommée</span>
              <span className="font-mono text-[11px] font-semibold text-red-400">{s!.powerDraw} W</span>
            </div>
          )}
          {/* Vie du composant */}
          {s!.health != null && (
            <div className="flex items-center gap-1.5">
              <Heart className="h-3 w-3 text-rose-400" />
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

const ShipDetail = () => {
  const { id }             = useParams<{ id: string }>();
  const { t }              = useTranslation();
  const { selectedVersion } = useVersion();

  const [ship,    setShip]    = useState<ShipDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [copied,  setCopied]  = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    const qs = selectedVersion ? `?gameVersion=${selectedVersion.label}` : '';
    apiFetch<ShipDetail>(`/api/ships/${id}${qs}`)
      .then(setShip)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id, selectedVersion?.id]);

  useSEO({
    title:       ship?.name,
    description: ship ? `${ship.name} — ${ship.role ?? ''} par ${ship.manufacturer ?? ''}. Spécifications et loadout sur StarHead.` : undefined,
    path:        id ? `/ships/${id}` : undefined,
  });

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (error || !ship) return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <Rocket className="mb-4 h-12 w-12 text-muted-foreground/20" />
      <h1 className="font-display text-2xl font-bold text-foreground">{t("shipDetail.notFound")}</h1>
      <Link href="/ships" className="mt-4 text-primary hover:underline">← {t("shipDetail.backToShips")}</Link>
    </div>
  );

  const crew = crewLabel(ship.minCrew, ship.maxCrew);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: ship.name, text: `${ship.name} — ${ship.role ?? ''} par ${ship.manufacturer ?? ''}`, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Grouper le loadout par type
  const loadoutByType = ship.loadout.reduce<Record<string, LoadoutEntry[]>>((acc, e) => {
    const key = e.type ?? 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  const typeOrder = ['Shield', 'PowerPlant', 'Cooler', 'QuantumDrive', 'FuelTank', 'QuantumFuelTank', 'FuelIntake', 'Radar', 'WeaponDefensive', 'WeaponGun', 'MissileLauncher', 'Turret', 'Other'];
  const sortedTypes = Object.keys(loadoutByType).sort((a, b) => {
    const ai = typeOrder.indexOf(a); const bi = typeOrder.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <div className="relative min-h-screen bg-background">

      {/* Bande de fond — image du vaisseau ou fallback hero-bg */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28vh] overflow-hidden">
        <img
          src={ship.image ? `${API_URL}${ship.image}` : '/hero-bg.jpg'}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-40"
          style={!ship.image ? { objectPosition: '50% 30%' } : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex min-h-[20vh] items-center">
        <div className="container pb-2 pt-8">

          {/* Breadcrumb */}
          <Link
            href="/ships"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("shipDetail.backToShips")}
          </Link>

          <div className="flex items-end justify-between gap-4">
            <div>
              {ship.manufacturer && (
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                  {ship.manufacturer}
                </p>
              )}
              <h1 className="font-display text-4xl font-bold text-foreground">
                {ship.name}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                {ship.career  && <Badge variant="outline">{ship.career}</Badge>}
                {ship.role    && <Badge variant="outline">{ship.role}</Badge>}
                {ship.size    && <Badge variant="outline">{ship.size}</Badge>}
                {crew         && <Badge variant="outline"><Users className="mr-1 h-3 w-3" />{crew}</Badge>}
                {ship.cargo != null && ship.cargo > 0 && (
                  <Badge variant="outline"><Box className="mr-1 h-3 w-3" />{ship.cargo} SCU</Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              {/* Configurateur */}
              <Link
                href={`/ships/configure?ship=${id}`}
                className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary/20 hover:border-primary/50"
              >
                <Wrench className="h-4 w-4" />
                <span className="hidden sm:inline">Configurer</span>
              </Link>

              {/* Partager */}
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
      </div>

      {/* Contenu */}
      <div className="relative z-10 container pb-8 pt-0 space-y-8">

        {/* Specs + Description — bloc unique deux colonnes */}
        <div className="rounded-xl border border-border bg-card">
          <div className="grid divide-y divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0">

            {/* Specs — colonne gauche */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-3">
                <Spec icon={Ruler} label={t("shipDetail.length")}  value={ship.sizeX != null ? `${ship.sizeX.toFixed(1)} m` : null} />
                <Spec icon={Ruler} label={t("shipDetail.beam")}    value={ship.sizeY != null ? `${ship.sizeY.toFixed(1)} m` : null} />
                <Spec icon={Ruler} label={t("shipDetail.height")}  value={ship.sizeZ != null ? `${ship.sizeZ.toFixed(1)} m` : null} />
                <Spec icon={Users} label={t("shipDetail.crew")}    value={crew} />
                <Spec icon={Box}   label={t("shipDetail.cargo")}   value={ship.cargo != null ? `${ship.cargo} SCU` : null} />
                {ship.insuranceBaseWait != null && (
                  <Spec icon={Rocket} label="Insurance" value={`${ship.insuranceBaseWait} min`} />
                )}
              </div>
            </div>

            {/* Description — colonne droite */}
            <div className="p-6">
              {ship.description
                ? <p className="text-sm leading-relaxed text-muted-foreground">{ship.description}</p>
                : <p className="text-sm italic text-muted-foreground/40">Aucune description disponible.</p>
              }
            </div>

          </div>
        </div>

        {/* Loadout + Caractéristiques */}
        {ship.loadout.length > 0 && (
          <div className="grid grid-cols-12 gap-6 items-stretch">

            {/* Composants — col-9 */}
            <div className="col-span-12 lg:col-span-9 rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 bg-secondary/40">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  {t("shipDetail.defaultComponents")}
                  <span className="ml-2 font-normal text-muted-foreground/40">({ship.loadout.length})</span>
                </p>
              </div>
              <div className="p-4 space-y-5">
                {sortedTypes.map(type => (
                  <div key={type}>
                    <div className="mb-2 flex items-center gap-2">
                      {(() => { const Icon = TYPE_ICON[type] ?? Rocket; return <Icon className={`h-3.5 w-3.5 ${TYPE_COLOR[type] ?? 'text-primary'}`} />; })()}
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                        {componentTypeLabel(type, t)}
                      </span>
                      <span className="text-[10px] text-muted-foreground/40">({loadoutByType[type].length})</span>
                    </div>
                    <div className="grid gap-1.5 sm:grid-cols-2">
                      {loadoutByType[type].map((e, i) => (
                        <LoadoutRow key={i} entry={e} t={t} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Caractéristiques — col-3 */}
            <div className="col-span-12 lg:col-span-3">
              <div className="h-full rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
                <div className="px-4 py-3 bg-secondary/40">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    Caractéristiques
                  </p>
                </div>

                {/* Power */}
                {(ship.stats?.powerGenerated != null || ship.stats?.powerConsumed != null) && (
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-2 text-amber-400">
                      <Zap className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-[10px] font-semibold uppercase tracking-widest">Énergie</span>
                    </div>
                    <div className="space-y-1">
                      {ship.stats?.powerGenerated != null && (
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-muted-foreground">Générée</span>
                          <span className="font-mono text-sm font-bold text-emerald-400 tabular-nums">
                            {ship.stats.powerGenerated.toLocaleString()} W
                          </span>
                        </div>
                      )}
                      {ship.stats?.powerConsumed != null && (
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-muted-foreground">Consommée</span>
                          <span className="font-mono text-sm font-bold text-red-400 tabular-nums">
                            {ship.stats.powerConsumed.toLocaleString()} W
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quantum Drive */}
                {(ship.stats?.qdSpeed != null || ship.stats?.qdSpoolUp != null) && (
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-2 text-violet-400">
                      <Gauge className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-[10px] font-semibold uppercase tracking-widest">Quantum Drive</span>
                    </div>
                    <div className="space-y-1">
                      {ship.stats.qdSpeed != null && (
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-muted-foreground">Vitesse</span>
                          <span className="font-mono text-sm font-bold text-foreground tabular-nums">
                            {ship.stats.qdSpeed.toFixed(2)} Mm/s
                          </span>
                        </div>
                      )}
                      {ship.stats.qdSpoolUp != null && (
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-muted-foreground">Spool-up</span>
                          <span className="font-mono text-sm font-bold text-foreground tabular-nums">
                            {ship.stats.qdSpoolUp}s
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Shield */}
                {(ship.stats?.shieldHealth != null || ship.stats?.shieldRegen != null) && (
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-2 text-blue-400">
                      <Shield className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-[10px] font-semibold uppercase tracking-widest">Bouclier</span>
                    </div>
                    <div className="space-y-1">
                      {ship.stats.shieldHealth != null && (
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-muted-foreground">Points de vie</span>
                          <span className="font-mono text-sm font-bold text-foreground tabular-nums">
                            {ship.stats.shieldHealth.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {ship.stats.shieldRegen != null && (
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-muted-foreground">Régén. / s</span>
                          <span className="font-mono text-sm font-bold text-foreground tabular-nums">
                            {ship.stats.shieldRegen.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Armement */}
                {ship.stats?.weaponDps != null && (
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-2 text-red-400">
                      <Crosshair className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-[10px] font-semibold uppercase tracking-widest">Armement</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground">DPS total</span>
                      <span className="font-mono text-sm font-bold text-foreground tabular-nums">
                        {ship.stats.weaponDps.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Aucune stat disponible */}
                {!ship.stats?.powerGenerated && !ship.stats?.powerConsumed && !ship.stats?.qdSpeed && !ship.stats?.shieldHealth && !ship.stats?.weaponDps && (
                  <p className="px-4 py-4 text-xs italic text-muted-foreground/40">
                    Aucune statistique disponible.
                  </p>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ShipDetail;
