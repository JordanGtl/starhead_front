'use client';
import Link from "next/link";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Rocket, Cpu, FlaskConical, Clock, Trash2, Package,
  ChevronDown, Loader2, Layers, Wheat, Plus, Pencil,
  Check, X, GripVertical, FolderInput, FolderOpen, Star,
  SlidersHorizontal, Bookmark,
} from "lucide-react";
import { useShipLoadouts } from "@/hooks/useShipLoadouts";
import { useTranslation } from "react-i18next";
import {
  DndContext, closestCenter,
  DragStartEvent, DragOverEvent, DragEndEvent,
  PointerSensor, useSensor, useSensors, DragOverlay, useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAuth } from "@/contexts/AuthContext";
import { useVersion } from "@/contexts/VersionContext";
import { useSEO } from "@/hooks/useSEO";
import { useCraftingInventory, type SavedCraft, type SavedIngredient } from "@/hooks/useCraftingInventory";
import { useCraftCategories, type CraftCategory } from "@/hooks/useCraftCategories";
import { apiFetch } from "@/lib/api";
import PageHeader from "@/components/PageHeader";

// ─── Minimal blueprint type ───────────────────────────────────────────────────

interface BpDetail {
  ingredients: {
    ref: string; name: string | null; internalName: string | null;
    quantity: number | null; unit: string | null;
    tier: number; isMandatory: boolean;
  }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtTime(sec: number | null): string {
  if (!sec) return "—";
  if (sec < 60)   return `${sec}s`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m`;
  return `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;
}

function aggregateIngredients(crafts: SavedCraft[], enriched: Map<number, SavedIngredient[]>) {
  const map = new Map<string, { name: string; unit: string | null; total: number }>();
  for (const craft of crafts) {
    const ings = (craft.ingredients ?? []).length > 0 ? craft.ingredients : (enriched.get(craft.id) ?? []);
    for (const ing of ings) {
      const key = ing.name.toLowerCase();
      const e = map.get(key);
      const qty = ing.quantity * craft.quantity;
      if (e) e.total += qty; else map.set(key, { name: ing.name, unit: ing.unit, total: qty });
    }
  }
  return [...map.values()].sort((a, b) => b.total - a.total);
}

function effectiveIngredients(craft: SavedCraft, enriched: Map<number, SavedIngredient[]>): SavedIngredient[] {
  return (craft.ingredients ?? []).length > 0 ? craft.ingredients : (enriched.get(craft.id) ?? []);
}

// ─── Inline editable label ────────────────────────────────────────────────────

const EditableLabel = ({ value, onSave, className }: {
  value:     string;
  onSave:    (v: string) => void;
  className?: string;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) inputRef.current?.select(); }, [editing]);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onSave(trimmed);
    setEditing(false);
  };

  if (editing) return (
    <input
      ref={inputRef}
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
      className="min-w-0 flex-1 bg-transparent text-xs font-bold uppercase tracking-widest text-foreground/70 outline-none border-b border-primary/40 pb-px"
      autoFocus
    />
  );

  return (
    <button
      onClick={() => { setDraft(value); setEditing(true); }}
      title="Renommer"
      className={`flex items-center gap-1.5 group ${className ?? ''}`}
    >
      <span>{value}</span>
      <Pencil className="h-2.5 w-2.5 opacity-0 group-hover:opacity-40 transition-opacity" />
    </button>
  );
};

// ─── Move-to-category dropdown (portaled) ────────────────────────────────────

const MoveToCategoryDropdown = ({ craft, categories, onMove }: {
  craft:      SavedCraft;
  categories: CraftCategory[];
  onMove:     (categoryId: number | null) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState({ top: 0, left: 0 });
  const btnRef  = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({
        top:  r.bottom + 4,
        left: Math.max(4, r.right - 168),
      });
    }
    setOpen(v => !v);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        !dropRef.current?.contains(e.target as Node) &&
        !btnRef.current?.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const others = categories.filter(c => c.id !== craft.categoryId);

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleOpen}
        title="Déplacer vers une catégorie"
        className={`flex h-7 w-7 items-center justify-center rounded border transition-colors ${
          open
            ? 'border-primary/40 bg-primary/10 text-primary'
            : 'border-border text-muted-foreground/40 hover:text-foreground'
        }`}
      >
        <FolderInput className="h-3 w-3" />
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <div
          ref={dropRef}
          style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999, minWidth: 168 }}
          className="overflow-hidden rounded-lg border border-border bg-card shadow-lg"
        >
          <p className="border-b border-border/50 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            Déplacer vers
          </p>
          {craft.categoryId !== null && (
            <button
              onClick={() => { onMove(null); setOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-secondary/40"
            >
              <X className="h-3 w-3" /> Sans catégorie
            </button>
          )}
          {others.map(cat => (
            <button
              key={cat.id}
              onClick={() => { onMove(cat.id); setOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-secondary/40"
            >
              <FolderOpen className="h-3 w-3 text-primary/50" />
              {cat.name}
            </button>
          ))}
          {others.length === 0 && craft.categoryId !== null && (
            <p className="px-3 py-2 text-xs italic text-muted-foreground/40">Aucune autre catégorie</p>
          )}
          {categories.length === 0 && (
            <p className="px-3 py-2 text-xs italic text-muted-foreground/40">Créez d'abord une catégorie</p>
          )}
        </div>,
        document.body,
      )}
    </>
  );
};

