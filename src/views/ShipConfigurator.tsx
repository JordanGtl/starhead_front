'use client';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Rocket, Search, Loader2, ArrowLeft, RotateCcw, Share2, Check,
  Shield, Zap, Thermometer, Gauge, Crosshair, Fuel, Radio, Target,
  ChevronDown, X, Heart, Wrench, SlidersHorizontal, ExternalLink,
  BookmarkPlus, Bookmark, Trash2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useShipLoadouts } from '@/hooks/useShipLoadouts';
import { useTranslation } from 'react-i18next';
import { useVersion } from '@/contexts/VersionContext';
import { apiFetch, API_URL } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { componentTypeLabel } from '@/data/components';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SlotStats {
  health:        number | null;
  powerOutput:   number | null;
  powerDraw:     number | null;
  shieldHealth:  number | null;
  shieldRegen:   number | null;
  qdSpeed:       number | null;
  qdSpoolUp:     number | null;
  weaponDps:     number | null;
  emSignature:   number | null;
  irSignature:   number | null;
  powerSegment:  number | null; // segments consommés en Online (4.7+)
}

interface ConfigSlot {
  port:         string;
  type:         string;
  subType:      string | null;
  size:         number | null;
  itemId:       number | null;
  itemName:     string | null;
  manufacturer: string | null;
  stats:        SlotStats | null;
  isModified:   boolean;
}

interface ShipSummary {
  id:           number;
  name:         string;
  manufacturer: string | null;
  role:         string | null;
  size:         string | null;
}

interface ShipDetail {
  id:           number;
  name:         string;
  manufacturer: string | null;
  role:         string | null;
  size:         string | null;
  image:        string | null;
  crossSection: number | null;
  loadout: Array<{
    port:         string;
    itemId:       number | null;
    name:         string | null;
    type:         string | null;
    subType:      string | null;
    size:         number | null;
    manufacturer: string | null;
    stats:        SlotStats | null;
  }>;
}

interface PickerItem {
  id:              number;
  name:            string | null;
  internalName:    string;
  size:            number | null;
  grade:           number | null;
  manufacturer:    string | null;
  health:          number | null;
  statPowerOutput:  number | null;
  statPowerDraw:    number | null;
  statCoolingRate:  number | null;
  statShieldHealth: number | null;
  statShieldRegen:  number | null;
  statQdSpeed:      number | null;
  statQdSpoolUp:    number | null;
}

