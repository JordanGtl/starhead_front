import { Construction } from "lucide-react";
import { useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/weapons": "Armes",
  "/components": "Composants",
  "/locations": "Lieux",
  "/vehicles": "Véhicules",
  "/search": "Recherche",
};

const ComingSoon = () => {
  const location = useLocation();
  const title = titles[location.pathname] || "Page";

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <Construction className="mb-4 h-16 w-16 text-primary animate-pulse-glow" />
      <h1 className="font-display text-3xl font-bold text-foreground">{title}</h1>
      <p className="mt-2 text-muted-foreground">Cette section est en cours de construction. Revenez bientôt !</p>
    </div>
  );
};

export default ComingSoon;
