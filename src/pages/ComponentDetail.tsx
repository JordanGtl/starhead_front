import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Cpu, Shield, Zap, Thermometer, Gauge,
  Radar, Target, Fuel, Heart, Tag, Layers, AlertCircle,
  Activity, Flame, Wind, Radio, Crosshair, Timer,
  ShoppingBag, MapPin, CircleDollarSign, Package, Share2, Check,
} from "lucide-react";
import {
  fetchComponent, componentTypeLabel, gradeLabel,
  type ShipComponent, type ShieldData, type PowerPlantData,
  type QuantumDriveData, type CoolerData, type ShipWeaponData,
  type MissileData, type MissileRackData,
} from "@/data/components";
import PageHeader from "@/components/PageHeader";

// ─── Styles par type ──────────────────────────────────────────────────────────

const TYPE_STYLE: Record<string, {
  bg: string; border: string; iconColor: string; gradientFrom: string; accent: string;
  tooltipBorder: string; tooltipGlow: string; nameColor: string;
  Icon: React.ElementType;
}> = {
  Shield:          { bg: "from-blue-500/15 to-blue-600/5",     border: "border-blue-500/30",     iconColor: "text-blue-400",    gradientFrom: "from-blue-500",    accent: "bg-blue-500",    tooltipBorder: "border-blue-500/50",    tooltipGlow: "shadow-blue-500/10",    nameColor: "text-blue-300",    Icon: Shield },
  PowerPlant:      { bg: "from-amber-500/15 to-amber-600/5",   border: "border-amber-500/30",    iconColor: "text-amber-400",   gradientFrom: "from-amber-500",   accent: "bg-amber-500",   tooltipBorder: "border-amber-500/50",   tooltipGlow: "shadow-amber-500/10",   nameColor: "text-amber-300",   Icon: Zap },
  Cooler:          { bg: "from-cyan-500/15 to-cyan-600/5",     border: "border-cyan-500/30",     iconColor: "text-cyan-400",    gradientFrom: "from-cyan-500",    accent: "bg-cyan-500",    tooltipBorder: "border-cyan-500/50",    tooltipGlow: "shadow-cyan-500/10",    nameColor: "text-cyan-300",    Icon: Thermometer },
  QuantumDrive:    { bg: "from-violet-500/15 to-violet-600/5", border: "border-violet-500/30",   iconColor: "text-violet-400",  gradientFrom: "from-violet-500",  accent: "bg-violet-500",  tooltipBorder: "border-violet-500/50",  tooltipGlow: "shadow-violet-500/10",  nameColor: "text-violet-300",  Icon: Gauge },
  Radar:           { bg: "from-emerald-500/15 to-emerald-600/5",border:"border-emerald-500/30",  iconColor: "text-emerald-400", gradientFrom: "from-emerald-500", accent: "bg-emerald-500", tooltipBorder: "border-emerald-500/50", tooltipGlow: "shadow-emerald-500/10", nameColor: "text-emerald-300", Icon: Radar },
  WeaponDefensive: { bg: "from-rose-500/15 to-rose-600/5",     border: "border-rose-500/30",     iconColor: "text-rose-400",    gradientFrom: "from-rose-500",    accent: "bg-rose-500",    tooltipBorder: "border-rose-500/50",    tooltipGlow: "shadow-rose-500/10",    nameColor: "text-rose-300",    Icon: Target },
  FuelTank:        { bg: "from-orange-500/15 to-orange-600/5", border: "border-orange-500/30",   iconColor: "text-orange-400",  gradientFrom: "from-orange-500",  accent: "bg-orange-500",  tooltipBorder: "border-orange-500/50",  tooltipGlow: "shadow-orange-500/10",  nameColor: "text-orange-300",  Icon: Fuel },
  QuantumFuelTank: { bg: "from-purple-500/15 to-purple-600/5", border: "border-purple-500/30",   iconColor: "text-purple-400",  gradientFrom: "from-purple-500",  accent: "bg-purple-500",  tooltipBorder: "border-purple-500/50",  tooltipGlow: "shadow-purple-500/10",  nameColor: "text-purple-300",  Icon: Fuel },
  FuelIntake:      { bg: "from-teal-500/15 to-teal-600/5",     border: "border-teal-500/30",     iconColor: "text-teal-400",    gradientFrom: "from-teal-500",    accent: "bg-teal-500",    tooltipBorder: "border-teal-500/50",    tooltipGlow: "shadow-teal-500/10",    nameColor: "text-teal-300",    Icon: Fuel },
};
const DEFAULT_STYLE = {
  bg: "from-primary/15 to-primary/5", border: "border-primary/30",
  iconColor: "text-primary", gradientFrom: "from-primary", accent: "bg-primary",
  tooltipBorder: "border-primary/50", tooltipGlow: "shadow-primary/10", nameColor: "text-primary",
  Icon: Cpu,
};
const typeStyle = (type: string | null) => (type && TYPE_STYLE[type]) ? TYPE_STYLE[type] : DEFAULT_STYLE;