// ─── Droppable category zone ──────────────────────────────────────────────────

const DroppableZone = ({ id, isOver, children }: { id: string; isOver: boolean; children: React.ReactNode }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`min-h-10 rounded-lg transition-all duration-150 ${isOver ? 'ring-1 ring-primary/30 bg-primary/[0.03]' : ''}`}
    >
      {children}
    </div>
  );
};

// ─── Sortable craft card ──────────────────────────────────────────────────────

const SortableCraftCard = ({ craft, enriched, categories, onRemove, onMove, expanded, onToggle }: {
  craft:      SavedCraft;
  enriched:   Map<number, SavedIngredient[]>;
  categories: CraftCategory[];
  onRemove:   () => void;
  onMove:     (categoryId: number | null) => void;
  expanded:   boolean;
  onToggle:   () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: craft.id });
  const ings = effectiveIngredients(craft, enriched);

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.35 : 1 }}
      className="rounded-lg border border-border bg-card"
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        {/* Drag handle */}
        <button
          {...attributes} {...listeners}
          className="shrink-0 cursor-grab touch-none text-muted-foreground/25 hover:text-muted-foreground/60 active:cursor-grabbing"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground leading-tight">{craft.name}</p>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground/50">
            <span className="font-mono font-bold text-primary/70">×{craft.quantity}</span>
            {craft.craftTimeSec && (
              <span className="flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" />{fmtTime(craft.craftTimeSec)}
              </span>
            )}
            {ings.length > 0 && <span>{ings.length} matériau{ings.length > 1 ? 'x' : ''}</span>}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {ings.length > 0 && (
            <button
              onClick={onToggle}
              className={`flex h-7 w-7 items-center justify-center rounded border transition-colors ${
                expanded ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground/40 hover:text-foreground"
              }`}
            >
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          )}
          <MoveToCategoryDropdown craft={craft} categories={categories} onMove={onMove} />
          <button
            onClick={onRemove}
            className="flex h-7 w-7 items-center justify-center rounded border border-transparent text-muted-foreground/30 transition-colors hover:border-destructive/30 hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {expanded && ings.length > 0 && (
        <div className="border-t border-border/40 bg-background/40 px-3 py-2.5 rounded-b-lg">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
            Matériaux · ×{craft.quantity}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ings.map(ing => (
              <span key={ing.name} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/30 px-2.5 py-1 text-xs">
                <span className="text-foreground/80">{ing.name}</span>
                <span className="font-mono font-bold text-primary">×{ing.quantity * craft.quantity}{ing.unit ? ` ${ing.unit}` : ''}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyState = ({ icon: Icon, title, subtitle, action }: {
  icon: React.ElementType; title: string; subtitle: string;
  action?: { label: string; href: string };
}) => (
  <div className="flex flex-col items-center rounded-xl border border-dashed border-border/50 py-16 text-center text-muted-foreground">
    <Icon className="mb-3 h-10 w-10 opacity-20" />
    <p className="text-sm font-medium text-foreground/60">{title}</p>
    <p className="mt-1 text-xs opacity-50">{subtitle}</p>
    {action && (
      <Link href={action.href} className="mt-4 rounded-lg bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors">
        {action.label}
      </Link>
    )}
  </div>
);

// ─── Tab types ────────────────────────────────────────────────────────────────

type Tab = "ships" | "components" | "crafts";

// ─── Page ─────────────────────────────────────────────────────────────────────

const Inventory = () => {
  const { isAuthenticated, authLoading } = useAuth();
  const router = useRouter();
  const { selectedVersion } = useVersion();
  const { i18n } = useTranslation();
  const { crafts, loaded, remove, updateCraft, clear } = useCraftingInventory();
  const {
    categories, loaded: catsLoaded,
    create: createCat, rename: renameCat,
    reorder: reorderCats, setDefault: setDefaultCat, remove: removeCat,
  } = useCraftCategories();
  const [tab, setTab] = useState<Tab>("ships");
  const { loadouts: shipLoadouts, loading: shipLoadoutsLoading, remove: removeShipLoadout } = useShipLoadouts();

  // ── Ingredient enrichment ──
  const [enriched,  setEnriched]  = useState<Map<number, SavedIngredient[]>>(new Map());
  const [enriching, setEnriching] = useState(false);

  useEffect(() => {
    if (!loaded || !selectedVersion || crafts.length === 0) return;
    const toEnrich = crafts.filter(c => (c.ingredients ?? []).length === 0);
    if (!toEnrich.length) return;
    setEnriching(true);
    const unique = [...new Map(toEnrich.map(c => [c.blueprintId, c])).values()];
    Promise.allSettled(unique.map(async c => {
      const qs = new URLSearchParams({ locale: i18n.language, gameVersion: String(selectedVersion.id) });
      const detail = await apiFetch<BpDetail>(`/api/blueprints/${c.blueprintId}?${qs}`);
      return {
        blueprintId: c.blueprintId,
        ingredients: detail.ingredients.filter(i => i.tier === 1 && i.isMandatory)
          .map(i => ({ name: i.name ?? i.internalName ?? i.ref, quantity: i.quantity ?? 1, unit: i.unit })),
      };
    })).then(results => {
      const byBpId = new Map<number, SavedIngredient[]>();
      for (const r of results) {
        if (r.status === 'fulfilled' && r.value.ingredients.length > 0)
          byBpId.set(r.value.blueprintId, r.value.ingredients);
      }
      if (byBpId.size > 0) {
        setEnriched(prev => {
          const next = new Map(prev);
          for (const craft of toEnrich) {
            const ings = byBpId.get(craft.blueprintId);
            if (ings) next.set(craft.id, ings);
          }
          return next;
        });
      }
    }).finally(() => setEnriching(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, selectedVersion?.id, crafts.length]);

  // ── UI state ──
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [totalOpen,   setTotalOpen]   = useState(true);
  const [addingCat,   setAddingCat]   = useState(false);
  const [newCatName,  setNewCatName]  = useState('');
  const [catError,    setCatError]    = useState<string | null>(null);
  const [catSaving,   setCatSaving]   = useState(false);
  const newCatRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const toggleExpand = (id: number) =>
    setExpandedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  // ── Category ids set ──
  const categoryIds = useMemo(() => new Set(categories.map(c => c.id)), [categories]);

  // ── DnD: container items state ──
  // key: "uncategorized" | "cat-{id}"  value: ordered craft ids
  const [containerItems, setContainerItems] = useState<Map<string, number[]>>(new Map());
  const [activeId,        setActiveId]       = useState<number | null>(null);
  const [overContainer,   setOverContainer]  = useState<string | null>(null);

  // Capture the source container at drag start — stays stable even after onDragOver moves the item
  const sourceContainerRef = useRef<string | null>(null);

  // Sync container items from server state (only when not dragging)
  useEffect(() => {
    if (activeId !== null) return;
    const map = new Map<string, number[]>();
    map.set('uncategorized',
      crafts
        .filter(c => c.categoryId === null || !categoryIds.has(c.categoryId))
        .sort((a, b) => a.position - b.position)
        .map(c => c.id),
    );
    for (const cat of categories) {
      map.set(`cat-${cat.id}`,
        crafts
          .filter(c => c.categoryId === cat.id)
          .sort((a, b) => a.position - b.position)
          .map(c => c.id),
      );
    }
    setContainerItems(map);
  }, [crafts, categories, categoryIds, activeId]);

  // Always-fresh ref to containerItems for use inside event handlers
  const containerItemsRef = useRef(containerItems);
  useEffect(() => { containerItemsRef.current = containerItems; }, [containerItems]);

  const findContainer = useCallback((itemId: number): string | null => {
    for (const [key, ids] of containerItemsRef.current) {
      if (ids.includes(itemId)) return key;
    }
    return null;
  }, []);

  const handleDragStart = ({ active }: DragStartEvent) => {
    const id = active.id as number;
    setActiveId(id);
    // Capture source before any onDragOver mutations
    sourceContainerRef.current = findContainer(id);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) { setOverContainer(null); return; }

    const overContainerKey = containerItemsRef.current.has(over.id as string)
      ? over.id as string
      : findContainer(over.id as number);

    setOverContainer(overContainerKey);

    const currentContainer = findContainer(active.id as number);
    if (!currentContainer || !overContainerKey || currentContainer === overContainerKey) return;

    // Move item between containers optimistically for visual feedback
    setContainerItems(prev => {
      const next     = new Map(prev);
      const fromList = [...(next.get(currentContainer) ?? [])];
      const toList   = [...(next.get(overContainerKey) ?? [])];

      const fromIdx = fromList.indexOf(active.id as number);
      if (fromIdx === -1) return prev;
      fromList.splice(fromIdx, 1);

      const overItemIdx = toList.indexOf(over.id as number);
      toList.splice(overItemIdx >= 0 ? overItemIdx : toList.length, 0, active.id as number);

      next.set(currentContainer, fromList);
      next.set(overContainerKey, toList);
      return next;
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const sourceContainer = sourceContainerRef.current;
    sourceContainerRef.current = null;

    if (!sourceContainer) { setActiveId(null); setOverContainer(null); return; }

    if (over) {
      // Where did the item land after all the onDragOver mutations?
      const finalContainer = findContainer(active.id as number)
        ?? (containerItemsRef.current.has(over.id as string) ? over.id as string : sourceContainer);

      if (sourceContainer === finalContainer) {
        // ── Same container: reorder only ──
        if (active.id !== over.id) {
          const items    = containerItemsRef.current.get(finalContainer) ?? [];
          const oldIndex = items.indexOf(active.id as number);
          const newIndex = items.indexOf(over.id as number);

          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            const reordered = arrayMove(items, oldIndex, newIndex);
            setContainerItems(prev => { const n = new Map(prev); n.set(finalContainer, reordered); return n; });
            reordered.forEach((id, idx) => {
              const c = crafts.find(c => c.id === id);
              if (c && c.position !== idx) updateCraft(c.id, { position: idx });
            });
          }
        }
      } else {
        // ── Cross-container: update categoryId + position via API ──
        const newCategoryId = finalContainer === 'uncategorized'
          ? null
          : Number(finalContainer.replace('cat-', ''));
        const items    = containerItemsRef.current.get(finalContainer) ?? [];
        const position = items.indexOf(active.id as number);
        updateCraft(active.id as number, {
          categoryId: newCategoryId,
          position:   position >= 0 ? position : 0,
        });
      }
    }

    setActiveId(null);
    setOverContainer(null);
  };

  const handleDragCancel = () => {
    sourceContainerRef.current = null;
    setActiveId(null);
    setOverContainer(null);
  };

  // ── Add category ──
  const submitNewCat = async () => {
    const name = newCatName.trim();
    if (!name) { setAddingCat(false); return; }
    setCatError(null);
    setCatSaving(true);
    try {
      await createCat(name);
      setNewCatName('');
      setAddingCat(false);
    } catch (err: unknown) {
      setCatError(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setCatSaving(false);
    }
  };

  useEffect(() => { if (addingCat) newCatRef.current?.focus(); }, [addingCat]);

  const globalTotals = useMemo(() => aggregateIngredients(crafts, enriched), [crafts, enriched]);

  useSEO({ title: "Mon inventaire", noindex: true });

  if (authLoading) return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
  if (!isAuthenticated) {
    if (typeof window !== "undefined") router.replace("/login");
    return null;
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "crafts",     label: "Crafts à réaliser", icon: FlaskConical, count: crafts.length },
    { id: "ships",      label: "Vaisseaux",          icon: Rocket,       count: shipLoadouts.length || undefined },
    { id: "components", label: "Composants",         icon: Cpu },
  ];

  const activeCraft = activeId ? crafts.find(c => c.id === activeId) : null;

  // Render a container (category or uncategorized)
  const renderContainer = (containerKey: string, emptyMessage: string) => {
    const ids = containerItems.get(containerKey) ?? [];
    const isOver = overContainer === containerKey;

    return (
      <DroppableZone id={containerKey} isOver={isOver}>
        {ids.length === 0 ? (
          <p className={`py-2 text-xs italic transition-colors ${isOver ? 'text-primary/40' : 'text-muted-foreground/30'}`}>
            {isOver ? 'Déposer ici' : emptyMessage}
          </p>
        ) : (
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <div className="space-y-1.5">
              {ids.map(id => {
                const craft = crafts.find(c => c.id === id);
                if (!craft) return null;
                return (
                  <SortableCraftCard
                    key={craft.id}
                    craft={craft}
                    enriched={enriched}
                    categories={categories}
                    onRemove={() => remove(craft.id)}
                    onMove={catId => updateCraft(craft.id, { categoryId: catId })}
                    expanded={expandedIds.has(craft.id)}
                    onToggle={() => toggleExpand(craft.id)}
                  />
                );
              })}
            </div>
          </SortableContext>
        )}
      </DroppableZone>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        breadcrumb={[{ label: "Mon inventaire" }]}
        title="Mon inventaire"
        label="Joueur"
        labelIcon={Package}
        subtitle="Retrouvez vos vaisseaux, composants et crafts à venir."
      />

      <div className="container pb-12 pt-6">
        {/* Tabs */}
        <div className="mb-6 flex items-center gap-1 border-b border-border">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors -mb-px ${
                tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
              {t.count != null && t.count > 0 && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  tab === t.id ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                }`}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Crafts tab ──────────────────────────────────────────────────── */}
        {tab === "crafts" && (
          !loaded || !catsLoaded ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : crafts.length === 0 ? (
            <EmptyState
              icon={FlaskConical}
              title="Aucun craft sauvegardé"
              subtitle="Utilisez le simulateur de craft pour configurer et sauvegarder vos crafts à réaliser."
              action={{ label: "Simulateur de craft", href: "/tools/crafting" }}
            />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <div className="space-y-6">

                {/* Total ressources */}
                <div className="rounded-xl border border-border bg-card">
                  <button onClick={() => setTotalOpen(v => !v)}
                    className="flex w-full items-center justify-between px-4 py-3 hover:bg-secondary/20 transition-colors rounded-xl"
                  >
                    <div className="flex items-center gap-2.5">
                      <Wheat className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">Ressources à farmer</span>
                      {globalTotals.length > 0 && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                          {globalTotals.length}
                        </span>
                      )}
                      {enriching && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground/50" />}
                    </div>
                    <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${totalOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {totalOpen && (
                    <div className="border-t border-border/50 px-4 py-3">
                      {globalTotals.length === 0 ? (
                        <p className="text-xs italic text-muted-foreground/40">
                          {enriching ? 'Chargement…' : 'Aucune donnée de matériaux'}
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {globalTotals.map(ing => (
                            <span key={ing.name} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/30 px-2.5 py-1 text-xs">
                              <span className="text-foreground/80">{ing.name}</span>
                              <span className="font-mono font-bold text-primary">×{ing.total}{ing.unit ? ` ${ing.unit}` : ''}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setAddingCat(true)}
                    className="flex items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" /> Nouvelle catégorie
                  </button>
                  <button onClick={clear} className="text-xs text-muted-foreground/40 hover:text-destructive transition-colors">
                    Tout supprimer
                  </button>
                </div>

                {/* New category input */}
                {addingCat && (
                  <div className="space-y-1.5">
                    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${catError ? 'border-destructive/40 bg-destructive/5' : 'border-primary/30 bg-primary/5'}`}>
                      <FolderOpen className={`h-4 w-4 shrink-0 ${catError ? 'text-destructive/50' : 'text-primary/50'}`} />
                      <input
                        ref={newCatRef}
                        value={newCatName}
                        onChange={e => { setNewCatName(e.target.value); setCatError(null); }}
                        onKeyDown={e => { if (e.key === 'Enter') submitNewCat(); if (e.key === 'Escape') { setAddingCat(false); setCatError(null); } }}
                        placeholder="Nom de la catégorie…"
                        disabled={catSaving}
                        className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/40 disabled:opacity-50"
                      />
                      {catSaving
                        ? <Loader2 className="h-4 w-4 animate-spin text-primary/50" />
                        : <button onClick={submitNewCat} className="text-primary hover:text-primary/80"><Check className="h-4 w-4" /></button>
                      }
                      <button onClick={() => { setAddingCat(false); setCatError(null); setNewCatName(''); }} className="text-muted-foreground/50 hover:text-foreground">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {catError && (
                      <p className="flex items-center gap-1.5 px-1 text-xs text-destructive">
                        <X className="h-3 w-3 shrink-0" />{catError}
                      </p>
                    )}
                  </div>
                )}

                {/* Named categories */}
                {categories.map(cat => (
                  <div key={cat.id}>
                    <div className="mb-3 flex items-center gap-2">
                      <Layers className="h-3.5 w-3.5 shrink-0 text-primary/40" />
                      <EditableLabel
                        value={cat.name}
                        onSave={name => renameCat(cat.id, name)}
                        className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60"
                      />
                      {cat.isDefault && (
                        <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                          défaut
                        </span>
                      )}
                      <div className="flex-1 border-t border-border/30" />
                      <span className="whitespace-nowrap text-[11px] text-muted-foreground/35">
                        {(containerItems.get(`cat-${cat.id}`) ?? []).length} craft{(containerItems.get(`cat-${cat.id}`) ?? []).length > 1 ? 's' : ''}
                      </span>
                      <button
                        onClick={() => setDefaultCat(cat.id)}
                        title={cat.isDefault ? 'Catégorie par défaut' : 'Définir comme catégorie par défaut'}
                        className={`transition-colors ${cat.isDefault ? 'text-primary' : 'text-muted-foreground/25 hover:text-primary/60'}`}
                      >
                        <Star className={`h-3 w-3 ${cat.isDefault ? 'fill-primary' : ''}`} />
                      </button>
                      <button
                        onClick={() => removeCat(cat.id)}
                        className="text-muted-foreground/25 hover:text-destructive transition-colors"
                        title="Supprimer la catégorie"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                    {renderContainer(`cat-${cat.id}`, 'Aucun craft dans cette catégorie')}
                  </div>
                ))}

                {/* Uncategorized — always visible */}
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <Layers className="h-3.5 w-3.5 shrink-0 text-muted-foreground/25" />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40">
                      Sans catégorie
                    </span>
                    <div className="flex-1 border-t border-border/30" />
                    <span className="whitespace-nowrap text-[11px] text-muted-foreground/30">
                      {(containerItems.get('uncategorized') ?? []).length} craft{(containerItems.get('uncategorized') ?? []).length > 1 ? 's' : ''}
                    </span>
                  </div>
                  {renderContainer('uncategorized', 'Aucun craft sans catégorie')}
                </div>

              </div>

              {/* Drag overlay — floating preview */}
              <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
                {activeCraft && (
                  <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-card px-3 py-2.5 shadow-2xl ring-1 ring-primary/20">
                    <GripVertical className="h-3.5 w-3.5 shrink-0 text-primary/40" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{activeCraft.name}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-primary/70">×{activeCraft.quantity}</span>
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          )
        )}

        {tab === "ships" && (
          shipLoadoutsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : shipLoadouts.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="Aucune configuration sauvegardée"
              subtitle="Utilisez le configurateur de vaisseau pour personnaliser et sauvegarder vos loadouts."
              action={{ label: "Configurateur", href: "/ships/configure" }}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shipLoadouts.map(l => (
                <div key={l.id} className="relative flex flex-col overflow-hidden rounded-xl border border-border bg-card">
                  {/* Image */}
                  <div className="relative h-32 overflow-hidden bg-secondary/40">
                    {l.shipDef.image ? (
                      <img src={l.shipDef.image} alt={l.shipDef.internalName} className="h-full w-full object-cover opacity-60" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Rocket className="h-10 w-10 text-muted-foreground/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  </div>

                  {/* Contenu */}
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">{l.shipDef.internalName}</p>
                      <h3 className="mt-0.5 font-display font-bold text-foreground">{l.name}</h3>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {Object.keys(l.slots).length} modification{Object.keys(l.slots).length > 1 ? 's' : ''}
                        {' · '}
                        {new Date(l.savedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>

                    <div className="mt-auto flex gap-2">
                      <Link
                        href={`/ships/configure?ship=${l.shipDef.id}&c=${Object.entries(l.slots).map(([p, id]) => `${encodeURIComponent(p)}:${id ?? 0}`).join(',')}`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        Ouvrir
                      </Link>
                      <button
                        onClick={() => removeShipLoadout(l.id)}
                        className="rounded-lg border border-border px-3 py-2 text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
        {tab === "components" && (
          <EmptyState icon={Cpu} title="Composants — bientôt disponible"
            subtitle="Vous pourrez bientôt gérer vos composants installés." />
        )}
      </div>
    </div>
  );
};

export default Inventory;
