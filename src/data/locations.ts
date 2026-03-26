export interface Location {
  id: string;
  name: string;
  type: "Planet" | "Moon" | "Station" | "City" | "Outpost" | "Asteroid Belt" | "Lagrange Point" | "Star" | "Rest Stop";
  system: string;
  parent?: string;
  atmosphere: string;
  gravity: string;
  description: string;
  orbitAngle?: number;
  orbitRadius?: number;
  size?: number;
  color?: string;
}

export interface StarSystem {
  id: string;
  name: string;
  position: [number, number, number];
  starColor: string;
  starSize: number;
  description: string;
}

export const starSystems: StarSystem[] = [
  { id: "stanton", name: "Stanton", position: [0, 0, 0], starColor: "#FFD93D", starSize: 2, description: "Système civilisé, siège des 4 grandes corporations." },
  { id: "pyro", name: "Pyro", position: [40, 5, -15], starColor: "#FF6B35", starSize: 1.6, description: "Système sans loi, dangereusement instable." },
  { id: "nyx", name: "Nyx", position: [-35, -8, 20], starColor: "#A78BFA", starSize: 1.4, description: "Système isolé, refuge de dissidents politiques." },
  { id: "terra", name: "Terra", position: [25, -12, 35], starColor: "#34D399", starSize: 1.8, description: "Système politique majeur de l'UEE, rival de Sol." },
  { id: "magnus", name: "Magnus", position: [-20, 10, -30], starColor: "#60A5FA", starSize: 1.2, description: "Système industriel en déclin, chantiers navals abandonnés." },
];