// ─── Grade config ─────────────────────────────────────────────────────────────

const GRADE_STYLE: Record<string, { badge: string }> = {
  A: { badge: "bg-amber-500/10 text-amber-400 border-amber-500/30"       },
  B: { badge: "bg-blue-500/10 text-blue-400 border-blue-500/30"          },
  C: { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  D: { badge: "bg-muted text-muted-foreground border-border"             },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: number | null | undefined, decimals = 0, unit = "") =>
  v == null ? null : `${v.toLocaleString("fr-FR", { maximumFractionDigits: decimals })}${unit}`;

const fmtPct = (v: number | null | undefined) =>
  v == null ? null : `${(v * 100).toFixed(0)}%`;

// ─── Infobulle — ligne stat (label gauche / valeur droite) ───────────────────

const StatRow = ({
  icon: Icon, label, value, accent = "text-foreground",
}: { icon?: React.ElementType; label: string; value: string | null; accent?: string }) => {
  if (value == null) return null;
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
        {Icon && <Icon className="h-3 w-3 shrink-0" />}
        <span className="text-xs">{label}</span>
      </div>
      <span className={`font-mono text-xs font-semibold tabular-nums text-right ${accent}`}>{value}</span>
    </div>
  );
};

const Divider = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 pt-3 pb-1">
    <div className="h-px flex-1 bg-border/40" />
    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-1">{label}</span>
    <div className="h-px flex-1 bg-border/40" />
  </div>
);