interface ItemDetail {
  id:           number;
  name:         string | null;
  health:       number | null;
  powerPlant?:  { powerOutput: number | null; emSignature: number | null } | null;
  cooler?:      { powerDraw: number | null; coolingRate: number | null; emSignature: number | null; irSignature: number | null } | null;
  shield?:      { maxShieldHealth: number | null; maxShieldRegen: number | null; powerSegment: number | null } | null;
  quantumDrive?:{ driveSpeed: number | null; spoolUpTime: number | null; emSignature: number | null; powerSegment: number | null } | null;
  shipWeapon?:  { ammoDamage: any[] | null; fireModes: any[] | null; emSignature: number | null; powerDraw: number | null } | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_ICON: Record<string, React.ElementType> = {
  Shield: Shield, PowerPlant: Zap, Cooler: Thermometer, QuantumDrive: Gauge,
  Radar: Radio, WeaponDefensive: Target, FuelTank: Fuel, QuantumFuelTank: Fuel,
  FuelIntake: Fuel, WeaponGun: Crosshair, MissileLauncher: Crosshair, Turret: Crosshair,
};
const TYPE_COLOR: Record<string, string> = {
  Shield: 'text-blue-400', PowerPlant: 'text-amber-400', Cooler: 'text-cyan-400',
  QuantumDrive: 'text-violet-400', Radar: 'text-emerald-400', WeaponDefensive: 'text-rose-400',
  FuelTank: 'text-orange-400', QuantumFuelTank: 'text-purple-400', FuelIntake: 'text-teal-400',
  WeaponGun: 'text-red-400', MissileLauncher: 'text-red-400', Turret: 'text-red-400',
};
const TYPE_ORDER = [
  'Shield', 'PowerPlant', 'Cooler', 'QuantumDrive', 'FuelTank', 'QuantumFuelTank',
  'FuelIntake', 'Radar', 'WeaponDefensive', 'WeaponGun', 'MissileLauncher', 'Turret', 'Other',
];
const GRADE_LABEL = ['', 'A', 'B', 'C', 'D'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractItemStats(detail: ItemDetail): SlotStats {
  const qd = detail.quantumDrive;
  const w  = detail.shipWeapon;
  let weaponDps: number | null = null;
  if (w?.ammoDamage && w?.fireModes && w.fireModes.length > 0) {
    const dmg = w.ammoDamage.reduce((s: number, d: any) =>
      s + ((d.damage ?? d.value ?? 0) as number), 0);
    const fm = w.fireModes[0];
    const rof = (fm?.fireRate ?? fm?.rpm ?? fm?.rateOfFire ?? 0) / 60;
    if (dmg > 0 && rof > 0) weaponDps = Math.round(dmg * rof * 10) / 10;
  }
  const emSig =
    detail.powerPlant?.emSignature ??
    detail.cooler?.emSignature ??
    detail.quantumDrive?.emSignature ??
    detail.shipWeapon?.emSignature ??
    null;

  const powerSegment =
    detail.shield?.powerSegment ??
    detail.cooler?.powerDraw ??
    detail.quantumDrive?.powerSegment ??
    detail.shipWeapon?.powerDraw ??
    null;

  return {
    health:        detail.health ?? null,
    powerOutput:   detail.powerPlant?.powerOutput ?? null,
    powerDraw:     detail.cooler?.powerDraw ?? null,
    shieldHealth:  detail.shield?.maxShieldHealth ?? null,
    shieldRegen:   detail.shield?.maxShieldRegen ?? null,
    qdSpeed:       qd?.driveSpeed != null ? Math.round(qd.driveSpeed / 10_000) / 100 : null,
    qdSpoolUp:     qd?.spoolUpTime ?? null,
    weaponDps,
    emSignature:   emSig,
    irSignature:   detail.cooler?.irSignature ?? null,
    powerSegment,
  };
}

function encodeConfig(shipId: number, slots: Record<string, ConfigSlot>): string {
  const modified = Object.values(slots).filter(s => s.isModified && s.itemId != null);
  if (!modified.length) return `?ship=${shipId}`;
  const c = modified.map(s => `${encodeURIComponent(s.port)}:${s.itemId}`).join(',');
  return `?ship=${shipId}&c=${c}`;
}

function parseConfig(raw: string): Record<string, number> {
  const result: Record<string, number> = {};
  raw.split(',').forEach(pair => {
    const [port, id] = pair.split(':');
    if (port && id && !isNaN(Number(id))) result[decodeURIComponent(port)] = Number(id);
  });
  return result;
}

// ─── Stats Panel ──────────────────────────────────────────────────────────────

function StatsPanel({ slots }: { slots: Record<string, ConfigSlot> }) {
  const { t } = useTranslation();
  const values = Object.values(slots);
  const sum = (fn: (s: ConfigSlot) => number | null | undefined) =>
    values.reduce<number | null>((acc, s) => {
      const v = fn(s);
      if (v == null) return acc;
      return (acc ?? 0) + v;
    }, null);
  const first = (fn: (s: ConfigSlot) => number | null | undefined) => {
    for (const s of values) { const v = fn(s); if (v != null) return v; }
    return null;
  };

  const powerGen    = sum(s => s.stats?.powerOutput);
  const powerCons   = sum(s => s.stats?.powerDraw);
  const shieldHp    = sum(s => s.stats?.shieldHealth);
  const shieldRegen = sum(s => s.stats?.shieldRegen);
  const qdSpeed     = first(s => s.type === 'QuantumDrive' ? s.stats?.qdSpeed : null);
  const qdSpoolUp   = first(s => s.type === 'QuantumDrive' ? s.stats?.qdSpoolUp : null);
  const weaponDps   = sum(s => ['WeaponGun', 'Turret'].includes(s.type) ? s.stats?.weaponDps : null);
  const modifiedCount = values.filter(s => s.isModified).length;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 bg-secondary/40 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          {t('configurator.stats')}
        </p>
        {modifiedCount > 0 && (
          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
            {modifiedCount} {t('configurator.modified')}
          </span>
        )}
      </div>

      <div className="divide-y divide-border">
        {/* Power */}
        {(powerGen != null || powerCons != null) && (
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-2 text-amber-400">
              <Zap className="h-3.5 w-3.5" />
              <span className="text-[10px] font-semibold uppercase tracking-widest">{t('configurator.energy')}</span>
            </div>
            <div className="space-y-1.5">
              {powerGen != null && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{t('configurator.generated')}</span>
                  <span className="font-mono text-sm font-bold text-emerald-400">{powerGen.toLocaleString()} W</span>
                </div>
              )}
              {powerCons != null && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{t('configurator.consumed')}</span>
                  <span className="font-mono text-sm font-bold text-red-400">{powerCons.toLocaleString()} W</span>
                </div>
              )}
              {powerGen != null && powerCons != null && (
                <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${powerGen >= powerCons ? 'bg-emerald-400' : 'bg-red-400'}`}
                    style={{ width: `${Math.min(100, (powerCons / powerGen) * 100)}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bouclier */}
        {(shieldHp != null || shieldRegen != null) && (
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-2 text-blue-400">
              <Shield className="h-3.5 w-3.5" />
              <span className="text-[10px] font-semibold uppercase tracking-widest">{t('configurator.shield')}</span>
            </div>
            <div className="space-y-1.5">
              {shieldHp != null && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{t('configurator.hitPoints')}</span>
                  <span className="font-mono text-sm font-bold text-foreground">{shieldHp.toLocaleString()}</span>
                </div>
              )}
              {shieldRegen != null && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{t('configurator.regenPerSec')}</span>
                  <span className="font-mono text-sm font-bold text-foreground">{shieldRegen.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quantum Drive */}
        {(qdSpeed != null || qdSpoolUp != null) && (
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-2 text-violet-400">
              <Gauge className="h-3.5 w-3.5" />
              <span className="text-[10px] font-semibold uppercase tracking-widest">Quantum Drive</span>
            </div>
            <div className="space-y-1.5">
              {qdSpeed != null && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{t('configurator.speed')}</span>
                  <span className="font-mono text-sm font-bold text-foreground">{qdSpeed.toFixed(2)} Mm/s</span>
                </div>
              )}
              {qdSpoolUp != null && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Spool-up</span>
                  <span className="font-mono text-sm font-bold text-foreground">{qdSpoolUp}s</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Armement */}
        {weaponDps != null && (
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-2 text-red-400">
              <Crosshair className="h-3.5 w-3.5" />
              <span className="text-[10px] font-semibold uppercase tracking-widest">{t('configurator.weapons')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{t('configurator.dpsTotal')}</span>
              <span className="font-mono text-sm font-bold text-foreground">{weaponDps.toLocaleString()}</span>
            </div>
          </div>
        )}

        {powerGen == null && shieldHp == null && qdSpeed == null && weaponDps == null && (
          <p className="px-4 py-4 text-xs italic text-muted-foreground/40">
            {t('configurator.noStats')}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Energy MFD Panel ────────────────────────────────────────────────────────

/** Format a signature value: > 1 000 → "1.2k", > 1 000 000 → "1.2M" */
function fmtSig(v: number | null): string {
  if (v == null) return '—';
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
  if (v >= 1_000)     return (v / 1_000).toFixed(1) + 'k';
  return v.toFixed(0);
}

// ── power categories ──────────────────────────────────────────────────────────

interface EnergyCat {
  key:   string;
  label: string;
  icon:  React.ElementType;
  color: string;
  types: string[];
}

const ENERGY_CATS: EnergyCat[] = [
  { key: 'weapons',  label: 'WPN',  icon: Crosshair,   color: '#ef4444', types: ['WeaponGun', 'MissileLauncher', 'Turret']    },
  { key: 'shields',  label: 'SHD',  icon: Shield,      color: '#3b82f6', types: ['Shield']                                     },
  { key: 'defense',  label: 'DEF',  icon: Target,      color: '#f97316', types: ['WeaponDefensive']                            },
  { key: 'qd',       label: 'QD',   icon: Gauge,       color: '#a855f7', types: ['QuantumDrive']                               },
  { key: 'engines',  label: 'ENG',  icon: Rocket,      color: '#f59e0b', types: ['FuelTank', 'FuelIntake', 'QuantumFuelTank']  },
  { key: 'sensors',  label: 'SEN',  icon: Radio,       color: '#10b981', types: ['Radar']                                      },
  { key: 'systems',  label: 'SYS',  icon: Heart,       color: '#ec4899', types: ['LifeSupportGenerator']                      },
  { key: 'coolers',  label: 'COOL', icon: Thermometer, color: '#06b6d4', types: ['Cooler']                                     },
];

type EnergyCatKey = 'weapons' | 'shields' | 'defense' | 'qd' | 'engines' | 'sensors' | 'systems' | 'coolers';
type AllocMap     = Record<EnergyCatKey, number>;

const ZERO_ALLOC: AllocMap = {
  weapons: 0, shields: 0, defense: 0, qd: 0, engines: 0, sensors: 0, systems: 0, coolers: 0,
};

interface PowerProfile { output: number; alloc: AllocMap; }

const MAX_ROWS = 10;

function buildInitProfile(maxSeg: number, slotValues: ConfigSlot[]): PowerProfile {
  if (maxSeg === 0) return { output: 0, alloc: { ...ZERO_ALLOC } };

  const alloc = { ...ZERO_ALLOC };

  // Sommer les powerSegment réels par catégorie
  for (const slot of slotValues) {
    const ps = slot.stats?.powerSegment;
    if (ps == null || ps <= 0) continue;
    const cat = ENERGY_CATS.find(c => c.types.includes(slot.type));
    if (cat) alloc[cat.key as EnergyCatKey] += Math.round(ps);
  }

  // Vérifier si on a des données réelles (au moins une catégorie non-zéro)
  const hasRealData = Object.values(alloc).some(v => v > 0);

  if (!hasRealData) {
    // Fallback : distribution uniforme sur les catégories actives
    const active = ENERGY_CATS.filter(c =>
      c.types.length === 0 || slotValues.some(s => c.types.includes(s.type))
    );
    const per = Math.floor(maxSeg / Math.max(1, active.length));
    const rem = maxSeg - per * active.length;
    active.forEach((c, i) => { alloc[c.key as EnergyCatKey] = per + (i < rem ? 1 : 0); });
    return { output: maxSeg, alloc };
  }

  // On conserve les consommations réelles même si total > maxSeg :
  // le consumePct > 100% signalera le dépassement en rouge dans l'UI.

  return { output: maxSeg, alloc };
}

function EnergyMFDPanel({
  slots,
  crossSection,
}: {
  slots:        Record<string, ConfigSlot>;
  crossSection: number | null;
}) {
  const { t } = useTranslation();
  const slotValues = useMemo(() => Object.values(slots), [slots]);

  const maxSegments = useMemo(() =>
    slotValues.reduce<number>((acc, s) =>
      s.type === 'PowerPlant' && s.stats?.powerOutput != null ? acc + s.stats.powerOutput : acc
    , 0),
  [slotValues]);

  const [mode, setMode] = useState<'scm' | 'nav'>('scm');
  const [scm,  setScm]  = useState<PowerProfile>(() => buildInitProfile(maxSegments, slotValues));
  const [nav,  setNav]  = useState<PowerProfile>(() => buildInitProfile(maxSegments, slotValues));
  const prevMax = useRef(maxSegments);

  useEffect(() => {
    if (maxSegments === prevMax.current) return;
    prevMax.current = maxSegments;
    setScm(buildInitProfile(maxSegments, slotValues));
    setNav(buildInitProfile(maxSegments, slotValues));
  }, [maxSegments, slotValues]);

  const profile    = mode === 'scm' ? scm : nav;
  const setProfile = mode === 'scm' ? setScm : setNav;

  const allocTotal = useMemo(
    () => Object.values(profile.alloc).reduce((a, b) => a + b, 0),
    [profile.alloc],
  );
  const consumePct = profile.output > 0
    ? Math.min(999, Math.round((allocTotal / profile.output) * 100))
    : 0;

  // Signatures
  const sumSig = (fn: (s: ConfigSlot) => number | null | undefined): number | null =>
    slotValues.reduce<number | null>((acc, s) => {
      const v = fn(s); return v != null ? (acc ?? 0) + v : acc;
    }, null);
  const totalEM = sumSig(s => s.stats?.emSignature);
  const totalIR = sumSig(s => s.stats?.irSignature);

  // Visual cells
  const rowCount  = maxSegments > 0 ? Math.min(maxSegments, MAX_ROWS) : MAX_ROWS;
  const segPerRow = maxSegments > 0 ? maxSegments / rowCount : 1;

  const setAlloc = (key: EnergyCatKey, targetSeg: number) => {
    const others  = allocTotal - profile.alloc[key];
    const clamped = Math.max(0, Math.min(targetSeg, profile.output - others));
    setProfile(p => ({ ...p, alloc: { ...p.alloc, [key]: clamped } }));
  };

  const setOutput = (val: number) => {
    setProfile(p => {
      if (val >= allocTotal) return { ...p, output: val };
      const factor   = val / allocTotal;
      const newAlloc = Object.fromEntries(
        Object.entries(p.alloc).map(([k, v]) => [k, Math.floor(v * factor)])
      ) as AllocMap;
      return { output: val, alloc: newAlloc };
    });
  };

  if (maxSegments === 0) return null;

  const A = 'rgba(255,160,64,';

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${A}0.20)`, background: 'hsl(var(--card))' }}>

      {/* Header */}
      <div className="px-4 py-2 flex items-center gap-2"
        style={{ background: `${A}0.07)`, borderBottom: `1px solid ${A}0.14)` }}>
        <span className="text-[10px] font-bold" style={{ color: `${A}0.50)` }}>〉</span>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: `${A}0.75)` }}>
          {t('configurator.powerManagement')}
        </p>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${A}0.30), transparent)` }} />
      </div>

      {/* Signatures inline */}
      {(totalIR != null || totalEM != null || crossSection != null) && (
        <div className="flex items-center justify-around px-4 py-2"
          style={{ borderBottom: `1px solid ${A}0.10)` }}>
          {totalIR != null && (
            <div className="flex items-center gap-1">
              <Thermometer className="h-3 w-3 shrink-0" style={{ color: '#ff7b00' }} />
              <span className="font-mono text-[11px] font-bold" style={{ color: '#ff7b00' }}>{fmtSig(totalIR)}</span>
            </div>
          )}
          {totalEM != null && (
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 shrink-0" style={{ color: '#00d8ff' }} />
              <span className="font-mono text-[11px] font-bold" style={{ color: '#00d8ff' }}>{fmtSig(totalEM)}</span>
            </div>
          )}
          {crossSection != null && (
            <div className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 12 12" className="shrink-0">
                <path d="M6 1L11 6L6 11L1 6Z" fill="none" stroke="#a3e635" strokeWidth="1.5"/>
              </svg>
              <span className="font-mono text-[11px] font-bold" style={{ color: '#a3e635' }}>{fmtSig(crossSection)}</span>
            </div>
          )}
        </div>
      )}

      {/* OUTPUT + CONSUMPTION */}
      <div className="px-4 pt-3 pb-2 space-y-2">
        {/* OUTPUT */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 shrink-0 w-24">
            <div className="flex h-5 w-5 items-center justify-center rounded border" style={{ borderColor: `${A}0.40)` }}>
              <Zap className="h-3 w-3" style={{ color: '#ffa040' }} />
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: `${A}0.70)` }}>
              OUTPUT
            </span>
          </div>
          <input
            type="range" min={0} max={maxSegments} step={1}
            value={profile.output}
            onChange={e => setOutput(Number(e.target.value))}
            className="flex-1 cursor-pointer"
            style={{ accentColor: '#ffa040', height: '4px' }}
          />
          <span className="font-mono text-xs font-bold shrink-0 w-14 text-right" style={{ color: '#ffa040' }}>
            {profile.output}
            <span className="text-muted-foreground/50 font-normal"> /{maxSegments}</span>
          </span>
        </div>

        {/* CONSUMPTION */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 shrink-0 w-24">
            <div className="flex h-5 w-5 items-center justify-center rounded border" style={{ borderColor: `${A}0.40)` }}>
              <Thermometer className="h-3 w-3" style={{ color: '#ffa040' }} />
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: `${A}0.70)` }}>
              CONS.
            </span>
          </div>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div className="h-full rounded-full transition-all duration-150"
              style={{
                width: `${Math.min(100, consumePct)}%`,
                background: consumePct > 100 ? '#ef4444' : consumePct > 80 ? '#ffa040' : '#22c55e',
              }}
            />
          </div>
          <span className="font-mono text-xs font-bold shrink-0 w-14 text-right"
            style={{ color: consumePct > 100 ? '#ef4444' : consumePct > 80 ? '#ffa040' : '#22c55e' }}>
            {consumePct}%
          </span>
        </div>
      </div>

      {/* Equalizer */}
      <div className="px-3 pb-1">
        <div className="flex items-end justify-between">
          {ENERGY_CATS.map(cat => {
            const key            = cat.key as EnergyCatKey;
            const allocated      = profile.alloc[key];
            const filledRows     = Math.round((allocated / maxSegments) * rowCount);
            // Budget réel disponible pour cette catégorie = output - ce que les autres consomment
            const remainBudget   = Math.max(0, profile.output - (allocTotal - allocated));
            // Nombre max de cases atteignables (remplies + budget restant)
            const maxReachRows   = Math.min(rowCount, Math.round(((allocated + remainBudget) / maxSegments) * rowCount));
            const hasComp        = cat.types.length === 0 || slotValues.some(s => cat.types.includes(s.type));

            return (
              <div key={cat.key} className="flex flex-col items-center">
                {/* Cells — flex-col-reverse so index 0 = bottom */}
                <div className="flex flex-col-reverse" style={{ gap: '2px' }}>
                  {Array.from({ length: rowCount }).map((_, rowIdx) => {
                    const targetSeg = Math.round((rowIdx + 1) * segPerRow);
                    const prevSeg   = rowIdx > 0 ? Math.round(rowIdx * segPerRow) : 0;
                    const isFilled  = rowIdx < filledRows;
                    // Clic sur une case remplie → descend d'un cran (prevSeg)
                    // Clic sur une case vide → monte à ce niveau (capped par budget dans setAlloc)
                    const isDisabled = !hasComp || (!isFilled && rowIdx >= maxReachRows);
                    return (
                      <button
                        key={rowIdx}
                        title={`${targetSeg} seg`}
                        disabled={isDisabled}
                        onClick={() => setAlloc(key, isFilled ? prevSeg : targetSeg)}
                        style={{
                          width: '18px', height: '6px',
                          borderRadius: '2px',
                          background: isFilled
                            ? cat.color
                            : rowIdx < maxReachRows
                            ? 'rgba(255,255,255,0.10)'
                            : 'rgba(255,255,255,0.04)',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          opacity: hasComp ? 1 : 0.25,
                          transition: 'background 0.1s',
                        }}
                      />
                    );
                  })}
                </div>

                {/* Allocation badge */}
                <div style={{ height: '18px' }} className="flex items-center justify-center mt-0.5">
                  {allocated > 0 && (
                    <span className="text-[9px] font-bold rounded-sm px-1 leading-none py-0.5"
                      style={{ color: cat.color, background: `${cat.color}28` }}>
                      {allocated}
                    </span>
                  )}
                </div>

                {/* Icon */}
                <cat.icon className="h-3.5 w-3.5"
                  style={{ color: hasComp ? `${cat.color}cc` : `${cat.color}33` }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* SCM / NAV toggle */}
      <div className="px-3 py-3 flex gap-2">
        {(['scm', 'nav'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className="flex-1 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all"
            style={mode === m
              ? { background: `${A}0.14)`, border: `1px solid ${A}0.40)`, color: '#ffa040' }
              : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.40)' }
            }>
            {m === 'scm' ? 'SCM MODE' : 'NAV MODE'}
          </button>
        ))}
      </div>
    </div>
  );
}


// ─── Component Picker ─────────────────────────────────────────────────────────

// Retourne la stat principale + son label pour un type donné
function primaryStat(type: string, item: PickerItem, t: (key: string) => string): { value: number | null; label: string; unit: string } {
  switch (type) {
    case 'PowerPlant':   return { value: item.statPowerOutput,  label: t('configurator.statPower'),   unit: 'W' };
    case 'Cooler':       return { value: item.statCoolingRate,  label: t('configurator.statCooling'), unit: 'W' };
    case 'Shield':       return { value: item.statShieldHealth, label: t('configurator.statShield'),  unit: 'HP' };
    case 'QuantumDrive': return { value: item.statQdSpeed != null ? Math.round(item.statQdSpeed / 10_000) / 100 : null, label: t('configurator.statSpeed'), unit: 'Mm/s' };
    default:             return { value: item.health,           label: t('configurator.statHealth'),  unit: 'HP' };
  }
}

function currentStatValue(type: string, currentStats: SlotStats | null): number | null {
  if (!currentStats) return null;
  switch (type) {
    case 'PowerPlant':   return currentStats.powerOutput;
    case 'Cooler':       return currentStats.powerDraw;
    case 'Shield':       return currentStats.shieldHealth;
    case 'QuantumDrive': return currentStats.qdSpeed;
    default:             return currentStats.health;
  }
}

function ComponentPicker({
  slot,
  versionId,
  onSelect,
  onClose,
}: {
  slot: ConfigSlot;
  versionId: number | undefined;
  onSelect: (item: PickerItem) => void;
  onClose: () => void;
}) {
  const [items, setItems]   = useState<PickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const params = new URLSearchParams({
      type:        slot.type,
      purchasable: 'false',
      playerName:  'false',
    });
    if (slot.size != null) params.set('maxSize', String(slot.size));
    if (versionId) params.set('gameVersion', String(versionId));
    apiFetch<PickerItem[]>(`/api/items?${params}`)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [slot.type, slot.size, versionId]);

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter(i =>
      (i.name ?? i.internalName).toLowerCase().includes(q) ||
      (i.manufacturer ?? '').toLowerCase().includes(q)
    );
  }, [items, search]);