export const locations: Location[] = [
  // ===============================
  // === STANTON — Étoile ===
  // ===============================
  { id: "star-stanton", name: "Stanton (étoile)", type: "Star", system: "Stanton", atmosphere: "N/A", gravity: "N/A", description: "Étoile de type G du système Stanton, autour de laquelle orbitent quatre super-Terres.", orbitAngle: 0, orbitRadius: 0, size: 3, color: "#FFD93D" },

  // === Crusader & ses lunes ===
  { id: "l1", name: "Crusader", type: "Planet", system: "Stanton", atmosphere: "Gas Giant", gravity: "2.0g", description: "A gas giant and home to Crusader Industries, with floating platforms serving as habitation.", orbitAngle: 45, orbitRadius: 8, size: 1.8, color: "#38BDF8" },
  { id: "l2", name: "Orison", type: "City", system: "Stanton", parent: "Crusader", atmosphere: "Breathable (platforms)", gravity: "1.0g (artificial)", description: "A breathtaking floating city in the clouds of Crusader." },
  { id: "l9", name: "Port Olisar", type: "Station", system: "Stanton", parent: "Crusader", atmosphere: "Sealed", gravity: "Artificial", description: "A busy orbital station above Crusader, former main spawn point.", orbitAngle: 90, orbitRadius: 2.5, size: 0.3, color: "#FBBF24" },
  { id: "l11", name: "Daymar", type: "Moon", system: "Stanton", parent: "Crusader", atmosphere: "Thin", gravity: "0.3g", description: "A dusty moon with canyons and outposts, popular for racing.", orbitAngle: 180, orbitRadius: 3.5, size: 0.6, color: "#D4A574" },
  { id: "l12", name: "Yela", type: "Moon", system: "Stanton", parent: "Crusader", atmosphere: "None", gravity: "0.2g", description: "An icy moon with asteroid ring, known for drug labs and caves.", orbitAngle: 270, orbitRadius: 4.5, size: 0.55, color: "#CBD5E1" },
  { id: "l13", name: "Cellin", type: "Moon", system: "Stanton", parent: "Crusader", atmosphere: "Thin", gravity: "0.4g", description: "A volcanic moon with geysers and hostile outposts.", orbitAngle: 0, orbitRadius: 3, size: 0.5, color: "#EF4444" },
  { id: "l14", name: "GrimHEX", type: "Station", system: "Stanton", parent: "Yela", atmosphere: "Sealed", gravity: "Artificial", description: "An outlaw station carved into an asteroid near Yela." },

  // Outposts de Daymar
  { id: "out-d1", name: "Kudre Ore", type: "Outpost", system: "Stanton", parent: "Daymar", atmosphere: "Thin", gravity: "0.3g", description: "Un avant-poste minier d'extraction de minerai sur Daymar." },
  { id: "out-d2", name: "Shubin Mining SCD-1", type: "Outpost", system: "Stanton", parent: "Daymar", atmosphere: "Thin", gravity: "0.3g", description: "Installation minière de Shubin Interstellar sur Daymar." },
  { id: "out-d3", name: "ArcCorp Mining Area 141", type: "Outpost", system: "Stanton", parent: "Daymar", atmosphere: "Thin", gravity: "0.3g", description: "Zone d'extraction minière d'ArcCorp sur Daymar." },
  { id: "out-d4", name: "Bountiful Harvest Hydroponics", type: "Outpost", system: "Stanton", parent: "Daymar", atmosphere: "Thin", gravity: "0.3g", description: "Ferme hydroponique produisant des denrées alimentaires." },

  // Outposts de Cellin
  { id: "out-c1", name: "Hickes Research", type: "Outpost", system: "Stanton", parent: "Cellin", atmosphere: "Thin", gravity: "0.4g", description: "Laboratoire de recherche scientifique sur Cellin." },
  { id: "out-c2", name: "Terra Mills HydroFarm", type: "Outpost", system: "Stanton", parent: "Cellin", atmosphere: "Thin", gravity: "0.4g", description: "Ferme hydroponique dans les plaines volcaniques de Cellin." },
  { id: "out-c3", name: "Galette Family Farms", type: "Outpost", system: "Stanton", parent: "Cellin", atmosphere: "Thin", gravity: "0.4g", description: "Exploitation agricole familiale." },

  // Outposts de Yela
  { id: "out-y1", name: "Deakins Research", type: "Outpost", system: "Stanton", parent: "Yela", atmosphere: "None", gravity: "0.2g", description: "Poste avancé de recherche sur les glaciers de Yela." },
  { id: "out-y2", name: "ArcCorp Mining Area 157", type: "Outpost", system: "Stanton", parent: "Yela", atmosphere: "None", gravity: "0.2g", description: "Site minier d'ArcCorp creusé dans la glace de Yela." },
  { id: "out-y3", name: "Benson Mining Outpost", type: "Outpost", system: "Stanton", parent: "Yela", atmosphere: "None", gravity: "0.2g", description: "Petite exploitation minière indépendante." },

  // === Hurston & ses lunes ===
  { id: "l3", name: "Hurston", type: "Planet", system: "Stanton", atmosphere: "Toxic", gravity: "1.0g", description: "An ecologically devastated super-earth owned by Hurston Dynamics.", orbitAngle: 150, orbitRadius: 14, size: 1.5, color: "#F97316" },
  { id: "l4", name: "Lorville", type: "City", system: "Stanton", parent: "Hurston", atmosphere: "Toxic (sealed city)", gravity: "1.0g", description: "The largest city on Hurston, a sprawling industrial metropolis." },
  { id: "l10", name: "Everus Harbor", type: "Station", system: "Stanton", parent: "Hurston", atmosphere: "Sealed", gravity: "Artificial", description: "Hurston's orbital station providing docking services.", orbitAngle: 30, orbitRadius: 2.5, size: 0.3, color: "#FBBF24" },
  { id: "l15", name: "Aberdeen", type: "Moon", system: "Stanton", parent: "Hurston", atmosphere: "Toxic", gravity: "0.5g", description: "A hot, toxic moon with acid pools near Hurston.", orbitAngle: 200, orbitRadius: 3, size: 0.5, color: "#DC2626" },
  { id: "l16", name: "Arial", type: "Moon", system: "Stanton", parent: "Hurston", atmosphere: "Thin", gravity: "0.35g", description: "A barren moon close to Hurston with extreme temperatures.", orbitAngle: 60, orbitRadius: 3.5, size: 0.45, color: "#9CA3AF" },
  { id: "l17", name: "Magda", type: "Moon", system: "Stanton", parent: "Hurston", atmosphere: "Thin", gravity: "0.3g", description: "A rocky, mountainous moon orbiting Hurston.", orbitAngle: 310, orbitRadius: 4, size: 0.4, color: "#78716C" },
  { id: "l18", name: "Ita", type: "Moon", system: "Stanton", parent: "Hurston", atmosphere: "None", gravity: "0.1g", description: "The smallest moon of Hurston, barren and desolate.", orbitAngle: 140, orbitRadius: 4.5, size: 0.35, color: "#57534E" },

  // Outposts de Hurston
  { id: "out-h1", name: "HDMS-Edmond", type: "Outpost", system: "Stanton", parent: "Hurston", atmosphere: "Toxic", gravity: "1.0g", description: "Installation minière de Hurston Dynamics à la surface." },
  { id: "out-h2", name: "HDMS-Oparei", type: "Outpost", system: "Stanton", parent: "Hurston", atmosphere: "Toxic", gravity: "1.0g", description: "Avant-poste industriel de Hurston Dynamics." },
  { id: "out-h3", name: "HDMS-Hadley", type: "Outpost", system: "Stanton", parent: "Hurston", atmosphere: "Toxic", gravity: "1.0g", description: "Base d'opérations minières sur Hurston." },
  { id: "out-h4", name: "HDMS-Stanhope", type: "Outpost", system: "Stanton", parent: "Hurston", atmosphere: "Toxic", gravity: "1.0g", description: "Complexe minier au sud de Hurston." },

  // === ArcCorp & ses lunes ===
  { id: "l5", name: "ArcCorp", type: "Planet", system: "Stanton", atmosphere: "Breathable", gravity: "1.0g", description: "An entirely urbanized planet, covered in a single massive cityscape.", orbitAngle: 220, orbitRadius: 20, size: 1.6, color: "#A78BFA" },
  { id: "l6", name: "Area18", type: "City", system: "Stanton", parent: "ArcCorp", atmosphere: "Breathable", gravity: "1.0g", description: "The main landing zone on ArcCorp, a vibrant commercial hub." },
  { id: "l19", name: "Lyria", type: "Moon", system: "Stanton", parent: "ArcCorp", atmosphere: "Thin", gravity: "0.3g", description: "An icy moon of ArcCorp with frozen lakes.", orbitAngle: 120, orbitRadius: 3.5, size: 0.5, color: "#BAE6FD" },
  { id: "l20", name: "Wala", type: "Moon", system: "Stanton", parent: "ArcCorp", atmosphere: "None", gravity: "0.2g", description: "A tidally heated moon with volcanic activity.", orbitAngle: 280, orbitRadius: 3, size: 0.45, color: "#FCA5A5" },
  { id: "sta-arccorp", name: "Baijini Point", type: "Station", system: "Stanton", parent: "ArcCorp", atmosphere: "Sealed", gravity: "Artificial", description: "Station orbitale au-dessus d'ArcCorp, principal point d'amarrage.", orbitAngle: 160, orbitRadius: 2.5, size: 0.3, color: "#FBBF24" },

  // Outposts de Lyria
  { id: "out-ly1", name: "Loveridge Mineral Reserve", type: "Outpost", system: "Stanton", parent: "Lyria", atmosphere: "Thin", gravity: "0.3g", description: "Réserve minière exploitant les dépôts glaciaires de Lyria." },
  { id: "out-ly2", name: "Shubin Mining SAL-2", type: "Outpost", system: "Stanton", parent: "Lyria", atmosphere: "Thin", gravity: "0.3g", description: "Station minière de Shubin Interstellar sur Lyria." },
  { id: "out-ly3", name: "Humboldt Mines", type: "Outpost", system: "Stanton", parent: "Lyria", atmosphere: "Thin", gravity: "0.3g", description: "Complexe minier dans les crevasses de Lyria." },

  // === microTech & ses lunes ===
  { id: "l7", name: "microTech", type: "Planet", system: "Stanton", atmosphere: "Breathable", gravity: "0.9g", description: "A cold world known for tech innovation, home to microTech corporation.", orbitAngle: 310, orbitRadius: 26, size: 1.4, color: "#67E8F9" },
  { id: "l8", name: "New Babbage", type: "City", system: "Stanton", parent: "microTech", atmosphere: "Breathable", gravity: "0.9g", description: "A modern city of glass and steel, center of microTech operations." },
  { id: "l21", name: "Calliope", type: "Moon", system: "Stanton", parent: "microTech", atmosphere: "None", gravity: "0.2g", description: "A small icy moon orbiting microTech.", orbitAngle: 50, orbitRadius: 3, size: 0.4, color: "#E2E8F0" },
  { id: "l22", name: "Clio", type: "Moon", system: "Stanton", parent: "microTech", atmosphere: "Thin", gravity: "0.3g", description: "A frozen moon with research outposts.", orbitAngle: 170, orbitRadius: 3.5, size: 0.45, color: "#C4B5FD" },
  { id: "l23", name: "Euterpe", type: "Moon", system: "Stanton", parent: "microTech", atmosphere: "None", gravity: "0.15g", description: "The smallest moon of microTech.", orbitAngle: 290, orbitRadius: 4, size: 0.35, color: "#A5B4FC" },
  { id: "sta-microtech", name: "Port Tressler", type: "Station", system: "Stanton", parent: "microTech", atmosphere: "Sealed", gravity: "Artificial", description: "Station orbitale au-dessus de microTech, hub technologique.", orbitAngle: 350, orbitRadius: 2.5, size: 0.3, color: "#FBBF24" },

  // Outposts de microTech
  { id: "out-mt1", name: "Shubin Mining SMO-18", type: "Outpost", system: "Stanton", parent: "microTech", atmosphere: "Breathable", gravity: "0.9g", description: "Site minier de Shubin dans les montagnes enneigées." },
  { id: "out-mt2", name: "Rayari Deltana Research", type: "Outpost", system: "Stanton", parent: "microTech", atmosphere: "Breathable", gravity: "0.9g", description: "Centre de recherche Rayari Inc. spécialisé en xénobotanique." },
  { id: "out-mt3", name: "Rayari Anvik Research", type: "Outpost", system: "Stanton", parent: "microTech", atmosphere: "Breathable", gravity: "0.9g", description: "Laboratoire Rayari Inc. étudiant la faune locale." },

  // ===============================
  // === POINTS DE LAGRANGE ===
  // ===============================

  // Crusader Lagrange Points
  { id: "cru-l1", name: "CRU-L1", type: "Lagrange Point", system: "Stanton", parent: "Crusader", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L1 de Crusader, entre Crusader et Stanton. Zone fréquentée par les convois de ravitaillement.", orbitAngle: 45, orbitRadius: 5.5, size: 0.2, color: "#38BDF8" },
  { id: "cru-l2", name: "CRU-L2", type: "Lagrange Point", system: "Stanton", parent: "Crusader", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L2 de Crusader, derrière Crusader par rapport à Stanton. Zone calme, peu patrouillée." },
  { id: "cru-l3", name: "CRU-L3", type: "Lagrange Point", system: "Stanton", parent: "Crusader", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L3 de Crusader, à l'opposé de Crusader sur son orbite." },
  { id: "cru-l4", name: "CRU-L4", type: "Lagrange Point", system: "Stanton", parent: "Crusader", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L4 de Crusader, 60° en avance sur l'orbite. Point d'ancrage stable." },
  { id: "cru-l5", name: "CRU-L5", type: "Lagrange Point", system: "Stanton", parent: "Crusader", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L5 de Crusader, 60° en retard sur l'orbite. Point d'ancrage stable." },

  // Hurston Lagrange Points
  { id: "hur-l1", name: "HUR-L1", type: "Lagrange Point", system: "Stanton", parent: "Hurston", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L1 de Hurston. Présence de la station Rest Stop HUR-L1.", orbitAngle: 150, orbitRadius: 11, size: 0.2, color: "#F97316" },
  { id: "hur-l2", name: "HUR-L2", type: "Lagrange Point", system: "Stanton", parent: "Hurston", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L2 de Hurston, derrière la planète par rapport à l'étoile." },
  { id: "hur-l3", name: "HUR-L3", type: "Lagrange Point", system: "Stanton", parent: "Hurston", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L3 de Hurston, à l'opposé de Hurston." },
  { id: "hur-l4", name: "HUR-L4", type: "Lagrange Point", system: "Stanton", parent: "Hurston", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L4 de Hurston, position stable en avance." },
  { id: "hur-l5", name: "HUR-L5", type: "Lagrange Point", system: "Stanton", parent: "Hurston", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L5 de Hurston, position stable en retard." },

  // ArcCorp Lagrange Points
  { id: "arc-l1", name: "ARC-L1", type: "Lagrange Point", system: "Stanton", parent: "ArcCorp", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L1 d'ArcCorp. Zone de transit commercial majeure.", orbitAngle: 220, orbitRadius: 17, size: 0.2, color: "#A78BFA" },
  { id: "arc-l2", name: "ARC-L2", type: "Lagrange Point", system: "Stanton", parent: "ArcCorp", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L2 d'ArcCorp, dans l'ombre de la planète." },
  { id: "arc-l3", name: "ARC-L3", type: "Lagrange Point", system: "Stanton", parent: "ArcCorp", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L3 d'ArcCorp, opposé à la planète." },
  { id: "arc-l4", name: "ARC-L4", type: "Lagrange Point", system: "Stanton", parent: "ArcCorp", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L4 d'ArcCorp, position stable en avance." },
  { id: "arc-l5", name: "ARC-L5", type: "Lagrange Point", system: "Stanton", parent: "ArcCorp", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L5 d'ArcCorp, position stable en retard." },

  // microTech Lagrange Points
  { id: "mic-l1", name: "MIC-L1", type: "Lagrange Point", system: "Stanton", parent: "microTech", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L1 de microTech. Station Rest Stop à proximité.", orbitAngle: 310, orbitRadius: 23, size: 0.2, color: "#67E8F9" },
  { id: "mic-l2", name: "MIC-L2", type: "Lagrange Point", system: "Stanton", parent: "microTech", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L2 de microTech." },
  { id: "mic-l3", name: "MIC-L3", type: "Lagrange Point", system: "Stanton", parent: "microTech", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L3 de microTech." },
  { id: "mic-l4", name: "MIC-L4", type: "Lagrange Point", system: "Stanton", parent: "microTech", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L4 de microTech, position stable en avance." },
  { id: "mic-l5", name: "MIC-L5", type: "Lagrange Point", system: "Stanton", parent: "microTech", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L5 de microTech, position stable en retard." },

  // ===============================
  // === REST STOPS ===
  // ===============================
  { id: "rs-cru-l1", name: "Rest Stop CRU-L1", type: "Rest Stop", system: "Stanton", parent: "Crusader", atmosphere: "Sealed", gravity: "Artificial", description: "Station de repos au point de Lagrange L1 de Crusader. Services de ravitaillement, réparation et commerce." },
  { id: "rs-hur-l1", name: "Rest Stop HUR-L1", type: "Rest Stop", system: "Stanton", parent: "Hurston", atmosphere: "Sealed", gravity: "Artificial", description: "Station de repos au point de Lagrange L1 de Hurston. Hub logistique pour les opérations autour de Hurston." },
  { id: "rs-hur-l2", name: "Rest Stop HUR-L2", type: "Rest Stop", system: "Stanton", parent: "Hurston", atmosphere: "Sealed", gravity: "Artificial", description: "Station de repos au point L2 de Hurston, point d'escale calme." },
  { id: "rs-arc-l1", name: "Rest Stop ARC-L1", type: "Rest Stop", system: "Stanton", parent: "ArcCorp", atmosphere: "Sealed", gravity: "Artificial", description: "Station de repos au point L1 d'ArcCorp, très fréquentée par les commerçants." },
  { id: "rs-mic-l1", name: "Rest Stop MIC-L1", type: "Rest Stop", system: "Stanton", parent: "microTech", atmosphere: "Sealed", gravity: "Artificial", description: "Station de repos au point L1 de microTech, dernière escale avant les confins du système." },
  { id: "rs-cru-l4", name: "Rest Stop CRU-L4", type: "Rest Stop", system: "Stanton", parent: "Crusader", atmosphere: "Sealed", gravity: "Artificial", description: "Station de repos au point L4 de Crusader, position stable." },
  { id: "rs-cru-l5", name: "Rest Stop CRU-L5", type: "Rest Stop", system: "Stanton", parent: "Crusader", atmosphere: "Sealed", gravity: "Artificial", description: "Station de repos au point L5 de Crusader." },
  { id: "rs-hur-l3", name: "Rest Stop HUR-L3", type: "Rest Stop", system: "Stanton", parent: "Hurston", atmosphere: "Sealed", gravity: "Artificial", description: "Station de repos isolée au point L3 de Hurston." },
  { id: "rs-hur-l4", name: "Rest Stop HUR-L4", type: "Rest Stop", system: "Stanton", parent: "Hurston", atmosphere: "Sealed", gravity: "Artificial", description: "Station de repos au point L4 de Hurston." },
  { id: "rs-hur-l5", name: "Rest Stop HUR-L5", type: "Rest Stop", system: "Stanton", parent: "Hurston", atmosphere: "Sealed", gravity: "Artificial", description: "Station de repos au point L5 de Hurston." },

  // ===============================
  // === PYRO ===
  // ===============================
  { id: "star-pyro", name: "Pyro (étoile)", type: "Star", system: "Pyro", atmosphere: "N/A", gravity: "N/A", description: "Étoile instable du système Pyro, émettant des radiations dangereuses.", orbitAngle: 0, orbitRadius: 0, size: 2.5, color: "#FF6B35" },
  { id: "p1", name: "Pyro I", type: "Planet", system: "Pyro", atmosphere: "None", gravity: "0.4g", description: "A scorched planet dangerously close to the Pyro star.", orbitAngle: 30, orbitRadius: 6, size: 0.8, color: "#FF6B35" },
  { id: "p2", name: "Pyro II", type: "Planet", system: "Pyro", atmosphere: "Toxic", gravity: "0.8g", description: "A smog-covered world with rich mineral deposits.", orbitAngle: 120, orbitRadius: 12, size: 1.2, color: "#92400E" },
  { id: "p3", name: "Pyro III", type: "Planet", system: "Pyro", atmosphere: "Thin", gravity: "0.6g", description: "A habitable world, the only one in Pyro with settlements.", orbitAngle: 200, orbitRadius: 18, size: 1.4, color: "#65A30D" },
  { id: "p4", name: "Pyro IV", type: "Planet", system: "Pyro", atmosphere: "None", gravity: "1.2g", description: "A massive frozen world at the edge of the system.", orbitAngle: 290, orbitRadius: 24, size: 1.6, color: "#1E3A5F" },
  { id: "p5", name: "Pyro V", type: "Planet", system: "Pyro", atmosphere: "None", gravity: "0.5g", description: "Un monde rocheux froid et stérile aux confins du système Pyro.", orbitAngle: 350, orbitRadius: 30, size: 1.0, color: "#4B5563" },
  { id: "p6", name: "Pyro VI", type: "Planet", system: "Pyro", atmosphere: "None", gravity: "0.3g", description: "Une petite planète glacée, la plus éloignée de Pyro.", orbitAngle: 60, orbitRadius: 35, size: 0.7, color: "#1F2937" },
  { id: "p5s", name: "Ruin Station", type: "Station", system: "Pyro", parent: "Pyro III", atmosphere: "Sealed", gravity: "Artificial", description: "A lawless station orbiting Pyro III, hub for outlaws.", orbitAngle: 45, orbitRadius: 2.5, size: 0.3, color: "#FBBF24" },
  { id: "l24", name: "Pyro Gateway", type: "Station", system: "Pyro", atmosphere: "Sealed", gravity: "Artificial", description: "The entry station into the lawless Pyro system.", orbitAngle: 0, orbitRadius: 1 },
  { id: "p-checkmate", name: "Checkmate Station", type: "Station", system: "Pyro", parent: "Pyro II", atmosphere: "Sealed", gravity: "Artificial", description: "Station pirate en orbite de Pyro II, marché noir prospère." },

  // Pyro Lagrange Points
  { id: "pyro-l1", name: "PYR-L1", type: "Lagrange Point", system: "Pyro", parent: "Pyro I", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L1 de Pyro I. Zone de radiation intense." },
  { id: "pyro-l4", name: "PYR-L4", type: "Lagrange Point", system: "Pyro", parent: "Pyro III", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L4 de Pyro III. Zone de rassemblement pour les flottes pirates." },
  { id: "pyro-l5", name: "PYR-L5", type: "Lagrange Point", system: "Pyro", parent: "Pyro III", atmosphere: "N/A", gravity: "Microgravité", description: "Point de Lagrange L5 de Pyro III. Débris et épaves de vaisseaux abandonnés." },

  // ===============================
  // === NYX ===
  // ===============================
  { id: "star-nyx", name: "Nyx (étoile)", type: "Star", system: "Nyx", atmosphere: "N/A", gravity: "N/A", description: "Étoile faible du système Nyx, fournissant peu de lumière à ses planètes.", orbitAngle: 0, orbitRadius: 0, size: 2, color: "#A78BFA" },
  { id: "n1", name: "Delamar", type: "Planet", system: "Nyx", atmosphere: "None", gravity: "0.3g", description: "An asteroid turned planetoid, home to the political dissident group.", orbitAngle: 90, orbitRadius: 10, size: 1.0, color: "#6B7280" },
  { id: "n2", name: "Levski", type: "City", system: "Nyx", parent: "Delamar", atmosphere: "Sealed", gravity: "0.3g", description: "An underground city built into Delamar, haven for political refugees." },
  { id: "n3", name: "Nyx I", type: "Planet", system: "Nyx", atmosphere: "Thin", gravity: "0.7g", description: "A cold, dark world with minimal sunlight.", orbitAngle: 210, orbitRadius: 16, size: 1.2, color: "#4C1D95" },
  { id: "n4", name: "Nyx II", type: "Planet", system: "Nyx", atmosphere: "None", gravity: "0.5g", description: "A barren ice giant at the far edge of Nyx.", orbitAngle: 330, orbitRadius: 22, size: 1.5, color: "#312E81" },
  { id: "n5", name: "Nyx III", type: "Planet", system: "Nyx", atmosphere: "None", gravity: "0.8g", description: "Monde rocheux dense dans la zone extérieure du système Nyx.", orbitAngle: 150, orbitRadius: 28, size: 1.3, color: "#374151" },

  // ===============================
  // === TERRA ===
  // ===============================
  { id: "star-terra", name: "Terra (étoile)", type: "Star", system: "Terra", atmosphere: "N/A", gravity: "N/A", description: "Étoile G2V du système Terra, similaire à Sol.", orbitAngle: 0, orbitRadius: 0, size: 2.2, color: "#34D399" },
  { id: "t1", name: "Terra", type: "Planet", system: "Terra", atmosphere: "Breathable", gravity: "0.95g", description: "La seconde Terre, rivale politique de Sol. Monde luxuriant et civilisé.", orbitAngle: 100, orbitRadius: 14, size: 1.7, color: "#34D399" },
  { id: "t2", name: "Prime", type: "City", system: "Terra", parent: "Terra", atmosphere: "Breathable", gravity: "0.95g", description: "La capitale de Terra, centre politique et culturel majeur de l'UEE." },
  { id: "t3", name: "Pikon", type: "Planet", system: "Terra", atmosphere: "Toxic", gravity: "1.3g", description: "Planète industrielle proche de l'étoile, forte activité manufacturière.", orbitAngle: 40, orbitRadius: 8, size: 1.2, color: "#D97706" },
  { id: "t4", name: "Gen", type: "Planet", system: "Terra", atmosphere: "Breathable", gravity: "0.7g", description: "Monde agricole fournissant des denrées à l'ensemble du système.", orbitAngle: 200, orbitRadius: 20, size: 1.3, color: "#84CC16" },
  { id: "t5", name: "Marisol", type: "Moon", system: "Terra", parent: "Terra", atmosphere: "Thin", gravity: "0.25g", description: "Lune terraformée de Terra avec des installations de recherche.", orbitAngle: 60, orbitRadius: 3, size: 0.4, color: "#6EE7B7" },

  // ===============================
  // === MAGNUS ===
  // ===============================
  { id: "star-magnus", name: "Magnus (étoile)", type: "Star", system: "Magnus", atmosphere: "N/A", gravity: "N/A", description: "Étoile vieillissante du système Magnus.", orbitAngle: 0, orbitRadius: 0, size: 1.8, color: "#60A5FA" },
  { id: "m1", name: "Magnus I", type: "Planet", system: "Magnus", atmosphere: "None", gravity: "0.4g", description: "Planète rocheuse proche de l'étoile, inhabitable.", orbitAngle: 70, orbitRadius: 7, size: 0.9, color: "#B45309" },
  { id: "m2", name: "Borea", type: "Planet", system: "Magnus", atmosphere: "Breathable", gravity: "0.85g", description: "Le seul monde habité de Magnus, connu pour ses chantiers navals abandonnés.", orbitAngle: 180, orbitRadius: 14, size: 1.4, color: "#3B82F6" },
  { id: "m3", name: "Odyssa", type: "City", system: "Magnus", parent: "Borea", atmosphere: "Breathable", gravity: "0.85g", description: "Ville principale de Borea, centre des opérations de démantèlement naval." },
  { id: "m4", name: "Magnus III", type: "Planet", system: "Magnus", atmosphere: "Thin", gravity: "0.6g", description: "Monde froid au bord extérieur du système, peu exploré.", orbitAngle: 300, orbitRadius: 22, size: 1.1, color: "#1E40AF" },

  // ===============================
  // === CEINTURES D'ASTÉROÏDES ===
  // ===============================
  { id: "ab-stanton", name: "Aaron Halo", type: "Asteroid Belt", system: "Stanton", atmosphere: "N/A", gravity: "N/A", description: "Immense ceinture d'astéroïdes entre ArcCorp et microTech, riche en minerais et en dangers.", orbitAngle: 0, orbitRadius: 23, size: 0.15, color: "#9CA3AF" },
  { id: "ab-pyro", name: "Akiro Cluster", type: "Asteroid Belt", system: "Pyro", atmosphere: "N/A", gravity: "N/A", description: "Amas d'astéroïdes dans le système Pyro, repaire de pirates et de mineurs téméraires.", orbitAngle: 0, orbitRadius: 15, size: 0.15, color: "#78716C" },
];
