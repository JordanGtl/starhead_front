'use client';
import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  ScrollText, Clock, ArrowLeft, Loader2, AlertCircle,
  Crosshair, Shield, Cpu, Package, Zap, ChevronRight,
  Layers, GitBranch, Box, Beaker, Award,
} from "lucide-react";
import { useVersion } from "@/contexts/VersionContext";
import { apiFetch } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import { useSEO } from "@/hooks/useSEO";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CostNode {
  type:              "select" | "resource";
  // select
  slot?:             string | null;
  debugName?:        string | null;
  chooseCount?:      number | null;
  options?:          CostNode[] | null;
  // resource
  ref?:              string | null;
  name?:             string | null;
  quantity?:         number | null;
  unit?:             string | null;
  minQuality?:       number | null;
}

interface Tier {
  tier:          number;
  craftTime:     { days: number; hours: number; minutes: number; seconds: number; totalSeconds: number } | null;
  mandatoryCost: CostNode | null;
  optionalCosts: CostNode | null;
  research:      unknown;
}

interface BlueprintDetail {
  id:                 number;
  ref:                string;
  dataId:             number;
  internalName:       string;
  blueprintType:      string | null;
  outputRef:          string | null;
  outputName:         string | null;
  outputType:         string | null;
  outputSubType:      string | null;
  outputManufacturer: string | null;
  craftTimeSec:       number | null;
  version:            { id: number; label: string } | null;
  categoryRef:        string | null;
  file:               string | null;
  tiers:              Tier[] | null;
  rewardPools:        string[] | null;
}

