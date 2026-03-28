'use client';
import { Construction } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useSEO } from "@/hooks/useSEO";

const ComingSoon = () => {
  const { t } = useTranslation();
  useSEO({ title: "Prochainement", noindex: true });
  const pathname = usePathname();

  const titleKeys: Record<string, string> = {
    "/weapons": "nav.weapons",
    "/components": "nav.components",
    "/locations": "nav.locations",
    "/vehicles": "nav.vehicles",
    "/search": "search.title",
  };

  const titleKey = titleKeys[pathname];
  const title = titleKey ? t(titleKey) : "Page";

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <Construction className="mb-4 h-16 w-16 text-primary animate-pulse-glow" />
      <h1 className="font-display text-3xl font-bold text-foreground">{title}</h1>
      <p className="mt-2 text-muted-foreground">{t("comingSoon.message")}</p>
    </div>
  );
};

export default ComingSoon;
