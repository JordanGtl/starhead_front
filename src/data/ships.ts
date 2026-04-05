import { apiFetch } from '@/lib/api';

export interface Ship {
  id: number;
  name: string;
  internalName?: string;
  manufacturer: string;
  role: string;
  size: string;
  movementClass?: string | null;
  crew: string;          // calculé depuis minCrew/maxCrew
  minCrew: number | null;
  maxCrew: number | null;
  cargo: number | null;
  price: number | null;
  priceEur: number | null;
  status: "Flight Ready" | "In Concept" | "In Production";
  description: string | null;
  image: string | null;
  // dimensions réelles (liste + détail)
  sizeX?: number | null;   // longueur (m)
  sizeY?: number | null;   // largeur  (m)
  sizeZ?: number | null;   // hauteur  (m)
  // détails (ship:read)
  lore?: string | null;
  lengthM?: number | null;
  beamM?: number | null;
  heightM?: number | null;
  massKg?: number | null;
  scmSpeedMs?: number | null;
  afterburnerSpeedMs?: number | null;
  fuelCapacity?: number | null;
  fuelIntake?: number | null;
  quantumFuelCapacity?: number | null;
  shieldHp?: number | null;
  hullHp?: number | null;
}

/** Dérive la chaîne crew depuis min/max */
function crewLabel(min: number | null, max: number | null): string {
  if (!min && !max) return '1';
  if (min === max || !max) return String(min ?? 1);
  return `${min}-${max}`;
}

function normalize(s: unknown): Ship {
  const raw = s as Record<string, unknown>;
  return {
    ...(raw as unknown as Ship),
    id: Number(raw.id),
    crew: crewLabel(raw.minCrew as number | null, raw.maxCrew as number | null),
  };
}

/** Cache synchrone pour la recherche globale */
export let ships: Ship[] = [];

export const manufacturers = [
  "Aegis Dynamics", "Anvil Aerospace", "Aopoa", "Argo Astronautics",
  "Banu", "Consolidated Outland", "Crusader Industries", "Drake Interplanetary",
  "Esperia", "Gatac", "Greycat Industrial", "Kruger Intergalactic",
  "MISC", "Origin Jumpworks", "Roberts Space Industries", "Tumbril Land Systems",
];

export const roles = [
  "Fighter", "Bomber", "Transport", "Mining", "Exploration", "Medical",
  "Salvage", "Racing", "Dropship", "Gunship", "Stealth", "Multi-Role",
  "Cargo", "Refueling", "Interception", "Data Running", "Luxury",
  "Support", "Repair",
];

export async function fetchShips(params?: Record<string, string>): Promise<Ship[]> {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  const data = await apiFetch<unknown[]>(`/api/ships${qs}`);
  const result = data.map(normalize);
  if (!params) ships = result; // cache uniquement pour la liste complète
  return result;
}

export async function fetchShip(id: number | string): Promise<Ship> {
  const data = await apiFetch<unknown>(`/api/ships/${id}`);
  return normalize(data);
}
