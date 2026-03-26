import { ships } from "./ships";
import { weapons } from "./weapons";
import { locations } from "./locations";
import { vehicles } from "./vehicles";
import { components } from "./components";
import { manufacturers } from "./manufacturers";
import { loreEntries } from "./lore";

export type SearchCategory = "all" | "ships" | "weapons" | "locations" | "vehicles" | "components" | "manufacturers" | "lore";

export interface SearchResult {
  id: string;
  name: string;
  category: SearchCategory;
  categoryLabel: string;
  subtitle: string;
  description: string;
  link: string;
  meta: Record<string, string>;
}

export function globalSearch(query: string, category: SearchCategory = "all"): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: SearchResult[] = [];

  if (category === "all" || category === "ships") {
    ships.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.manufacturer.toLowerCase().includes(q) ||
      s.role.toLowerCase().includes(q)
    ).forEach(s => results.push({
      id: String(s.id), name: s.name, category: "ships", categoryLabel: "Vaisseau",
      subtitle: s.manufacturer, description: s.description ?? "",
      link: `/ships/${s.id}`,
      meta: { Rôle: s.role, Taille: s.size, Prix: `${(s.price ?? 0).toLocaleString()} aUEC` },
    }));
  }

  if (category === "all" || category === "weapons") {
    weapons.filter(w =>
      w.name.toLowerCase().includes(q) ||
      w.manufacturer.toLowerCase().includes(q) ||
      w.type.toLowerCase().includes(q)
    ).forEach(w => results.push({
      id: w.id, name: w.name, category: "weapons", categoryLabel: "Arme",
      subtitle: w.manufacturer, description: w.description,
      link: `/weapons`,
      meta: { Type: w.type, Taille: String(w.size), Catégorie: w.category },
    }));
  }

  if (category === "all" || category === "locations") {
    locations.filter(l =>
      (l.name ?? "").toLowerCase().includes(q) ||
      (l.system ?? "").toLowerCase().includes(q) ||
      (l.type ?? "").toLowerCase().includes(q)
    ).forEach(l => results.push({
      id: String(l.id), name: l.name ?? l.internal ?? "", category: "locations", categoryLabel: "Lieu",
      subtitle: (l.system ?? "") + (l.parent ? ` · ${l.parent}` : ""), description: l.description ?? "",
      link: `/locations`,
      meta: { Type: l.type ?? "", Gravité: l.gravity ?? "", Atmosphère: l.atmosphere ?? "" },
    }));
  }

  if (category === "all" || category === "vehicles") {
    vehicles.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.manufacturer.toLowerCase().includes(q) ||
      v.type.toLowerCase().includes(q)
    ).forEach(v => results.push({
      id: v.id, name: v.name, category: "vehicles", categoryLabel: "Véhicule",
      subtitle: v.manufacturer, description: v.description,
      link: `/vehicles`,
      meta: { Type: v.type, Vitesse: `${v.speed ?? 0} km/h`, Places: String(v.seats ?? 0) },
    }));
  }

  if (category === "all" || category === "components") {
    components.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.manufacturer.toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q)
    ).forEach(c => results.push({
      id: String(c.id), name: c.name, category: "components", categoryLabel: "Composant",
      subtitle: c.manufacturer, description: c.description ?? "",
      link: `/components`,
      meta: { Type: c.type, Taille: c.size, Grade: c.grade },
    }));
  }

  if (category === "all" || category === "manufacturers") {
    manufacturers.filter(m =>
      m.name.toLowerCase().includes(q) ||
      (m.description ?? "").toLowerCase().includes(q) ||
      (m.industry ?? []).some(i => i.toLowerCase().includes(q))
    ).forEach(m => results.push({
      id: String(m.id), name: m.name, category: "manufacturers", categoryLabel: "Entreprise",
      subtitle: m.headquarters ?? "", description: m.description ?? "",
      link: `/manufacturers/${m.slug}`,
      meta: { Fondée: m.founded ?? "", Secteurs: (m.industry ?? []).join(", ") },
    }));
  }

  if (category === "all" || category === "lore") {
    loreEntries.filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.summary.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q)
    ).forEach(l => results.push({
      id: String(l.id), name: l.title, category: "lore", categoryLabel: "Lore",
      subtitle: l.category, description: l.summary,
      link: `/lore`,
      meta: { Catégorie: l.category, ...(l.date ? { Date: l.date } : {}) },
    }));
  }

  return results;
}
