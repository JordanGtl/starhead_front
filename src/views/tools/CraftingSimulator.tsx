'use client';
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  FlaskConical, Search, Plus, Minus, Trash2, ChevronDown, ChevronRight,
  Clock, Package, ShoppingCart, CheckCircle2, Circle, RotateCcw,
  Loader2, AlertCircle, X, ArrowLeft, Award, Box, Check, Pencil, Save,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useVersion } from "@/contexts/VersionContext";
import { useAuth } from "@/contexts/AuthContext";
import { Tag } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useSEO } from "@/hooks/useSEO";
import PageHeader from "@/components/PageHeader";
import { useCraftingInventory } from "@/hooks/useCraftingInventory";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiBlueprintSummary {
  id:                 number;
  ref:                string;
  dataId:             number;
  internalName:       string | null;
  blueprintType:      string | null;
  outputName:         string | null;
  outputType:         string | null;
  outputSubType:      string | null;
  outputManufacturer: string | null;
  craftTimeSec:       number | null;
  version:            { id: number; label: string } | null;
}

interface Ingredient {
  ref:          string;
  itemId:       number | null;
  name:         string | null;
  internalName: string | null;
  type:         string | null;
  quantity:     number | null;
  unit:         string | null;
  minQuality:   number | null;
  tier:         number;
  isMandatory:  boolean;
}

interface PropertyModifier {
  propertyRef:          string;
  propertyName:         string | null;
  propertyUnit:         string | null;
  propertyInternal:     string | null;
  qualityMin:           number;
  qualityMax:           number;
  modifierAtMinQuality: number;
  modifierAtMaxQuality: number;
}

interface SlotOption {
  ref:      string;
  name:     string | null;
  quantity: number | null;
  unit:     string | null;
}

interface CraftingSlot {
  key:               string;
  label:             string;
  chooseCount:       number;
  options:           SlotOption[];
  propertyModifiers: PropertyModifier[];
}

interface CostNode {
  type:               "select" | "resource" | "item" | "ref";
  slot?:              string | null;
  debugName?:         string | null;
  chooseCount?:       number | null;
  options?:           CostNode[] | null;
  propertyModifiers?: PropertyModifier[] | null;
  ref?:               string | null;
  name?:              string | null;
  quantity?:          number | null;
  unit?:              string | null;
}

interface SimTier {
  tier:          number;
  mandatoryCost: CostNode | null;
  optionalCosts: CostNode[] | null;
}

interface ApiMission {
  id:           number;
  ref:          string;
  title:        string | null;
  type:         string | null;
  source:       string | null;
  missionGiver: string | null;
  difficulty:   number | null;
  lawful:       boolean;
  reward:       { amount: number; max: number | null; currency: string | null } | null;
}

interface ApiBlueprintDetail extends ApiBlueprintSummary {
  ingredients: Ingredient[];
  tiers:       SimTier[] | null;
  rewardPools: string[] | null;
  missions:    ApiMission[] | null;
}

interface SlotQuality {
  slotKey:     string;
  slotLabel:   string;
  optionName:  string | null;
  quality:     number;
  modifiers:   { name: string | null; mod: number }[];
}

