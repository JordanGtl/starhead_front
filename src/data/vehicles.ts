export interface Vehicle {
  id: string;
  name: string;
  manufacturer: string;
  type: "Ground" | "Hover" | "Gravlev";
  seats: number;
  speed: number;
  cargo: number;
  weapons: boolean;
  description: string;
}

export const vehicles: Vehicle[] = [
  // === RSI ===
  { id: "v1", name: "Ursa Rover", manufacturer: "Roberts Space Industries", type: "Ground", seats: 6, speed: 40, cargo: 2, weapons: true, description: "A rugged military-grade exploration rover with a turret." },

  // === Tumbril ===
  { id: "v2", name: "Cyclone", manufacturer: "Tumbril Land Systems", type: "Ground", seats: 2, speed: 60, cargo: 1, weapons: false, description: "A lightweight, fast ground vehicle for reconnaissance." },
  { id: "v3", name: "Cyclone-AA", manufacturer: "Tumbril Land Systems", type: "Ground", seats: 2, speed: 55, cargo: 0, weapons: true, description: "Anti-aircraft variant with dual missile racks." },
  { id: "v4", name: "Cyclone-MT", manufacturer: "Tumbril Land Systems", type: "Ground", seats: 2, speed: 55, cargo: 0, weapons: true, description: "Military variant equipped with a size 1 turret." },
  { id: "v14", name: "Cyclone-RC", manufacturer: "Tumbril Land Systems", type: "Ground", seats: 1, speed: 70, cargo: 0, weapons: false, description: "Racing variant stripped down for maximum speed." },
  { id: "v15", name: "Cyclone-RN", manufacturer: "Tumbril Land Systems", type: "Ground", seats: 2, speed: 55, cargo: 0, weapons: false, description: "Reconnaissance variant with enhanced scanning equipment." },
  { id: "v16", name: "Cyclone-TR", manufacturer: "Tumbril Land Systems", type: "Ground", seats: 2, speed: 55, cargo: 2, weapons: false, description: "Transport variant with expanded cargo capacity." },
  { id: "v5", name: "Nova Tank", manufacturer: "Tumbril Land Systems", type: "Ground", seats: 2, speed: 30, cargo: 0, weapons: true, description: "A heavy battle tank with devastating firepower." },
  { id: "v12", name: "Spartan", manufacturer: "Tumbril Land Systems", type: "Ground", seats: 8, speed: 45, cargo: 2, weapons: false, description: "An armored personnel carrier for troop transport." },
  { id: "v17", name: "Storm", manufacturer: "Tumbril Land Systems", type: "Ground", seats: 3, speed: 50, cargo: 0, weapons: true, description: "Anti-aircraft artillery vehicle with twin ballistic cannons." },
  { id: "v18", name: "Storm-AA", manufacturer: "Tumbril Land Systems", type: "Ground", seats: 3, speed: 45, cargo: 0, weapons: true, description: "Anti-air variant equipped with missile battery." },
  { id: "v19", name: "Centurion", manufacturer: "Tumbril Land Systems", type: "Ground", seats: 2, speed: 35, cargo: 0, weapons: true, description: "Heavy assault tank with reinforced armor plating." },

  // === Greycat ===
  { id: "v6", name: "PTV", manufacturer: "Greycat Industrial", type: "Ground", seats: 2, speed: 35, cargo: 0, weapons: false, description: "A small personal transport buggy." },
  { id: "v7", name: "ROC", manufacturer: "Greycat Industrial", type: "Ground", seats: 1, speed: 25, cargo: 1, weapons: false, description: "A mining vehicle for hand-mineable surface deposits." },
  { id: "v8", name: "ROC-DS", manufacturer: "Greycat Industrial", type: "Ground", seats: 2, speed: 25, cargo: 1, weapons: false, description: "Dual-seat variant of the ROC mining vehicle." },
  { id: "v20", name: "STV", manufacturer: "Greycat Industrial", type: "Ground", seats: 2, speed: 50, cargo: 1, weapons: false, description: "A sporty all-terrain vehicle for exploration." },
  { id: "v21", name: "Cydnus", manufacturer: "Greycat Industrial", type: "Ground", seats: 1, speed: 20, cargo: 2, weapons: false, description: "A compact utility tractor for loading operations." },

  // === Gravlev ===
  { id: "v9", name: "Dragonfly", manufacturer: "Drake Interplanetary", type: "Gravlev", seats: 2, speed: 55, cargo: 1, weapons: true, description: "An open-canopy gravlev bike with dual weapons." },
  { id: "v22", name: "Dragonfly Yellowjacket", manufacturer: "Drake Interplanetary", type: "Gravlev", seats: 2, speed: 55, cargo: 1, weapons: true, description: "Variant jaune et noir du Dragonfly, même performances." },
  { id: "v10", name: "Nox", manufacturer: "Aopoa", type: "Gravlev", seats: 1, speed: 65, cargo: 0, weapons: true, description: "A sleek Xi'an-designed racing gravlev bike." },
  { id: "v23", name: "Nox Kue", manufacturer: "Aopoa", type: "Gravlev", seats: 1, speed: 65, cargo: 0, weapons: true, description: "Variant argenté du Nox, performances identiques." },
  { id: "v24", name: "HoverQuad", manufacturer: "Consolidated Outland", type: "Gravlev", seats: 1, speed: 50, cargo: 1, weapons: false, description: "Quad gravlev compact, idéal pour les courtes excursions." },
  { id: "v25", name: "X1 Base", manufacturer: "Origin Jumpworks", type: "Gravlev", seats: 1, speed: 60, cargo: 0, weapons: false, description: "Luxueux gravlev bike d'Origin, design raffiné." },
  { id: "v26", name: "X1 Velocity", manufacturer: "Origin Jumpworks", type: "Gravlev", seats: 1, speed: 70, cargo: 0, weapons: false, description: "Variant racing du X1, optimisé pour la vitesse pure." },
  { id: "v27", name: "X1 Force", manufacturer: "Origin Jumpworks", type: "Gravlev", seats: 1, speed: 55, cargo: 0, weapons: true, description: "Variant armé du X1 avec canons laser." },

  // === Motos ===
  { id: "v11", name: "Ranger", manufacturer: "Consolidated Outland", type: "Ground", seats: 1, speed: 70, cargo: 0, weapons: false, description: "A classic motorcycle for personal transport." },
  { id: "v28", name: "Ranger CV", manufacturer: "Consolidated Outland", type: "Ground", seats: 1, speed: 65, cargo: 1, weapons: false, description: "Variant cargo du Ranger avec sacoches latérales." },
  { id: "v29", name: "Ranger RC", manufacturer: "Consolidated Outland", type: "Ground", seats: 1, speed: 75, cargo: 0, weapons: false, description: "Variant racing du Ranger, allégé pour la course." },
  { id: "v30", name: "Ranger TR", manufacturer: "Consolidated Outland", type: "Ground", seats: 1, speed: 65, cargo: 0, weapons: true, description: "Variant militaire du Ranger avec arme montée." },

  // === Autres ===
  { id: "v31", name: "Mule", manufacturer: "Drake Interplanetary", type: "Ground", seats: 1, speed: 20, cargo: 4, weapons: false, description: "Petit chariot utilitaire pour le transport de cargaison à courte distance." },
  { id: "v32", name: "Atlas", manufacturer: "RSI", type: "Ground", seats: 1, speed: 25, cargo: 6, weapons: false, description: "Plateforme de transport lourd pour le chargement de cargo." },
];
