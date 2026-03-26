export interface ShipComponent {
  id: string;
  name: string;
  manufacturer: string;
  type: "Shield" | "Power Plant" | "Cooler" | "Quantum Drive" | "Radar";
  size: "S" | "M" | "L";
  grade: "A" | "B" | "C" | "D";
  description: string;
}

export const components: ShipComponent[] = [
  // ===== SHIELDS =====
  // Small
  { id: "c1", name: "INK-Mark 1", manufacturer: "Seal Corp", type: "Shield", size: "S", grade: "D", description: "Basic small shield generator for starter ships." },
  { id: "c2", name: "FR-66", manufacturer: "Fortitude", type: "Shield", size: "S", grade: "C", description: "Reliable small shield with good regen rate." },
  { id: "c3", name: "Shimmer", manufacturer: "Basilisk", type: "Shield", size: "S", grade: "B", description: "High-performance shield with stealth characteristics." },
  { id: "c4", name: "Mirage", manufacturer: "Basilisk", type: "Shield", size: "S", grade: "A", description: "Top-tier small shield with signature reduction." },
  { id: "c80", name: "Palisade", manufacturer: "Seal Corp", type: "Shield", size: "S", grade: "D", description: "Rugged budget shield commonly found on Aegis ships." },
  { id: "c81", name: "Guardian", manufacturer: "Basilisk", type: "Shield", size: "S", grade: "B", description: "Balanced shield offering good protection and low emissions." },
  { id: "c82", name: "Spur", manufacturer: "Gorgon Defender", type: "Shield", size: "S", grade: "C", description: "Sturdy shield from Gorgon's economy line." },
  // Medium
  { id: "c5", name: "STOP-Barrier", manufacturer: "Seal Corp", type: "Shield", size: "M", grade: "D", description: "Standard medium shield generator." },
  { id: "c6", name: "Bulwark", manufacturer: "Fortitude", type: "Shield", size: "M", grade: "B", description: "Strong medium shield with high HP pool." },
  { id: "c7", name: "Rampart", manufacturer: "Basilisk", type: "Shield", size: "M", grade: "A", description: "Premium medium shield offering excellent coverage." },
  { id: "c83", name: "Aspis", manufacturer: "Gorgon Defender", type: "Shield", size: "M", grade: "C", description: "Reliable mid-range medium shield." },
  { id: "c84", name: "Citadel", manufacturer: "Basilisk", type: "Shield", size: "M", grade: "B", description: "Battle-hardened medium shield for multi-crew ships." },
  // Large
  { id: "c8", name: "AllStop", manufacturer: "Seal Corp", type: "Shield", size: "L", grade: "C", description: "Large shield suitable for capital ships." },
  { id: "c9", name: "Fortress", manufacturer: "Basilisk", type: "Shield", size: "L", grade: "A", description: "The ultimate large shield generator." },
  { id: "c85", name: "Glacis", manufacturer: "Gorgon Defender", type: "Shield", size: "L", grade: "D", description: "Entry-level large shield for big ships on a budget." },
  { id: "c86", name: "Citadel L", manufacturer: "Basilisk", type: "Shield", size: "L", grade: "B", description: "Large variant of the battle-proven Citadel series." },

  // ===== POWER PLANTS =====
  // Small
  { id: "c10", name: "Torus", manufacturer: "Aegis", type: "Power Plant", size: "S", grade: "D", description: "Basic small power plant for starter ships." },
  { id: "c11", name: "Regulus", manufacturer: "ArcCorp", type: "Power Plant", size: "S", grade: "C", description: "Upgraded power plant with better output." },
  { id: "c12", name: "Fierell Cascade", manufacturer: "Lightning Power", type: "Power Plant", size: "S", grade: "A", description: "Top-tier small power plant with maximum output." },
  { id: "c87", name: "Endurance", manufacturer: "ArcCorp", type: "Power Plant", size: "S", grade: "D", description: "Economy power plant with decent reliability." },
  { id: "c88", name: "Genoa", manufacturer: "Lightning Power", type: "Power Plant", size: "S", grade: "B", description: "High-output small power plant for combat ships." },
  // Medium
  { id: "c13", name: "Roughneck", manufacturer: "ArcCorp", type: "Power Plant", size: "M", grade: "D", description: "Standard medium power plant." },
  { id: "c14", name: "Maelstrom", manufacturer: "Lightning Power", type: "Power Plant", size: "M", grade: "B", description: "High-output medium power plant." },
  { id: "c89", name: "Quadracell", manufacturer: "ArcCorp", type: "Power Plant", size: "M", grade: "C", description: "Reliable medium power plant with good heat management." },
  { id: "c90", name: "Turbine", manufacturer: "Lightning Power", type: "Power Plant", size: "M", grade: "A", description: "Top-tier medium power plant with peak output." },
  // Large
  { id: "c15", name: "Drassik", manufacturer: "ArcCorp", type: "Power Plant", size: "L", grade: "C", description: "Large power plant for capital ships." },
  { id: "c16", name: "Eos", manufacturer: "Lightning Power", type: "Power Plant", size: "L", grade: "A", description: "Premium large power plant with incredible output." },
  { id: "c91", name: "Colossus", manufacturer: "ArcCorp", type: "Power Plant", size: "L", grade: "D", description: "Budget large power plant for basic capital operations." },
  { id: "c92", name: "Hyperion", manufacturer: "Lightning Power", type: "Power Plant", size: "L", grade: "B", description: "Reliable large power plant for military operations." },

  // ===== COOLERS =====
  // Small
  { id: "c17", name: "Bracer", manufacturer: "J-Span", type: "Cooler", size: "S", grade: "D", description: "Entry-level cooler for basic thermal management." },
  { id: "c18", name: "ZeroRush", manufacturer: "J-Span", type: "Cooler", size: "S", grade: "C", description: "Improved cooler with faster heat dissipation." },
  { id: "c19", name: "Blizzard", manufacturer: "J-Span", type: "Cooler", size: "S", grade: "A", description: "Premium small cooler for demanding setups." },
  { id: "c93", name: "Frost-Star", manufacturer: "Tyler Design", type: "Cooler", size: "S", grade: "B", description: "Compact cooler with excellent noise-to-cooling ratio." },
  // Medium
  { id: "c94", name: "SnowPack", manufacturer: "J-Span", type: "Cooler", size: "M", grade: "B", description: "Strong medium cooler for sustained combat." },
  { id: "c95", name: "Cryo-Core", manufacturer: "Tyler Design", type: "Cooler", size: "M", grade: "C", description: "Affordable medium cooler for everyday hauling." },
  { id: "c96", name: "TundraFrost", manufacturer: "J-Span", type: "Cooler", size: "M", grade: "D", description: "Standard medium cooler, decent thermal management." },
  { id: "c97", name: "ArcticFlow", manufacturer: "J-Span", type: "Cooler", size: "M", grade: "A", description: "Top-tier medium cooler for the most demanding loadouts." },
  // Large
  { id: "c98", name: "TundraFrost L", manufacturer: "J-Span", type: "Cooler", size: "L", grade: "C", description: "Standard large cooler for capital ships." },
  { id: "c99", name: "ArcticStorm", manufacturer: "J-Span", type: "Cooler", size: "L", grade: "B", description: "High-capacity cooler for large military vessels." },
  { id: "c100", name: "AbsoluteZero", manufacturer: "J-Span", type: "Cooler", size: "L", grade: "A", description: "The ultimate large cooler, unmatched heat dissipation." },
  { id: "c101", name: "Polar", manufacturer: "Tyler Design", type: "Cooler", size: "L", grade: "D", description: "Budget large cooler for basic capital operations." },

  // ===== QUANTUM DRIVES =====
  // Small
  { id: "c20", name: "Expedition", manufacturer: "ArcCorp", type: "Quantum Drive", size: "S", grade: "D", description: "Basic quantum drive with slow travel speed." },
  { id: "c21", name: "Beacon", manufacturer: "Roberts Space Industries", type: "Quantum Drive", size: "S", grade: "C", description: "Mid-range quantum drive with decent speed." },
  { id: "c22", name: "Odyssey", manufacturer: "Roberts Space Industries", type: "Quantum Drive", size: "S", grade: "B", description: "Fast quantum drive with good fuel efficiency." },
  { id: "c23", name: "Yeager", manufacturer: "ArcCorp", type: "Quantum Drive", size: "S", grade: "A", description: "Fastest small quantum drive available." },
  { id: "c102", name: "Voyage", manufacturer: "Roberts Space Industries", type: "Quantum Drive", size: "S", grade: "C", description: "Balanced quantum drive for mid-range ships." },
  // Medium
  { id: "c24", name: "Pontes", manufacturer: "Roberts Space Industries", type: "Quantum Drive", size: "M", grade: "B", description: "Reliable medium quantum drive." },
  { id: "c103", name: "Atlas", manufacturer: "ArcCorp", type: "Quantum Drive", size: "M", grade: "D", description: "Basic medium quantum drive for budget builds." },
  { id: "c104", name: "Goliath", manufacturer: "Roberts Space Industries", type: "Quantum Drive", size: "M", grade: "C", description: "Mid-range medium quantum drive." },
  { id: "c105", name: "Vortex", manufacturer: "ArcCorp", type: "Quantum Drive", size: "M", grade: "A", description: "Fastest medium quantum drive on the market." },
  // Large
  { id: "c25", name: "Kama", manufacturer: "ArcCorp", type: "Quantum Drive", size: "L", grade: "C", description: "Standard large quantum drive." },
  { id: "c26", name: "Erebos", manufacturer: "Roberts Space Industries", type: "Quantum Drive", size: "L", grade: "A", description: "Best-in-class large quantum drive." },
  { id: "c106", name: "Leviathan", manufacturer: "ArcCorp", type: "Quantum Drive", size: "L", grade: "D", description: "Budget large quantum drive, slow but reliable." },
  { id: "c107", name: "Constellation QD", manufacturer: "Roberts Space Industries", type: "Quantum Drive", size: "L", grade: "B", description: "Solid large quantum drive for explorer vessels." },

  // ===== RADARS =====
  // Small
  { id: "c108", name: "Crossfield", manufacturer: "TM", type: "Radar", size: "S", grade: "C", description: "Mid-range small radar with decent detection." },
  { id: "c109", name: "Surveyor", manufacturer: "TM", type: "Radar", size: "S", grade: "D", description: "Basic small radar for starter ships." },
  { id: "c110", name: "Ecouter", manufacturer: "Chimera", type: "Radar", size: "S", grade: "B", description: "High-sensitivity small radar for bounty hunters." },
  { id: "c111", name: "Tracker", manufacturer: "Chimera", type: "Radar", size: "S", grade: "A", description: "Top-tier small radar with maximum range and sensitivity." },
  // Medium
  { id: "c112", name: "Sentry", manufacturer: "TM", type: "Radar", size: "M", grade: "C", description: "Standard medium radar for multi-crew ships." },
  { id: "c113", name: "Overseer", manufacturer: "Chimera", type: "Radar", size: "M", grade: "B", description: "Advanced medium radar with multi-target tracking." },
  { id: "c114", name: "Panopticon", manufacturer: "Chimera", type: "Radar", size: "M", grade: "A", description: "Premium medium radar, unmatched detection capability." },
  // Large
  { id: "c115", name: "Explorer", manufacturer: "TM", type: "Radar", size: "L", grade: "A", description: "Exploration-grade large radar for deep space." },
  { id: "c116", name: "Watcher", manufacturer: "TM", type: "Radar", size: "L", grade: "C", description: "Standard large radar for capital operations." },
  { id: "c117", name: "Argus", manufacturer: "Chimera", type: "Radar", size: "L", grade: "B", description: "Military-grade large radar for fleet operations." },
];