interface QueueEntry {
  id:            number;
  dataId:        number;
  blueprintId:   number;
  name:          string;
  craftTimeSec:  number | null;
  outputType:    string | null;
  ingredients:   Ingredient[];
  quantity:      number;
  slots:         CraftingSlot[];
  qualities:     Record<string, number>;
  selOpt:        Record<string, number>;
  slotQualities: SlotQuality[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert a SavedIngredient (from API) to the local Ingredient shape used by computeTotals */
function savedIngToIngredient(ing: { name: string; quantity: number; unit: string | null }): Ingredient {
  return {
    ref:          ing.name,
    itemId:       null,
    name:         ing.name,
    internalName: null,
    type:         null,
    quantity:     ing.quantity,
    unit:         ing.unit,
    minQuality:   null,
    tier:         1,
    isMandatory:  true,
  };
}

function fmtTime(sec: number | null): string {
  if (!sec) return "—";
  if (sec < 60)   return `${sec}s`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m`;
  return `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;
}

function displayName(bp: ApiBlueprintSummary): string {
  return bp.outputName ?? bp.internalName ?? bp.ref;
}

function formatPoolName(pool: string): string {
  return pool
    .replace(/^BP_MISSIONREWARD_/i, "")
    .replace(/_\d+$/, "")
    .split("_")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function computeTotals(queue: QueueEntry[]): Map<string, { ing: Ingredient; qty: number }> {
  const map = new Map<string, { ing: Ingredient; qty: number }>();
  for (const qi of queue) {
    for (const ing of qi.ingredients) {
      const qty = (ing.quantity ?? 1) * qi.quantity;
      const e = map.get(ing.ref);
      if (e) e.qty += qty; else map.set(ing.ref, { ing, qty });
    }
  }
  return map;
}

function totalCraftTime(queue: QueueEntry[]): number {
  return queue.reduce((acc, qi) => acc + (qi.craftTimeSec ?? 0) * qi.quantity, 0);
}

// ─── Quality helpers ──────────────────────────────────────────────────────────

function extractSlots(node: CostNode | null, acc: CraftingSlot[], path = ""): void {
  if (!node) return;
  if (node.type === "select") {
    const label = node.slot ?? node.debugName ?? "Slot";
    const key   = `${path}/${label}`;
    if (node.propertyModifiers?.length) {
      const options: SlotOption[] = (node.options ?? [])
        .filter(o => o.type === "resource" || o.type === "item")
        .map(o => ({ ref: o.ref ?? "", name: o.name ?? null, quantity: o.quantity ?? null, unit: o.unit ?? null }));
      if (options.length > 0) {
        acc.push({ key, label, chooseCount: node.chooseCount ?? 1, options, propertyModifiers: node.propertyModifiers });
      }
    }
    node.options?.forEach((child, i) => extractSlots(child, acc, `${key}[${i}]`));
  }
}

function computeModifier(pm: PropertyModifier, quality: number): number {
  const range = pm.qualityMax - pm.qualityMin;
  if (range === 0) return pm.modifierAtMinQuality;
  const t = Math.max(0, Math.min(1, (quality - pm.qualityMin) / range));
  return pm.modifierAtMinQuality + t * (pm.modifierAtMaxQuality - pm.modifierAtMinQuality);
}

// Properties where lower = better (negative modifier = bonus)
const INVERTED_PROPERTIES = new Set([
  "recoil smoothness", "recoil handling", "recoil kick",
  "douceur du recul",  "gestion du recul", "coup de recul",
]);

function isInverted(name: string | null | undefined): boolean {
  return !!name && INVERTED_PROPERTIES.has(name.toLowerCase());
}

function modColor(m: number, name?: string | null) {
  const inv = isInverted(name);
  const good = inv ? m < 0.995 : m > 1.005;
  const bad  = inv ? m > 1.005 : m < 0.995;
  return good ? "text-emerald-400" : bad ? "text-red-400" : "text-muted-foreground/50";
}
function modLabel(m: number) {
  const p = (m - 1) * 100;
  return Math.abs(p) < 0.1 ? "+0%" : p > 0 ? `+${p.toFixed(1)}%` : `${p.toFixed(1)}%`;
}

const DEFAULT_QUALITY = 500;

const PROPERTY_TRANSLATIONS: Record<string, Record<string, string>> = {
  fr: {
    "recoil smoothness":  "Douceur du recul",
    "recoil handling":    "Gestion du recul",
    "recoil kick":        "Coup de recul",
    "impact force":       "Force d'impact",
  },
  en: {
    "douceur du recul":   "Recoil Smoothness",
    "gestion du recul":   "Recoil Handling",
    "coup de recul":      "Recoil Kick",
    "force d'impact":     "Impact Force",
  },
};

function translateProperty(name: string | null, locale: string): string | null {
  if (!name) return null;
  const lang = locale.split("-")[0];
  return PROPERTY_TRANSLATIONS[lang]?.[name.toLowerCase()] ?? name;
}

// ─── Quality slots panel ──────────────────────────────────────────────────────

const QualityPanel = ({ tiers, qualities, setQualities, selOpt, setSelOpt, locale }: {
  tiers:        SimTier[];
  qualities:    Record<string, number>;
  setQualities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  selOpt:       Record<string, number>;
  setSelOpt:    React.Dispatch<React.SetStateAction<Record<string, number>>>;
  locale:       string;
}) => {
  const { t } = useTranslation();
  const slots = useMemo(() => {
    const acc: CraftingSlot[] = [];
    for (const tier of tiers) {
      extractSlots(tier.mandatoryCost, acc, `t${tier.tier}`);
      for (const opt of tier.optionalCosts ?? []) extractSlots(opt, acc, `t${tier.tier}opt`);
    }
    return acc;
  }, [tiers]);

  if (!slots.length) return (
    <p className="py-8 text-center text-sm italic text-muted-foreground/50">
      {t('tools.crafting.noProps')}
    </p>
  );

  const getQ = (k: string) => qualities[k] ?? DEFAULT_QUALITY;

  const aggregated = useMemo(() => {
    const map = new Map<string, { pm: PropertyModifier; mods: number[] }>();
    for (const slot of slots) {
      for (const pm of slot.propertyModifiers) {
        const id  = pm.propertyInternal ?? pm.propertyRef;
        const mod = computeModifier(pm, getQ(slot.key));
        const e = map.get(id);
        if (e) e.mods.push(mod); else map.set(id, { pm, mods: [mod] });
      }
    }
    return map;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots, qualities]);

  return (
    <div className="space-y-3">
      {/* Summary bar */}
      {aggregated.size > 0 && (
        <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2">
          {[...aggregated.entries()].map(([id, { pm, mods }]) => {
            const avg = mods.reduce((a, b) => a * b, 1);
            return (
              <span key={id} className="inline-flex items-center gap-1 text-xs">
                <span className="text-muted-foreground">{translateProperty(pm.propertyName, locale) ?? id}</span>
                <span className={`font-mono font-bold ${modColor(avg, pm.propertyName)}`}>{modLabel(avg)}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Per-slot cards */}
      <div className="grid gap-3 lg:grid-cols-2">
      {slots.map(slot => {
        const q      = getQ(slot.key);
        const selIdx = selOpt[slot.key] ?? 0;
        const option = slot.options[selIdx] ?? null;
        return (
          <div key={slot.key} className="overflow-hidden rounded-xl border border-border bg-card">
            {/* Header */}
            <div className="flex items-center gap-2.5 border-b border-border/50 bg-secondary/20 px-4 py-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded border border-border bg-card shrink-0">
                <Box className="h-3 w-3 text-primary/60" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">{slot.label}</span>
              {slot.chooseCount > 1 && (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">×{slot.chooseCount}</span>
              )}
            </div>

            <div className="space-y-3 px-4 py-3">
              {/* Resource */}
              {slot.options.length > 1 ? (
                <div className="flex flex-wrap gap-1.5">
                  {slot.options.map((opt, i) => (
                    <button
                      key={opt.ref}
                      onClick={() => setSelOpt(p => ({ ...p, [slot.key]: i }))}
                      className={`rounded border px-2 py-0.5 text-xs font-medium transition-colors ${
                        selIdx === i
                          ? "border-primary/50 bg-primary/10 text-primary"
                          : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {opt.name ?? opt.ref.slice(0, 8)}
                    </button>
                  ))}
                </div>
              ) : option ? (
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-primary">{option.name ?? option.ref.slice(0, 8)}</span>
                  {option.quantity != null && (
                    <span className="text-sm text-muted-foreground">{option.quantity} {option.unit ?? ""}</span>
                  )}
                </div>
              ) : null}

              {/* Slider */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">{t('tools.crafting.quality')}</span>
                  <input
                    type="number" min={0} max={1000} step={50} value={q}
                    onChange={e => setQualities(p => ({ ...p, [slot.key]: Math.max(0, Math.min(1000, Number(e.target.value))) }))}
                    className="w-16 rounded border border-primary/30 bg-primary/5 px-2 py-0.5 text-center font-mono text-xs font-bold text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <input
                  type="range" min={0} max={1000} step={50} value={q}
                  onChange={e => setQualities(p => ({ ...p, [slot.key]: Number(e.target.value) }))}
                  className="w-full accent-primary"
                />
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                {slot.propertyModifiers.map(pm => {
                  const mod = computeModifier(pm, q);
                  return (
                    <span key={pm.propertyRef} className="inline-flex items-center gap-1.5 rounded border border-border bg-secondary/40 px-2 py-0.5 text-xs">
                      <span className="font-medium text-foreground">{translateProperty(pm.propertyName, locale) ?? pm.propertyInternal ?? "—"}</span>
                      <span className={`font-mono font-bold ${modColor(mod, pm.propertyName)}`}>{modLabel(mod)}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};

// ─── Blueprint detail / configurator ─────────────────────────────────────────

type DetailTab = "recipe" | "obtain" | "properties";

const BlueprintConfigurator = ({
  blueprintId, locale, versionId,
  onAdd, onBack,
}: {
  blueprintId: number;
  locale:      string;
  versionId:   number | undefined;
  onAdd:       (detail: ApiBlueprintDetail, qty: number, slots: CraftingSlot[], qualities: Record<string, number>, selOpt: Record<string, number>, slotQualities: SlotQuality[]) => void;
  onBack:      () => void;
}) => {
  const [detail, setDetail]       = useState<ApiBlueprintDetail | null>(null);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState<DetailTab>("recipe");
  const [qty, setQty]             = useState(1);
  const [added, setAdded]         = useState(false);
  const [qualities, setQualities] = useState<Record<string, number>>({});
  const [selOpt, setSelOpt]       = useState<Record<string, number>>({});
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    setDetail(null);
    setTab("recipe");
    setQty(1);
    setAdded(false);
    setQualities({});
    setSelOpt({});
    const qs = new URLSearchParams({ locale });
    if (versionId) qs.set("gameVersion", String(versionId));
    apiFetch<ApiBlueprintDetail>(`/api/blueprints/${blueprintId}?${qs}`)
      .then(setDetail)
      .finally(() => setLoading(false));
  }, [blueprintId, locale, versionId]);

  const extractedSlots = useMemo(() => {
    if (!detail?.tiers) return [];
    const acc: CraftingSlot[] = [];
    for (const tier of detail.tiers) {
      extractSlots(tier.mandatoryCost, acc, `t${tier.tier}`);
      for (const opt of tier.optionalCosts ?? []) extractSlots(opt, acc, `t${tier.tier}opt`);
    }
    return acc;
  }, [detail]);

  const buildSlotQualities = (slots: CraftingSlot[]): SlotQuality[] =>
    slots.map(slot => {
      const q      = qualities[slot.key] ?? DEFAULT_QUALITY;
      const idx    = selOpt[slot.key] ?? 0;
      const option = slot.options[idx] ?? null;
      return {
        slotKey:    slot.key,
        slotLabel:  slot.label,
        optionName: option?.name ?? null,
        quality:    q,
        modifiers:  slot.propertyModifiers.map(pm => ({
          name: translateProperty(pm.propertyName, locale) ?? pm.propertyInternal ?? null,
          mod:  computeModifier(pm, q),
        })),
      };
    });

  const handleAdd = () => {
    if (!detail) return;
    onAdd(detail, qty, extractedSlots, qualities, selOpt, buildSlotQualities(extractedSlots));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );

  if (!detail) return (
    <div className="flex h-64 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
      <AlertCircle className="h-5 w-5" />
      {t('tools.crafting.loadError')}
    </div>
  );

  const tier1 = detail.ingredients.filter(i => i.tier === 1);
  const mandatory = tier1.filter(i => i.isMandatory);
  const optional  = tier1.filter(i => !i.isMandatory);
  const hasTiers  = detail.tiers && detail.tiers.length > 1;

  const tabs: { id: DetailTab; label: string; count?: number }[] = [
    { id: "recipe",     label: t('tools.crafting.tabRecipe'),     count: mandatory.length },
    { id: "obtain",     label: t('tools.crafting.tabObtain'),     count: detail.missions?.length || detail.rewardPools?.length },
    { id: "properties", label: t('tools.crafting.tabProperties') },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Header card */}
      <div className="mb-4">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-gradient-to-br from-primary/10 to-transparent px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {detail.outputType && (
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-primary/70">
                    {detail.outputType}
                    {detail.outputSubType && detail.outputSubType.toLowerCase() !== "undefined"
                      ? ` · ${detail.outputSubType}` : ""}
                    {detail.tiers && detail.tiers.length > 1 && (
                      <span className="ml-1.5 rounded bg-primary/15 px-1.5 py-0.5 font-mono normal-case text-primary">
                        T{detail.tiers.length}
                      </span>
                    )}
                  </p>
                )}
                <h2 className="font-display text-xl font-bold text-foreground leading-tight">
                  {displayName(detail)}
                </h2>
                {detail.outputManufacturer && (
                  <p className="mt-0.5 text-sm text-muted-foreground">{detail.outputManufacturer}</p>
                )}
              </div>
              <div className="shrink-0 flex flex-col items-end gap-2">
                {detail.craftTimeSec && (
                  <div className="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span className="font-mono text-sm font-bold text-primary">{fmtTime(detail.craftTimeSec)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 rounded-lg border border-border bg-card/80">
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <input
                      type="number" min={1} value={qty}
                      onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-10 bg-transparent text-center font-mono text-sm font-bold text-foreground focus:outline-none"
                    />
                    <button
                      onClick={() => setQty(q => q + 1)}
                      className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={handleAdd}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                      added
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {added ? (
                      <><Check className="h-3.5 w-3.5" /> {t('tools.crafting.addedBadge')}</>
                    ) : (
                      <><ShoppingCart className="h-3.5 w-3.5" /> {t('tools.crafting.addToInventory')}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex items-center gap-1 border-b border-border">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold transition-colors -mb-px ${
              tab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
            {t.count != null && t.count > 0 && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                tab === t.id ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {tab === "recipe" && (
          <div className="space-y-4">
            {mandatory.length > 0 ? (
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                  {t('tools.crafting.mandatory')}
                </p>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {mandatory.map(ing => (
                    <div key={ing.ref} className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-foreground">
                          {ing.name ?? ing.internalName ?? ing.ref.slice(0, 8)}
                        </p>
                        {ing.type && <p className="text-[10px] text-muted-foreground/60">{ing.type}</p>}
                      </div>
                      <span className="shrink-0 font-mono text-sm font-bold text-primary">
                        ×{ing.quantity ?? "?"}{ing.unit ? ` ${ing.unit}` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="py-6 text-center text-sm italic text-muted-foreground/50">
                {t('tools.crafting.noIngredients')}
              </p>
            )}

            {optional.length > 0 && (
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                  {t('tools.crafting.optional')}
                </p>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {optional.map(ing => (
                    <div key={ing.ref} className="flex items-center gap-2 rounded-lg border border-dashed border-border/40 bg-secondary/10 px-3 py-2">
                      <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                        {ing.name ?? ing.internalName ?? ing.ref.slice(0, 8)}
                      </p>
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        ×{ing.quantity ?? "?"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasTiers && (
              <p className="text-[11px] text-muted-foreground/50 italic">
                {t('tools.crafting.extraTiers', { count: detail.tiers!.length - 1 })}
              </p>
            )}
          </div>
        )}

        {tab === "obtain" && (() => {
          if (!detail.missions || detail.missions.length === 0) {
            return (
              <div className="flex flex-col items-center py-10 text-center text-muted-foreground">
                <Award className="mb-3 h-8 w-8 opacity-20" />
                <p className="text-sm">{t('tools.crafting.noMissions')}</p>
              </div>
            );
          }

          // Grouper par titre (null → ref comme clé)
          const grouped = new Map<string, ApiMission[]>();
          for (const m of detail.missions) {
            const key = m.title ?? m.ref;
            const group = grouped.get(key);
            if (group) group.push(m); else grouped.set(key, [m]);
          }

          return (
            <div className="space-y-2">
              {[...grouped.entries()].map(([title, group]) => {
                const first = group[0];
                const givers = [...new Set(group.map(m => m.missionGiver).filter(Boolean))];
                const rewards = group.filter(m => m.reward);
                const reward  = rewards[0]?.reward ?? null;
                const count   = group.length;

                return (
                  <div key={title} className="rounded-lg border border-border bg-card overflow-hidden">
                    {/* Header */}
                    <div className="flex items-start gap-3 px-3 py-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 mt-0.5">
                        <Award className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-foreground leading-tight">{title}</p>
                          {count > 1 && (
                            <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                              ×{count}
                            </span>
                          )}
                        </div>
                        {givers.length > 0 && (
                          <p className="mt-0.5 text-[10px] text-muted-foreground">
                            {givers.join(' · ')}
                          </p>
                        )}
                      </div>
                      {/* Reward */}
                      {reward && (
                        <div className="shrink-0 text-right">
                          <p className="text-xs font-bold text-primary font-mono">
                            {reward.amount.toLocaleString()}
                            {reward.max ? `–${reward.max.toLocaleString()}` : ""}
                          </p>
                          <p className="text-[9px] text-muted-foreground">{reward.currency}</p>
                        </div>
                      )}
                    </div>
                    {/* Footer badges */}
                    <div className="flex flex-wrap items-center gap-1.5 border-t border-border/50 bg-secondary/20 px-3 py-1.5">
                      {first.type && (
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                          {first.type}
                        </span>
                      )}
                      {first.source && (
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {first.source}
                        </span>
                      )}
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        first.lawful
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}>
                        {first.lawful ? t('tools.crafting.lawful') : t('tools.crafting.unlawful')}
                      </span>
                      {first.difficulty !== null && first.difficulty >= 0 && (
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono">
                          {t('tools.crafting.difficulty')} {first.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}

        {tab === "properties" && detail.tiers && (
          <QualityPanel
            tiers={detail.tiers}
            qualities={qualities}
            setQualities={setQualities}
            selOpt={selOpt}
            setSelOpt={setSelOpt}
            locale={locale}
          />
        )}
      </div>

    </div>
  );
};

// ─── Cart inline editor ───────────────────────────────────────────────────────

const CartInlineEditor = ({ qi, locale, onSave, onCancel }: {
  qi:       QueueEntry;
  locale:   string;
  onSave:   (qualities: Record<string, number>, selOpt: Record<string, number>, slotQualities: SlotQuality[]) => void;
  onCancel: () => void;
}) => {
  const [qualities, setQualities] = useState<Record<string, number>>(qi.qualities);
  const [selOpt,    setSelOpt]    = useState<Record<string, number>>(qi.selOpt);
  const { t } = useTranslation();

  const buildSQ = (q: Record<string, number>, s: Record<string, number>): SlotQuality[] =>
    qi.slots.map(slot => {
      const quality = q[slot.key] ?? DEFAULT_QUALITY;
      const idx     = s[slot.key] ?? 0;
      const option  = slot.options[idx] ?? null;
      return {
        slotKey:    slot.key,
        slotLabel:  slot.label,
        optionName: option?.name ?? null,
        quality,
        modifiers: slot.propertyModifiers.map(pm => ({
          name: translateProperty(pm.propertyName, locale) ?? pm.propertyInternal ?? null,
          mod:  computeModifier(pm, quality),
        })),
      };
    });

  if (!qi.slots.length) return null;

  return (
    <div className="space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
      {qi.slots.map(slot => {
        const q      = qualities[slot.key] ?? DEFAULT_QUALITY;
        const selIdx = selOpt[slot.key] ?? 0;
        const option = slot.options[selIdx] ?? null;
        return (
          <div key={slot.key} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">{slot.label}</span>
              <span className="font-mono text-xs font-bold text-primary">{q}</span>
            </div>
            {slot.options.length > 1 && (
              <div className="flex flex-wrap gap-1">
                {slot.options.map((opt, i) => (
                  <button key={opt.ref} onClick={() => setSelOpt(p => ({ ...p, [slot.key]: i }))}
                    className={`rounded border px-2 py-0.5 text-[11px] font-medium transition-colors ${
                      selIdx === i
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
                    }`}>
                    {opt.name ?? opt.ref.slice(0, 8)}
                  </button>
                ))}
              </div>
            )}
            {slot.options.length === 1 && option && (
              <p className="text-[11px] font-semibold text-primary">{option.name ?? option.ref.slice(0, 8)}</p>
            )}
            <input type="range" min={0} max={1000} step={50} value={q}
              onChange={e => setQualities(p => ({ ...p, [slot.key]: Number(e.target.value) }))}
              className="w-full accent-primary" />
            <div className="flex flex-wrap gap-1">
              {slot.propertyModifiers.map(pm => {
                const mod = computeModifier(pm, q);
                return (
                  <span key={pm.propertyRef} className="inline-flex items-center gap-1 rounded border border-border bg-secondary/40 px-1.5 py-0.5 text-[10px]">
                    <span className="text-muted-foreground">{translateProperty(pm.propertyName, locale) ?? pm.propertyInternal}</span>
                    <span className={`font-mono font-bold ${modColor(mod, pm.propertyName)}`}>{modLabel(mod)}</span>
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(qualities, selOpt, buildSQ(qualities, selOpt))}
          className="flex-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
          {t('tools.crafting.save')}
        </button>
        <button onClick={onCancel}
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          {t('tools.crafting.cancel')}
        </button>
      </div>
    </div>
  );
};

// ─── Cart sidebar ─────────────────────────────────────────────────────────────

const CartSidebar = ({
  queue, onAdjust, onRemove, onReset, onEdit, onSave, locale,
}: {
  queue:    QueueEntry[];
  onAdjust: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onReset:  () => void;
  onEdit:   (id: number, qualities: Record<string, number>, selOpt: Record<string, number>, slotQualities: SlotQuality[]) => void;
  onSave:   (qi: QueueEntry) => void;
  locale:   string;
}) => {
  const [checked,   setChecked]   = useState<Record<string, boolean>>({});
  const [matOpen,   setMatOpen]   = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [savedIds,  setSavedIds]  = useState<Set<number>>(new Set());
  const { t } = useTranslation();

  const totalsMap = useMemo(() => computeTotals(queue), [queue]);
  const craftTime = useMemo(() => totalCraftTime(queue), [queue]);

  const groupedMaterials = useMemo(() => {
    const g: Record<string, Array<{ ref: string; ing: Ingredient; qty: number }>> = {};
    for (const [ref, { ing, qty }] of totalsMap.entries()) {
      const key = ing.type ?? "Autre";
      if (!g[key]) g[key] = [];
      g[key].push({ ref, ing, qty });
    }
    return g;
  }, [totalsMap]);



  if (!queue.length) return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border/50 py-16 text-center text-muted-foreground">
      <ShoppingCart className="mb-3 h-8 w-8 opacity-20" />
      <p className="text-sm font-medium">{t('tools.crafting.inventoryEmpty')}</p>
      <p className="mt-1 text-xs opacity-60">{t('tools.crafting.addFromCatalog')}</p>
    </div>
  );

  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Materials — above queue */}
      {totalsMap.size > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <button
            onClick={() => setMatOpen(o => !o)}
            className="flex w-full items-center justify-between px-4 py-3 hover:bg-secondary/20 transition-colors"
          >
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Package className="h-4 w-4 text-primary" />
              {t('tools.crafting.materials')}
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-normal text-muted-foreground">
                {checkedCount}/{totalsMap.size}
              </span>
            </p>
            <div className="flex items-center gap-2">
              {Object.keys(checked).length > 0 && (
                <span
                  onClick={e => { e.stopPropagation(); setChecked({}); }}
                  className="text-[11px] text-muted-foreground hover:text-foreground"
                >
                  Reset
                </span>
              )}
              {matOpen
                ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              }
            </div>
          </button>

          {/* Progress bar — always visible */}
          <div className="px-4 pb-3">
            <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-emerald-500/70 transition-all duration-300"
                style={{ width: `${totalsMap.size > 0 ? (checkedCount / totalsMap.size) * 100 : 0}%` }}
              />
            </div>
          </div>

          {matOpen && (
            <div className="border-t border-border/50 divide-y divide-border/50 max-h-[40vh] overflow-y-auto">
              {Object.entries(groupedMaterials).map(([type, items]) => (
                <div key={type} className="px-4 py-3">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">{type}</p>
                  <div className="space-y-1.5">
                    {items.sort((a, b) => b.qty - a.qty).map(({ ref, ing, qty }) => {
                      const isChecked = !!checked[ref];
                      return (
                        <button
                          key={ref}
                          onClick={() => setChecked(p => ({ ...p, [ref]: !p[ref] }))}
                          className={`flex w-full items-center gap-2.5 rounded-md border px-3 py-1.5 text-xs transition-all text-left ${
                            isChecked
                              ? "border-border/30 bg-secondary/20 opacity-50"
                              : "border-border/50 bg-card hover:border-primary/30"
                          }`}
                        >
                          {isChecked
                            ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                            : <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                          }
                          <span className={`flex-1 truncate font-medium ${isChecked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                            {ing.name ?? ing.internalName ?? ref.slice(0, 8)}
                          </span>
                          <span className={`shrink-0 font-mono font-bold tabular-nums ${isChecked ? "text-muted-foreground" : "text-foreground"}`}>
                            ×{qty}{ing.unit ? ` ${ing.unit}` : ""}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Queue list */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ShoppingCart className="h-4 w-4 text-primary" />
            {t('tools.crafting.inventory')} ({queue.length})
          </p>
          <button onClick={onReset} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
            <RotateCcw className="h-3 w-3" /> {t('tools.crafting.clearInventory')}
          </button>
        </div>
        <div className="divide-y divide-border/50">
          {queue.map(qi => {
            const isEditing = editingId === qi.id;
            const agg = new Map<string, { name: string; mods: number[] }>();
            for (const sq of qi.slotQualities) {
              for (const m of sq.modifiers) {
                const key = m.name ?? sq.slotLabel;
                const e = agg.get(key);
                if (e) e.mods.push(m.mod); else agg.set(key, { name: key, mods: [m.mod] });
              }
            }
            return (
              <div key={qi.id} className="px-4 py-3 space-y-2">
                {/* Row */}
                <div className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground">{qi.name}</p>
                    {qi.outputType && <p className="text-[10px] text-muted-foreground/50">{qi.outputType}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button onClick={() => onAdjust(qi.id, -1)}
                      className="flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground hover:text-foreground">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center font-mono text-xs font-bold text-foreground">{qi.quantity}</span>
                    <button onClick={() => onAdjust(qi.id, 1)}
                      className="flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground hover:text-foreground">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  {qi.slots.length > 0 && (
                    <button
                      onClick={() => setEditingId(isEditing ? null : qi.id)}
                      className={`flex h-6 w-6 items-center justify-center rounded border transition-colors ${
                        isEditing
                          ? "border-primary/50 bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onSave(qi);
                      setSavedIds(p => new Set(p).add(qi.id));
                      setTimeout(() => setSavedIds(p => { const n = new Set(p); n.delete(qi.id); return n; }), 2000);
                    }}
                    title={t('tools.crafting.saveToInventory')}
                    className={`flex h-6 w-6 items-center justify-center rounded border transition-colors ${
                      savedIds.has(qi.id)
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                        : "border-border text-muted-foreground hover:border-emerald-500/40 hover:text-emerald-400"
                    }`}
                  >
                    {savedIds.has(qi.id) ? <Check className="h-3 w-3" /> : <Save className="h-3 w-3" />}
                  </button>
                  <button onClick={() => onRemove(qi.id)} className="text-muted-foreground/40 hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Inline property summary */}
                {!isEditing && agg.size > 0 && (
                  <div className="rounded-md border border-border/40 bg-secondary/20 px-2.5 py-2 space-y-1">
                    {[...agg.values()].map(({ name, mods }) => {
                      const avg = mods.reduce((a, b) => a * b, 1);
                      return (
                        <div key={name} className="flex items-center justify-between gap-2 text-[11px]">
                          <span className="text-muted-foreground/70 truncate">{name}</span>
                          <span className={`shrink-0 font-mono font-bold ${modColor(avg, name)}`}>{modLabel(avg)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Inline editor */}
                {isEditing && (
                  <CartInlineEditor
                    qi={qi}
                    locale={locale}
                    onSave={(qualities, selOpt, slotQualities) => {
                      onEdit(qi.id, qualities, selOpt, slotQualities);
                      setEditingId(null);
                    }}
                    onCancel={() => setEditingId(null)}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center border-t border-border px-4 py-2.5 bg-secondary/10">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> {fmtTime(craftTime)}
          </span>
        </div>
      </div>

    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const CraftingSimulator = () => {
  const { t, i18n }                      = useTranslation();
  const { selectedVersion }              = useVersion();
  const { isAuthenticated }              = useAuth();
  const { save: saveToInventory, crafts: savedCrafts, loaded: inventoryLoaded } = useCraftingInventory();

  useSEO({
    title: t('tools.crafting.seoTitle'),
    description: t('tools.crafting.seoDesc'),
    path: "/tools/crafting",
  });

  // ── Catalog state ──
  const [query, setQuery]         = useState("");
  const [results, setResults]     = useState<ApiBlueprintSummary[]>([]);
  const [searching, setSearching] = useState(false);
  const [openTypes, setOpenTypes] = useState<Record<string, boolean>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── View state: "list" | "detail" ──
  const [view, setView]       = useState<"list" | "detail">("list");
  const [selectedId, setSelectedId] = useState<number | null>(null); // Blueprint.id

  // ── Queue ──
  const [queue, setQueue] = useState<QueueEntry[]>([]);

  // ── Fetch blueprints ──
  const fetchBlueprints = useCallback(async (q: string) => {
    if (!selectedVersion) return;
    setSearching(true);
    try {
      const qs = new URLSearchParams({ locale: i18n.language, gameVersion: String(selectedVersion.id), pagesize: "100" });
      if (q) qs.set("q", q);
      const data = await apiFetch<ApiBlueprintSummary[] | { items: ApiBlueprintSummary[] }>(`/api/blueprints?${qs}`);
      setResults(Array.isArray(data) ? data : (data as any).items ?? []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, [selectedVersion, i18n.language]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchBlueprints(query), 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, fetchBlueprints]);

  // ── Group results ──
  const grouped = useMemo(() => {
    const g: Record<string, ApiBlueprintSummary[]> = {};
    for (const bp of results) {
      const key = bp.outputType ?? "Autre";
      if (!g[key]) g[key] = [];
      g[key].push(bp);
    }
    return g;
  }, [results]);

  // ── Hydrate queue from API on first load ──
  const inventoryHydratedRef = useRef(false);
  useEffect(() => {
    if (!inventoryLoaded || inventoryHydratedRef.current) return;
    inventoryHydratedRef.current = true;
    if (savedCrafts.length === 0) return;
    const maxId = Math.max(...savedCrafts.map(c => c.id));
    nextIdRef.current = maxId + 1;
    setQueue(savedCrafts.map(c => ({
      id:            c.id,
      dataId:        c.dataId,
      blueprintId:   c.blueprintId,
      name:          c.name,
      craftTimeSec:  c.craftTimeSec,
      outputType:    c.outputType,
      ingredients:   (c.ingredients ?? []).map(savedIngToIngredient),
      quantity:      c.quantity,
      slots:         [],
      qualities:     {},
      selOpt:        {},
      slotQualities: c.slotQualities,
    })));
  }, [inventoryLoaded, savedCrafts]);

  // ── Enrich queue entries that have no ingredients (old saves without ingredient data) ──
  useEffect(() => {
    if (!inventoryLoaded || !selectedVersion) return;
    const toEnrich = queue.filter(qi => qi.ingredients.length === 0 && qi.blueprintId);
    if (!toEnrich.length) return;

    // Deduplicate by blueprintId to avoid duplicate fetches
    const unique = [...new Map(toEnrich.map(qi => [qi.blueprintId, qi])).values()];

    Promise.allSettled(unique.map(async qi => {
      const qs = new URLSearchParams({ locale: i18n.language, gameVersion: String(selectedVersion.id) });
      const detail = await apiFetch<ApiBlueprintDetail>(`/api/blueprints/${qi.blueprintId}?${qs}`);
      return {
        blueprintId: qi.blueprintId,
        ingredients: detail.ingredients.filter(i => i.tier === 1 && i.isMandatory),
      };
    })).then(results => {
      const byBpId = new Map<number, Ingredient[]>();
      for (const r of results) {
        if (r.status === 'fulfilled' && r.value.ingredients.length > 0) {
          byBpId.set(r.value.blueprintId, r.value.ingredients);
        }
      }
      if (byBpId.size > 0) {
        setQueue(prev => prev.map(qi =>
          qi.ingredients.length === 0 && byBpId.has(qi.blueprintId)
            ? { ...qi, ingredients: byBpId.get(qi.blueprintId)! }
            : qi
        ));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventoryLoaded, selectedVersion?.id]);

  // ── Queue helpers ──
  const nextIdRef = useRef(0);
  const addToQueue = useCallback((
    detail: ApiBlueprintDetail, qty: number,
    slots: CraftingSlot[], qualities: Record<string, number>, selOpt: Record<string, number>,
    slotQualities: SlotQuality[],
  ) => {
    const mandatory1 = detail.ingredients.filter(i => i.tier === 1 && i.isMandatory);
    setQueue(prev => [...prev, {
      id:            nextIdRef.current++,
      dataId:        detail.dataId,
      blueprintId:   detail.id,
      name:          displayName(detail),
      craftTimeSec:  detail.craftTimeSec,
      outputType:    detail.outputType,
      ingredients:   mandatory1,
      quantity:      qty,
      slots,
      qualities,
      selOpt,
      slotQualities,
    }]);
  }, []);

  const selectBlueprint = (id: number) => {
    setSelectedId(id);
    setView("detail");
  };

  return (
    <div className="relative min-h-screen bg-background">
      <PageHeader
        breadcrumb={[
          { label: t('tools.hub.overline'), href: "/tools", icon: FlaskConical },
          { label: t('tools.crafting.seoTitle') },
        ]}
        title={t('tools.crafting.seoTitle')}
        label={t('tools.hub.overline')}
        labelIcon={FlaskConical}
        subtitle={t('tools.crafting.seoDesc')}
        bgImage="/images/crafting-bg.webp"
        actions={isAuthenticated && selectedVersion ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card/80 px-2.5 py-1 font-mono text-xs backdrop-blur-sm">
            <Tag className="h-3 w-3 text-primary/70" />
            <span className="font-semibold text-foreground">{selectedVersion.label}</span>
            <span className={`rounded-sm px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
              selectedVersion.isLive
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-amber-500/20 text-amber-400"
            }`}>
              {selectedVersion.isLive ? "LIVE" : "PTU"}
            </span>
          </span>
        ) : undefined}
      />

      {/* Back button (detail view only) */}
      {view === "detail" && (
        <div className="sticky top-[calc(4rem+2rem)] z-30 border-b border-border/40 bg-background/80 backdrop-blur-sm">
          <div className="container py-2">
            <button
              onClick={() => setView("list")}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t('tools.crafting.backToList')}
            </button>
          </div>
        </div>
      )}

      {/* Two-column layout */}
      <div className="container pb-12 pt-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* ── Col 1: Catalog (list) or Configurator (detail) ── */}
          <div>
            {view === "list" ? (
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text" value={query} onChange={e => setQuery(e.target.value)}
                    placeholder={t('tools.crafting.searchPlaceholder')}
                    className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {searching ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : Object.keys(grouped).length === 0 ? (
                  <div className="flex flex-col items-center py-16 text-center text-muted-foreground">
                    <FlaskConical className="mb-3 h-10 w-10 opacity-20" />
                    <p className="text-sm">{selectedVersion ? t('tools.crafting.noResults') : t('tools.crafting.selectVersion')}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(grouped).map(([type, bps]) => {
                      const open = openTypes[type] !== false;
                      return (
                        <div key={type} className="overflow-hidden rounded-xl border border-border bg-card">
                          <button
                            onClick={() => setOpenTypes(p => ({ ...p, [type]: !open }))}
                            className="flex w-full items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-secondary/20 transition-colors"
                          >
                            <span>{type}</span>
                            <span className="flex items-center gap-2">
                              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-normal normal-case text-muted-foreground">{bps.length}</span>
                              {open ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                            </span>
                          </button>
                          {open && (
                            <div className="border-t border-border/50 divide-y divide-border/30">
                              {bps.map(bp => (
                                <button
                                  key={bp.dataId}
                                  onClick={() => selectBlueprint(bp.id)}
                                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/20 group"
                                >
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                      {displayName(bp)}
                                    </p>
                                    {bp.outputManufacturer && (
                                      <p className="text-[10px] text-muted-foreground/50">{bp.outputManufacturer}</p>
                                    )}
                                  </div>
                                  <div className="flex shrink-0 items-center gap-2">
                                    {bp.craftTimeSec && (
                                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                        <Clock className="h-3 w-3" />{fmtTime(bp.craftTimeSec)}
                                      </span>
                                    )}
                                    {queue.some(q => q.blueprintId === bp.id) && (
                                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                        {t('tools.crafting.addedBadge')}
                                      </span>
                                    )}
                                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              selectedId && selectedVersion && (
                <>
                  <BlueprintConfigurator
                    blueprintId={selectedId}
                    locale={i18n.language}
                    versionId={selectedVersion.id}
                    onAdd={(detail, qty, slots, qualities, selOpt, sq) => {
                      addToQueue(detail, qty, slots, qualities, selOpt, sq);
                      const ingredients = detail.ingredients
                        .filter(i => i.tier === 1 && i.isMandatory)
                        .map(i => ({
                          name:     i.name ?? i.internalName ?? i.ref,
                          quantity: i.quantity ?? 1,
                          unit:     i.unit,
                        }));
                      saveToInventory({
                        dataId:        detail.dataId,
                        blueprintId:   detail.id,
                        name:          displayName(detail),
                        craftTimeSec:  detail.craftTimeSec,
                        outputType:    detail.outputType,
                        quantity:      qty,
                        slotQualities: sq,
                        ingredients,
                      });
                    }}
                    onBack={() => setView("list")}
                  />
                </>
              )
            )}
          </div>

          {/* ── Col 2: Cart ── */}
          <div>
            <CartSidebar
              queue={queue}
              onAdjust={(id, delta) =>
                setQueue(prev => prev.map(qi =>
                  qi.id !== id ? qi
                    : qi.quantity + delta < 1 ? qi
                    : { ...qi, quantity: qi.quantity + delta }
                ))
              }
              onRemove={id => setQueue(prev => prev.filter(q => q.id !== id))}
              onReset={() => setQueue([])}
              onEdit={(id, qualities, selOpt, slotQualities) =>
                setQueue(prev => prev.map(q => q.id !== id ? q : { ...q, qualities, selOpt, slotQualities }))
              }
              onSave={qi => saveToInventory({
                dataId:        qi.dataId,
                blueprintId:   qi.blueprintId,
                name:          qi.name,
                craftTimeSec:  qi.craftTimeSec,
                outputType:    qi.outputType,
                quantity:      qi.quantity,
                slotQualities: qi.slotQualities,
              })}
              locale={i18n.language}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CraftingSimulator;
