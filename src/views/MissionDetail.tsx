'use client';
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import pirateBg from "@/assets/pirate.png";
import missionLawBg from "@/assets/mission_law.png";
import {
  ArrowLeft, Loader2, AlertCircle, Crosshair, Package, Truck,
  FileSearch, Zap, Shield, Star, Pickaxe, Siren, Wrench, MapPin,
  Radio, Anchor, Flag, HelpCircle, Users, Repeat2, GraduationCap,
  Target, TrendingUp, AlertTriangle, CheckCircle2, Info,
} from "lucide-react";
import { useVersion } from "@/contexts/VersionContext";
import { apiFetch } from "@/lib/api";
import { useSEO } from "@/hooks/useSEO";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ReputationReward {
  factionRef:  string;
  factionName: string;
  scopeRef:    string | null;
  scopeName:   string | null;
  amount:      number;
}

interface ReputationPrerequisite {
  factionRef:  string;
  factionName: string | null;
  scopeRef:    string | null;
  scopeName:   string | null;
  exclude:     boolean;
  minStanding: string | null;
  maxStanding: string | null;
}

interface ReputationRequirement {
  wantedLevelMin:       number | null;
  wantedLevelMax:       number | null;
  jurisdictionOverride: string | null;
  prerequisites?:       ReputationPrerequisite[];
}

interface ApiMissionDetail {
  id:                     number;
  title:                  string;
  description:            string | null;
  type:                   string | null;
  source:                 string | null;
  lawful:                 boolean;
  difficulty:             number | null;
  givers:                 string[];
  reward:                 { amount: number; max: number | null; currency: string | null } | null;
  variantCount:           number;
  reputationRequirement:  ReputationRequirement | null;
  reputationRewards:      ReputationReward[] | null;
  objectives:             unknown[] | null;
  meta: {
    canBeShared:           boolean;
    onceOnly:              boolean;
    tutorial:              boolean;
    maxPlayersPerInstance: number | null;
  };
}

// ---------------------------------------------------------------------------
// Visual config (same as list page)
// ---------------------------------------------------------------------------

type TypeCfg = { icon: React.ElementType; color: string; iconColor: string; badge: string };

