import { Construction } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ComingSoon = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const titleKeys: Record<string, string> = {
    "/weapons": "nav.weapons",
    "/components": "nav.components",
    "/locations": "nav.locations",
    "/vehicles": "nav.vehicles",
    "/search": "search.title",
  };

  const titleKey = titleKeys[location.pathname];
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