  const Icon  = TYPE_ICON[slot.type] ?? Rocket;
  const color = TYPE_COLOR[slot.type] ?? 'text-primary';
  const portLabel = slot.port.replace(/^hardpoint_/, '').replace(/_/g, ' ');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex flex-col w-full max-w-lg sm:rounded-xl border border-border bg-card shadow-2xl max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Icon className={`h-4 w-4 shrink-0 ${color}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{componentTypeLabel(slot.type, t)}</p>
            <p className="text-[11px] text-muted-foreground capitalize">{portLabel}{slot.size != null && ` — ${t('configurator.maxSize')}${slot.size}`}</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative border-b border-border">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('configurator.searchComponent')}
            className="w-full bg-transparent pl-9 pr-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">{t('configurator.noComponent')}</p>
          ) : (
            <div className="divide-y divide-border">
              {/* Option : vider le slot */}
              <button
                onClick={() => onSelect({ id: 0, name: null, internalName: '', size: null, grade: null, manufacturer: null, health: null })}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/30 transition-colors"
              >
                <X className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                <span className="text-sm italic text-muted-foreground/60">{t('configurator.clearSlot')}</span>
              </button>
              {filtered.map(item => {
                const ps      = primaryStat(slot.type, item, t);
                const current = currentStatValue(slot.type, slot.stats);
                const delta   = ps.value != null && current != null ? ps.value - current : null;
                const isActive = slot.itemId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/30 transition-colors ${isActive ? 'bg-primary/5' : ''}`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{item.name ?? item.internalName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.manufacturer && <span>{item.manufacturer}</span>}
                        {ps.value != null && (
                          <span className="ml-1 font-mono">
                            {item.manufacturer && '· '}
                            {ps.label} : <span className="text-foreground">{ps.value.toLocaleString()} {ps.unit}</span>
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {delta != null && Math.abs(delta) > 0.01 && (
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold font-mono ${
                          delta > 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                        }`}>
                          {delta > 0 ? '+' : ''}{delta % 1 === 0 ? delta.toLocaleString() : delta.toFixed(2)} {ps.unit}
                        </span>
                      )}
                      {item.size != null && (
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">S{item.size}</span>
                      )}
                      {item.grade != null && GRADE_LABEL[item.grade] && (
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">{GRADE_LABEL[item.grade]}</span>
                      )}
                      {isActive && <Check className="h-3.5 w-3.5 text-primary" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Slot Card ────────────────────────────────────────────────────────────────

function SlotCard({
  slot,
  onClick,
}: {
  slot: ConfigSlot;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  const Icon  = TYPE_ICON[slot.type] ?? Rocket;
  const color = TYPE_COLOR[slot.type] ?? 'text-primary';
  const portLabel = slot.port.replace(/^hardpoint_/, '').replace(/_/g, ' ');
  const s = slot.stats;

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-md border text-left transition-all hover:border-primary/40 hover:bg-secondary/30 overflow-hidden group ${
        slot.isModified ? 'border-primary/40 bg-primary/5' : 'border-border bg-secondary/20'
      }`}
    >
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <Icon className={`h-4 w-4 shrink-0 ${color}`} />
        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm font-medium ${slot.itemId ? 'text-foreground' : 'text-muted-foreground/50 italic'}`}>
            {slot.itemName ?? t('configurator.empty')}
          </p>
          <p className="text-[10px] text-muted-foreground/60 capitalize">{portLabel}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {slot.size != null && <span className="text-[10px] text-muted-foreground">S{slot.size}</span>}
          {slot.isModified && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
        </div>
      </div>
      {/* Mini stats */}
      {s && (s.powerOutput != null || s.powerDraw != null || s.shieldHealth != null || s.qdSpeed != null) && (
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 border-t border-border/50 bg-secondary/30 px-3 py-1.5">
          {s.powerOutput  != null && <span className="text-[10px] text-amber-400">⚡ {s.powerOutput} W</span>}
          {s.powerDraw    != null && <span className="text-[10px] text-red-400">⚡ -{s.powerDraw} W</span>}
          {s.shieldHealth != null && <span className="text-[10px] text-blue-400">🛡 {s.shieldHealth.toLocaleString()}</span>}
          {s.qdSpeed      != null && <span className="text-[10px] text-violet-400">🚀 {s.qdSpeed} Mm/s</span>}
          {s.health       != null && <span className="text-[10px] text-rose-400">♥ {s.health.toLocaleString()}</span>}
        </div>
      )}
    </button>
  );
}

// ─── Ship Search ──────────────────────────────────────────────────────────────

function ShipSearch({ onSelect }: { onSelect: (ship: ShipSummary) => void }) {
  const [query, setQuery]   = useState('');
  const [results, setResults] = useState<ShipSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const { selectedVersion } = useVersion();
  const { t } = useTranslation();

  useEffect(() => {
    if (!query || query.length < 2) { setResults([]); return; }
    const t = setTimeout(() => {
      setLoading(true);
      const qs = new URLSearchParams({ q: query });
      if (selectedVersion) qs.set('gameVersion', String(selectedVersion.id));
      apiFetch<ShipSummary[]>(`/api/ships?${qs}`)
        .then(setResults)
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query, selectedVersion]);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <div className="relative" style={{ minHeight: '40vh' }}>
        {/* Fond image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/configurator-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.22,
          }}
        />
        {/* Grille décorative */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Gradient bas */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

        {/* Contenu */}
        <div className="relative flex min-h-[40vh] flex-col items-center justify-center px-4 py-16">
          {/* Badge */}
          <div className="mb-5 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
            <span className="font-display text-xs font-semibold uppercase tracking-widest text-primary">{t('configurator.overline')}</span>
          </div>

          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t('configurator.title')}
          </h1>
          <p className="mt-3 max-w-md text-center text-sm text-muted-foreground">
            {t('configurator.subtitle')}
          </p>

          {/* Barre de recherche */}
          <div className="mt-8 w-full max-w-lg">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('configurator.searchPlaceholder')}
                className="h-13 w-full rounded-xl border border-border bg-card/80 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground backdrop-blur focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-lg"
                style={{ height: '3.25rem' }}
              />
              {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
              {results.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-[200] mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                  {results.slice(0, 8).map(ship => (
                    <button
                      key={ship.id}
                      onClick={() => onSelect(ship)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                    >
                      <Rocket className="h-4 w-4 shrink-0 text-primary/60" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{ship.name}</p>
                        <p className="text-[11px] text-muted-foreground">{ship.manufacturer} · {ship.role}</p>
                      </div>
                      {ship.size && <Badge variant="outline" className="text-[10px] shrink-0">{ship.size}</Badge>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Indications sous le hero */}
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Rocket,           color: 'text-primary',    label: t('configurator.feature1Label'), desc: t('configurator.feature1Desc') },
            { icon: SlidersHorizontal, color: 'text-violet-400', label: t('configurator.feature2Label'), desc: t('configurator.feature2Desc') },
            { icon: Share2,           color: 'text-emerald-400', label: t('configurator.feature3Label'), desc: t('configurator.feature3Desc') },
          ].map(({ icon: Icon, color, label, desc }) => (
            <div key={label} className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/60 px-5 py-6 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary">
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="text-[11px] leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const ShipConfigurator = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { selectedVersion } = useVersion();
  const { t } = useTranslation();

  const [ship,         setShip]        = useState<ShipDetail | null>(null);
  const [slots,        setSlots]       = useState<Record<string, ConfigSlot>>({});
  const [defaultSlots, setDefaultSlots] = useState<Record<string, ConfigSlot>>({});
  const [loading,      setLoading]     = useState(false);
  const [pickerSlot,   setPickerSlot]  = useState<ConfigSlot | null>(null);
  const [copied,       setCopied]      = useState(false);
  const [saveModal,    setSaveModal]   = useState(false);
  const [saveName,     setSaveName]    = useState('');
  const [saving,       setSaving]      = useState(false);

  const { isAuthenticated } = useAuth();
  // ship.id = ship_def_id (stable)
  const { loadouts, save: saveLoadout, remove: removeLoadout } = useShipLoadouts(ship?.id ?? null);

  // ── Charger un vaisseau ────────────────────────────────────────────────────

  const loadShip = useCallback(async (shipId: number, configRaw?: string) => {
    setLoading(true);
    try {
      const qs = selectedVersion ? `?gameVersion=${selectedVersion.id}` : '';
      const detail = await apiFetch<ShipDetail>(`/api/ships/${shipId}${qs}`);
      setShip(detail);

      // Construire les slots depuis le loadout
      const initialSlots: Record<string, ConfigSlot> = {};
      for (const entry of detail.loadout) {
        if (!entry.type) continue;
        initialSlots[entry.port] = {
          port:         entry.port,
          type:         entry.type,
          subType:      entry.subType ?? null,
          size:         entry.size,
          itemId:       entry.itemId,
          itemName:     entry.name,
          manufacturer: entry.manufacturer,
          stats:        entry.stats,
          isModified:   false,
        };
      }

      // Appliquer la config depuis l'URL
      if (configRaw) {
        const overrides = parseConfig(configRaw);
        for (const [port, itemId] of Object.entries(overrides)) {
          if (initialSlots[port]) {
            if (itemId === 0) {
              initialSlots[port] = { ...initialSlots[port], itemId: null, itemName: null, manufacturer: null, stats: null, isModified: true };
            } else {
              // Fetch item detail pour les stats
              try {
                const item = await apiFetch<ItemDetail>(`/api/items/${itemId}`);
                initialSlots[port] = {
                  ...initialSlots[port],
                  itemId,
                  itemName: item.name,
                  manufacturer: null,
                  stats: extractItemStats(item),
                  isModified: true,
                };
              } catch {}
            }
          }
        }
      }

      setDefaultSlots(JSON.parse(JSON.stringify(initialSlots)));
      setSlots(initialSlots);
    } finally {
      setLoading(false);
    }
  }, [selectedVersion]);

  // ── Init depuis URL ────────────────────────────────────────────────────────

  useEffect(() => {
    const shipId  = searchParams.get('ship');
    const config  = searchParams.get('c') ?? undefined;
    if (shipId) loadShip(Number(shipId), config);
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sélectionner un composant ──────────────────────────────────────────────

  const handleSelectItem = useCallback(async (item: PickerItem) => {
    if (!pickerSlot) return;
    const port = pickerSlot.port;

    if (item.id === 0) {
      // Vider le slot
      setSlots(prev => ({
        ...prev,
        [port]: { ...prev[port], itemId: null, itemName: null, manufacturer: null, stats: null, isModified: true },
      }));
      setPickerSlot(null);
      return;
    }

    // Optimistic update
    setSlots(prev => ({
      ...prev,
      [port]: { ...prev[port], itemId: item.id, itemName: item.name, manufacturer: item.manufacturer, stats: null, isModified: true },
    }));
    setPickerSlot(null);

    // Fetch les stats complètes
    try {
      const detail = await apiFetch<ItemDetail>(`/api/items/${item.id}`);
      setSlots(prev => ({
        ...prev,
        [port]: { ...prev[port], stats: extractItemStats(detail) },
      }));
    } catch {}
  }, [pickerSlot]);

  // ── Sync URL sur chaque modification ─────────────────────────────────────

  useEffect(() => {
    if (!ship) return;
    const hasModified = Object.values(slots).some(s => s.isModified);
    const newUrl = '/ships/configure' + (hasModified ? encodeConfig(ship.id, slots) : `?ship=${ship.id}`);
    router.replace(newUrl, { scroll: false });
  }, [slots, ship]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Reset ──────────────────────────────────────────────────────────────────

  const handleReset = () => {
    setSlots(JSON.parse(JSON.stringify(defaultSlots)));
  };

  // ── Sauvegarder ──────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!ship || !saveName.trim()) return;
    setSaving(true);
    try {
      const overrides: Record<string, number | null> = {};
      for (const slot of Object.values(slots)) {
        if (slot.isModified) overrides[slot.port] = slot.itemId;
      }
      await saveLoadout(saveName.trim(), overrides, ship.id);
      setSaveModal(false);
      setSaveName('');
    } catch {}
    finally { setSaving(false); }
  };

  const handleLoadConfig = (savedSlots: Record<string, number | null>) => {
    setSlots(prev => {
      const next = { ...prev };
      for (const [port, itemId] of Object.entries(savedSlots)) {
        if (next[port]) {
          next[port] = { ...next[port], itemId, itemName: null, stats: null, isModified: true };
        }
      }
      return next;
    });
  };

  // ── Partager ──────────────────────────────────────────────────────────────

  const handleShare = async () => {
    if (!ship) return;
    const url = window.location.origin + '/ships/configure' + encodeConfig(ship.id, slots);
    if (navigator.share) {
      try { await navigator.share({ title: `Config ${ship.name}`, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ── Grouper les slots par type ────────────────────────────────────────────

  const slotsByType = useMemo(() => {
    const groups: Record<string, ConfigSlot[]> = {};
    for (const slot of Object.values(slots)) {
      const key = slot.type ?? 'Other';
      if (!groups[key]) groups[key] = [];
      groups[key].push(slot);
    }
    return groups;
  }, [slots]);

  const sortedTypes = useMemo(() =>
    Object.keys(slotsByType).sort((a, b) => {
      const ai = TYPE_ORDER.indexOf(a), bi = TYPE_ORDER.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    }),
  [slotsByType]);

  const modifiedCount = useMemo(() => Object.values(slots).filter(s => s.isModified).length, [slots]);

  // ── Render ────────────────────────────────────────────────────────────────

  if (!ship && !loading) {
    return (
      <ShipSearch onSelect={s => {
        router.push(`/ships/configure?ship=${s.id}`);
      }} />
    );
  }

  return (
    <div className="relative min-h-screen bg-background">

      {/* Bande de fond */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[22vh] overflow-hidden">
        <img
          src={ship?.image ? `${API_URL}${ship.image}` : '/hero-bg.jpg'}
          alt="" aria-hidden="true"
          className="h-full w-full object-cover opacity-30"
          style={!ship?.image ? { objectPosition: '50% 30%' } : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex min-h-[18vh] items-end">
        <div className="container pb-4 pt-8">
          <Link href={ship ? `/ships/${ship.id}` : '/ships'} className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {ship ? ship.name : t('configurator.backToShips')}
          </Link>

          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t('configurator.configurator')}</span>
              </div>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">{t('configurator.loading')}</span>
                </div>
              ) : (
                <>
                  <h1 className="font-display text-3xl font-bold text-foreground">{ship?.name}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">{ship?.manufacturer} · {ship?.role}</p>
                </>
              )}
            </div>

            {ship && (
              <div className="flex shrink-0 items-center gap-2">
                {modifiedCount > 0 && (
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('configurator.reset')}</span>
                  </button>
                )}
                {isAuthenticated && (
                  <button
                    onClick={() => { setSaveName(ship.name + ' — config'); setSaveModal(true); }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <BookmarkPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('configurator.save')}</span>
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                >
                  {copied
                    ? <><Check className="h-4 w-4 text-emerald-400" /><span className="hidden sm:inline text-emerald-400">{t('configurator.copied')}</span></>
                    : <><Share2 className="h-4 w-4" /><span className="hidden sm:inline">{t('configurator.share')}</span></>
                  }
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu */}
      {ship && !loading && (
        <div className="relative z-10 container pb-12 pt-2">
          <div className="grid grid-cols-12 gap-6 items-start">

            {/* Slots — col-8 */}
            <div className="col-span-12 lg:col-span-8 rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 bg-secondary/40 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  {t('configurator.equipments')}
                  <span className="ml-2 font-normal text-muted-foreground/40">({Object.keys(slots).length})</span>
                </p>
                {modifiedCount > 0 && (
                  <span className="text-[10px] font-semibold text-primary">
                    {modifiedCount} modification{modifiedCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="p-4 space-y-5">
                {sortedTypes.map(type => {
                  const Icon  = TYPE_ICON[type] ?? Rocket;
                  const color = TYPE_COLOR[type] ?? 'text-primary';
                  return (
                    <div key={type}>
                      <div className="mb-2 flex items-center gap-2">
                        <Icon className={`h-3.5 w-3.5 shrink-0 ${color}`} />
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                          {componentTypeLabel(type, t)}
                        </span>
                        <span className="text-[10px] text-muted-foreground/40">({slotsByType[type].length})</span>
                      </div>
                      <div className="grid gap-1.5 sm:grid-cols-2">
                        {slotsByType[type].map(slot => (
                          <SlotCard
                            key={slot.port}
                            slot={slot}
                            onClick={() => setPickerSlot(slot)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats + actions — col-4 */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <StatsPanel slots={slots} />
              <EnergyMFDPanel slots={slots} crossSection={ship.crossSection ?? null} />

              {/* Configs sauvegardées */}
              {isAuthenticated && loadouts.length > 0 && (
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="px-4 py-3 bg-secondary/40 flex items-center gap-2">
                    <Bookmark className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 flex-1">
                      {t('configurator.savedConfigs')}
                    </p>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{loadouts.length}</span>
                  </div>
                  <div className="divide-y divide-border">
                    {loadouts.map(l => (
                      <div key={l.id} className="flex items-center gap-2 px-4 py-2.5 group">
                        <button
                          onClick={() => handleLoadConfig(l.slots)}
                          className="flex-1 min-w-0 text-left"
                        >
                          <p className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">{l.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {Object.keys(l.slots).length} modification{Object.keys(l.slots).length > 1 ? 's' : ''}
                          </p>
                        </button>
                        <button
                          onClick={() => removeLoadout(l.id)}
                          className="shrink-0 rounded p-1 text-muted-foreground/40 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lien vers la fiche */}
              <Link
                href={`/ships/${ship.id}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                {t('configurator.viewShip')}
              </Link>

              {/* Changer de vaisseau */}
              <button
                onClick={() => { setShip(null); setSlots({}); }}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
              >
                <Rocket className="h-4 w-4" />
                {t('configurator.changeShip')}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modale sauvegarde */}
      {saveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSaveModal(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="mb-4 font-display text-lg font-bold text-foreground">{t('configurator.saveConfig')}</h2>
            <input
              autoFocus
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder={t('configurator.configNamePlaceholder')}
              className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="mt-4 flex gap-2 justify-end">
              <button
                onClick={() => setSaveModal(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('configurator.cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={!saveName.trim() || saving}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookmarkPlus className="h-4 w-4" />}
                {t('configurator.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Component Picker */}
      {pickerSlot && (
        <ComponentPicker
          slot={pickerSlot}
          versionId={selectedVersion?.id}
          onSelect={handleSelectItem}
          onClose={() => setPickerSlot(null)}
        />
      )}
    </div>
  );
};

export default ShipConfigurator;
