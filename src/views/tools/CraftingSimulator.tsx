'use client';
import { useState, useMemo, useCallback } from "react";
import {
  FlaskConical, Search, Plus, Minus, Trash2,
  ChevronDown, ChevronRight, Clock, Package, ShoppingCart,
  CheckCircle2, Circle, RotateCcw,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  BLUEPRINTS, MATERIALS, CATEGORY_LABELS, SUBCATEGORY_LABELS,
  MATERIAL_CATEGORY_LABELS, formatCraftingTime,
  type Blueprint, type BlueprintMaterial,
} from "@/data/crafting";
import { useSEO } from "@/hooks/useSEO";

// ─── Types ────────────────────────────────────────────────────────────────────

interface QueueItem {
  blueprintId: string;
  quantity: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeTotalMaterials(queue: QueueItem[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const qi of queue) {
    const bp = BLUEPRINTS.find(b => b.id === qi.blueprintId);
    if (!bp) continue;
    for (const mat of bp.materials) {
      const needed = Math.ceil((mat.quantity * qi.quantity) / bp.outputQty);
      totals[mat.materialId] = (totals[mat.materialId] ?? 0) + needed;
    }
  }
  return totals;
}

function totalCraftingTime(queue: QueueItem[]): number {
  return queue.reduce((acc, qi) => {
    const bp = BLUEPRINTS.find(b => b.id === qi.blueprintId);
    return acc + (bp ? bp.craftingTimeSec * qi.quantity : 0);
  }, 0);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const GradeBadge = ({ grade }: { grade?: string }) => {
  if (!grade) return null;
  const colors: Record<string, string> = {
    A: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    B: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    C: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    D: "text-muted-foreground bg-secondary border-border",
  };
  return (
    <span className={`rounded border px-1.5 py-0.5 text-[10px] font-bold ${colors[grade] ?? colors.D}`}>
      {grade}
    </span>
  );
};

const MaterialRow = ({
  mat, qty, checked, onToggle,
}: { mat: BlueprintMaterial; qty: number; checked: boolean; onToggle: () => void }) => {
  const material = MATERIALS[mat.materialId];
  if (!material) return null;
  return (
    <button
      onClick={onToggle}
      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-xs transition-all ${
        checked
          ? "border-border/30 bg-secondary/30 opacity-50"
          : "border-border/50 bg-card hover:border-primary/30"
      }`}
    >
      {checked
        ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
        : <Circle className="h-4 w-4 shrink-0 text-muted-foreground/50" />
      }
      <span className={`flex-1 font-medium ${checked ? "line-through text-muted-foreground" : material.color}`}>
        {material.name}
      </span>
      <span className={`font-mono font-bold tabular-nums ${checked ? "text-muted-foreground" : "text-foreground"}`}>
        ×{qty}
      </span>
    </button>
  );
};

// ─── Blueprint Card (in catalog) ─────────────────────────────────────────────

const BlueprintCard = ({
  bp, selected, inQueue, onSelect, onAddToQueue,
}: {
  bp: Blueprint;
  selected: boolean;
  inQueue: boolean;
  onSelect: () => void;
  onAddToQueue: () => void;
}) => {
  const subLabel = SUBCATEGORY_LABELS[bp.subcategory] ?? bp.subcategory;
  return (
    <button
      onClick={onSelect}
      className={`group w-full rounded-lg border p-3 text-left transition-all ${
        selected
          ? "border-primary/60 bg-primary/5 shadow-[0_0_16px_hsl(var(--primary)/0.1)]"
          : "border-border/50 bg-card hover:border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] text-muted-foreground">{subLabel}</p>
          <p className="truncate text-sm font-semibold text-foreground leading-tight">{bp.name}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {bp.grade && <GradeBadge grade={bp.grade} />}
          {bp.size && (
            <span className="rounded border border-border/50 bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
              S{bp.size}
            </span>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />{formatCraftingTime(bp.craftingTimeSec)}
        </span>
        <span className="flex items-center gap-1">
          <Package className="h-3 w-3" />{bp.materials.length} mat.
        </span>
        <button
          onClick={e => { e.stopPropagation(); onAddToQueue(); }}
          className={`ml-auto flex items-center gap-1 rounded px-1.5 py-0.5 font-medium transition-colors ${
            inQueue
              ? "bg-primary/20 text-primary"
              : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary"
          }`}
        >
          <Plus className="h-3 w-3" />
          {inQueue ? "Ajouté" : "File"}
        </button>
      </div>
    </button>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const CraftingSimulator = () => {
  const { t } = useTranslation();
  useSEO({ title: "Simulateur de craft", description: "Simulez vos recettes de fabrication dans Star Citizen.", path: "/tools/crafting" });

  // Catalog state
  const [query, setQuery]         = useState("");
  const [category, setCategory]   = useState<string>("all");
  const [openCats, setOpenCats]   = useState<Record<string, boolean>>({});

  // Selection
  const [selected, setSelected]   = useState<Blueprint | null>(null);

  // Queue
  const [queue, setQueue]         = useState<QueueItem[]>([]);

  // Materials checked (got them)
  const [checked, setChecked]     = useState<Record<string, boolean>>({});

  // ── Catalog filtering ──

  const filtered = useMemo(() => {
    return BLUEPRINTS.filter(bp => {
      if (category !== "all" && bp.category !== category) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          bp.name.toLowerCase().includes(q) ||
          (SUBCATEGORY_LABELS[bp.subcategory] ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [query, category]);

  const groupedFiltered = useMemo(() => {
    const groups: Record<string, Blueprint[]> = {};
    for (const bp of filtered) {
      if (!groups[bp.category]) groups[bp.category] = [];
      groups[bp.category].push(bp);
    }
    return groups;
  }, [filtered]);

  // ── Queue helpers ──

  const addToQueue = useCallback((id: string) => {
    setQueue(prev => {
      const existing = prev.find(q => q.blueprintId === id);
      if (existing) return prev.map(q => q.blueprintId === id ? { ...q, quantity: q.quantity + 1 } : q);
      return [...prev, { blueprintId: id, quantity: 1 }];
    });
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => prev.filter(q => q.blueprintId !== id));
  }, []);

  const adjustQty = useCallback((id: string, delta: number) => {
    setQueue(prev => prev.map(qi => {
      if (qi.blueprintId !== id) return qi;
      const next = qi.quantity + delta;
      return next < 1 ? qi : { ...qi, quantity: next };
    }));
  }, []);

  const resetQueue = () => { setQueue([]); setChecked({}); };

  // ── Total materials ──

  const totalMaterials = useMemo(() => computeTotalMaterials(queue), [queue]);
  const craftingTime   = useMemo(() => totalCraftingTime(queue), [queue]);

  const groupedMaterials = useMemo(() => {
    const groups: Record<string, Array<{ id: string; qty: number }>> = {};
    for (const [matId, qty] of Object.entries(totalMaterials)) {
      const mat = MATERIALS[matId];
      if (!mat) continue;
      if (!groups[mat.category]) groups[mat.category] = [];
      groups[mat.category].push({ id: matId, qty });
    }
    return groups;
  }, [totalMaterials]);

  const remainingMaterials = Object.entries(totalMaterials).filter(([id]) => !checked[id]).length;

  // ── Render ──

  return (
    <div className="relative min-h-screen bg-background">
      {/* Hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[22vh] overflow-hidden">
        <img src="/hero-bg.jpg" alt="" aria-hidden className="h-full w-full object-cover opacity-30" style={{ objectPosition: "50% 40%" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex min-h-[20vh] items-center">
        <div className="container pb-2 pt-8">
          <div className="mb-1 flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("tools.hub.overline")}</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">{t("tools.crafting.title")}</h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">{t("tools.crafting.desc")}</p>
        </div>
      </div>

      {/* Main 3-column layout */}
      <div className="relative z-10 container pb-12 pt-0">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr_300px]">

          {/* ── Col 1 : Catalogue ── */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t("tools.crafting.catalog")}</p>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder={t("common.search")}
                className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
              />
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5">
              {["all", ...Object.keys(CATEGORY_LABELS)].map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`rounded-lg border px-2 py-1 text-[11px] font-medium transition-all ${
                    category === cat
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border/50 bg-card/50 text-muted-foreground hover:text-foreground"
                  }`}>
                  {cat === "all" ? t("common.all") : CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>

            {/* Blueprint list grouped by category */}
            <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
              {Object.entries(groupedFiltered).map(([cat, bps]) => {
                const open = openCats[cat] !== false; // open by default
                return (
                  <div key={cat}>
                    <button
                      onClick={() => setOpenCats(p => ({ ...p, [cat]: !open }))}
                      className="flex w-full items-center justify-between py-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground"
                    >
                      {CATEGORY_LABELS[cat] ?? cat}
                      {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>
                    {open && (
                      <div className="flex flex-col gap-1.5">
                        {bps.map(bp => (
                          <BlueprintCard
                            key={bp.id}
                            bp={bp}
                            selected={selected?.id === bp.id}
                            inQueue={queue.some(q => q.blueprintId === bp.id)}
                            onSelect={() => setSelected(bp)}
                            onAddToQueue={() => addToQueue(bp.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="flex flex-col items-center py-12 text-center text-sm text-muted-foreground">
                  <FlaskConical className="mb-3 h-8 w-8 opacity-30" />
                  {t("common.noResults")}
                </div>
              )}
            </div>
          </div>

          {/* ── Col 2 : Détail blueprint sélectionné ── */}
          <div>
            {selected ? (
              <div className="rounded-xl border border-border bg-card p-6">
                {/* Header */}
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground uppercase tracking-wider">
                      {CATEGORY_LABELS[selected.category]} · {SUBCATEGORY_LABELS[selected.subcategory] ?? selected.subcategory}
                    </p>
                    <h2 className="font-display text-2xl font-bold text-foreground">{selected.name}</h2>
                    <div className="mt-2 flex items-center gap-2">
                      {selected.grade && <GradeBadge grade={selected.grade} />}
                      {selected.size && (
                        <span className="rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
                          Taille {selected.size}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => addToQueue(selected.id)}
                    className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {t("tools.crafting.addToQueue")}
                  </button>
                </div>

                {/* Description */}
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{selected.description}</p>

                {/* Stats */}
                <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
                    <p className="text-xs text-muted-foreground">{t("tools.crafting.craftTime")}</p>
                    <p className="font-display text-lg font-bold text-foreground">{formatCraftingTime(selected.craftingTimeSec)}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
                    <p className="text-xs text-muted-foreground">{t("tools.crafting.output")}</p>
                    <p className="font-display text-lg font-bold text-foreground">×{selected.outputQty}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
                    <p className="text-xs text-muted-foreground">{t("tools.crafting.materials")}</p>
                    <p className="font-display text-lg font-bold text-foreground">{selected.materials.length}</p>
                  </div>
                </div>

                {/* Materials list (for 1 craft) */}
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("tools.crafting.materialsFor1")}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {selected.materials.map(mat => {
                    const material = MATERIALS[mat.materialId];
                    if (!material) return null;
                    return (
                      <div key={mat.materialId}
                        className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/20 px-3 py-2">
                        <div className={`h-2 w-2 rounded-full ${material.color.replace('text-', 'bg-')}`} />
                        <span className={`flex-1 text-xs font-medium ${material.color}`}>{material.name}</span>
                        <span className="font-mono text-sm font-bold text-foreground tabular-nums">×{mat.quantity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border/50 text-center text-muted-foreground">
                <FlaskConical className="mb-3 h-10 w-10 opacity-20" />
                <p className="text-sm">{t("tools.crafting.selectBlueprint")}</p>
              </div>
            )}

            {/* Queue list */}
            {queue.length > 0 && (
              <div className="mt-6 rounded-xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    {t("tools.crafting.queue")} ({queue.length})
                  </p>
                  <button onClick={resetQueue} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                    <RotateCcw className="h-3 w-3" /> {t("common.reset")}
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {queue.map(qi => {
                    const bp = BLUEPRINTS.find(b => b.id === qi.blueprintId);
                    if (!bp) return null;
                    return (
                      <div key={qi.blueprintId} className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/20 px-3 py-2">
                        <span className="flex-1 text-xs font-medium text-foreground truncate">{bp.name}</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => adjustQty(qi.blueprintId, -1)}
                            className="flex h-5 w-5 items-center justify-center rounded border border-border text-muted-foreground hover:text-foreground">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center font-mono text-xs font-bold text-foreground">{qi.quantity}</span>
                          <button onClick={() => adjustQty(qi.blueprintId, 1)}
                            className="flex h-5 w-5 items-center justify-center rounded border border-border text-muted-foreground hover:text-foreground">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button onClick={() => removeFromQueue(qi.blueprintId)} className="text-muted-foreground/50 hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatCraftingTime(craftingTime)}</span>
                  <span className="text-emerald-400">{remainingMaterials} mat. restants</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Col 3 : Matériaux totaux ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t("tools.crafting.totalMaterials")}</p>
              {Object.keys(checked).length > 0 && (
                <button onClick={() => setChecked({})} className="text-[11px] text-muted-foreground hover:text-foreground">
                  {t("common.reset")}
                </button>
              )}
            </div>

            {queue.length === 0 ? (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-border/50 py-12 text-center text-muted-foreground">
                <ShoppingCart className="mb-3 h-8 w-8 opacity-20" />
                <p className="text-sm">{t("tools.crafting.queueEmpty")}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
                {Object.entries(groupedMaterials).map(([catId, mats]) => (
                  <div key={catId}>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                      {MATERIAL_CATEGORY_LABELS[catId] ?? catId}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {mats.sort((a, b) => b.qty - a.qty).map(({ id, qty }) => {
                        const mat = MATERIALS[id];
                        if (!mat) return null;
                        const fakeMatEntry: BlueprintMaterial = { materialId: id, quantity: qty };
                        return (
                          <MaterialRow
                            key={id}
                            mat={fakeMatEntry}
                            qty={qty}
                            checked={!!checked[id]}
                            onToggle={() => setChecked(p => ({ ...p, [id]: !p[id] }))}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Progress */}
                <div className="rounded-lg border border-border bg-card p-3">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{t("tools.crafting.progress")}</span>
                    <span className="font-bold text-foreground">
                      {Object.keys(checked).length} / {Object.keys(totalMaterials).length}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-emerald-500/70 transition-all duration-300"
                      style={{ width: `${Object.keys(totalMaterials).length > 0 ? (Object.keys(checked).length / Object.keys(totalMaterials).length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CraftingSimulator;
