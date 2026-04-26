'use client';
import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Ship } from "@/data/ships";
import { Users, Globe, Rocket, Tag } from "lucide-react";
import { API_URL } from "@/lib/api";

const shortManufacturer: Record<string, string> = {
  "Roberts Space Industries": "RSI",
  "Aegis Dynamics": "Aegis",
  "Drake Interplanetary": "Drake",
  "Anvil Aerospace": "Anvil",
  "Crusader Industries": "Crusader",
  "Origin Jumpworks": "Origin",
  "Consolidated Outland": "C.O.",
  "Argo Astronautics": "Argo",
  "Greycat Industrial": "Greycat",
  "Kruger Intergalactic": "Kruger",
  "Tumbril Land Systems": "Tumbril",
};

const manufacturerLogo: Record<string, string> = {
  "Roberts Space Industries": "/manufacturers/logo-rsi.png",
  "Aegis Dynamics":           "/manufacturers/logo-aegis-dynamic.png",
  "Drake Interplanetary":     "/manufacturers/logo-drake.png",
  "Anvil Aerospace":          "/manufacturers/logo-anvil.webp",
  "Crusader Industries":      "/manufacturers/logo-crusader.webp",
  "Origin Jumpworks":         "/manufacturers/logo-origin.webp",
  "Consolidated Outland":     "/manufacturers/logo-consolidated-outland.png",
  "Argo Astronautics":        "/manufacturers/logo-argo-astraunotic.svg",
  "Greycat Industrial":       "/manufacturers/logo-greycat.svg",
  "Kruger Intergalactic":     "/manufacturers/logo-kruger-intergalactic.svg",
  "Tumbril Land Systems":     "/manufacturers/logo-tumbril.svg",
  "MISC":                     "/manufacturers/logo-misc.png",
  "Aopoa":                    "/manufacturers/logo-aopoa.svg",
  "Esperia":                  "/manufacturers/logo-esperia.svg",
};

interface ShipCardProps {
  ship: Ship;
}

const statusStyles = {
  "Flight Ready": "bg-emerald-500/80 text-white border-emerald-400/50",
  "In Concept": "bg-amber-500/80 text-white border-amber-400/50",
  "In Production": "bg-blue-500/80 text-white border-blue-400/50",
};

const ShipCard = ({ ship }: ShipCardProps) => {
  const { t, i18n } = useTranslation();
  const [imgError, setImgError] = useState(false);

  const statusLabels: Record<string, string> = {
    "Flight Ready":   t("ships.statusFlightReady"),
    "In Concept":     t("ships.statusInConcept"),
    "In Production":  t("ships.statusInProduction"),
  };

  return (
    <Link
      href={`/ships/${ship.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_hsl(var(--primary)/0.12)]"
    >
      {/* Image area */}
      <div className="relative h-52 overflow-hidden bg-secondary">
        {ship.image && !imgError ? (
          <img
            src={ship.image?.startsWith('/') ? `${API_URL}${ship.image}` : ship.image}
            alt={ship.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Rocket className="h-16 w-16 text-muted-foreground/15" />
          </div>
        )}

        {/* Manufacturer notch - top right */}
        <div className="absolute top-0 right-0 bg-background/80 backdrop-blur-md pl-3 pb-2 pr-3 pt-2 rounded-bl-lg border-l border-b border-border/50 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground/90">
          {manufacturerLogo[ship.manufacturer] && (
            <img
              src={manufacturerLogo[ship.manufacturer]}
              alt={ship.manufacturer}
              className="h-3.5 w-auto object-contain"
            />
          )}
          {shortManufacturer[ship.manufacturer] || ship.manufacturer}
        </div>

        {/* Status badge - bottom right */}
        <span className={`absolute bottom-3 right-3 inline-flex rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${statusStyles[ship.status] ?? 'bg-muted/80 text-foreground border-border/50'}`}>
          {statusLabels[ship.status] ?? ship.status}
        </span>
      </div>

      {/* Info bar - role / crew */}
      <div className="flex items-center gap-1.5 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent px-4 py-2 text-[11px] text-muted-foreground">
        <Globe className="h-3 w-3 text-primary/70" />
        <span className="font-medium text-foreground/80">{ship.role}</span>
        <span className="text-muted-foreground/40">/</span>
        <span>{ship.size}</span>
        <span className="text-muted-foreground/40">/</span>
        <Users className="h-3 w-3 text-primary/70" />
        <span>{t("ships.crewLabel")} {ship.crew}</span>
      </div>

      {/* Bottom section */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        {/* Ship name */}
        <h3 className="font-display text-xl font-bold text-foreground">
          {ship.name}
        </h3>

        {/* Price row */}
        {(ship.price != null || ship.priceEur != null) && (
          <div className="mt-auto border-t border-border pt-3">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Tag className="h-3.5 w-3.5" />
              <span className="text-xs">{t("ships.boutique")}</span>
            </div>
            <div className="flex items-baseline gap-2">
              {i18n.language === 'en' ? (
                <>
                  {ship.price != null && (
                    <span className="font-mono text-sm font-semibold text-foreground">
                      ${ship.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  )}
                  {ship.priceEur != null && (
                    <span className="font-mono text-xs text-muted-foreground/60">
                      {ship.priceEur.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </span>
                  )}
                </>
              ) : (
                <>
                  {ship.priceEur != null && (
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {ship.priceEur.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </span>
                  )}
                  {ship.price != null && (
                    <span className="font-mono text-xs text-muted-foreground/60">
                      ${ship.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

    </Link>
  );
};

export default ShipCard;