const TYPE_CFG: Record<string, TypeCfg> = {
  "Bounty Hunter":          { icon: Crosshair, color: "from-red-500/20 to-red-600/5 border-red-500/30",           iconColor: "text-red-400",    badge: "bg-red-500/10 text-red-400 border-red-500/30"         },
  "Mercenary":              { icon: Shield,    color: "from-orange-500/20 to-orange-600/5 border-orange-500/30",   iconColor: "text-orange-400", badge: "bg-orange-500/10 text-orange-400 border-orange-500/30" },
  "Delivery":               { icon: Package,   color: "from-blue-500/20 to-blue-600/5 border-blue-500/30",         iconColor: "text-blue-400",   badge: "bg-blue-500/10 text-blue-400 border-blue-500/30"       },
  "Hauling":                { icon: Truck,     color: "from-amber-500/20 to-amber-600/5 border-amber-500/30",      iconColor: "text-amber-400",  badge: "bg-amber-500/10 text-amber-400 border-amber-500/30"    },
  "Hauling - Local":        { icon: Truck,     color: "from-amber-500/20 to-amber-600/5 border-amber-500/30",      iconColor: "text-amber-400",  badge: "bg-amber-500/10 text-amber-400 border-amber-500/30"    },
  "Hauling - Planetary":    { icon: Truck,     color: "from-amber-500/20 to-amber-600/5 border-amber-500/30",      iconColor: "text-amber-400",  badge: "bg-amber-500/10 text-amber-400 border-amber-500/30"    },
  "Hauling - Stellar":      { icon: Truck,     color: "from-amber-500/20 to-amber-600/5 border-amber-500/30",      iconColor: "text-amber-400",  badge: "bg-amber-500/10 text-amber-400 border-amber-500/30"    },
  "Hauling - Interstellar": { icon: Truck,     color: "from-amber-500/20 to-amber-600/5 border-amber-500/30",      iconColor: "text-amber-400",  badge: "bg-amber-500/10 text-amber-400 border-amber-500/30"    },
  "Investigation":          { icon: FileSearch,color: "from-violet-500/20 to-violet-600/5 border-violet-500/30",   iconColor: "text-violet-400", badge: "bg-violet-500/10 text-violet-400 border-violet-500/30" },
  "Research":               { icon: FileSearch,color: "from-violet-500/20 to-violet-600/5 border-violet-500/30",   iconColor: "text-violet-400", badge: "bg-violet-500/10 text-violet-400 border-violet-500/30" },
  "Mining":                 { icon: Pickaxe,   color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30",iconColor: "text-emerald-400",badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"},
  "Salvage":                { icon: Wrench,    color: "from-stone-500/20 to-stone-600/5 border-stone-500/30",      iconColor: "text-stone-400",  badge: "bg-stone-500/10 text-stone-400 border-stone-500/30"    },
  "Racing":                 { icon: Flag,      color: "from-pink-500/20 to-pink-600/5 border-pink-500/30",         iconColor: "text-pink-400",   badge: "bg-pink-500/10 text-pink-400 border-pink-500/30"       },
  "Search":                 { icon: MapPin,    color: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/30",         iconColor: "text-cyan-400",   badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"       },
  "ECN Alert":              { icon: Siren,     color: "from-red-500/20 to-red-600/5 border-red-500/30",            iconColor: "text-red-400",    badge: "bg-red-500/10 text-red-400 border-red-500/30"          },
  "Maintenance":            { icon: Wrench,    color: "from-stone-500/20 to-stone-600/5 border-stone-500/30",      iconColor: "text-stone-400",  badge: "bg-stone-500/10 text-stone-400 border-stone-500/30"    },
  "Job":                    { icon: Anchor,    color: "from-sky-500/20 to-sky-600/5 border-sky-500/30",            iconColor: "text-sky-400",    badge: "bg-sky-500/10 text-sky-400 border-sky-500/30"          },
  "Appointment":            { icon: Radio,     color: "from-indigo-500/20 to-indigo-600/5 border-indigo-500/30",   iconColor: "text-indigo-400", badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30" },
  "Priority":               { icon: Zap,       color: "from-yellow-500/20 to-yellow-600/5 border-yellow-500/30",   iconColor: "text-yellow-400", badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" },
  "Service Beacons":        { icon: HelpCircle,color: "from-teal-500/20 to-teal-600/5 border-teal-500/30",        iconColor: "text-teal-400",   badge: "bg-teal-500/10 text-teal-400 border-teal-500/30"       },
};

const DEFAULT_CFG: TypeCfg = {
  icon: HelpCircle,
  color: "from-muted/20 to-muted/5 border-border",
  iconColor: "text-muted-foreground",
  badge: "bg-secondary text-muted-foreground border-border",
};

const typeCfg = (type: string | null): TypeCfg =>
  (type && TYPE_CFG[type]) ? TYPE_CFG[type] : DEFAULT_CFG;

const diffStars = (d: number | null) => (d === null || d < 0) ? 0 : Math.min(d, 4);
const diffColor = (d: number | null) => {
  if (d === null || d < 0) return "text-muted-foreground/30";
  if (d <= 1) return "text-emerald-400";
  if (d <= 2) return "text-amber-400";
  if (d <= 3) return "text-orange-400";
  return "text-red-400";
};

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

const InfoRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border/40 last:border-0">
    <span className="text-xs text-muted-foreground/70 shrink-0">{label}</span>
    <span className="text-xs font-medium text-foreground text-right">{children}</span>
  </div>
);

const JsonValue = ({ value }: { value: unknown }): React.ReactElement => {
  if (value === null || value === undefined) return <span className="text-muted-foreground/40 italic">—</span>;
  if (typeof value === 'boolean') return <span className={value ? "text-emerald-400" : "text-muted-foreground/50"}>{value ? "✓" : "✗"}</span>;
  if (typeof value === 'number') return <span className="text-primary font-mono">{value.toLocaleString()}</span>;
  if (typeof value === 'string') return <span>{value}</span>;
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-muted-foreground/40 italic">—</span>;
    return (
      <div className="space-y-1 pl-2 border-l border-border/40 mt-1">
        {value.map((item, i) => (
          <div key={i}><JsonValue value={item} /></div>
        ))}
      </div>
    );
  }
  if (typeof value === 'object') {
    return (
      <div className="space-y-1.5">
        {Object.entries(value as Record<string, unknown>).filter(([k]) => !['id', 'debugName'].includes(k)).map(([k, v]) => (
          <div key={k} className="flex flex-wrap gap-x-2 gap-y-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground/60 shrink-0 capitalize">
              {k.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2')}
            </span>
            <span className="text-[11px] text-foreground/80 break-all"><JsonValue value={v} /></span>
          </div>
        ))}
      </div>
    );
  }
  return <span>{String(value)}</span>;
};

const SectionCard = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
  <div className="rounded-lg border border-border bg-card overflow-hidden">
    <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3 bg-muted/20">
      <Icon className="h-4 w-4 text-primary" />
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const MissionDetail = () => {
  const { t }               = useTranslation();
  const params              = useParams();
  const router              = useRouter();
  const { selectedVersion } = useVersion();
  const [mission, setMission] = useState<ApiMissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  const id = params?.id as string;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    const qs = new URLSearchParams({ locale: 'fr' });
    if (selectedVersion) qs.set('gameVersion', String(selectedVersion.id));
    apiFetch<ApiMissionDetail>(`/api/missions/${id}?${qs}`)
      .then(setMission)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id, selectedVersion]);

  useSEO({
    title: mission?.title ?? `Mission #${id}`,
    description: mission ? `${mission.type ?? 'Mission'} — ${mission.source ?? ''}` : undefined,
    path: `/missions/${id}`,
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-muted-foreground">
        <AlertCircle className="h-10 w-10 opacity-30" />
        <p className="text-sm">{t("common.loadError")}</p>
        <button onClick={() => router.back()} className="text-sm text-primary hover:underline">
          {t("missions.detail.back")}
        </button>
      </div>
    );
  }

  const cfg   = typeCfg(mission.type);
  const Icon  = cfg.icon;
  const stars = diffStars(mission.difficulty);
  const dc    = diffColor(mission.difficulty);

  return (
    <div className="relative min-h-screen bg-background">

      {/* Hero */}
      <div className="relative border-b border-border bg-background">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url(${mission.lawful ? missionLawBg.src : pirateBg.src})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 to-background/80" />
        </div>
        <div className="relative z-10 container py-10">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("missions.detail.back")}
          </button>

          {/* Title row */}
          <div className="flex flex-wrap items-start gap-4">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border ${cfg.color}`}>
              <Icon className={`h-7 w-7 ${cfg.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                {mission.type && (
                  <span className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}>
                    {mission.type}
                  </span>
                )}
                <span className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${
                  mission.lawful
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-red-500/30 bg-red-500/10 text-red-400"
                }`}>
                  {mission.lawful ? t("missions.lawful") : t("missions.unlawful")}
                </span>
                {mission.variantCount > 1 && (
                  <span className="rounded border border-border/50 bg-secondary/60 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                    ×{mission.variantCount} {t("missions.detail.variants")}
                  </span>
                )}
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground leading-tight">
                {mission.title}
              </h1>
              {mission.givers.length > 0 && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {mission.givers.join(' · ')}
                </p>
              )}
            </div>

            {/* Difficulty stars */}
            {stars > 0 && (
              <div className="flex items-center gap-1 self-center">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < stars ? dc : "text-muted-foreground/20"}`} fill={i < stars ? "currentColor" : "none"} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container py-8">
        <div className="grid gap-6 lg:grid-cols-3">

          {/* ── Left: description ──────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description */}
            <SectionCard title={t("missions.detail.description")} icon={FileSearch}>
              {mission.description ? (
                <div className="text-sm leading-relaxed text-muted-foreground space-y-2">
                  {mission.description.split('\\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-muted-foreground/50">{t("missions.detail.noDescription")}</p>
              )}
            </SectionCard>

            {/* Objectives */}
            {mission.objectives && mission.objectives.length > 0 && (
              <SectionCard title={t("missions.detail.objectives")} icon={Target}>
                <div className="space-y-3">
                  {mission.objectives.map((obj, i) => (
                    <div key={i} className="rounded-md border border-border/40 bg-muted/20 overflow-hidden">
                      {typeof obj === 'string' ? (
                        <div className="flex items-start gap-2 px-3 py-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary/60" />
                          <span>{obj}</span>
                        </div>
                      ) : (
                        <div className="px-3 py-2.5">
                          <JsonValue value={obj} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Reputation rewards */}
            {mission.reputationRewards && mission.reputationRewards.length > 0 && (
              <SectionCard title={t("missions.detail.reputationRewards")} icon={TrendingUp}>
                <div className="space-y-2">
                  {mission.reputationRewards.map((rr, i) => (
                    <div key={i} className="flex items-center justify-between rounded-md border border-border/40 bg-muted/20 px-3 py-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{rr.factionName}</p>
                        {rr.scopeName && (
                          <p className="text-[11px] text-muted-foreground/70">{rr.scopeName}</p>
                        )}
                      </div>
                      <span className={`text-sm font-bold font-mono ${rr.amount >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {rr.amount >= 0 ? "+" : ""}{rr.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Reputation requirement */}
            {mission.reputationRequirement && (
              <SectionCard title={t("missions.detail.reputationRequired")} icon={AlertTriangle}>
                <div className="space-y-3">
                  {(mission.reputationRequirement.wantedLevelMin !== null ||
                    mission.reputationRequirement.wantedLevelMax !== null) && (
                    <div className="text-sm text-muted-foreground">
                      {t("missions.detail.wantedLevel")}:{" "}
                      <span className="font-medium text-foreground">
                        {mission.reputationRequirement.wantedLevelMin ?? 0} – {mission.reputationRequirement.wantedLevelMax ?? 5}
                      </span>
                    </div>
                  )}
                  {mission.reputationRequirement.prerequisites?.map((p, i) => (
                    <div key={i} className={`rounded-md border px-3 py-2 text-sm ${
                      p.exclude
                        ? "border-red-500/20 bg-red-500/5 text-red-300"
                        : "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
                    }`}>
                      <span className="font-medium">{p.factionName ?? p.factionRef}</span>
                      {p.scopeName && <span className="ml-1 text-xs opacity-70">({p.scopeName})</span>}
                      {p.minStanding && (
                        <span className="ml-2 text-xs opacity-80">
                          {p.minStanding}{p.maxStanding && p.maxStanding !== p.minStanding ? ` → ${p.maxStanding}` : ''}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>

          {/* ── Right: metadata ────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Reward */}
            {mission.reward ? (
              <SectionCard title={t("missions.reward")} icon={Zap}>
                <div className="text-center py-2">
                  <p className="font-display text-3xl font-bold text-primary font-mono">
                    {mission.reward.amount.toLocaleString()}
                    {mission.reward.max ? `–${mission.reward.max.toLocaleString()}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{mission.reward.currency}</p>
                </div>
              </SectionCard>
            ) : (
              <SectionCard title={t("missions.reward")} icon={Zap}>
                <p className="text-center text-sm italic text-muted-foreground/60 py-2">
                  {t("missions.variableReward")}
                </p>
              </SectionCard>
            )}

            {/* Mission info */}
            <SectionCard title={t("missions.detail.info")} icon={Info}>
              <InfoRow label={t("missions.source")}>{mission.source ?? "—"}</InfoRow>
              {mission.givers.length > 0 && (
                <InfoRow label={t("missions.detail.givers")}>
                  <span className="text-right">{mission.givers.join(', ')}</span>
                </InfoRow>
              )}
              {mission.difficulty !== null && mission.difficulty >= 0 && (
                <InfoRow label={t("missions.difficulty")}>
                  <div className="flex justify-end gap-0.5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < stars ? dc : "text-muted-foreground/20"}`} fill={i < stars ? "currentColor" : "none"} />
                    ))}
                  </div>
                </InfoRow>
              )}
              {mission.variantCount > 1 && (
                <InfoRow label={t("missions.detail.variants")}>
                  <span className="font-mono">{mission.variantCount}</span>
                </InfoRow>
              )}
            </SectionCard>

            {/* Meta flags */}
            <SectionCard title={t("missions.detail.conditions")} icon={Shield}>
              <InfoRow label={t("missions.detail.canBeShared")}>
                <div className={`flex items-center gap-1 ${mission.meta.canBeShared ? "text-emerald-400" : "text-muted-foreground/50"}`}>
                  <Users className="h-3.5 w-3.5" />
                  {mission.meta.canBeShared ? t("common.yes") : t("common.no")}
                </div>
              </InfoRow>
              <InfoRow label={t("missions.detail.onceOnly")}>
                <div className={`flex items-center gap-1 ${mission.meta.onceOnly ? "text-amber-400" : "text-muted-foreground/50"}`}>
                  <Repeat2 className="h-3.5 w-3.5" />
                  {mission.meta.onceOnly ? t("common.yes") : t("common.no")}
                </div>
              </InfoRow>
              {mission.meta.tutorial && (
                <InfoRow label={t("missions.detail.tutorial")}>
                  <div className="flex items-center gap-1 text-sky-400">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {t("common.yes")}
                  </div>
                </InfoRow>
              )}
              {mission.meta.maxPlayersPerInstance !== null && (
                <InfoRow label={t("missions.detail.maxPlayers")}>
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {mission.meta.maxPlayersPerInstance}
                  </div>
                </InfoRow>
              )}
            </SectionCard>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionDetail;