/** Barre de résistance */
const ResistBar = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center gap-2 py-1.5 border-b border-border/30 last:border-0">
    <span className="w-20 shrink-0 text-xs text-muted-foreground">{label}</span>
    <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${value > 0 ? "bg-primary" : value < 0 ? "bg-destructive" : "bg-border"}`}
        style={{ width: `${Math.max(0, Math.min(100, Math.abs(value) * 100))}%` }}
      />
    </div>
    <span className={`w-10 text-right text-xs font-mono tabular-nums shrink-0 ${value > 0 ? "text-primary" : value < 0 ? "text-destructive" : "text-muted-foreground"}`}>
      {(value * 100).toFixed(0)}%
    </span>
  </div>
);

// Stats par type
const ShieldStats = ({ d }: { d: ShieldData }) => (
  <div>
    <StatRow icon={Shield}     label="HP bouclier"      value={fmt(d.maxShieldHealth, 0, " HP")}   accent="text-blue-400" />
    <StatRow icon={Activity}   label="Régénération / s"  value={fmt(d.maxShieldRegen, 0, " HP/s")}  accent="text-blue-400" />
    <StatRow icon={Timer}      label="Délai endommagé"   value={fmt(d.damagedRegenDelay, 2, " s")}  accent="text-orange-400" />
    <StatRow icon={Timer}      label="Délai hors service" value={fmt(d.downedRegenDelay, 2, " s")}  accent="text-orange-400" />
    <StatRow icon={Activity}   label="Décroissance"      value={fmtPct(d.decayRatio)}              />
    {d.reservePoolMaxHealthRatio != null && (
      <>
        <Divider label="Réserve" />
        <StatRow label="HP max réserve"   value={fmtPct(d.reservePoolMaxHealthRatio)} />
        <StatRow label="Régén réserve"    value={fmtPct(d.reservePoolRegenRateRatio)} />
        <StatRow label="Drain réserve"    value={fmtPct(d.reservePoolDrainRateRatio)} accent="text-orange-400" />
      </>
    )}
    {d.resistance && d.resistance.filter((r) => r.max !== 0).length > 0 && (
      <>
        <Divider label="Résistances" />
        {d.resistance.filter((r) => r.max !== 0).map((r) => <ResistBar key={r.damageType} label={r.damageType} value={r.max} />)}
      </>
    )}
  </div>
);

const PowerPlantStats = ({ d }: { d: PowerPlantData }) => (
  <div>
    <StatRow icon={Zap}         label="Puissance"       value={fmt(d.powerOutput, 0, " EU")}       accent="text-amber-400" />
    <StatRow icon={Radio}       label="Signature EM"    value={fmt(d.emSignature, 0)}              />
    <Divider label="Thermique" />
    <StatRow icon={Flame}       label="Surchauffe"      value={fmt(d.overheatTemp, 0, " °C")}      accent="text-orange-400" />
    <StatRow icon={Flame}       label="Alerte surchauffe" value={fmt(d.overheatWarning, 0, " °C")} accent="text-orange-400" />
    <StatRow icon={Thermometer} label="Récupération"    value={fmt(d.overheatRecovery, 0, " °C")}  accent="text-cyan-400" />
  </div>
);

const QuantumDriveStats = ({ d }: { d: QuantumDriveData }) => (
  <div>
    <StatRow icon={Gauge}  label="Vitesse QD"        value={fmt(d.driveSpeed ? d.driveSpeed / 1e6 : null, 2, " Gm/s")} accent="text-violet-400" />
    <StatRow icon={Timer}  label="Temps d'armement"  value={fmt(d.spoolUpTime, 1, " s")}         accent="text-orange-400" />
    <StatRow icon={Timer}  label="Refroidissement"   value={fmt(d.cooldownTime, 1, " s")}         accent="text-cyan-400" />
    <StatRow icon={Fuel}   label="Carburant / SCU"   value={fmt(d.fuelPerSCU, 4)}                />
    <StatRow icon={Fuel}   label="Carburant QD requis" value={fmt(d.quantumFuelRequirement, 2)}  />
    <StatRow icon={Radio}  label="Signature EM"      value={fmt(d.emSignature, 0)}               />
    <StatRow icon={Flame}  label="Surchauffe"        value={fmt(d.overheatTemp, 0, " °C")}        accent="text-orange-400" />
    <Divider label="Calibration" />
    <StatRow label="Taux de calibration"  value={fmt(d.calibrationRate, 2, "/s")}      />
    <StatRow label="Calibration min"      value={fmtPct(d.minCalibration)}             />
    <StatRow label="Calibration max"      value={fmtPct(d.maxCalibration)}             accent="text-green-400" />
    <StatRow label="Angle limite"         value={fmt(d.calibrationAngleLimit, 1, "°")} />
  </div>
);

const CoolerStats = ({ d }: { d: CoolerData }) => (
  <div>
    <StatRow icon={Thermometer} label="Taux de refroid."  value={fmt(d.coolingRate, 0, " HTU/s")}   accent="text-cyan-400" />
    <StatRow icon={Zap}         label="Consommation"      value={fmt(d.powerDraw, 0, " EU")}         accent="text-amber-400" />
    <Divider label="Signatures" />
    <StatRow icon={Radio} label="Signature EM"  value={fmt(d.emSignature, 0)} />
    <StatRow icon={Radio} label="Signature IR"  value={fmt(d.irSignature, 0)} />
    <Divider label="Thermique" />
    <StatRow icon={Flame}       label="Surchauffe"        value={fmt(d.overheatTemp, 0, " °C")}     accent="text-orange-400" />
    <StatRow icon={Flame}       label="Alerte surchauffe" value={fmt(d.overheatWarning, 0, " °C")}  accent="text-orange-400" />
    <StatRow icon={Thermometer} label="Récupération"      value={fmt(d.overheatRecovery, 0, " °C")} accent="text-cyan-400" />
  </div>
);

const ShipWeaponStats = ({ d }: { d: ShipWeaponData }) => (
  <div>
    <StatRow icon={Crosshair} label="Portée effective"  value={fmt(d.effectiveRange, 0, " m")}    accent="text-amber-400" />
    <StatRow icon={Wind}      label="Vitesse munition"  value={fmt(d.ammoSpeed, 0, " m/s")}       accent="text-green-400" />
    <StatRow icon={Timer}     label="Durée munition"    value={fmt(d.ammoLifetime, 2, " s")}      />
    <StatRow icon={Radio}     label="Signature EM"      value={fmt(d.emSignature, 0)}             />
    <StatRow icon={Flame}     label="Surchauffe"        value={fmt(d.overheatTemp, 0, " °C")}    accent="text-orange-400" />
    <StatRow icon={Flame}     label="Alerte surchauffe" value={fmt(d.overheatWarning, 0, " °C")} accent="text-orange-400" />
    {d.fireModes && d.fireModes.length > 0 && (
      <>
        <Divider label="Modes de tir" />
        <div className="flex flex-wrap gap-1.5 pt-1">
          {d.fireModes.map((m, i) => (
            <span key={i} className="rounded border border-primary/30 bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-primary">
              {((m as Record<string, unknown>).name as string) ?? `Mode ${i + 1}`}
            </span>
          ))}
        </div>
      </>
    )}
  </div>
);

const MissileStats = ({ d }: { d: MissileData }) => (
  <div>
    <StatRow icon={Wind}  label="Vitesse"       value={fmt(d.linearSpeed, 0, " m/s")}   accent="text-amber-400" />
    <StatRow icon={Timer} label="Durée de vie"  value={fmt(d.maxLifetime, 1, " s")}     />
    <StatRow icon={Timer} label="Armement"      value={fmt(d.armTime, 2, " s")}         accent="text-orange-400" />
    <StatRow icon={Timer} label="Ignition"      value={fmt(d.igniteTime, 2, " s")}      accent="text-orange-400" />
    <Divider label="Explosion" />
    <StatRow label="Rayon min"   value={fmt(d.explosionMinRadius, 0, " m")} accent="text-orange-400" />
    <StatRow label="Rayon max"   value={fmt(d.explosionMaxRadius, 0, " m")} accent="text-destructive" />
    <Divider label="Verrouillage" />
    <StatRow icon={Crosshair} label="Temps de lock"  value={fmt(d.lockTime, 2, " s")}       accent="text-orange-400" />
    <StatRow icon={Crosshair} label="Angle de lock"  value={fmt(d.lockingAngle, 1, "°")}   />
    <StatRow icon={Crosshair} label="Portée min"     value={fmt(d.lockRangeMin, 0, " m")}  />
    <StatRow icon={Crosshair} label="Portée max"     value={fmt(d.lockRangeMax, 0, " m")}  accent="text-green-400" />
    {d.trackingSignalType && <StatRow icon={Radio} label="Type de signal" value={d.trackingSignalType} accent="text-cyan-400" />}
  </div>
);

const MissileRackStats = ({ d }: { d: MissileRackData }) => (
  <div>
    <StatRow icon={Package} label="Nombre de missiles" value={fmt(d.missileCount, 0)}              accent="text-amber-400" />
    <StatRow icon={Timer}   label="Délai de lancement" value={fmt(d.launchDelay, 3, " s")}         accent="text-orange-400" />
    <Divider label="Compatibilité" />
    <StatRow icon={Layers} label="Taille min" value={d.missileSizeMin != null ? `S${d.missileSizeMin}` : null} />
    <StatRow icon={Layers} label="Taille max" value={d.missileSizeMax != null ? `S${d.missileSizeMax}` : null} />
  </div>
);

// ─── Infobulle principale ─────────────────────────────────────────────────────

const WoWTooltip = ({ c }: { c: ShipComponent }) => {
  const s  = typeStyle(c.type);

  const statsContent = (() => {
    if (c.shield)       return <ShieldStats       d={c.shield} />;
    if (c.powerPlant)   return <PowerPlantStats   d={c.powerPlant} />;
    if (c.quantumDrive) return <QuantumDriveStats d={c.quantumDrive} />;
    if (c.cooler)       return <CoolerStats       d={c.cooler} />;
    if (c.shipWeapon)   return <ShipWeaponStats   d={c.shipWeapon} />;
    if (c.missile)      return <MissileStats      d={c.missile} />;
    if (c.missileRack)  return <MissileRackStats  d={c.missileRack} />;
    return null;
  })();

  const name = c.name ?? c.internalName;
  const gl   = gradeLabel(c.grade);

  return (
    <div className={`rounded-lg border-2 ${s.border} bg-card overflow-hidden`}>

      {/* En-tête WoW : nom + type */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <s.Icon className={`h-4 w-4 shrink-0 mt-0.5 ${s.iconColor}`} />
            <p className={`text-base font-bold leading-tight ${s.nameColor}`}>{name}</p>
          </div>
          {(c.health != null || gl !== "?") && (
            <div className="shrink-0 text-right">
              {c.health != null && (
                <p className="text-xs font-bold text-foreground tabular-nums">
                  {c.health.toLocaleString()} HP
                </p>
              )}
              {gl !== "?" && (
                <p className={`text-xs font-semibold ${s.iconColor}`}>Grade {gl}</p>
              )}
            </div>
          )}
        </div>
        <div className="-mt-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
          <span>{componentTypeLabel(c.type)}</span>
          {c.size != null && (
            <>
              <span className="opacity-40">·</span>
              <span>Taille {c.size}</span>
            </>
          )}
        </div>
      </div>

      {/* Séparateur WoW */}
      <div className={`h-px mx-1 bg-gradient-to-r from-transparent ${s.gradientFrom} via-30% to-transparent opacity-60`} />

      <div className="px-4 py-3">
        {statsContent ?? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucune spécification disponible pour ce type.
          </p>
        )}

        {/* Description */}
        {c.description && (
          <div className="mt-4 rounded-md border border-border/30 bg-background/20 px-4 py-3">
            <p className="text-[11px] italic leading-relaxed text-muted-foreground/80">
              {c.description.replace(/\\n|\n/g, " ")}
            </p>
          </div>
        )}

        {/* Version */}
        {c.version && (
          <p className="mt-3 text-[10px] text-muted-foreground/40 text-right font-mono">
            v{c.version.label}
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Bouton partage ───────────────────────────────────────────────────────────

const ShareButton = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary/20 hover:border-primary/60 active:scale-[0.98]"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-400" />
          <span className="text-green-400">Lien copié !</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          <span>Partager cet item</span>
        </>
      )}
    </button>
  );
};

// ─── Info générale (droite) ───────────────────────────────────────────────────

const InfoRow = ({
  icon: Icon, label, value,
}: { icon: React.ElementType; label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4 py-2.5 border-b border-border/40 last:border-0">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="text-xs">{label}</span>
    </div>
    <span className="text-sm font-semibold text-foreground shrink-0 text-right max-w-[60%] truncate">
      {value}
    </span>
  </div>
);

const GRADE_LABEL: Record<string, string> = {
  A: "Grade A — Optimal",
  B: "Grade B — Supérieur",
  C: "Grade C — Standard",
  D: "Grade D — Basique",
};

// ─── Placeholder shops ────────────────────────────────────────────────────────

const MOCK_SHOPS = [
  { id: 1, name: "Cousin Crow's Custom Craft", location: "Port Olisar — Crusader", price: 12500 },
  { id: 2, name: "Omega Pro",                  location: "Area18 — ArcCorp",        price: 13200 },
  { id: 3, name: "Live Fire Weapons",          location: "New Babbage — microTech", price: 11800 },
  { id: 4, name: "Skutters",                   location: "GrimHEX — Yela",          price: 10950 },
];

const MOCK_SHIPS = [
  { id: 1, name: "Aegis Avenger Titan",   role: "Starter / Cargo",    manufacturer: "Aegis" },
  { id: 2, name: "Anvil Arrow",           role: "Chasseur léger",     manufacturer: "Anvil" },
  { id: 3, name: "RSI Constellation Andromeda", role: "Multi-rôle",   manufacturer: "RSI"   },
  { id: 4, name: "Drake Cutlass Black",   role: "Multi-rôle",         manufacturer: "Drake" },
  { id: 5, name: "Aegis Gladius",         role: "Chasseur",           manufacturer: "Aegis" },
];

const EquippedShipsSection = () => (
  <div className="rounded-xl border border-border/50 bg-card/60 overflow-hidden">
    <div className="flex items-center gap-2 border-b border-border/40 px-5 py-3.5">
      <Cpu className="h-4 w-4 text-primary" />
      <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Vaisseaux équipés
      </h2>
      <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
        {MOCK_SHIPS.length} vaisseaux
      </span>
    </div>
    <div className="divide-y divide-border/40">
      {MOCK_SHIPS.map((ship) => (
        <div key={ship.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/10 transition-colors">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-secondary shrink-0">
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{ship.name}</p>
            <p className="text-[11px] text-muted-foreground truncate">{ship.role}</p>
          </div>
          <span className="text-[11px] text-muted-foreground/60 shrink-0">{ship.manufacturer}</span>
        </div>
      ))}
    </div>
  </div>
);

const ShopsSection = () => (
  <div className="rounded-xl border border-border/50 bg-card/60 overflow-hidden">
    <div className="flex items-center gap-2 border-b border-border/40 px-5 py-3.5">
      <ShoppingBag className="h-4 w-4 text-primary" />
      <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Où acheter
      </h2>
      <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
        {MOCK_SHOPS.length} boutiques
      </span>
    </div>
    <div className="divide-y divide-border/40">
      {MOCK_SHOPS.map((shop) => (
        <div key={shop.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/10 transition-colors">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-secondary shrink-0">
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{shop.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 text-muted-foreground/60" />
              <p className="text-[11px] text-muted-foreground truncate">{shop.location}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 justify-end">
              <CircleDollarSign className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-sm font-bold text-amber-400 tabular-nums">
                {shop.price.toLocaleString("fr-FR")}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">aUEC</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-5 w-32 rounded bg-muted/40" />
    <div className="h-24 rounded-xl bg-muted/20" />
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <div className="h-64 rounded-xl bg-muted/20" />
        <div className="h-32 rounded-xl bg-muted/20" />
      </div>
      <div className="space-y-4">
        <div className="h-48 rounded-xl bg-muted/20" />
        <div className="h-48 rounded-xl bg-muted/20" />
      </div>
    </div>
  </div>
);

// ─── Page principale ──────────────────────────────────────────────────────────

const ComponentDetail = () => {
  const { id }      = useParams<{ id: string }>();
  const { i18n }    = useTranslation();
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

  if (loading) return <div className="container py-8"><Skeleton /></div>;

  if (error || !component) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground/30" />
        <h1 className="font-display text-2xl font-bold">Composant introuvable</h1>
        <Link to="/components" className="mt-4 text-sm text-primary hover:underline">← Retour</Link>
      </div>
    );
  }

  const s    = typeStyle(component.type);
  const { Icon } = s;
  const gl   = gradeLabel(component.grade);
  const gs   = GRADE_STYLE[gl] ?? GRADE_STYLE["D"];
  const name = component.name ?? component.internalName;

  return (
    <div className="min-h-screen bg-background">

      <PageHeader
        breadcrumb={[
          { label: "Composants", href: "/components", icon: Cpu },
          { label: componentTypeLabel(component.type), href: `/components?type=${component.type}` },
          { label: name },
        ]}
        title={name}
        label={componentTypeLabel(component.type)}
        labelIcon={Icon}
        subtitle={[
          component.manufacturer,
          component.subType?.toLowerCase() !== "undefined" ? component.subType : null,
        ].filter(Boolean).join(" · ") || undefined}
      />

      <div className="container pb-8">

        {/* ── Corps : tooltip col-3 / reste col-9 ────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-12">

          {/* Infobulle — col-3 */}
          <div className="lg:col-span-3">
            <WoWTooltip c={component} />
          </div>

          {/* Contenu principal — col-9 */}
          <div className="lg:col-span-9 grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* Shops + Vaisseaux équipés */}
          <div className="space-y-6 self-start">
            <ShopsSection />
            <EquippedShipsSection />
          </div>

          {/* Caractéristiques générales */}
          <div className="space-y-5 self-start">

            {/* Photo */}
            <div className="rounded-xl border border-border/50 bg-card overflow-hidden aspect-video flex items-center justify-center relative">
              {/* image future : <img src={component.imageUrl} className="w-full h-full object-contain" /> */}
              {/* Fond quadrillage */}
              <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
              {/* Coins viseur */}
              <div className={`absolute top-4 left-4 h-6 w-6 border-t-2 border-l-2 ${s.border} rounded-tl`} />
              <div className={`absolute top-4 right-4 h-6 w-6 border-t-2 border-r-2 ${s.border} rounded-tr`} />
              <div className={`absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 ${s.border} rounded-bl`} />
              <div className={`absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 ${s.border} rounded-br`} />
              {/* Contenu centré */}
              <div className="relative flex flex-col items-center gap-2">
                <Icon className={`h-8 w-8 ${s.iconColor} opacity-30`} />
                <span className={`text-[10px] font-semibold uppercase tracking-widest ${s.iconColor} opacity-40`}>
                  Pas d'image disponible
                </span>
              </div>
            </div>

            {/* Bouton partage */}
            <ShareButton />

            {/* Caractéristiques générales */}
            <div className="rounded-xl border border-border/50 bg-card/60 overflow-hidden">
              <div className="border-b border-border/40 px-5 py-3">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Caractéristiques
                </h2>
              </div>
              <div className="px-5 py-1">
                {component.manufacturer && (
                  <InfoRow icon={Tag}    label="Fabricant"  value={<span className="text-primary">{component.manufacturer}</span>} />
                )}
                {component.subType && component.subType.toLowerCase() !== "undefined" && (
                  <InfoRow icon={Tag}    label="Sous-type"  value={component.subType} />
                )}
                {component.version && (
                  <InfoRow icon={Layers} label="Version"    value={component.version.label} />
                )}
              </div>
            </div>

            {/* Réf interne */}
            <div className="rounded-lg border border-border/30 bg-card/20 px-4 py-2.5 text-[11px] text-muted-foreground/50 font-mono break-all">
              {component.internalName}
              {component.ref && <><br />{component.ref}</>}
            </div>
          </div>

          </div>{/* fin col-9 */}
        </div>{/* fin grid-cols-12 */}
      </div>
    </div>
  );
};

export default ComponentDetail;
