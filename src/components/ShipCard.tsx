'use client';
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Ship } from "@/data/ships";
import { Users, Globe, Rocket } from "lucide-react";

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

interface ShipCardProps {
  ship: Ship;
}

const statusStyles = {
  "Flight Ready": "bg-emerald-500/80 text-white border-emerald-400/50",
  "In Concept": "bg-amber-500/80 text-white border-amber-400/50",
  "In Production": "bg-blue-500/80 text-white border-blue-400/50",
};

const ShipCard = ({ ship }: ShipCardProps) => {
  const { t } = useTranslation();
  return (
    <Link
      href={`/ships/${ship.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_hsl(var(--primary)/0.12)]"
    >
      {/* Image area */}
      <div className="relative h-52 overflow-hidden bg-secondary">
        {ship.image ? (
          <img
            src={ship.image}
            alt={ship.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Rocket className="h-16 w-16 text-muted-foreground/15" />
          </div>
        )}

        {/* Manufacturer notch - top right */}
        <div className="absolute top-0 right-0 bg-background/80 backdrop-blur-md pl-3 pb-2 pr-3 pt-2 rounded-bl-lg border-l border-b border-border/50 text-[10px] font-bold uppercase tracking-wider text-foreground/90">
          {shortManufacturer[ship.manufacturer] || ship.manufacturer}
        </div>

        {/* Status badge - bottom right */}
        <span className={`absolute bottom-3 right-3 inline-flex rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${statusStyles[ship.status]}`}>
          {ship.status}
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
        {/* Manufacturer */}
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {ship.manufacturer}
        </p>

        {/* Ship name */}
        <h3 className="mt-1 font-display text-xl font-bold text-foreground">
          {ship.name}
        </h3>

        {/* Price row */}
        <div className="mt-auto flex items-baseline justify-between pt-3">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-muted-foreground">{t("ships.boutique")}</span>
            <span className="font-display text-sm font-bold text-accent">{ship.priceEur} €</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-muted-foreground">In-game</span>
            <span className="font-display text-base font-bold text-primary">
              {ship.price.toLocaleString()} aUEC
            </span>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-0.5 bg-gradient-to-r from-primary via-primary/60 to-accent/40" />
    </Link>
  );
};

export default ShipCard;
