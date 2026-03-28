'use client';
import Link from "next/link";
import { Wrench, FlaskConical, ChevronRight, Settings2, Gem } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSEO } from "@/hooks/useSEO";

const TOOLS = [
  {
    href: "/tools/loadout",
    icon: Settings2,
    color: "from-blue-500/20 to-blue-600/5",
    accent: "border-blue-500/40 group-hover:border-blue-400/60",
    iconColor: "text-blue-400",
    titleKey: "tools.loadout.title",
    descKey:  "tools.loadout.desc",
    badge: null,
  },
  {
    href: "/tools/crafting",
    icon: FlaskConical,
    color: "from-emerald-500/20 to-emerald-600/5",
    accent: "border-emerald-500/40 group-hover:border-emerald-400/60",
    iconColor: "text-emerald-400",
    titleKey: "tools.crafting.title",
    descKey:  "tools.crafting.desc",
    badge: null,
  },
  {
    href: "/tools/refining",
    icon: Gem,
    color: "from-violet-500/20 to-violet-600/5",
    accent: "border-violet-500/40 group-hover:border-violet-400/60",
    iconColor: "text-violet-400",
    titleKey: "tools.refining.title",
    descKey:  "tools.refining.desc",
    badge: null,
  },
];

const ToolsHub = () => {
  const { t } = useTranslation();
  useSEO({ title: "Outils", description: "Outils Star Citizen : comparateur de vaisseaux, simulateur de craft, planificateur CCU.", path: "/tools" });

  return (
    <div className="relative min-h-screen bg-background">
      {/* Hero background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[22vh] overflow-hidden">
        <img src="/hero-bg.jpg" alt="" aria-hidden className="h-full w-full object-cover opacity-30" style={{ objectPosition: "50% 40%" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex min-h-[20vh] items-center">
        <div className="container pb-2 pt-8">
          <div className="mb-1 flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("tools.hub.overline")}</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">{t("tools.hub.title")}</h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">{t("tools.hub.desc")}</p>
        </div>
      </div>

      {/* Tools grid */}
      <div className="relative z-10 container pb-16 pt-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`group relative flex flex-col overflow-hidden rounded-xl border bg-gradient-to-br ${tool.color} p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-border ${tool.accent}`}
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-border/50 bg-background/60 ${tool.iconColor}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mb-2 font-display text-lg font-bold text-foreground">
                  {t(tool.titleKey)}
                </h2>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {t(tool.descKey)}
                </p>
                <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${tool.iconColor}`}>
                  {t("common.open")} <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default ToolsHub;