interface ResolvedItem {
  id:   number;
  ref:  string;
  name: string | null;
  type: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const OUTPUT_TYPE_LABELS: Record<string, string> = {
  WeaponPersonal:       "Arme personnelle",
  WeaponAttachment:     "Accessoire",
  Char_Armor_Helmet:    "Casque",
  Char_Armor_Torso:     "Torse",
  Char_Armor_Arms:      "Bras",
  Char_Armor_Legs:      "Jambes",
  Char_Armor_Undersuit: "Sous-combinaison",
  Char_Armor_Backpack:  "Sac à dos",
  Armor:                "Armure complète",
  FPS_Consumable:       "Consommable",
  Grenade:              "Grenade",
  Shield:               "Bouclier",
  PowerPlant:           "Générateur",
  Cooler:               "Refroidisseur",
  QuantumDrive:         "Quantum Drive",
};

const OUTPUT_TYPE_ICON: Record<string, React.ElementType> = {
  WeaponPersonal:   Crosshair,
  WeaponAttachment: Package,
  Shield:           Shield,
  PowerPlant:       Zap,
  Cooler:           Cpu,
  QuantumDrive:     Cpu,
};

const outputTypeLabel = (t: string | null) => t ? (OUTPUT_TYPE_LABELS[t] ?? t) : "—";
const outputTypeIcon  = (t: string | null): React.ElementType =>
  (t && OUTPUT_TYPE_ICON[t]) ? OUTPUT_TYPE_ICON[t] : ScrollText;

const fmtCraftTime = (sec: number | null) => {
  if (sec == null) return null;
  if (sec < 60)   return `${sec}s`;
  if (sec < 3600) return `${Math.floor(sec / 60)}min`;
  return `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}min`;
};

const fmtDebugName = (s: string | null | undefined): string => {
  if (!s) return "—";
  return s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

/** Recursively collect all resource refs from a cost tree */
function collectRefs(node: CostNode | null, acc: Set<string>): void {
  if (!node) return;
  if (node.type === "resource" && node.ref) {
    acc.add(node.ref);
  } else if (node.options) {
    for (const child of node.options) collectRefs(child, acc);
  }
}

// ---------------------------------------------------------------------------
// CostTree — recursive component
// ---------------------------------------------------------------------------

const ResourceNode = ({
  node,
  nameMap,
}: {
  node: CostNode;
  nameMap: Map<string, ResolvedItem>;
}) => {
  const resolved = node.ref ? nameMap.get(node.ref) : undefined;
  const name     = resolved?.name ?? null;
  // Fallback: if name is still a UUID or null, show internalName style
  const isRaw    = !name;
  const label    = name ?? (node.ref ? node.ref.slice(0, 8) + "…" : "?");
  const itemPath = resolved ? `/components/${resolved.id}` : null;

  const inner = (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border/40 bg-background/60 px-3 py-2 group/res">
      <div className="flex items-center gap-2 min-w-0">
        <Box className="h-3.5 w-3.5 shrink-0 text-primary/60" />
        <span className={`text-xs truncate ${isRaw ? "font-mono text-muted-foreground/60" : "font-medium text-foreground group-hover/res:text-primary transition-colors"}`}>
          {label}
        </span>
        {resolved?.type && (
          <span className="shrink-0 rounded bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/60 border border-border/40">
            {outputTypeLabel(resolved.type)}
          </span>
        )}
      </div>
      <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-primary">
        <span className="font-mono">{node.quantity ?? "?"}</span>
        {node.unit && <span className="text-muted-foreground font-normal">{node.unit}</span>}
        {node.minQuality != null && (
          <span className="ml-1 text-[10px] text-muted-foreground/60">min Q{node.minQuality}</span>
        )}
      </div>
    </div>
  );

  return itemPath ? (
    <Link href={itemPath} className="block hover:opacity-90 transition-opacity">
      {inner}
    </Link>
  ) : inner;
};

const SelectNode = ({
  node,
  nameMap,
  depth = 0,
}: {
  node:    CostNode;
  nameMap: Map<string, ResolvedItem>;
  depth?:  number;
}) => {
  const label  = node.slot ? fmtDebugName(node.slot) : fmtDebugName(node.debugName);
  const choose = node.chooseCount && node.chooseCount > 1 ? `choisir ${node.chooseCount}` : null;

  return (
    <div className={depth > 0 ? "ml-4 border-l border-border/30 pl-3" : ""}>
      <div className="mb-1.5 flex items-center gap-1.5">
        <GitBranch className="h-3 w-3 shrink-0 text-muted-foreground/50" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{label}</span>
        {choose && (
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">{choose}</span>
        )}
      </div>
      <div className="space-y-1.5">
        {node.options?.map((opt, idx) =>
          opt.type === "resource"
            ? <ResourceNode key={idx} node={opt} nameMap={nameMap} />
            : <SelectNode key={idx} node={opt} nameMap={nameMap} depth={depth + 1} />
        )}
      </div>
    </div>
  );
};

const CostTree = ({
  node,
  label,
  nameMap,
}: {
  node:    CostNode;
  label:   string;
  nameMap: Map<string, ResolvedItem>;
}) => (
  <div className="rounded-lg border border-border bg-card/60 p-4">
    <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      <Layers className="h-3.5 w-3.5" />
      {label}
    </p>
    {node.type === "resource"
      ? <ResourceNode node={node} nameMap={nameMap} />
      : <SelectNode node={node} nameMap={nameMap} />
    }
  </div>
);

// ---------------------------------------------------------------------------
// BlueprintDetail page
// ---------------------------------------------------------------------------

const BlueprintDetail = () => {
  const { id }              = useParams<{ id: string }>();
  const { t, i18n }         = useTranslation();
  const { selectedVersion } = useVersion();
  const router              = useRouter();

  const [bp, setBp]           = useState<BlueprintDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [nameMap, setNameMap] = useState<Map<string, ResolvedItem>>(new Map());

  useSEO({
    title: bp?.outputName ?? bp?.internalName ?? undefined,
    description: bp ? `Blueprint : ${bp.outputName ?? bp.internalName}. Type: ${bp.outputType ?? "—"}. Matériaux et temps de craft sur StarHead.` : undefined,
    path: id ? `/blueprints/${id}` : undefined,
    noindex: false,
  });

  // 1. Fetch blueprint detail
  useEffect(() => {
    if (!id || !selectedVersion) return;
    setLoading(true);
    setError(null);
    const qs = new URLSearchParams({
      gameVersion: String(selectedVersion.id),
      locale:      i18n.language,
    });
    apiFetch<BlueprintDetail>(`/api/blueprints/${id}?${qs}`)
      .then(setBp)
      .catch(() => setError("Blueprint introuvable"))
      .finally(() => setLoading(false));
  }, [id, selectedVersion, i18n.language]);

  // 2. Collect all unique resource refs from tiers
  const allRefs = useMemo(() => {
    if (!bp?.tiers) return [];
    const set = new Set<string>();
    for (const tier of bp.tiers) {
      collectRefs(tier.mandatoryCost, set);
      collectRefs(tier.optionalCosts, set);
    }
    return [...set];
  }, [bp]);

  // 3. Batch-fetch items by refs to build nameMap
  useEffect(() => {
    if (!allRefs.length || !selectedVersion) return;
    const qs = new URLSearchParams({
      refs:        allRefs.join(","),
      gameVersion: String(selectedVersion.id),
      locale:      i18n.language,
    });
    apiFetch<ResolvedItem[]>(`/api/items?${qs}`)
      .then((items) => {
        const map = new Map<string, ResolvedItem>();
        for (const item of items) map.set(item.ref, item);
        setNameMap(map);
      })
      .catch(() => { /* non-blocking — keep empty map */ });
  }, [allRefs, selectedVersion, i18n.language]);

  const Icon      = outputTypeIcon(bp?.outputType ?? null);
  const craftTime = fmtCraftTime(bp?.craftTimeSec ?? null);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-background">
        <PageHeader
          breadcrumb={[
            { label: t("nav.blueprints"), icon: ScrollText, href: "/blueprints" },
            { label: "…" },
          ]}
          label={t("nav.groupCraft")}
          labelIcon={ScrollText}
          title="Chargement…"
        />
        <div className="container flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !bp) {
    return (
      <div className="relative min-h-screen bg-background">
        <PageHeader
          breadcrumb={[{ label: t("nav.blueprints"), icon: ScrollText, href: "/blueprints" }]}
          label={t("nav.groupCraft")}
          labelIcon={ScrollText}
          title="Blueprint introuvable"
        />
        <div className="container flex flex-col items-center py-20 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-destructive/50" />
          <p className="text-lg font-medium text-muted-foreground">{error ?? "Blueprint introuvable"}</p>
          <button onClick={() => router.push("/blueprints")} className="mt-4 text-sm text-primary hover:underline">
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const tier = bp.tiers?.[0] ?? null;

  return (
    <div className="relative min-h-screen bg-background">
      <PageHeader
        breadcrumb={[
          { label: t("nav.blueprints"), icon: ScrollText, href: "/blueprints" },
          { label: bp.outputName ?? bp.internalName },
        ]}
        label={t("nav.groupCraft")}
        labelIcon={ScrollText}
        title={bp.outputName ?? bp.internalName}
        subtitle={outputTypeLabel(bp.outputType)}
      />

      <div className="container pb-12">
        <Link
          href="/blueprints"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour aux blueprints
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

          {/* ── Colonne principale ── */}
          <div className="space-y-6">

            {/* Header card */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="bg-gradient-to-br from-primary/10 to-transparent px-6 py-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-primary/70 mb-1">
                      {outputTypeLabel(bp.outputType)}
                      {bp.outputSubType && bp.outputSubType.toLowerCase() !== "undefined" && (
                        <> · {bp.outputSubType}</>
                      )}
                    </p>
                    <h1 className="text-xl font-bold text-foreground leading-tight">
                      {bp.outputName ?? bp.internalName}
                    </h1>
                    {bp.outputManufacturer && (
                      <p className="mt-0.5 text-sm text-muted-foreground">{bp.outputManufacturer}</p>
                    )}
                  </div>
                  {craftTime && (
                    <div className="ml-auto shrink-0 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-mono text-sm font-semibold text-primary">{craftTime}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

              <div className="grid grid-cols-2 divide-x divide-border sm:grid-cols-4">
                {[
                  { label: "Type",      value: outputTypeLabel(bp.outputType) },
                  { label: "Classe",    value: bp.outputSubType && bp.outputSubType.toLowerCase() !== "undefined" ? bp.outputSubType : "—" },
                  { label: "Fabricant", value: bp.outputManufacturer ?? "—" },
                  { label: "Version",   value: bp.version?.label ?? "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{label}</p>
                    <p className="mt-0.5 text-sm font-medium text-foreground truncate">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Recette de craft ── */}
            {tier && (
              <div>
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <Beaker className="h-4 w-4" />
                  Recette de craft
                </h2>
                <div className="space-y-3">
                  {tier.mandatoryCost && (
                    <CostTree node={tier.mandatoryCost} label="Ingrédients obligatoires" nameMap={nameMap} />
                  )}
                  {tier.optionalCosts && (
                    <CostTree node={tier.optionalCosts} label="Ingrédients optionnels" nameMap={nameMap} />
                  )}
                </div>
              </div>
            )}

            {/* Multi-tiers */}
            {bp.tiers && bp.tiers.length > 1 && bp.tiers.slice(1).map((t) => (
              <div key={t.tier}>
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <Layers className="h-4 w-4" />
                  Tier {t.tier}
                  {t.craftTime && (
                    <span className="ml-auto flex items-center gap-1 font-mono text-xs text-muted-foreground/60 normal-case tracking-normal">
                      <Clock className="h-3 w-3" />
                      {fmtCraftTime(t.craftTime.totalSeconds)}
                    </span>
                  )}
                </h2>
                <div className="space-y-3">
                  {t.mandatoryCost && <CostTree node={t.mandatoryCost} label="Ingrédients obligatoires" nameMap={nameMap} />}
                  {t.optionalCosts  && <CostTree node={t.optionalCosts}  label="Ingrédients optionnels"  nameMap={nameMap} />}
                </div>
              </div>
            ))}

          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">

            {/* Reward Pools */}
            {bp.rewardPools && bp.rewardPools.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Award className="h-3.5 w-3.5" />
                  Reward Pools
                </h3>
                <ul className="space-y-1.5">
                  {bp.rewardPools.map((pool) => (
                    <li
                      key={pool}
                      className="flex items-center gap-2 rounded-md bg-background/60 px-2.5 py-1.5 text-xs font-mono text-muted-foreground"
                    >
                      <ChevronRight className="h-3 w-3 text-primary/40 shrink-0" />
                      <span className="truncate">{pool}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ingrédients résolus (légende) */}
            {nameMap.size > 0 && (
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ingrédients identifiés
                </h3>
                <p className="text-[11px] text-muted-foreground/60 mb-2">
                  {nameMap.size} sur {allRefs.length} ref{allRefs.length > 1 ? "s" : ""} résolue{nameMap.size > 1 ? "s" : ""}
                </p>
                <ul className="space-y-1">
                  {[...nameMap.values()].map((item) => (
                    <li key={item.ref}>
                      <Link
                        href={`/components/${item.id}`}
                        className="flex items-center gap-1.5 text-xs text-primary hover:underline truncate"
                      >
                        <ChevronRight className="h-3 w-3 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Métadonnées */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Métadonnées
              </h3>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-border/30">
                    <td className="py-1.5 text-muted-foreground">Type blueprint</td>
                    <td className="py-1.5 text-right font-medium text-foreground">{bp.blueprintType ?? "—"}</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="py-1.5 text-muted-foreground">Ref</td>
                    <td className="py-1.5 text-right font-mono text-[10px] text-muted-foreground/70">{bp.ref.slice(0, 8)}…</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="py-1.5 text-muted-foreground">Output ref</td>
                    <td className="py-1.5 text-right font-mono text-[10px] text-muted-foreground/70">
                      {bp.outputRef ? bp.outputRef.slice(0, 8) + "…" : "—"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-muted-foreground">Fichier</td>
                    <td className="py-1.5 text-right font-mono text-[10px] text-muted-foreground/70 break-all">
                      {bp.file ? bp.file.split(/[\\/]/).pop() : "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BlueprintDetail;
