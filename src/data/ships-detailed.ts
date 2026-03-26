export interface ShipComponent {
  name: string;
  type: "Weapon" | "Shield" | "Power Plant" | "Cooler" | "Quantum Drive" | "Radar" | "Missile Rack";
  size: string;
  grade: string;
  manufacturer: string;
}

export interface Hardpoint {
  slot: string;
  size: number;
  type: "Weapon" | "Missile" | "Utility" | "Turret";
  equipped?: string;
}

export interface ShipSpecs {
  length: number;
  beam: number;
  height: number;
  mass: number;
  scmSpeed: number;
  maxSpeed: number;
  qtFuelCapacity: number;
  hydrogenFuelCapacity: number;
  shieldHp: number;
  hullHp: number;
}

export interface ShipDetailed {
  id: string;
  name: string;
  manufacturer: string;
  role: string;
  size: string;
  crew: string;
  cargo: number;
  price: number;
  status: "Flight Ready" | "In Concept" | "In Production";
  description: string;
  lore: string;
  specs: ShipSpecs;
  hardpoints: Hardpoint[];
  defaultComponents: ShipComponent[];
  compatibleComponents: ShipComponent[];
}

export const shipsDetailed: ShipDetailed[] = [
  {
    id: "1", name: "Aurora MR", manufacturer: "Roberts Space Industries", role: "Multi-Role", size: "Small", crew: "1", cargo: 3, price: 25000, status: "Flight Ready",
    description: "The Aurora MR is the base model of RSI's flagship starter ship.",
    lore: "The Aurora is the modern day descendant of the X-7, Roberts Space Industries' first commercially available spacecraft. Designed as an introductory ship for new pilots, the Aurora MR offers reliability and versatility at an affordable price point.",
    specs: { length: 18.5, beam: 8, height: 4, mass: 25172, scmSpeed: 165, maxSpeed: 1230, qtFuelCapacity: 583, hydrogenFuelCapacity: 20000, shieldHp: 1599, hullHp: 3600 },
    hardpoints: [
      { slot: "Nose", size: 1, type: "Weapon", equipped: "CF-117 Badger Laser Repeater" },
      { slot: "Wing L", size: 1, type: "Weapon", equipped: "CF-117 Badger Laser Repeater" },
      { slot: "Pylon L", size: 1, type: "Missile" },
      { slot: "Pylon R", size: 1, type: "Missile" },
    ],
    defaultComponents: [
      { name: "INK-Mark 1", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Torus", type: "Power Plant", size: "S", grade: "D", manufacturer: "Aegis" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "FR-66", type: "Shield", size: "S", grade: "C", manufacturer: "Fortitude" },
      { name: "Shimmer", type: "Shield", size: "S", grade: "B", manufacturer: "Basilisk" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "C", manufacturer: "ArcCorp" },
      { name: "ZeroRush", type: "Cooler", size: "S", grade: "C", manufacturer: "J-Span" },
      { name: "Beacon", type: "Quantum Drive", size: "S", grade: "C", manufacturer: "Roberts Space Industries" },
      { name: "Odyssey", type: "Quantum Drive", size: "S", grade: "B", manufacturer: "Roberts Space Industries" },
      { name: "Crossfield", type: "Radar", size: "S", grade: "C", manufacturer: "TM" },
    ],
  },
  {
    id: "2", name: "Avenger Titan", manufacturer: "Aegis Dynamics", role: "Multi-Role", size: "Small", crew: "1", cargo: 8, price: 50000, status: "Flight Ready",
    description: "A versatile ship perfect for cargo hauling and light combat.",
    lore: "Initially designed as Aegis' standard patrol craft for the UEE Advocacy, the Avenger Titan has been adapted for civilian use. Its spacious cargo hold and agile combat capabilities make it a favorite among independent pilots.",
    specs: { length: 22.5, beam: 16.5, height: 5.5, mass: 36490, scmSpeed: 195, maxSpeed: 1305, qtFuelCapacity: 583, hydrogenFuelCapacity: 25000, shieldHp: 3990, hullHp: 5300 },
    hardpoints: [
      { slot: "Nose", size: 3, type: "Weapon", equipped: "Mantis GT-220 Gatling" },
      { slot: "Wing L", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Wing R", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Pylon L", size: 2, type: "Missile" },
      { slot: "Pylon R", size: 2, type: "Missile" },
    ],
    defaultComponents: [
      { name: "Palisade", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Endurance", type: "Power Plant", size: "S", grade: "D", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "FR-66", type: "Shield", size: "S", grade: "C", manufacturer: "Fortitude" },
      { name: "Guardian", type: "Shield", size: "S", grade: "B", manufacturer: "Basilisk" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "B", manufacturer: "ArcCorp" },
      { name: "Blizzard", type: "Cooler", size: "S", grade: "B", manufacturer: "J-Span" },
      { name: "Odyssey", type: "Quantum Drive", size: "S", grade: "B", manufacturer: "Roberts Space Industries" },
      { name: "Yeager", type: "Quantum Drive", size: "S", grade: "A", manufacturer: "ArcCorp" },
    ],
  },
  {
    id: "3", name: "Gladius", manufacturer: "Aegis Dynamics", role: "Fighter", size: "Small", crew: "1", cargo: 0, price: 90000, status: "Flight Ready",
    description: "The Gladius is the UEE's premier light fighter.",
    lore: "The Gladius is the UEE's reigning light fighter. A combination of speed, maneuverability and firepower makes it a formidable opponent in any dogfight. Originally developed for the military, it has since become available to civilians.",
    specs: { length: 20, beam: 17, height: 5, mass: 30300, scmSpeed: 210, maxSpeed: 1350, qtFuelCapacity: 583, hydrogenFuelCapacity: 22000, shieldHp: 3990, hullHp: 4100 },
    hardpoints: [
      { slot: "Nose", size: 3, type: "Weapon", equipped: "Strife Mass Driver" },
      { slot: "Wing L", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Wing R", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Pylon L", size: 2, type: "Missile" },
      { slot: "Pylon R", size: 2, type: "Missile" },
    ],
    defaultComponents: [
      { name: "Palisade", type: "Shield", size: "S", grade: "C", manufacturer: "Seal Corp" },
      { name: "Endurance", type: "Power Plant", size: "S", grade: "C", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "S", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Guardian", type: "Shield", size: "S", grade: "B", manufacturer: "Basilisk" },
      { name: "Mirage", type: "Shield", size: "S", grade: "A", manufacturer: "Basilisk" },
      { name: "Fierell Cascade", type: "Power Plant", size: "S", grade: "A", manufacturer: "Lightning Power" },
      { name: "Blizzard", type: "Cooler", size: "S", grade: "A", manufacturer: "J-Span" },
      { name: "Yeager", type: "Quantum Drive", size: "S", grade: "A", manufacturer: "ArcCorp" },
    ],
  },
  {
    id: "4", name: "Cutlass Black", manufacturer: "Drake Interplanetary", role: "Multi-Role", size: "Medium", crew: "1-3", cargo: 46, price: 100000, status: "Flight Ready",
    description: "Drake's most popular ship, balancing firepower and cargo capacity.",
    lore: "The Cutlass Black is Drake Interplanetary's most successful ship, striking a balance between combat capability and utility. Originally marketed as a search and rescue craft, its versatile design has made it popular with haulers, bounty hunters, and pirates alike.",
    specs: { length: 29, beam: 26.5, height: 10, mass: 73885, scmSpeed: 175, maxSpeed: 1205, qtFuelCapacity: 1680, hydrogenFuelCapacity: 40000, shieldHp: 5880, hullHp: 12500 },
    hardpoints: [
      { slot: "Nose L", size: 3, type: "Weapon", equipped: "CF-337 Panther Laser Repeater" },
      { slot: "Nose R", size: 3, type: "Weapon", equipped: "CF-337 Panther Laser Repeater" },
      { slot: "Turret L", size: 3, type: "Turret", equipped: "CF-337 Panther Laser Repeater" },
      { slot: "Turret R", size: 3, type: "Turret", equipped: "CF-337 Panther Laser Repeater" },
      { slot: "Pylon L", size: 2, type: "Missile" },
      { slot: "Pylon R", size: 2, type: "Missile" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "D", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "D", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "M", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Bulwark", type: "Shield", size: "M", grade: "B", manufacturer: "Fortitude" },
      { name: "Rampart", type: "Shield", size: "M", grade: "A", manufacturer: "Basilisk" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "B", manufacturer: "Lightning Power" },
      { name: "SnowPack", type: "Cooler", size: "M", grade: "B", manufacturer: "J-Span" },
      { name: "Pontes", type: "Quantum Drive", size: "M", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
  },
  {
    id: "5", name: "Freelancer", manufacturer: "MISC", role: "Transport", size: "Medium", crew: "1-4", cargo: 66, price: 110000, status: "Flight Ready",
    description: "A reliable hauler with solid defensive capabilities.",
    lore: "The Freelancer is MISC's most popular ship and one of the most recognizable designs in the galaxy. Built for long-range hauling, it offers a generous cargo bay and enough firepower to discourage all but the most determined pirates.",
    specs: { length: 32, beam: 15, height: 8, mass: 81000, scmSpeed: 155, maxSpeed: 1100, qtFuelCapacity: 1680, hydrogenFuelCapacity: 45000, shieldHp: 5880, hullHp: 14000 },
    hardpoints: [
      { slot: "Chin L", size: 3, type: "Weapon", equipped: "Behring M4A Laser Cannon" },
      { slot: "Chin R", size: 3, type: "Weapon", equipped: "Behring M4A Laser Cannon" },
      { slot: "Turret L", size: 2, type: "Turret" },
      { slot: "Turret R", size: 2, type: "Turret" },
      { slot: "Pylon L", size: 3, type: "Missile" },
      { slot: "Pylon R", size: 3, type: "Missile" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "D", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "D", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "M", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Bulwark", type: "Shield", size: "M", grade: "B", manufacturer: "Fortitude" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "B", manufacturer: "Lightning Power" },
      { name: "Pontes", type: "Quantum Drive", size: "M", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
  },
  {
    id: "6", name: "Constellation Andromeda", manufacturer: "Roberts Space Industries", role: "Multi-Role", size: "Large", crew: "1-5", cargo: 96, price: 225000, status: "Flight Ready",
    description: "RSI's multi-crew flagship, a versatile large ship.",
    lore: "The Constellation Andromeda is RSI's premier multi-crew vessel. Featuring a cavernous cargo bay, powerful weapons systems, and a snub fighter bay housing a P-52 Merlin, the Andromeda is the ship of choice for organizations needing firepower and flexibility.",
    specs: { length: 61.2, beam: 26.6, height: 13.8, mass: 358400, scmSpeed: 135, maxSpeed: 985, qtFuelCapacity: 3800, hydrogenFuelCapacity: 70000, shieldHp: 15960, hullHp: 36000 },
    hardpoints: [
      { slot: "Chin L", size: 4, type: "Weapon", equipped: "M5A Laser Cannon" },
      { slot: "Chin R", size: 4, type: "Weapon", equipped: "M5A Laser Cannon" },
      { slot: "Turret Top L", size: 2, type: "Turret", equipped: "CF-227 Panther Repeater" },
      { slot: "Turret Top R", size: 2, type: "Turret", equipped: "CF-227 Panther Repeater" },
      { slot: "Turret Bot L", size: 2, type: "Turret" },
      { slot: "Turret Bot R", size: 2, type: "Turret" },
      { slot: "Pylons", size: 4, type: "Missile" },
    ],
    defaultComponents: [
      { name: "AllStop", type: "Shield", size: "L", grade: "C", manufacturer: "Seal Corp" },
      { name: "Drassik", type: "Power Plant", size: "L", grade: "C", manufacturer: "ArcCorp" },
      { name: "TundraFrost", type: "Cooler", size: "L", grade: "C", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "C", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "ArcticStorm", type: "Cooler", size: "L", grade: "A", manufacturer: "J-Span" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  {
    id: "7", name: "Hammerhead", manufacturer: "Aegis Dynamics", role: "Gunship", size: "Capital", crew: "6-8", cargo: 0, price: 725000, status: "Flight Ready",
    description: "A heavy gunship bristling with turrets.",
    lore: "Designed to serve as a patrol ship against the Vanduul threat, the Hammerhead features six crewed turrets providing 360-degree coverage. It serves as a powerful anti-fighter platform, capable of engaging multiple targets simultaneously.",
    specs: { length: 100, beam: 73, height: 18, mass: 1032000, scmSpeed: 95, maxSpeed: 850, qtFuelCapacity: 8000, hydrogenFuelCapacity: 120000, shieldHp: 47880, hullHp: 92000 },
    hardpoints: [
      { slot: "Turret 1 L", size: 4, type: "Turret", equipped: "AD4B Laser Cannon" },
      { slot: "Turret 1 R", size: 4, type: "Turret", equipped: "AD4B Laser Cannon" },
      { slot: "Turret 2 L", size: 4, type: "Turret", equipped: "AD4B Laser Cannon" },
      { slot: "Turret 2 R", size: 4, type: "Turret", equipped: "AD4B Laser Cannon" },
      { slot: "Turret 3 L", size: 4, type: "Turret", equipped: "AD4B Laser Cannon" },
      { slot: "Turret 3 R", size: 4, type: "Turret", equipped: "AD4B Laser Cannon" },
    ],
    defaultComponents: [
      { name: "Citadel", type: "Shield", size: "L", grade: "B", manufacturer: "Basilisk" },
      { name: "Citadel", type: "Shield", size: "L", grade: "B", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "B", manufacturer: "Lightning Power" },
      { name: "ArcticStorm", type: "Cooler", size: "L", grade: "B", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "B", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Hyperion", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  {
    id: "8", name: "Carrack", manufacturer: "Anvil Aerospace", role: "Exploration", size: "Large", crew: "1-6", cargo: 456, price: 600000, status: "Flight Ready",
    description: "The premier exploration vessel in the 'verse.",
    lore: "The Anvil Carrack has been the go-to ship for the UEE's pathfinder program for decades. Equipped with a medical bay, a repair bay, a drone hangar, and a modular cargo pod system, the Carrack is built to venture into the unknown and return safely.",
    specs: { length: 126.5, beam: 76.5, height: 26, mass: 5000000, scmSpeed: 95, maxSpeed: 830, qtFuelCapacity: 12000, hydrogenFuelCapacity: 150000, shieldHp: 63840, hullHp: 120000 },
    hardpoints: [
      { slot: "Turret Top L", size: 4, type: "Turret", equipped: "C-788 Ballistic Cannon" },
      { slot: "Turret Top R", size: 4, type: "Turret", equipped: "C-788 Ballistic Cannon" },
      { slot: "Turret Rear L", size: 3, type: "Turret" },
      { slot: "Turret Rear R", size: 3, type: "Turret" },
      { slot: "Pylons", size: 4, type: "Missile" },
      { slot: "Utility", size: 1, type: "Utility" },
    ],
    defaultComponents: [
      { name: "Citadel", type: "Shield", size: "L", grade: "B", manufacturer: "Basilisk" },
      { name: "Citadel", type: "Shield", size: "L", grade: "B", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "B", manufacturer: "Lightning Power" },
      { name: "ArcticStorm", type: "Cooler", size: "L", grade: "B", manufacturer: "J-Span" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "B", manufacturer: "Roberts Space Industries" },
      { name: "Explorer", type: "Radar", size: "L", grade: "A", manufacturer: "TM" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Hyperion", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "AbsoluteZero", type: "Cooler", size: "L", grade: "A", manufacturer: "J-Span" },
    ],
  },
  {
    id: "9", name: "Prospector", manufacturer: "MISC", role: "Mining", size: "Small", crew: "1", cargo: 32, price: 155000, status: "Flight Ready",
    description: "A dedicated solo mining ship.",
    lore: "The MISC Prospector is a purpose-built mining vessel designed for solo operators. Its articulated mining arm and sophisticated scanning systems make it ideal for surveying asteroid fields and extracting valuable minerals.",
    specs: { length: 24, beam: 18, height: 9, mass: 65000, scmSpeed: 145, maxSpeed: 1050, qtFuelCapacity: 1680, hydrogenFuelCapacity: 35000, shieldHp: 3990, hullHp: 8200 },
    hardpoints: [
      { slot: "Mining Arm", size: 1, type: "Utility", equipped: "Arbor MH1 Mining Laser" },
    ],
    defaultComponents: [
      { name: "Palisade", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "S", grade: "D", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "FR-66", type: "Shield", size: "S", grade: "C", manufacturer: "Fortitude" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "C", manufacturer: "ArcCorp" },
      { name: "Beacon", type: "Quantum Drive", size: "S", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
  },
  {
    id: "10", name: "Reclaimer", manufacturer: "Aegis Dynamics", role: "Salvage", size: "Capital", crew: "1-5", cargo: 180, price: 400000, status: "Flight Ready",
    description: "A massive salvage ship capable of reclaiming derelicts.",
    lore: "The Reclaimer is an industrial ship designed to salvage and reclaim materials from space wrecks and derelicts. Its massive claw and processing facilities allow it to tear apart and repurpose even large spacecraft.",
    specs: { length: 155, beam: 48, height: 40, mass: 6500000, scmSpeed: 70, maxSpeed: 720, qtFuelCapacity: 12000, hydrogenFuelCapacity: 180000, shieldHp: 47880, hullHp: 110000 },
    hardpoints: [
      { slot: "Turret Top L", size: 4, type: "Turret" },
      { slot: "Turret Top R", size: 4, type: "Turret" },
      { slot: "Salvage Claw", size: 1, type: "Utility", equipped: "Salvage Claw" },
    ],
    defaultComponents: [
      { name: "AllStop", type: "Shield", size: "L", grade: "C", manufacturer: "Seal Corp" },
      { name: "AllStop", type: "Shield", size: "L", grade: "C", manufacturer: "Seal Corp" },
      { name: "Drassik", type: "Power Plant", size: "L", grade: "C", manufacturer: "ArcCorp" },
      { name: "TundraFrost", type: "Cooler", size: "L", grade: "C", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "C", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
    ],
  },
  {
    id: "11", name: "Starfarer Gemini", manufacturer: "MISC", role: "Refueling", size: "Large", crew: "2-7", cargo: 291, price: 340000, status: "Flight Ready",
    description: "A military variant of the Starfarer refueling platform.",
    lore: "The Starfarer Gemini is the militarized version of MISC's Starfarer platform. With enhanced armor and defensive systems, the Gemini trades some cargo capacity for combat survivability, making it ideal for refueling operations in contested space.",
    specs: { length: 101, beam: 52, height: 21, mass: 3300000, scmSpeed: 85, maxSpeed: 780, qtFuelCapacity: 8000, hydrogenFuelCapacity: 100000, shieldHp: 31920, hullHp: 72000 },
    hardpoints: [
      { slot: "Turret Top L", size: 3, type: "Turret" },
      { slot: "Turret Top R", size: 3, type: "Turret" },
      { slot: "Turret Rear", size: 3, type: "Turret" },
    ],
    defaultComponents: [
      { name: "AllStop", type: "Shield", size: "L", grade: "C", manufacturer: "Seal Corp" },
      { name: "Drassik", type: "Power Plant", size: "L", grade: "C", manufacturer: "ArcCorp" },
      { name: "TundraFrost", type: "Cooler", size: "L", grade: "C", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "C", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  {
    id: "12", name: "Vanguard Warden", manufacturer: "Aegis Dynamics", role: "Fighter", size: "Medium", crew: "1-2", cargo: 0, price: 260000, status: "Flight Ready",
    description: "A deep-space heavy fighter built for endurance.",
    lore: "The Vanguard Warden is Aegis' deep-space heavy fighter. Designed for long-range missions, the Warden features reinforced armor, powerful forward-facing weapons, and the ability to operate far from friendly territory.",
    specs: { length: 38.5, beam: 34.6, height: 8.4, mass: 119000, scmSpeed: 170, maxSpeed: 1180, qtFuelCapacity: 3800, hydrogenFuelCapacity: 55000, shieldHp: 11970, hullHp: 18000 },
    hardpoints: [
      { slot: "Nose", size: 5, type: "Weapon", equipped: "Revenant Ballistic Gatling" },
      { slot: "Nose L", size: 2, type: "Weapon", equipped: "Sawbuck Ballistic Repeater" },
      { slot: "Nose R", size: 2, type: "Weapon", equipped: "Sawbuck Ballistic Repeater" },
      { slot: "Turret", size: 2, type: "Turret" },
      { slot: "Pylons", size: 3, type: "Missile" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "C", manufacturer: "Seal Corp" },
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "C", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "C", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "M", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Rampart", type: "Shield", size: "M", grade: "A", manufacturer: "Basilisk" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "A", manufacturer: "Lightning Power" },
      { name: "SnowPack", type: "Cooler", size: "M", grade: "A", manufacturer: "J-Span" },
    ],
  },
  {
    id: "13", name: "Mercury Star Runner", manufacturer: "Crusader Industries", role: "Transport", size: "Medium", crew: "1-3", cargo: 114, price: 210000, status: "Flight Ready",
    description: "A data runner with style and speed.",
    lore: "The Mercury Star Runner is Crusader Industries' answer to the need for speed in data transport. Featuring a dedicated data storage room, generous cargo capacity, and impressive straight-line speed, the Mercury excels at getting goods and information delivered quickly.",
    specs: { length: 44, beam: 36, height: 11, mass: 178000, scmSpeed: 185, maxSpeed: 1250, qtFuelCapacity: 3800, hydrogenFuelCapacity: 60000, shieldHp: 11970, hullHp: 22000 },
    hardpoints: [
      { slot: "Chin L", size: 3, type: "Weapon", equipped: "CF-337 Panther Laser Repeater" },
      { slot: "Chin R", size: 3, type: "Weapon", equipped: "CF-337 Panther Laser Repeater" },
      { slot: "Turret L", size: 3, type: "Turret" },
      { slot: "Turret R", size: 3, type: "Turret" },
      { slot: "Pylons", size: 3, type: "Missile" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "C", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "C", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "M", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Rampart", type: "Shield", size: "M", grade: "A", manufacturer: "Basilisk" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "A", manufacturer: "Lightning Power" },
      { name: "SnowPack", type: "Cooler", size: "M", grade: "A", manufacturer: "J-Span" },
      { name: "Pontes", type: "Quantum Drive", size: "M", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  {
    id: "14", name: "890 Jump", manufacturer: "Origin Jumpworks", role: "Exploration", size: "Capital", crew: "3-5", cargo: 60, price: 950000, status: "Flight Ready",
    description: "The ultimate luxury touring vessel.",
    lore: "The 890 Jump represents the pinnacle of luxury spacecraft design by Origin Jumpworks. Featuring opulent interiors, a pool, a hangar for an 85X touring vessel, and sophisticated defensive systems, the 890 Jump caters to the galaxy's wealthiest travelers.",
    specs: { length: 210, beam: 75, height: 45, mass: 8200000, scmSpeed: 80, maxSpeed: 740, qtFuelCapacity: 12000, hydrogenFuelCapacity: 200000, shieldHp: 63840, hullHp: 140000 },
    hardpoints: [
      { slot: "Turret 1 L", size: 4, type: "Turret" },
      { slot: "Turret 1 R", size: 4, type: "Turret" },
      { slot: "Point Defense L", size: 3, type: "Turret" },
      { slot: "Point Defense R", size: 3, type: "Turret" },
      { slot: "Pylons", size: 5, type: "Missile" },
    ],
    defaultComponents: [
      { name: "Citadel", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Citadel", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Hyperion", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "AbsoluteZero", type: "Cooler", size: "L", grade: "A", manufacturer: "J-Span" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
    ],
  },
  {
    id: "15", name: "Sabre", manufacturer: "Aegis Dynamics", role: "Stealth", size: "Small", crew: "1", cargo: 0, price: 170000, status: "Flight Ready",
    description: "A stealth-focused light fighter.",
    lore: "The Aegis Sabre was designed from the ground up as a dedicated stealth fighter. Its unique quad-wing design and signature-reducing hull make it difficult to detect, while its complement of weapons ensure it can strike hard when it does engage.",
    specs: { length: 24, beam: 26, height: 5, mass: 35000, scmSpeed: 200, maxSpeed: 1335, qtFuelCapacity: 583, hydrogenFuelCapacity: 22000, shieldHp: 5880, hullHp: 4600 },
    hardpoints: [
      { slot: "Wing 1", size: 3, type: "Weapon", equipped: "Omnisky IX Laser Cannon" },
      { slot: "Wing 2", size: 3, type: "Weapon", equipped: "Omnisky IX Laser Cannon" },
      { slot: "Wing 3", size: 3, type: "Weapon", equipped: "Omnisky IX Laser Cannon" },
      { slot: "Wing 4", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Pylon L", size: 2, type: "Missile" },
      { slot: "Pylon R", size: 2, type: "Missile" },
    ],
    defaultComponents: [
      { name: "Shimmer", type: "Shield", size: "S", grade: "B", manufacturer: "Basilisk" },
      { name: "Shimmer", type: "Shield", size: "S", grade: "B", manufacturer: "Basilisk" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "B", manufacturer: "ArcCorp" },
      { name: "Blizzard", type: "Cooler", size: "S", grade: "B", manufacturer: "J-Span" },
      { name: "Odyssey", type: "Quantum Drive", size: "S", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Mirage", type: "Shield", size: "S", grade: "A", manufacturer: "Basilisk" },
      { name: "Fierell Cascade", type: "Power Plant", size: "S", grade: "A", manufacturer: "Lightning Power" },
      { name: "Yeager", type: "Quantum Drive", size: "S", grade: "A", manufacturer: "ArcCorp" },
    ],
  },
  {
    id: "16", name: "Caterpillar", manufacturer: "Drake Interplanetary", role: "Cargo", size: "Large", crew: "1-5", cargo: 576, price: 295000, status: "Flight Ready",
    description: "Drake's modular cargo hauler.",
    lore: "The Drake Caterpillar is a modular cargo vessel consisting of a command module and multiple detachable cargo sections. Its pirate heritage is evident in its utilitarian design, though many legitimate haulers have adopted it for its massive cargo capacity.",
    specs: { length: 111.5, beam: 30, height: 14, mass: 2200000, scmSpeed: 90, maxSpeed: 800, qtFuelCapacity: 8000, hydrogenFuelCapacity: 100000, shieldHp: 31920, hullHp: 68000 },
    hardpoints: [
      { slot: "Turret Front", size: 2, type: "Turret" },
      { slot: "Turret Rear", size: 2, type: "Turret" },
      { slot: "Turret Cmd L", size: 2, type: "Turret" },
      { slot: "Turret Cmd R", size: 2, type: "Turret" },
    ],
    defaultComponents: [
      { name: "AllStop", type: "Shield", size: "L", grade: "C", manufacturer: "Seal Corp" },
      { name: "Drassik", type: "Power Plant", size: "L", grade: "C", manufacturer: "ArcCorp" },
      { name: "TundraFrost", type: "Cooler", size: "L", grade: "C", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "C", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 17: Arrow ===
  {
    id: "17", name: "Arrow", manufacturer: "Anvil Aerospace", role: "Fighter", size: "Small", crew: "1", cargo: 0, price: 75000, status: "Flight Ready",
    description: "A nimble light fighter designed for speed and precision.",
    lore: "The Anvil Arrow was developed as a replacement for the aging Gladius in the UEE Navy's light fighter role. Its swept-forward wing design and lightweight frame give it exceptional agility, making it a favorite among dogfighters who prefer speed over durability.",
    specs: { length: 16.5, beam: 12, height: 4, mass: 22000, scmSpeed: 220, maxSpeed: 1380, qtFuelCapacity: 583, hydrogenFuelCapacity: 18000, shieldHp: 1599, hullHp: 3200 },
    hardpoints: [
      { slot: "Nose", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Wing L", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Wing R", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Pylon L", size: 2, type: "Missile" },
      { slot: "Pylon R", size: 2, type: "Missile" },
    ],
    defaultComponents: [
      { name: "INK-Mark 1", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Torus", type: "Power Plant", size: "S", grade: "D", manufacturer: "Aegis" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Shimmer", type: "Shield", size: "S", grade: "B", manufacturer: "Basilisk" },
      { name: "Mirage", type: "Shield", size: "S", grade: "A", manufacturer: "Basilisk" },
      { name: "Fierell Cascade", type: "Power Plant", size: "S", grade: "A", manufacturer: "Lightning Power" },
      { name: "Blizzard", type: "Cooler", size: "S", grade: "A", manufacturer: "J-Span" },
      { name: "Yeager", type: "Quantum Drive", size: "S", grade: "A", manufacturer: "ArcCorp" },
    ],
  },
  // === ID 18: Hornet F7C ===
  {
    id: "18", name: "Hornet F7C", manufacturer: "Anvil Aerospace", role: "Fighter", size: "Small", crew: "1", cargo: 0, price: 110000, status: "Flight Ready",
    description: "The civilian variant of the UEE's iconic military fighter.",
    lore: "The F7C Hornet is the civilian version of the F7A military fighter, the backbone of the UEE Navy for decades. Stripped of military-grade equipment but retaining its rugged frame and weapon capacity, the F7C is a popular choice for mercenaries and militia pilots.",
    specs: { length: 22.5, beam: 21.5, height: 6, mass: 32400, scmSpeed: 195, maxSpeed: 1300, qtFuelCapacity: 583, hydrogenFuelCapacity: 22000, shieldHp: 3990, hullHp: 5800 },
    hardpoints: [
      { slot: "Nose", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Canard L", size: 2, type: "Weapon", equipped: "Bulldog Laser Repeater" },
      { slot: "Canard R", size: 2, type: "Weapon", equipped: "Bulldog Laser Repeater" },
      { slot: "Ball Turret", size: 3, type: "Turret" },
      { slot: "Pylon L", size: 2, type: "Missile" },
      { slot: "Pylon R", size: 2, type: "Missile" },
    ],
    defaultComponents: [
      { name: "Palisade", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Endurance", type: "Power Plant", size: "S", grade: "D", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Guardian", type: "Shield", size: "S", grade: "B", manufacturer: "Basilisk" },
      { name: "Mirage", type: "Shield", size: "S", grade: "A", manufacturer: "Basilisk" },
      { name: "Fierell Cascade", type: "Power Plant", size: "S", grade: "A", manufacturer: "Lightning Power" },
      { name: "Blizzard", type: "Cooler", size: "S", grade: "A", manufacturer: "J-Span" },
      { name: "Yeager", type: "Quantum Drive", size: "S", grade: "A", manufacturer: "ArcCorp" },
    ],
  },
  // === ID 19: Super Hornet ===
  {
    id: "19", name: "Super Hornet F7C-M", manufacturer: "Anvil Aerospace", role: "Fighter", size: "Small", crew: "1-2", cargo: 0, price: 180000, status: "Flight Ready",
    description: "A two-seat variant of the F7C with enhanced weapons.",
    lore: "The F7C-M Super Hornet adds a second seat and upgraded weapons systems to the already formidable Hornet platform. The additional crew member can operate the ball turret independently, making the Super Hornet a fearsome opponent in close-quarters combat.",
    specs: { length: 22.5, beam: 21.5, height: 6, mass: 34200, scmSpeed: 185, maxSpeed: 1280, qtFuelCapacity: 583, hydrogenFuelCapacity: 22000, shieldHp: 5880, hullHp: 6200 },
    hardpoints: [
      { slot: "Nose", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Canard L", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Canard R", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Ball Turret L", size: 3, type: "Turret", equipped: "Panther Laser Repeater" },
      { slot: "Ball Turret R", size: 3, type: "Turret", equipped: "Panther Laser Repeater" },
      { slot: "Pylon L", size: 2, type: "Missile" },
      { slot: "Pylon R", size: 2, type: "Missile" },
    ],
    defaultComponents: [
      { name: "Palisade", type: "Shield", size: "S", grade: "C", manufacturer: "Seal Corp" },
      { name: "Endurance", type: "Power Plant", size: "S", grade: "C", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "S", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Mirage", type: "Shield", size: "S", grade: "A", manufacturer: "Basilisk" },
      { name: "Fierell Cascade", type: "Power Plant", size: "S", grade: "A", manufacturer: "Lightning Power" },
      { name: "Blizzard", type: "Cooler", size: "S", grade: "A", manufacturer: "J-Span" },
      { name: "Yeager", type: "Quantum Drive", size: "S", grade: "A", manufacturer: "ArcCorp" },
    ],
  },
  // === ID 20: Buccaneer ===
  {
    id: "20", name: "Buccaneer", manufacturer: "Drake Interplanetary", role: "Fighter", size: "Small", crew: "1", cargo: 0, price: 110000, status: "Flight Ready",
    description: "A hard-hitting light fighter that punches above its weight class.",
    lore: "The Drake Buccaneer was designed to pair with the Caterpillar as an escort fighter. True to Drake's philosophy, it sacrifices durability for raw firepower, carrying weapons typically found on much larger ships. It's a glass cannon that rewards aggressive pilots.",
    specs: { length: 19, beam: 19, height: 6, mass: 28000, scmSpeed: 205, maxSpeed: 1340, qtFuelCapacity: 583, hydrogenFuelCapacity: 20000, shieldHp: 1599, hullHp: 3000 },
    hardpoints: [
      { slot: "Nose L", size: 1, type: "Weapon", equipped: "Badger Laser Repeater" },
      { slot: "Nose R", size: 1, type: "Weapon", equipped: "Badger Laser Repeater" },
      { slot: "Wing L", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Wing R", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Top", size: 4, type: "Weapon", equipped: "Revenant Ballistic Gatling" },
      { slot: "Pylon L", size: 2, type: "Missile" },
      { slot: "Pylon R", size: 2, type: "Missile" },
    ],
    defaultComponents: [
      { name: "INK-Mark 1", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Torus", type: "Power Plant", size: "S", grade: "D", manufacturer: "Aegis" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Shimmer", type: "Shield", size: "S", grade: "B", manufacturer: "Basilisk" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "B", manufacturer: "ArcCorp" },
      { name: "ZeroRush", type: "Cooler", size: "S", grade: "B", manufacturer: "J-Span" },
      { name: "Odyssey", type: "Quantum Drive", size: "S", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 21: Cutlass Red ===
  {
    id: "21", name: "Cutlass Red", manufacturer: "Drake Interplanetary", role: "Medical", size: "Medium", crew: "1-3", cargo: 12, price: 135000, status: "Flight Ready",
    description: "A medical variant of the Cutlass with med beds and emergency equipment.",
    lore: "The Cutlass Red converts the Black's cargo bay into a mobile medical facility. Equipped with medical beds and life support systems, it serves as a first responder vehicle, rushing to emergencies across the system. Drake's pragmatic approach means it retains some combat capability.",
    specs: { length: 29, beam: 26.5, height: 10, mass: 73885, scmSpeed: 175, maxSpeed: 1205, qtFuelCapacity: 1680, hydrogenFuelCapacity: 40000, shieldHp: 5880, hullHp: 12500 },
    hardpoints: [
      { slot: "Nose L", size: 3, type: "Weapon", equipped: "CF-337 Panther Laser Repeater" },
      { slot: "Nose R", size: 3, type: "Weapon", equipped: "CF-337 Panther Laser Repeater" },
      { slot: "Pylon L", size: 2, type: "Missile" },
      { slot: "Pylon R", size: 2, type: "Missile" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "D", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "D", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "M", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Bulwark", type: "Shield", size: "M", grade: "B", manufacturer: "Fortitude" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "B", manufacturer: "Lightning Power" },
      { name: "Pontes", type: "Quantum Drive", size: "M", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 22: Cutlass Blue ===
  {
    id: "22", name: "Cutlass Blue", manufacturer: "Drake Interplanetary", role: "Multi-Role", size: "Medium", crew: "1-3", cargo: 24, price: 165000, status: "Flight Ready",
    description: "A bounty hunter variant with prisoner pods and enhanced shields.",
    lore: "The Cutlass Blue is the bounty hunter's ship of choice. Reinforced with additional armor and shields, and fitted with prisoner transport pods, it excels at interdiction and fugitive capture. Its quantum enforcement device can pull targets out of quantum travel.",
    specs: { length: 29, beam: 26.5, height: 10, mass: 78000, scmSpeed: 170, maxSpeed: 1180, qtFuelCapacity: 1680, hydrogenFuelCapacity: 40000, shieldHp: 11970, hullHp: 14000 },
    hardpoints: [
      { slot: "Nose L", size: 3, type: "Weapon", equipped: "CF-337 Panther Laser Repeater" },
      { slot: "Nose R", size: 3, type: "Weapon", equipped: "CF-337 Panther Laser Repeater" },
      { slot: "Turret L", size: 3, type: "Turret", equipped: "CF-337 Panther Laser Repeater" },
      { slot: "Turret R", size: 3, type: "Turret", equipped: "CF-337 Panther Laser Repeater" },
      { slot: "Pylon L", size: 2, type: "Missile" },
      { slot: "Pylon R", size: 2, type: "Missile" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "C", manufacturer: "Seal Corp" },
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "C", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "C", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "M", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Rampart", type: "Shield", size: "M", grade: "A", manufacturer: "Basilisk" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "A", manufacturer: "Lightning Power" },
      { name: "SnowPack", type: "Cooler", size: "M", grade: "A", manufacturer: "J-Span" },
    ],
  },
  // === ID 23: Herald ===
  {
    id: "23", name: "Herald", manufacturer: "Drake Interplanetary", role: "Data Running", size: "Small", crew: "1", cargo: 0, price: 85000, status: "Flight Ready",
    description: "A dedicated electronic warfare and data running vessel.",
    lore: "The Drake Herald is built for one purpose: getting data from point A to point B as fast as possible. Its oversized engines and server racks make it the go-to ship for data runners. When the information is too sensitive for quantum-linked transmission, the Herald delivers.",
    specs: { length: 23, beam: 13, height: 8, mass: 30000, scmSpeed: 200, maxSpeed: 1350, qtFuelCapacity: 583, hydrogenFuelCapacity: 18000, shieldHp: 1599, hullHp: 3400 },
    hardpoints: [
      { slot: "Nose", size: 2, type: "Weapon", equipped: "Bulldog Laser Repeater" },
      { slot: "Chin", size: 2, type: "Weapon", equipped: "Bulldog Laser Repeater" },
    ],
    defaultComponents: [
      { name: "INK-Mark 1", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Torus", type: "Power Plant", size: "S", grade: "D", manufacturer: "Aegis" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "FR-66", type: "Shield", size: "S", grade: "C", manufacturer: "Fortitude" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "C", manufacturer: "ArcCorp" },
      { name: "Beacon", type: "Quantum Drive", size: "S", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 24: Vulture ===
  {
    id: "24", name: "Vulture", manufacturer: "Drake Interplanetary", role: "Salvage", size: "Small", crew: "1", cargo: 12, price: 140000, status: "Flight Ready",
    description: "A starter salvage ship designed for solo operators.",
    lore: "The Vulture is Drake's answer to solo salvage operations. Its articulated salvage arm can strip hull materials from derelicts, while its modest cargo bay stores the reclaimed materials. It's the entry point for aspiring salvage operators.",
    specs: { length: 25, beam: 22, height: 9, mass: 55000, scmSpeed: 155, maxSpeed: 1100, qtFuelCapacity: 583, hydrogenFuelCapacity: 25000, shieldHp: 3990, hullHp: 6800 },
    hardpoints: [
      { slot: "Salvage Arm", size: 1, type: "Utility", equipped: "Cinch Salvage Head" },
      { slot: "Nose", size: 2, type: "Weapon", equipped: "Bulldog Laser Repeater" },
    ],
    defaultComponents: [
      { name: "Palisade", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Endurance", type: "Power Plant", size: "S", grade: "D", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "FR-66", type: "Shield", size: "S", grade: "C", manufacturer: "Fortitude" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "C", manufacturer: "ArcCorp" },
      { name: "Beacon", type: "Quantum Drive", size: "S", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 25: 300i ===
  {
    id: "25", name: "300i", manufacturer: "Origin Jumpworks", role: "Multi-Role", size: "Small", crew: "1", cargo: 2, price: 55000, status: "Flight Ready",
    description: "An elegant touring ship with luxury appointments.",
    lore: "The 300i is Origin Jumpworks' entry-level luxury spacecraft. With its sleek lines and premium interior, it offers a flying experience that's a cut above the typical starter ship. A bed, weapon rack, and small cargo hold make it surprisingly versatile.",
    specs: { length: 24, beam: 13, height: 6.5, mass: 28000, scmSpeed: 190, maxSpeed: 1280, qtFuelCapacity: 583, hydrogenFuelCapacity: 22000, shieldHp: 1599, hullHp: 3800 },
    hardpoints: [
      { slot: "Nose", size: 3, type: "Weapon", equipped: "Omnisky IX Laser Cannon" },
      { slot: "Wing L", size: 3, type: "Weapon", equipped: "CF-337 Panther Laser Repeater" },
      { slot: "Wing R", size: 3, type: "Weapon", equipped: "CF-337 Panther Laser Repeater" },
      { slot: "Pylon L", size: 2, type: "Missile" },
      { slot: "Pylon R", size: 2, type: "Missile" },
    ],
    defaultComponents: [
      { name: "INK-Mark 1", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Torus", type: "Power Plant", size: "S", grade: "D", manufacturer: "Aegis" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Shimmer", type: "Shield", size: "S", grade: "B", manufacturer: "Basilisk" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "B", manufacturer: "ArcCorp" },
      { name: "Odyssey", type: "Quantum Drive", size: "S", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 26: 315p ===
  {
    id: "26", name: "315p", manufacturer: "Origin Jumpworks", role: "Exploration", size: "Small", crew: "1", cargo: 4, price: 65000, status: "Flight Ready",
    description: "The pathfinder variant of the 300 series with extended fuel range.",
    lore: "The 315p is Origin's pathfinder variant, equipped with an extended fuel range and a tractor beam mount. It's designed for explorers who want to travel farther and discover more, while maintaining the luxury Origin is known for.",
    specs: { length: 24, beam: 13, height: 6.5, mass: 29000, scmSpeed: 185, maxSpeed: 1260, qtFuelCapacity: 833, hydrogenFuelCapacity: 26000, shieldHp: 1599, hullHp: 3800 },
    hardpoints: [
      { slot: "Nose", size: 3, type: "Weapon", equipped: "Omnisky IX Laser Cannon" },
      { slot: "Wing L", size: 2, type: "Weapon", equipped: "Bulldog Laser Repeater" },
      { slot: "Wing R", size: 2, type: "Weapon", equipped: "Bulldog Laser Repeater" },
      { slot: "Utility", size: 1, type: "Utility", equipped: "Tractor Beam" },
    ],
    defaultComponents: [
      { name: "INK-Mark 1", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Torus", type: "Power Plant", size: "S", grade: "D", manufacturer: "Aegis" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "C", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Shimmer", type: "Shield", size: "S", grade: "B", manufacturer: "Basilisk" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "B", manufacturer: "ArcCorp" },
      { name: "Odyssey", type: "Quantum Drive", size: "S", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 27: 325a ===
  {
    id: "27", name: "325a", manufacturer: "Origin Jumpworks", role: "Fighter", size: "Small", crew: "1", cargo: 0, price: 70000, status: "Flight Ready",
    description: "An interdiction variant of the 300 series with enhanced weaponry.",
    lore: "The 325a trades cargo space for additional weapon hardpoints and a nose-mounted missile rack. It's Origin's answer for pilots who want luxury and lethality in equal measure, capable of holding its own against dedicated fighter craft.",
    specs: { length: 24, beam: 13, height: 6.5, mass: 28500, scmSpeed: 195, maxSpeed: 1300, qtFuelCapacity: 583, hydrogenFuelCapacity: 22000, shieldHp: 1599, hullHp: 3800 },
    hardpoints: [
      { slot: "Nose", size: 4, type: "Weapon", equipped: "Omnisky XII Laser Cannon" },
      { slot: "Wing L", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Wing R", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Pylon", size: 3, type: "Missile" },
    ],
    defaultComponents: [
      { name: "Palisade", type: "Shield", size: "S", grade: "C", manufacturer: "Seal Corp" },
      { name: "Endurance", type: "Power Plant", size: "S", grade: "C", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "S", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Mirage", type: "Shield", size: "S", grade: "A", manufacturer: "Basilisk" },
      { name: "Fierell Cascade", type: "Power Plant", size: "S", grade: "A", manufacturer: "Lightning Power" },
      { name: "Yeager", type: "Quantum Drive", size: "S", grade: "A", manufacturer: "ArcCorp" },
    ],
  },
  // === ID 28: 600i Explorer ===
  {
    id: "28", name: "600i Explorer", manufacturer: "Origin Jumpworks", role: "Exploration", size: "Large", crew: "1-5", cargo: 40, price: 475000, status: "Flight Ready",
    description: "Origin's luxury explorer combining comfort with capability.",
    lore: "The 600i is Origin's answer to luxury exploration. Featuring a scanning suite, vehicle bay, and lavish interior appointments, it allows explorers to push into the unknown without sacrificing comfort. Its sleek design and powerful engines ensure it can outrun most threats.",
    specs: { length: 91.5, beam: 52, height: 17, mass: 1850000, scmSpeed: 115, maxSpeed: 920, qtFuelCapacity: 8000, hydrogenFuelCapacity: 90000, shieldHp: 31920, hullHp: 52000 },
    hardpoints: [
      { slot: "Chin L", size: 5, type: "Weapon", equipped: "M6A Laser Cannon" },
      { slot: "Chin R", size: 5, type: "Weapon", equipped: "M6A Laser Cannon" },
      { slot: "Turret Top L", size: 3, type: "Turret" },
      { slot: "Turret Top R", size: 3, type: "Turret" },
      { slot: "Pylons", size: 4, type: "Missile" },
    ],
    defaultComponents: [
      { name: "AllStop", type: "Shield", size: "L", grade: "B", manufacturer: "Seal Corp" },
      { name: "AllStop", type: "Shield", size: "L", grade: "B", manufacturer: "Seal Corp" },
      { name: "Drassik", type: "Power Plant", size: "L", grade: "B", manufacturer: "ArcCorp" },
      { name: "TundraFrost", type: "Cooler", size: "L", grade: "B", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "B", manufacturer: "ArcCorp" },
      { name: "Explorer", type: "Radar", size: "L", grade: "B", manufacturer: "TM" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 29: 100i ===
  {
    id: "29", name: "100i", manufacturer: "Origin Jumpworks", role: "Multi-Role", size: "Small", crew: "1", cargo: 2, price: 30000, status: "Flight Ready",
    description: "Origin's most affordable starter ship with elegant design.",
    lore: "The 100i is Origin's most accessible ship, designed to bring luxury to new pilots. Despite its small size, it features a refined interior and efficient fuel-injected engines that give it surprising range. It's the perfect gateway to the Origin lifestyle.",
    specs: { length: 14, beam: 10, height: 3.5, mass: 18000, scmSpeed: 180, maxSpeed: 1250, qtFuelCapacity: 583, hydrogenFuelCapacity: 16000, shieldHp: 1599, hullHp: 2800 },
    hardpoints: [
      { slot: "Nose", size: 1, type: "Weapon", equipped: "CF-117 Badger Laser Repeater" },
      { slot: "Wing L", size: 1, type: "Weapon", equipped: "CF-117 Badger Laser Repeater" },
    ],
    defaultComponents: [
      { name: "INK-Mark 1", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Torus", type: "Power Plant", size: "S", grade: "D", manufacturer: "Aegis" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "FR-66", type: "Shield", size: "S", grade: "C", manufacturer: "Fortitude" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "C", manufacturer: "ArcCorp" },
      { name: "Beacon", type: "Quantum Drive", size: "S", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 30: Freelancer MAX ===
  {
    id: "30", name: "Freelancer MAX", manufacturer: "MISC", role: "Cargo", size: "Medium", crew: "1-4", cargo: 120, price: 150000, status: "Flight Ready",
    description: "An expanded cargo variant of the Freelancer with bigger hold.",
    lore: "The Freelancer MAX doubles down on cargo capacity, extending the hull and widening the cargo bay. While it sacrifices some combat capability, haulers who need maximum volume per trip swear by the MAX's reliable performance on trade routes.",
    specs: { length: 38, beam: 18, height: 9, mass: 95000, scmSpeed: 145, maxSpeed: 1050, qtFuelCapacity: 1680, hydrogenFuelCapacity: 50000, shieldHp: 5880, hullHp: 14500 },
    hardpoints: [
      { slot: "Chin L", size: 3, type: "Weapon", equipped: "Behring M4A Laser Cannon" },
      { slot: "Chin R", size: 3, type: "Weapon", equipped: "Behring M4A Laser Cannon" },
      { slot: "Turret L", size: 2, type: "Turret" },
      { slot: "Turret R", size: 2, type: "Turret" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "D", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "D", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "M", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Bulwark", type: "Shield", size: "M", grade: "B", manufacturer: "Fortitude" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "B", manufacturer: "Lightning Power" },
      { name: "Pontes", type: "Quantum Drive", size: "M", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 31: Freelancer DUR ===
  {
    id: "31", name: "Freelancer DUR", manufacturer: "MISC", role: "Exploration", size: "Medium", crew: "1-4", cargo: 36, price: 125000, status: "Flight Ready",
    description: "A long-range exploration variant with extended fuel tanks.",
    lore: "The DUR variant sacrifices cargo capacity for extended fuel tanks and enhanced scanning equipment. Explorers who need to reach the farthest systems choose the DUR for its unmatched operational range among medium-class ships.",
    specs: { length: 38, beam: 15, height: 8, mass: 85000, scmSpeed: 150, maxSpeed: 1080, qtFuelCapacity: 3360, hydrogenFuelCapacity: 55000, shieldHp: 5880, hullHp: 14000 },
    hardpoints: [
      { slot: "Chin L", size: 3, type: "Weapon", equipped: "Behring M4A Laser Cannon" },
      { slot: "Chin R", size: 3, type: "Weapon", equipped: "Behring M4A Laser Cannon" },
      { slot: "Turret L", size: 2, type: "Turret" },
      { slot: "Turret R", size: 2, type: "Turret" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "D", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "D", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "D", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "M", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Bulwark", type: "Shield", size: "M", grade: "B", manufacturer: "Fortitude" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "B", manufacturer: "Lightning Power" },
      { name: "Pontes", type: "Quantum Drive", size: "M", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 32: Freelancer MIS ===
  {
    id: "32", name: "Freelancer MIS", manufacturer: "MISC", role: "Gunship", size: "Medium", crew: "1-4", cargo: 28, price: 165000, status: "Flight Ready",
    description: "A missile boat variant loaded with ordnance.",
    lore: "The MIS is the Freelancer's military variant, trading cargo space for an impressive missile payload. With its expanded missile racks, it can deliver devastating alpha strikes. Limited production runs make it a sought-after variant among combat pilots.",
    specs: { length: 38, beam: 15, height: 8, mass: 88000, scmSpeed: 155, maxSpeed: 1100, qtFuelCapacity: 1680, hydrogenFuelCapacity: 45000, shieldHp: 5880, hullHp: 15000 },
    hardpoints: [
      { slot: "Chin L", size: 3, type: "Weapon", equipped: "Behring M4A Laser Cannon" },
      { slot: "Chin R", size: 3, type: "Weapon", equipped: "Behring M4A Laser Cannon" },
      { slot: "Turret L", size: 2, type: "Turret" },
      { slot: "Turret R", size: 2, type: "Turret" },
      { slot: "Pylon 1", size: 3, type: "Missile" },
      { slot: "Pylon 2", size: 3, type: "Missile" },
      { slot: "Pylon 3", size: 3, type: "Missile" },
      { slot: "Pylon 4", size: 3, type: "Missile" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "C", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "C", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "M", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Rampart", type: "Shield", size: "M", grade: "A", manufacturer: "Basilisk" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "A", manufacturer: "Lightning Power" },
      { name: "Pontes", type: "Quantum Drive", size: "M", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 33: Hull A ===
  {
    id: "33", name: "Hull A", manufacturer: "MISC", role: "Cargo", size: "Small", crew: "1", cargo: 64, price: 80000, status: "Flight Ready",
    description: "The smallest of the Hull series, a dedicated light cargo hauler.",
    lore: "The Hull A is the entry point to MISC's revolutionary Hull series of cargo ships. Using an expandable spindle system, it can carry external cargo containers that multiply its hauling capacity, making it profitable for new traders.",
    specs: { length: 22, beam: 10, height: 7, mass: 35000, scmSpeed: 160, maxSpeed: 1200, qtFuelCapacity: 583, hydrogenFuelCapacity: 22000, shieldHp: 1599, hullHp: 4200 },
    hardpoints: [
      { slot: "Nose", size: 2, type: "Weapon", equipped: "Bulldog Laser Repeater" },
    ],
    defaultComponents: [
      { name: "INK-Mark 1", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Torus", type: "Power Plant", size: "S", grade: "D", manufacturer: "Aegis" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "FR-66", type: "Shield", size: "S", grade: "C", manufacturer: "Fortitude" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "C", manufacturer: "ArcCorp" },
      { name: "Beacon", type: "Quantum Drive", size: "S", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 34: Hull C ===
  {
    id: "34", name: "Hull C", manufacturer: "MISC", role: "Cargo", size: "Large", crew: "1-4", cargo: 4608, price: 350000, status: "Flight Ready",
    description: "The backbone of UEE commerce, a massive cargo hauler.",
    lore: "The Hull C is the most common cargo ship in the UEE, responsible for transporting the majority of goods between systems. Its spindle system allows it to carry an enormous quantity of standard cargo containers, but it requires a station or landing pad to load and unload.",
    specs: { length: 125, beam: 55, height: 30, mass: 3800000, scmSpeed: 85, maxSpeed: 780, qtFuelCapacity: 8000, hydrogenFuelCapacity: 120000, shieldHp: 31920, hullHp: 65000 },
    hardpoints: [
      { slot: "Turret Top", size: 3, type: "Turret" },
      { slot: "Turret Bottom", size: 3, type: "Turret" },
    ],
    defaultComponents: [
      { name: "AllStop", type: "Shield", size: "L", grade: "C", manufacturer: "Seal Corp" },
      { name: "Drassik", type: "Power Plant", size: "L", grade: "C", manufacturer: "ArcCorp" },
      { name: "TundraFrost", type: "Cooler", size: "L", grade: "C", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "C", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 35: Razor ===
  {
    id: "35", name: "Razor", manufacturer: "MISC", role: "Racing", size: "Small", crew: "1", cargo: 0, price: 135000, status: "Flight Ready",
    description: "A dedicated racing ship with an ultra-aerodynamic profile.",
    lore: "The Razor is MISC's pure racing ship, designed with Xi'an-influenced engineering. Its incredibly thin profile and oversized engines make it one of the fastest ships in its class. Competitive racers prize it for its blistering straight-line speed.",
    specs: { length: 14, beam: 8, height: 3, mass: 15000, scmSpeed: 235, maxSpeed: 1420, qtFuelCapacity: 583, hydrogenFuelCapacity: 14000, shieldHp: 1599, hullHp: 2200 },
    hardpoints: [
      { slot: "Wing L", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Wing R", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
    ],
    defaultComponents: [
      { name: "INK-Mark 1", type: "Shield", size: "S", grade: "C", manufacturer: "Seal Corp" },
      { name: "Torus", type: "Power Plant", size: "S", grade: "C", manufacturer: "Aegis" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "S", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Shimmer", type: "Shield", size: "S", grade: "A", manufacturer: "Basilisk" },
      { name: "Fierell Cascade", type: "Power Plant", size: "S", grade: "A", manufacturer: "Lightning Power" },
      { name: "Yeager", type: "Quantum Drive", size: "S", grade: "A", manufacturer: "ArcCorp" },
    ],
  },
  // === ID 36: Constellation Taurus ===
  {
    id: "36", name: "Constellation Taurus", manufacturer: "Roberts Space Industries", role: "Cargo", size: "Large", crew: "1-4", cargo: 174, price: 190000, status: "Flight Ready",
    description: "The cargo-focused variant of the Constellation with expanded hold.",
    lore: "The Taurus strips out the snub fighter bay and reduces weapon loadout to maximize cargo capacity. It's the working-class Constellation, favored by haulers who need a large, reliable cargo ship without the premium price of the Andromeda.",
    specs: { length: 61.2, beam: 26.6, height: 13.8, mass: 340000, scmSpeed: 130, maxSpeed: 970, qtFuelCapacity: 3800, hydrogenFuelCapacity: 70000, shieldHp: 15960, hullHp: 34000 },
    hardpoints: [
      { slot: "Chin L", size: 4, type: "Weapon", equipped: "M5A Laser Cannon" },
      { slot: "Chin R", size: 4, type: "Weapon", equipped: "M5A Laser Cannon" },
      { slot: "Turret Top L", size: 2, type: "Turret" },
      { slot: "Turret Top R", size: 2, type: "Turret" },
      { slot: "Pylons", size: 3, type: "Missile" },
    ],
    defaultComponents: [
      { name: "AllStop", type: "Shield", size: "L", grade: "D", manufacturer: "Seal Corp" },
      { name: "Drassik", type: "Power Plant", size: "L", grade: "D", manufacturer: "ArcCorp" },
      { name: "TundraFrost", type: "Cooler", size: "L", grade: "D", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 37: Constellation Phoenix ===
  {
    id: "37", name: "Constellation Phoenix", manufacturer: "Roberts Space Industries", role: "Luxury", size: "Large", crew: "1-5", cargo: 66, price: 350000, status: "Flight Ready",
    description: "The luxury variant of the Constellation with VIP amenities.",
    lore: "The Phoenix is the luxury flagship of the Constellation line. Featuring a hot tub, bar area, and premium furnishings, it's designed to impress VIP passengers. A P-72 Archimedes snub fighter and point defense turret provide security for its wealthy occupants.",
    specs: { length: 61.2, beam: 26.6, height: 13.8, mass: 365000, scmSpeed: 130, maxSpeed: 970, qtFuelCapacity: 3800, hydrogenFuelCapacity: 70000, shieldHp: 15960, hullHp: 38000 },
    hardpoints: [
      { slot: "Chin L", size: 4, type: "Weapon", equipped: "M5A Laser Cannon" },
      { slot: "Chin R", size: 4, type: "Weapon", equipped: "M5A Laser Cannon" },
      { slot: "Turret Top L", size: 2, type: "Turret", equipped: "CF-227 Panther Repeater" },
      { slot: "Turret Top R", size: 2, type: "Turret", equipped: "CF-227 Panther Repeater" },
      { slot: "Point Defense", size: 2, type: "Turret" },
      { slot: "Pylons", size: 4, type: "Missile" },
    ],
    defaultComponents: [
      { name: "AllStop", type: "Shield", size: "L", grade: "B", manufacturer: "Seal Corp" },
      { name: "Drassik", type: "Power Plant", size: "L", grade: "B", manufacturer: "ArcCorp" },
      { name: "TundraFrost", type: "Cooler", size: "L", grade: "B", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "B", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 38: Mantis ===
  {
    id: "38", name: "Mantis", manufacturer: "Roberts Space Industries", role: "Interception", size: "Small", crew: "1", cargo: 0, price: 150000, status: "Flight Ready",
    description: "A quantum enforcement ship capable of pulling targets out of quantum travel.",
    lore: "The RSI Mantis is purpose-built for quantum interdiction. Its Quantum Enforcement Device can create a quantum snare, pulling targets out of quantum travel. While lightly armed, it excels at its role as a first-response interceptor for bounty hunters and law enforcement.",
    specs: { length: 20, beam: 28, height: 7, mass: 32000, scmSpeed: 175, maxSpeed: 1220, qtFuelCapacity: 583, hydrogenFuelCapacity: 22000, shieldHp: 1599, hullHp: 3200 },
    hardpoints: [
      { slot: "Nose L", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Nose R", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "QED", size: 1, type: "Utility", equipped: "Quantum Enforcement Device" },
    ],
    defaultComponents: [
      { name: "INK-Mark 1", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Torus", type: "Power Plant", size: "S", grade: "C", manufacturer: "Aegis" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "S", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Shimmer", type: "Shield", size: "S", grade: "B", manufacturer: "Basilisk" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "B", manufacturer: "ArcCorp" },
      { name: "Odyssey", type: "Quantum Drive", size: "S", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 39: Pisces C8X ===
  {
    id: "39", name: "Pisces C8X", manufacturer: "Anvil Aerospace", role: "Multi-Role", size: "Small", crew: "1-3", cargo: 4, price: 40000, status: "Flight Ready",
    description: "A compact exploration shuttle, snub craft of the Carrack.",
    lore: "The C8X Pisces is the military variant of the Carrack's dedicated snub craft. Equipped with additional hardpoints over the civilian C8, this compact shuttle excels at short-range exploration, personnel transport, and light reconnaissance missions.",
    specs: { length: 12, beam: 8, height: 3.5, mass: 14000, scmSpeed: 190, maxSpeed: 1280, qtFuelCapacity: 583, hydrogenFuelCapacity: 12000, shieldHp: 1599, hullHp: 2400 },
    hardpoints: [
      { slot: "Nose L", size: 1, type: "Weapon", equipped: "Badger Laser Repeater" },
      { slot: "Nose R", size: 1, type: "Weapon", equipped: "Badger Laser Repeater" },
      { slot: "Chin", size: 2, type: "Weapon", equipped: "Omnisky VI" },
      { slot: "Pylon L", size: 1, type: "Missile" },
      { slot: "Pylon R", size: 1, type: "Missile" },
    ],
    defaultComponents: [
      { name: "INK-Mark 1", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Torus", type: "Power Plant", size: "S", grade: "D", manufacturer: "Aegis" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "FR-66", type: "Shield", size: "S", grade: "C", manufacturer: "Fortitude" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "C", manufacturer: "ArcCorp" },
      { name: "Beacon", type: "Quantum Drive", size: "S", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 40: Valkyrie ===
  {
    id: "40", name: "Valkyrie", manufacturer: "Anvil Aerospace", role: "Dropship", size: "Large", crew: "1-5", cargo: 30, price: 375000, status: "Flight Ready",
    description: "A military dropship designed for rapid troop deployment.",
    lore: "The Anvil Valkyrie is the UEE military's primary dropship. Designed to rapidly deploy ground forces while providing covering fire, it features multiple turret positions and a vehicle bay. Its heavy armor allows it to survive contested landing zones.",
    specs: { length: 38, beam: 28, height: 10, mass: 280000, scmSpeed: 140, maxSpeed: 1020, qtFuelCapacity: 3800, hydrogenFuelCapacity: 65000, shieldHp: 15960, hullHp: 32000 },
    hardpoints: [
      { slot: "Nose L", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Nose R", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Turret Top L", size: 3, type: "Turret" },
      { slot: "Turret Top R", size: 3, type: "Turret" },
      { slot: "Turret Rear L", size: 2, type: "Turret" },
      { slot: "Turret Rear R", size: 2, type: "Turret" },
      { slot: "Door L", size: 1, type: "Turret" },
      { slot: "Door R", size: 1, type: "Turret" },
      { slot: "Pylons", size: 3, type: "Missile" },
    ],
    defaultComponents: [
      { name: "AllStop", type: "Shield", size: "L", grade: "C", manufacturer: "Seal Corp" },
      { name: "Drassik", type: "Power Plant", size: "L", grade: "C", manufacturer: "ArcCorp" },
      { name: "TundraFrost", type: "Cooler", size: "L", grade: "C", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "C", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 41: Eclipse ===
  {
    id: "41", name: "Eclipse", manufacturer: "Aegis Dynamics", role: "Bomber", size: "Medium", crew: "1", cargo: 0, price: 300000, status: "Flight Ready",
    description: "A stealth torpedo bomber designed for devastating first strikes.",
    lore: "The Eclipse is Aegis' stealth bomber, capable of approaching targets undetected and delivering a devastating torpedo payload. Its low signature profile makes it nearly invisible to radar, allowing it to strike capital ships before they can react.",
    specs: { length: 26, beam: 20, height: 5, mass: 42000, scmSpeed: 185, maxSpeed: 1260, qtFuelCapacity: 1680, hydrogenFuelCapacity: 30000, shieldHp: 3990, hullHp: 4800 },
    hardpoints: [
      { slot: "Bay 1", size: 5, type: "Missile", equipped: "Argos IX Torpedo" },
      { slot: "Bay 2", size: 5, type: "Missile", equipped: "Argos IX Torpedo" },
      { slot: "Bay 3", size: 5, type: "Missile", equipped: "Argos IX Torpedo" },
    ],
    defaultComponents: [
      { name: "Shimmer", type: "Shield", size: "S", grade: "B", manufacturer: "Basilisk" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "B", manufacturer: "ArcCorp" },
      { name: "Blizzard", type: "Cooler", size: "S", grade: "B", manufacturer: "J-Span" },
      { name: "Odyssey", type: "Quantum Drive", size: "S", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Mirage", type: "Shield", size: "S", grade: "A", manufacturer: "Basilisk" },
      { name: "Fierell Cascade", type: "Power Plant", size: "S", grade: "A", manufacturer: "Lightning Power" },
      { name: "Yeager", type: "Quantum Drive", size: "S", grade: "A", manufacturer: "ArcCorp" },
    ],
  },
  // === ID 42: Retaliator ===
  {
    id: "42", name: "Retaliator", manufacturer: "Aegis Dynamics", role: "Bomber", size: "Large", crew: "1-7", cargo: 0, price: 275000, status: "Flight Ready",
    description: "A heavy torpedo bomber capable of striking capital ships.",
    lore: "The Retaliator is Aegis' premier torpedo bomber, originally designed for the UEE Navy to engage capital-class targets. Its modular bays can be configured for torpedoes, cargo, or crew amenities. Multiple turret stations provide 360-degree defensive coverage.",
    specs: { length: 71, beam: 24, height: 10, mass: 450000, scmSpeed: 120, maxSpeed: 950, qtFuelCapacity: 3800, hydrogenFuelCapacity: 70000, shieldHp: 15960, hullHp: 28000 },
    hardpoints: [
      { slot: "Turret Top Fwd", size: 2, type: "Turret" },
      { slot: "Turret Top Aft", size: 2, type: "Turret" },
      { slot: "Turret Bot Fwd", size: 2, type: "Turret" },
      { slot: "Turret Bot Aft", size: 2, type: "Turret" },
      { slot: "Turret Tail", size: 2, type: "Turret" },
      { slot: "Bay 1", size: 5, type: "Missile", equipped: "Argos IX Torpedo" },
      { slot: "Bay 2", size: 5, type: "Missile", equipped: "Argos IX Torpedo" },
      { slot: "Bay 3", size: 5, type: "Missile", equipped: "Argos IX Torpedo" },
      { slot: "Bay 4", size: 5, type: "Missile", equipped: "Argos IX Torpedo" },
      { slot: "Bay 5", size: 5, type: "Missile", equipped: "Argos IX Torpedo" },
      { slot: "Bay 6", size: 5, type: "Missile", equipped: "Argos IX Torpedo" },
    ],
    defaultComponents: [
      { name: "AllStop", type: "Shield", size: "L", grade: "C", manufacturer: "Seal Corp" },
      { name: "Drassik", type: "Power Plant", size: "L", grade: "C", manufacturer: "ArcCorp" },
      { name: "TundraFrost", type: "Cooler", size: "L", grade: "C", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "C", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 43: Vanguard Sentinel ===
  {
    id: "43", name: "Vanguard Sentinel", manufacturer: "Aegis Dynamics", role: "Fighter", size: "Medium", crew: "1-2", cargo: 0, price: 275000, status: "Flight Ready",
    description: "An electronic warfare variant of the Vanguard with EMP capabilities.",
    lore: "The Sentinel variant adds an EMP device to the Vanguard platform, allowing it to disable enemy electronics. Combined with its electronic warfare suite, the Sentinel can disrupt entire formations, making it invaluable in coordinated fleet operations.",
    specs: { length: 38.5, beam: 34.6, height: 8.4, mass: 121000, scmSpeed: 170, maxSpeed: 1180, qtFuelCapacity: 3800, hydrogenFuelCapacity: 55000, shieldHp: 11970, hullHp: 18000 },
    hardpoints: [
      { slot: "Nose", size: 5, type: "Weapon", equipped: "Revenant Ballistic Gatling" },
      { slot: "Nose L", size: 2, type: "Weapon", equipped: "Sawbuck Ballistic Repeater" },
      { slot: "Nose R", size: 2, type: "Weapon", equipped: "Sawbuck Ballistic Repeater" },
      { slot: "Turret", size: 2, type: "Turret" },
      { slot: "EMP", size: 1, type: "Utility", equipped: "EMP Device" },
      { slot: "Pylons", size: 3, type: "Missile" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "C", manufacturer: "Seal Corp" },
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "C", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "C", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "M", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Rampart", type: "Shield", size: "M", grade: "A", manufacturer: "Basilisk" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "A", manufacturer: "Lightning Power" },
      { name: "SnowPack", type: "Cooler", size: "M", grade: "A", manufacturer: "J-Span" },
    ],
  },
  // === ID 44: Vanguard Harbinger ===
  {
    id: "44", name: "Vanguard Harbinger", manufacturer: "Aegis Dynamics", role: "Bomber", size: "Medium", crew: "1-2", cargo: 0, price: 290000, status: "Flight Ready",
    description: "A strike variant of the Vanguard with torpedo capabilities.",
    lore: "The Harbinger converts the Vanguard's living space into a torpedo bay, making it a devastating strike fighter. Capable of engaging both fighters and larger ships, the Harbinger bridges the gap between a heavy fighter and a dedicated bomber.",
    specs: { length: 38.5, beam: 34.6, height: 8.4, mass: 125000, scmSpeed: 165, maxSpeed: 1150, qtFuelCapacity: 3800, hydrogenFuelCapacity: 55000, shieldHp: 11970, hullHp: 19000 },
    hardpoints: [
      { slot: "Nose", size: 5, type: "Weapon", equipped: "Revenant Ballistic Gatling" },
      { slot: "Nose L", size: 2, type: "Weapon", equipped: "Sawbuck Ballistic Repeater" },
      { slot: "Nose R", size: 2, type: "Weapon", equipped: "Sawbuck Ballistic Repeater" },
      { slot: "Turret", size: 2, type: "Turret" },
      { slot: "Bay 1", size: 5, type: "Missile", equipped: "Torpedo MSD-442" },
      { slot: "Bay 2", size: 5, type: "Missile", equipped: "Torpedo MSD-442" },
      { slot: "Bay 3", size: 5, type: "Missile", equipped: "Torpedo MSD-442" },
      { slot: "Pylons", size: 3, type: "Missile" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "C", manufacturer: "Seal Corp" },
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "C", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "C", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "M", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Rampart", type: "Shield", size: "M", grade: "A", manufacturer: "Basilisk" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "A", manufacturer: "Lightning Power" },
    ],
  },
  // === ID 45: Ares Ion ===
  {
    id: "45", name: "Ares Starfighter Ion", manufacturer: "Crusader Industries", role: "Fighter", size: "Medium", crew: "1", cargo: 0, price: 250000, status: "Flight Ready",
    description: "A heavy fighter with a devastating size 7 laser cannon.",
    lore: "The Ares Ion is Crusader Industries' answer to the anti-capital ship role. Built around a massive size 7 laser cannon, it delivers punishing energy damage to larger targets. While less effective against small fighters, its raw damage output is unmatched.",
    specs: { length: 27, beam: 18, height: 7, mass: 68000, scmSpeed: 160, maxSpeed: 1180, qtFuelCapacity: 1680, hydrogenFuelCapacity: 35000, shieldHp: 5880, hullHp: 9200 },
    hardpoints: [
      { slot: "Main", size: 7, type: "Weapon", equipped: "SF7E Laser Cannon" },
      { slot: "Pylon L", size: 3, type: "Missile" },
      { slot: "Pylon R", size: 3, type: "Missile" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "C", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "C", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "M", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Rampart", type: "Shield", size: "M", grade: "A", manufacturer: "Basilisk" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "A", manufacturer: "Lightning Power" },
      { name: "SnowPack", type: "Cooler", size: "M", grade: "A", manufacturer: "J-Span" },
    ],
  },
  // === ID 46: Ares Inferno ===
  {
    id: "46", name: "Ares Starfighter Inferno", manufacturer: "Crusader Industries", role: "Fighter", size: "Medium", crew: "1", cargo: 0, price: 250000, status: "Flight Ready",
    description: "A heavy fighter with a massive size 7 ballistic gatling.",
    lore: "The Inferno variant mounts a colossal size 7 ballistic gatling gun. While ammunition is limited, the sheer volume of ballistic damage it can deliver makes it devastating against shielded targets. Its distinctive sound strikes fear into enemy crews.",
    specs: { length: 27, beam: 18, height: 7, mass: 70000, scmSpeed: 160, maxSpeed: 1180, qtFuelCapacity: 1680, hydrogenFuelCapacity: 35000, shieldHp: 5880, hullHp: 9200 },
    hardpoints: [
      { slot: "Main", size: 7, type: "Weapon", equipped: "SF7B Ballistic Gatling" },
      { slot: "Pylon L", size: 3, type: "Missile" },
      { slot: "Pylon R", size: 3, type: "Missile" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "C", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "C", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "M", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Rampart", type: "Shield", size: "M", grade: "A", manufacturer: "Basilisk" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "A", manufacturer: "Lightning Power" },
      { name: "SnowPack", type: "Cooler", size: "M", grade: "A", manufacturer: "J-Span" },
    ],
  },
  // === ID 47: C2 Hercules ===
  {
    id: "47", name: "C2 Hercules", manufacturer: "Crusader Industries", role: "Cargo", size: "Large", crew: "1-4", cargo: 696, price: 360000, status: "Flight Ready",
    description: "A military cargo transport capable of carrying vehicles.",
    lore: "The C2 Hercules is Crusader Industries' dedicated military cargo transport. Its massive bay can accommodate vehicles, ground equipment, and bulk cargo. Despite its size, it handles remarkably well in atmosphere thanks to Crusader's signature engine design.",
    specs: { length: 90, beam: 65, height: 20, mass: 2100000, scmSpeed: 110, maxSpeed: 900, qtFuelCapacity: 8000, hydrogenFuelCapacity: 110000, shieldHp: 31920, hullHp: 58000 },
    hardpoints: [
      { slot: "Nose L", size: 4, type: "Weapon", equipped: "M5A Laser Cannon" },
      { slot: "Nose R", size: 4, type: "Weapon", equipped: "M5A Laser Cannon" },
      { slot: "Turret Top L", size: 3, type: "Turret" },
      { slot: "Turret Top R", size: 3, type: "Turret" },
      { slot: "Turret Rear", size: 3, type: "Turret" },
    ],
    defaultComponents: [
      { name: "AllStop", type: "Shield", size: "L", grade: "C", manufacturer: "Seal Corp" },
      { name: "AllStop", type: "Shield", size: "L", grade: "C", manufacturer: "Seal Corp" },
      { name: "Drassik", type: "Power Plant", size: "L", grade: "C", manufacturer: "ArcCorp" },
      { name: "TundraFrost", type: "Cooler", size: "L", grade: "C", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "C", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 48: M2 Hercules ===
  {
    id: "48", name: "M2 Hercules", manufacturer: "Crusader Industries", role: "Cargo", size: "Large", crew: "1-5", cargo: 522, price: 520000, status: "Flight Ready",
    description: "An armored military transport with enhanced defenses.",
    lore: "The M2 is the military variant of the Hercules platform. With reinforced hull plating, additional shield generators, and improved defensive armament, it's designed to deliver cargo and vehicles into active combat zones.",
    specs: { length: 90, beam: 65, height: 20, mass: 2400000, scmSpeed: 105, maxSpeed: 880, qtFuelCapacity: 8000, hydrogenFuelCapacity: 110000, shieldHp: 47880, hullHp: 72000 },
    hardpoints: [
      { slot: "Nose L", size: 5, type: "Weapon", equipped: "M6A Laser Cannon" },
      { slot: "Nose R", size: 5, type: "Weapon", equipped: "M6A Laser Cannon" },
      { slot: "Turret Top L", size: 3, type: "Turret" },
      { slot: "Turret Top R", size: 3, type: "Turret" },
      { slot: "Turret Rear", size: 3, type: "Turret" },
    ],
    defaultComponents: [
      { name: "AllStop", type: "Shield", size: "L", grade: "B", manufacturer: "Seal Corp" },
      { name: "AllStop", type: "Shield", size: "L", grade: "B", manufacturer: "Seal Corp" },
      { name: "Drassik", type: "Power Plant", size: "L", grade: "B", manufacturer: "ArcCorp" },
      { name: "TundraFrost", type: "Cooler", size: "L", grade: "B", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "B", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 49: A2 Hercules ===
  {
    id: "49", name: "A2 Hercules", manufacturer: "Crusader Industries", role: "Bomber", size: "Capital", crew: "1-6", cargo: 234, price: 750000, status: "Flight Ready",
    description: "A gunship variant armed with a MOAB bomb and turrets.",
    lore: "The A2 is the ultimate Hercules variant, equipped with a MOAB bomb capable of devastating ground targets. Combined with multiple turret positions and heavy armor, the A2 is a ground-attack platform that can reshape a battlefield.",
    specs: { length: 90, beam: 65, height: 20, mass: 2800000, scmSpeed: 100, maxSpeed: 860, qtFuelCapacity: 8000, hydrogenFuelCapacity: 110000, shieldHp: 63840, hullHp: 88000 },
    hardpoints: [
      { slot: "Nose L", size: 5, type: "Weapon", equipped: "M6A Laser Cannon" },
      { slot: "Nose R", size: 5, type: "Weapon", equipped: "M6A Laser Cannon" },
      { slot: "Turret Top L", size: 4, type: "Turret" },
      { slot: "Turret Top R", size: 4, type: "Turret" },
      { slot: "Turret Rear", size: 4, type: "Turret" },
      { slot: "MOAB Bay", size: 10, type: "Missile", equipped: "MOAB" },
      { slot: "Bomb Bay L", size: 5, type: "Missile" },
      { slot: "Bomb Bay R", size: 5, type: "Missile" },
    ],
    defaultComponents: [
      { name: "Citadel", type: "Shield", size: "L", grade: "B", manufacturer: "Basilisk" },
      { name: "Citadel", type: "Shield", size: "L", grade: "B", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "B", manufacturer: "Lightning Power" },
      { name: "ArcticStorm", type: "Cooler", size: "L", grade: "B", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "B", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Hyperion", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 50: Nomad ===
  {
    id: "50", name: "Nomad", manufacturer: "Consolidated Outland", role: "Multi-Role", size: "Small", crew: "1", cargo: 24, price: 55000, status: "Flight Ready",
    description: "A versatile starter ship with an external cargo platform.",
    lore: "The Nomad is Consolidated Outland's answer to the starter ship market. Its unique open cargo platform allows for easy loading and even vehicle transport, while the enclosed cabin provides comfortable living space for extended solo missions.",
    specs: { length: 18, beam: 14, height: 5, mass: 27000, scmSpeed: 175, maxSpeed: 1230, qtFuelCapacity: 583, hydrogenFuelCapacity: 20000, shieldHp: 1599, hullHp: 3600 },
    hardpoints: [
      { slot: "Chin L", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Chin R", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Top", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Pylon L", size: 2, type: "Missile" },
      { slot: "Pylon R", size: 2, type: "Missile" },
    ],
    defaultComponents: [
      { name: "INK-Mark 1", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Torus", type: "Power Plant", size: "S", grade: "D", manufacturer: "Aegis" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Shimmer", type: "Shield", size: "S", grade: "B", manufacturer: "Basilisk" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "B", manufacturer: "ArcCorp" },
      { name: "Odyssey", type: "Quantum Drive", size: "S", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 51: Mustang Alpha ===
  {
    id: "51", name: "Mustang Alpha", manufacturer: "Consolidated Outland", role: "Multi-Role", size: "Small", crew: "1", cargo: 3, price: 25000, status: "Flight Ready",
    description: "Consolidated Outland's premier starter ship.",
    lore: "The Mustang Alpha is Silas Koerner's vision of freedom in a spacecraft. Designed for independent pilots who prefer the open frontier to established routes, it offers decent speed and enough firepower to handle basic threats.",
    specs: { length: 19.5, beam: 11, height: 5, mass: 21000, scmSpeed: 185, maxSpeed: 1280, qtFuelCapacity: 583, hydrogenFuelCapacity: 18000, shieldHp: 1599, hullHp: 2800 },
    hardpoints: [
      { slot: "Wing L", size: 2, type: "Weapon", equipped: "Bulldog Laser Repeater" },
      { slot: "Wing R", size: 2, type: "Weapon", equipped: "Bulldog Laser Repeater" },
      { slot: "Pylon L", size: 1, type: "Missile" },
      { slot: "Pylon R", size: 1, type: "Missile" },
    ],
    defaultComponents: [
      { name: "INK-Mark 1", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Torus", type: "Power Plant", size: "S", grade: "D", manufacturer: "Aegis" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "FR-66", type: "Shield", size: "S", grade: "C", manufacturer: "Fortitude" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "C", manufacturer: "ArcCorp" },
      { name: "Beacon", type: "Quantum Drive", size: "S", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 52: Mustang Delta ===
  {
    id: "52", name: "Mustang Delta", manufacturer: "Consolidated Outland", role: "Fighter", size: "Small", crew: "1", cargo: 0, price: 65000, status: "Flight Ready",
    description: "A combat variant of the Mustang with rocket pods.",
    lore: "The Delta strips out the cargo module and adds rocket pods and enhanced weapons. It's an aggressive combat variant that trades versatility for raw firepower, popular with militia pilots defending frontier systems.",
    specs: { length: 19.5, beam: 11, height: 5, mass: 22500, scmSpeed: 195, maxSpeed: 1320, qtFuelCapacity: 583, hydrogenFuelCapacity: 18000, shieldHp: 1599, hullHp: 3000 },
    hardpoints: [
      { slot: "Wing L", size: 2, type: "Weapon", equipped: "Bulldog Laser Repeater" },
      { slot: "Wing R", size: 2, type: "Weapon", equipped: "Bulldog Laser Repeater" },
      { slot: "Rocket Pod L", size: 2, type: "Missile", equipped: "Rocket Pod" },
      { slot: "Rocket Pod R", size: 2, type: "Missile", equipped: "Rocket Pod" },
    ],
    defaultComponents: [
      { name: "Palisade", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Endurance", type: "Power Plant", size: "S", grade: "D", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Shimmer", type: "Shield", size: "S", grade: "B", manufacturer: "Basilisk" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "B", manufacturer: "ArcCorp" },
      { name: "Odyssey", type: "Quantum Drive", size: "S", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 53: MOLE ===
  {
    id: "53", name: "MOLE", manufacturer: "Argo Astronautics", role: "Mining", size: "Medium", crew: "1-4", cargo: 96, price: 315000, status: "Flight Ready",
    description: "A multi-crew mining vessel with three mining turrets.",
    lore: "The MOLE (Multi-Operator Laser Extractor) is Argo's multi-crew mining ship. With three independently operated mining turrets, a crew can extract minerals far more efficiently than solo miners. Its ore bags and processing systems handle high-volume operations.",
    specs: { length: 42, beam: 28, height: 14, mass: 260000, scmSpeed: 120, maxSpeed: 950, qtFuelCapacity: 1680, hydrogenFuelCapacity: 55000, shieldHp: 5880, hullHp: 14000 },
    hardpoints: [
      { slot: "Mining Turret 1", size: 2, type: "Utility", equipped: "Arbor MH2 Mining Laser" },
      { slot: "Mining Turret 2", size: 2, type: "Utility", equipped: "Arbor MH2 Mining Laser" },
      { slot: "Mining Turret 3", size: 2, type: "Utility", equipped: "Arbor MH2 Mining Laser" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "D", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "D", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "M", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Bulwark", type: "Shield", size: "M", grade: "B", manufacturer: "Fortitude" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "B", manufacturer: "Lightning Power" },
      { name: "Pontes", type: "Quantum Drive", size: "M", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 54: RAFT ===
  {
    id: "54", name: "RAFT", manufacturer: "Argo Astronautics", role: "Cargo", size: "Medium", crew: "1", cargo: 96, price: 135000, status: "Flight Ready",
    description: "A dedicated cargo hauler using standard cargo containers.",
    lore: "The RAFT (Reinforced Advanced Freight Transport) hauls three 32-SCU standard cargo containers. Its simple but effective design makes loading and unloading at stations quick and efficient, ideal for solo haulers running regular trade routes.",
    specs: { length: 28, beam: 16, height: 12, mass: 120000, scmSpeed: 140, maxSpeed: 1020, qtFuelCapacity: 1680, hydrogenFuelCapacity: 40000, shieldHp: 5880, hullHp: 11000 },
    hardpoints: [
      { slot: "Turret L", size: 2, type: "Turret" },
      { slot: "Turret R", size: 2, type: "Turret" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "D", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "D", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "M", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Bulwark", type: "Shield", size: "M", grade: "B", manufacturer: "Fortitude" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "B", manufacturer: "Lightning Power" },
      { name: "Pontes", type: "Quantum Drive", size: "M", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 55: Prowler ===
  {
    id: "55", name: "Prowler", manufacturer: "Esperia", role: "Dropship", size: "Medium", crew: "1-2", cargo: 0, price: 440000, status: "Flight Ready",
    description: "A Tevarin-designed stealth dropship recreated by Esperia.",
    lore: "The Prowler is Esperia's faithful recreation of the Tevarin dropship used during the Tevarin wars. Its gravity-lens technology allows troops to deploy without doors or ramps, and its stealth systems make it nearly undetectable on approach.",
    specs: { length: 32, beam: 28, height: 9, mass: 140000, scmSpeed: 170, maxSpeed: 1200, qtFuelCapacity: 1680, hydrogenFuelCapacity: 40000, shieldHp: 11970, hullHp: 15000 },
    hardpoints: [
      { slot: "Chin L", size: 4, type: "Weapon", equipped: "Deadbolt V Ballistic Cannon" },
      { slot: "Chin R", size: 4, type: "Weapon", equipped: "Deadbolt V Ballistic Cannon" },
      { slot: "Turret L", size: 3, type: "Turret" },
      { slot: "Turret R", size: 3, type: "Turret" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "B", manufacturer: "Seal Corp" },
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "B", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "B", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "B", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "M", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Rampart", type: "Shield", size: "M", grade: "A", manufacturer: "Basilisk" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "A", manufacturer: "Lightning Power" },
    ],
  },
  // === ID 56: Talon ===
  {
    id: "56", name: "Talon", manufacturer: "Esperia", role: "Fighter", size: "Small", crew: "1", cargo: 0, price: 110000, status: "Flight Ready",
    description: "A Tevarin light fighter replica with crystalline armor.",
    lore: "The Talon is Esperia's recreation of the Tevarin light fighter. Its distinctive crystalline armor panels can be deployed as shields, absorbing damage. The Talon rewards pilots who can master its unique defensive mechanics.",
    specs: { length: 18, beam: 20, height: 4, mass: 24000, scmSpeed: 210, maxSpeed: 1360, qtFuelCapacity: 583, hydrogenFuelCapacity: 18000, shieldHp: 1599, hullHp: 3400 },
    hardpoints: [
      { slot: "Wing L", size: 3, type: "Weapon", equipped: "Singe Tachyon Cannon" },
      { slot: "Wing R", size: 3, type: "Weapon", equipped: "Singe Tachyon Cannon" },
    ],
    defaultComponents: [
      { name: "Palisade", type: "Shield", size: "S", grade: "C", manufacturer: "Seal Corp" },
      { name: "Endurance", type: "Power Plant", size: "S", grade: "C", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "S", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Mirage", type: "Shield", size: "S", grade: "A", manufacturer: "Basilisk" },
      { name: "Fierell Cascade", type: "Power Plant", size: "S", grade: "A", manufacturer: "Lightning Power" },
      { name: "Yeager", type: "Quantum Drive", size: "S", grade: "A", manufacturer: "ArcCorp" },
    ],
  },
  // === ID 57: Khartu-al ===
  {
    id: "57", name: "Khartu-al", manufacturer: "Aopoa", role: "Fighter", size: "Small", crew: "1", cargo: 0, price: 150000, status: "Flight Ready",
    description: "A Xi'an scout craft with unique articulating wings.",
    lore: "The Khartu-al is a Xi'an scout craft exported for human use by Aopoa. Its four articulating wings provide unmatched maneuverability, and its alien design aesthetics make it one of the most distinctive ships in the verse.",
    specs: { length: 23, beam: 24, height: 6, mass: 28000, scmSpeed: 210, maxSpeed: 1350, qtFuelCapacity: 583, hydrogenFuelCapacity: 20000, shieldHp: 3990, hullHp: 3800 },
    hardpoints: [
      { slot: "Wing L", size: 3, type: "Weapon", equipped: "Singe Tachyon Cannon" },
      { slot: "Wing R", size: 3, type: "Weapon", equipped: "Singe Tachyon Cannon" },
    ],
    defaultComponents: [
      { name: "Palisade", type: "Shield", size: "S", grade: "C", manufacturer: "Seal Corp" },
      { name: "Endurance", type: "Power Plant", size: "S", grade: "C", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "S", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Mirage", type: "Shield", size: "S", grade: "A", manufacturer: "Basilisk" },
      { name: "Fierell Cascade", type: "Power Plant", size: "S", grade: "A", manufacturer: "Lightning Power" },
      { name: "Yeager", type: "Quantum Drive", size: "S", grade: "A", manufacturer: "ArcCorp" },
    ],
  },
  // === ID 58: San'tok.yāi ===
  {
    id: "58", name: "San'tok.yāi", manufacturer: "Aopoa", role: "Fighter", size: "Medium", crew: "1", cargo: 0, price: 220000, status: "Flight Ready",
    description: "A Xi'an medium fighter with superior maneuverability.",
    lore: "The San'tok.yāi is Aopoa's medium fighter, offering a step up in firepower while retaining the exceptional maneuverability of Xi'an design. Its larger frame accommodates heavier weapons without sacrificing the agility that makes Xi'an fighters legendary.",
    specs: { length: 28, beam: 26, height: 7, mass: 52000, scmSpeed: 195, maxSpeed: 1300, qtFuelCapacity: 1680, hydrogenFuelCapacity: 32000, shieldHp: 5880, hullHp: 6800 },
    hardpoints: [
      { slot: "Wing L", size: 4, type: "Weapon", equipped: "Singe Tachyon Cannon" },
      { slot: "Wing R", size: 4, type: "Weapon", equipped: "Singe Tachyon Cannon" },
      { slot: "Nose L", size: 3, type: "Weapon", equipped: "Singe Tachyon Cannon" },
      { slot: "Nose R", size: 3, type: "Weapon", equipped: "Singe Tachyon Cannon" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "C", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "C", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "M", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Rampart", type: "Shield", size: "M", grade: "A", manufacturer: "Basilisk" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "A", manufacturer: "Lightning Power" },
      { name: "SnowPack", type: "Cooler", size: "M", grade: "A", manufacturer: "J-Span" },
    ],
  },
  // === ID 59: Defender ===
  {
    id: "59", name: "Defender", manufacturer: "Banu", role: "Fighter", size: "Medium", crew: "1-2", cargo: 2, price: 220000, status: "Flight Ready",
    description: "A Banu multi-crew fighter designed as an escort for the Merchantman.",
    lore: "The Defender is a Banu-designed escort fighter intended to protect the massive Merchantman trading vessels. Its unique Singe tachyon cannons and alien-engineered shields make it a formidable opponent, while the co-pilot seat enhances its operational capability.",
    specs: { length: 33, beam: 24, height: 6, mass: 60000, scmSpeed: 180, maxSpeed: 1250, qtFuelCapacity: 1680, hydrogenFuelCapacity: 35000, shieldHp: 5880, hullHp: 7200 },
    hardpoints: [
      { slot: "Wing L1", size: 3, type: "Weapon", equipped: "Singe Tachyon Cannon" },
      { slot: "Wing L2", size: 3, type: "Weapon", equipped: "Singe Tachyon Cannon" },
      { slot: "Wing R1", size: 3, type: "Weapon", equipped: "Singe Tachyon Cannon" },
      { slot: "Wing R2", size: 3, type: "Weapon", equipped: "Singe Tachyon Cannon" },
      { slot: "Pylon L", size: 3, type: "Missile" },
      { slot: "Pylon R", size: 3, type: "Missile" },
    ],
    defaultComponents: [
      { name: "Sukoran", type: "Shield", size: "M", grade: "B", manufacturer: "Banu" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "B", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "B", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "M", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Rampart", type: "Shield", size: "M", grade: "A", manufacturer: "Basilisk" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "A", manufacturer: "Lightning Power" },
    ],
  },
  // === ID 60: Merchantman ===
  {
    id: "60", name: "Merchantman", manufacturer: "Banu", role: "Cargo", size: "Capital", crew: "1-8", cargo: 3584, price: 850000, status: "In Production",
    description: "A massive Banu trading vessel and bazaar ship.",
    lore: "The Banu Merchantman is both a trading vessel and a flying bazaar. Its massive interior can be configured with shops and trading stalls, while its enormous cargo hold makes it one of the most capable freighters in existence. The unique Banu design reflects millennia of trading culture.",
    specs: { length: 160, beam: 75, height: 45, mass: 7500000, scmSpeed: 80, maxSpeed: 750, qtFuelCapacity: 12000, hydrogenFuelCapacity: 180000, shieldHp: 63840, hullHp: 130000 },
    hardpoints: [
      { slot: "Turret 1 L", size: 5, type: "Turret" },
      { slot: "Turret 1 R", size: 5, type: "Turret" },
      { slot: "Turret 2 L", size: 4, type: "Turret" },
      { slot: "Turret 2 R", size: 4, type: "Turret" },
      { slot: "Point Defense 1", size: 3, type: "Turret" },
      { slot: "Point Defense 2", size: 3, type: "Turret" },
    ],
    defaultComponents: [
      { name: "Citadel", type: "Shield", size: "L", grade: "B", manufacturer: "Basilisk" },
      { name: "Citadel", type: "Shield", size: "L", grade: "B", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "B", manufacturer: "Lightning Power" },
      { name: "ArcticStorm", type: "Cooler", size: "L", grade: "B", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "B", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Hyperion", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 61: Railen ===
  {
    id: "61", name: "Railen", manufacturer: "Gatac", role: "Cargo", size: "Large", crew: "1-3", cargo: 320, price: 240000, status: "In Production",
    description: "A Tevarin cargo hauler with organic hull design.",
    lore: "The Railen is a Tevarin-designed cargo vessel manufactured by Gatac. Its organic, flowing hull design conceals a surprisingly efficient cargo operation. The ship's unique aesthetics and alien engineering make it popular with those who appreciate non-human spacecraft.",
    specs: { length: 65, beam: 38, height: 16, mass: 850000, scmSpeed: 110, maxSpeed: 920, qtFuelCapacity: 3800, hydrogenFuelCapacity: 70000, shieldHp: 15960, hullHp: 38000 },
    hardpoints: [
      { slot: "Turret Top L", size: 3, type: "Turret" },
      { slot: "Turret Top R", size: 3, type: "Turret" },
      { slot: "Turret Bot", size: 3, type: "Turret" },
    ],
    defaultComponents: [
      { name: "AllStop", type: "Shield", size: "L", grade: "C", manufacturer: "Seal Corp" },
      { name: "Drassik", type: "Power Plant", size: "L", grade: "C", manufacturer: "ArcCorp" },
      { name: "TundraFrost", type: "Cooler", size: "L", grade: "C", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "C", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 62: Corsair ===
  {
    id: "62", name: "Corsair", manufacturer: "Drake Interplanetary", role: "Exploration", size: "Medium", crew: "1-4", cargo: 72, price: 215000, status: "Flight Ready",
    description: "Drake's explorer that leans into firepower over finesse.",
    lore: "The Corsair is Drake's take on an exploration ship—loaded with more guns than most would consider reasonable. Its philosophy is simple: explore the unknown, but be ready for whatever you find. Four crew stations and a generous cargo hold make it a capable expedition ship.",
    specs: { length: 42, beam: 34, height: 12, mass: 190000, scmSpeed: 155, maxSpeed: 1100, qtFuelCapacity: 3800, hydrogenFuelCapacity: 60000, shieldHp: 11970, hullHp: 20000 },
    hardpoints: [
      { slot: "Nose L", size: 4, type: "Weapon", equipped: "M5A Laser Cannon" },
      { slot: "Nose R", size: 4, type: "Weapon", equipped: "M5A Laser Cannon" },
      { slot: "Chin L", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Chin R", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Turret Top L", size: 3, type: "Turret" },
      { slot: "Turret Top R", size: 3, type: "Turret" },
      { slot: "Turret Rear L", size: 2, type: "Turret" },
      { slot: "Turret Rear R", size: 2, type: "Turret" },
      { slot: "Pylons", size: 3, type: "Missile" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "C", manufacturer: "Seal Corp" },
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "C", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "C", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "M", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Rampart", type: "Shield", size: "M", grade: "A", manufacturer: "Basilisk" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "A", manufacturer: "Lightning Power" },
      { name: "SnowPack", type: "Cooler", size: "M", grade: "A", manufacturer: "J-Span" },
      { name: "Pontes", type: "Quantum Drive", size: "M", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 63: Vulcan ===
  {
    id: "63", name: "Vulcan", manufacturer: "Aegis Dynamics", role: "Support", size: "Medium", crew: "1-3", cargo: 12, price: 200000, status: "In Production",
    description: "A support ship for repair, refuel, and rearm operations.",
    lore: "The Vulcan is Aegis' dedicated support vessel. Using drone technology, it can repair hulls, refuel tanks, and restock ammunition without requiring ships to dock. Its quick-turnaround capability makes it essential for sustained fleet operations.",
    specs: { length: 36, beam: 30, height: 10, mass: 155000, scmSpeed: 150, maxSpeed: 1080, qtFuelCapacity: 1680, hydrogenFuelCapacity: 45000, shieldHp: 5880, hullHp: 12000 },
    hardpoints: [
      { slot: "Nose L", size: 2, type: "Weapon", equipped: "Bulldog Laser Repeater" },
      { slot: "Nose R", size: 2, type: "Weapon", equipped: "Bulldog Laser Repeater" },
      { slot: "Turret", size: 2, type: "Turret" },
      { slot: "Drone 1", size: 1, type: "Utility" },
      { slot: "Drone 2", size: 1, type: "Utility" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "D", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "D", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "M", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Bulwark", type: "Shield", size: "M", grade: "B", manufacturer: "Fortitude" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "B", manufacturer: "Lightning Power" },
      { name: "Pontes", type: "Quantum Drive", size: "M", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 64: Apollo Medivac ===
  {
    id: "64", name: "Apollo Medivac", manufacturer: "Roberts Space Industries", role: "Medical", size: "Medium", crew: "1-3", cargo: 28, price: 275000, status: "In Production",
    description: "A dedicated medical ship with trauma and intensive care bays.",
    lore: "The Apollo Medivac is RSI's premier medical vessel. Equipped with intensive care and trauma treatment facilities, it serves as a flying hospital. Its modular medical bays can be configured for different levels of care, from field triage to complex surgery.",
    specs: { length: 38, beam: 28, height: 10, mass: 175000, scmSpeed: 145, maxSpeed: 1050, qtFuelCapacity: 1680, hydrogenFuelCapacity: 50000, shieldHp: 11970, hullHp: 18000 },
    hardpoints: [
      { slot: "Turret Top L", size: 3, type: "Turret" },
      { slot: "Turret Top R", size: 3, type: "Turret" },
      { slot: "Pylons", size: 3, type: "Missile" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "C", manufacturer: "Seal Corp" },
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "C", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "C", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "M", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Rampart", type: "Shield", size: "M", grade: "A", manufacturer: "Basilisk" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "A", manufacturer: "Lightning Power" },
      { name: "Pontes", type: "Quantum Drive", size: "M", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 65: Crucible ===
  {
    id: "65", name: "Crucible", manufacturer: "Anvil Aerospace", role: "Repair", size: "Large", crew: "1-4", cargo: 40, price: 350000, status: "In Concept",
    description: "A dedicated repair ship with an integrated repair bay.",
    lore: "The Crucible is Anvil's dedicated repair vessel. Its detachable repair bay can clamp onto damaged ships, providing comprehensive hull and component repair in the field. Essential for fleet operations far from stations.",
    specs: { length: 70, beam: 42, height: 18, mass: 1200000, scmSpeed: 100, maxSpeed: 880, qtFuelCapacity: 3800, hydrogenFuelCapacity: 80000, shieldHp: 15960, hullHp: 42000 },
    hardpoints: [
      { slot: "Turret Top", size: 3, type: "Turret" },
      { slot: "Turret Bot", size: 3, type: "Turret" },
      { slot: "Repair Bay", size: 1, type: "Utility" },
    ],
    defaultComponents: [
      { name: "AllStop", type: "Shield", size: "L", grade: "C", manufacturer: "Seal Corp" },
      { name: "Drassik", type: "Power Plant", size: "L", grade: "C", manufacturer: "ArcCorp" },
      { name: "TundraFrost", type: "Cooler", size: "L", grade: "C", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "C", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
    ],
  },
  // === ID 66: Endeavor ===
  {
    id: "66", name: "Endeavor", manufacturer: "MISC", role: "Exploration", size: "Capital", crew: "1-16", cargo: 500, price: 450000, status: "In Concept",
    description: "A modular science vessel with customizable pod system.",
    lore: "The Endeavor is MISC's modular research platform. Its detachable pod system allows it to be configured for various scientific missions—from biodome farming to telescope arrays. It represents the cutting edge of civilian scientific capability.",
    specs: { length: 200, beam: 65, height: 35, mass: 8000000, scmSpeed: 70, maxSpeed: 700, qtFuelCapacity: 12000, hydrogenFuelCapacity: 200000, shieldHp: 63840, hullHp: 100000 },
    hardpoints: [
      { slot: "Turret 1", size: 4, type: "Turret" },
      { slot: "Turret 2", size: 4, type: "Turret" },
    ],
    defaultComponents: [
      { name: "Citadel", type: "Shield", size: "L", grade: "C", manufacturer: "Basilisk" },
      { name: "Drassik", type: "Power Plant", size: "L", grade: "C", manufacturer: "ArcCorp" },
      { name: "TundraFrost", type: "Cooler", size: "L", grade: "C", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "C", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 67: Orion ===
  {
    id: "67", name: "Orion", manufacturer: "Roberts Space Industries", role: "Mining", size: "Capital", crew: "1-6", cargo: 384, price: 575000, status: "In Concept",
    description: "A massive industrial mining platform.",
    lore: "The RSI Orion is the ultimate mining vessel. Its massive mining beam can crack asteroids, while onboard processing and refining facilities extract maximum value from raw ore. A crew of specialists operates this floating mining station.",
    specs: { length: 170, beam: 80, height: 40, mass: 7000000, scmSpeed: 65, maxSpeed: 680, qtFuelCapacity: 12000, hydrogenFuelCapacity: 200000, shieldHp: 63840, hullHp: 120000 },
    hardpoints: [
      { slot: "Mining Beam", size: 10, type: "Utility", equipped: "Industrial Mining Beam" },
      { slot: "Turret 1", size: 4, type: "Turret" },
      { slot: "Turret 2", size: 4, type: "Turret" },
    ],
    defaultComponents: [
      { name: "Citadel", type: "Shield", size: "L", grade: "B", manufacturer: "Basilisk" },
      { name: "Citadel", type: "Shield", size: "L", grade: "B", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "B", manufacturer: "Lightning Power" },
      { name: "ArcticStorm", type: "Cooler", size: "L", grade: "B", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "B", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Hyperion", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 68: Polaris ===
  {
    id: "68", name: "Polaris", manufacturer: "Roberts Space Industries", role: "Gunship", size: "Capital", crew: "6-14", cargo: 216, price: 750000, status: "In Production",
    description: "A corvette-class warship with torpedo bays and hangar.",
    lore: "The RSI Polaris is a nimble corvette designed for fast response military operations. Armed with torpedo bays and featuring a hangar for a medium fighter, it can strike hard and fast. Its relatively compact size for a capital ship allows it to deploy quickly.",
    specs: { length: 155, beam: 82, height: 35, mass: 6000000, scmSpeed: 85, maxSpeed: 800, qtFuelCapacity: 12000, hydrogenFuelCapacity: 180000, shieldHp: 63840, hullHp: 110000 },
    hardpoints: [
      { slot: "Turret 1 L", size: 4, type: "Turret" },
      { slot: "Turret 1 R", size: 4, type: "Turret" },
      { slot: "Turret 2 L", size: 4, type: "Turret" },
      { slot: "Turret 2 R", size: 4, type: "Turret" },
      { slot: "Bay 1", size: 9, type: "Missile", equipped: "Torpedo S10" },
      { slot: "Bay 2", size: 9, type: "Missile", equipped: "Torpedo S10" },
      { slot: "Bay 3", size: 9, type: "Missile", equipped: "Torpedo S10" },
      { slot: "Bay 4", size: 9, type: "Missile", equipped: "Torpedo S10" },
    ],
    defaultComponents: [
      { name: "Citadel", type: "Shield", size: "L", grade: "B", manufacturer: "Basilisk" },
      { name: "Citadel", type: "Shield", size: "L", grade: "B", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "B", manufacturer: "Lightning Power" },
      { name: "ArcticStorm", type: "Cooler", size: "L", grade: "B", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "B", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Hyperion", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 69: Idris-P ===
  {
    id: "69", name: "Idris-P", manufacturer: "Aegis Dynamics", role: "Gunship", size: "Capital", crew: "10-37", cargo: 831, price: 1500000, status: "Flight Ready",
    description: "A frigate-class capital ship with a fighter bay.",
    lore: "The Idris-P is the civilian variant of the Aegis Idris frigate. While lacking the military variant's spinal railgun, it retains its fighter hangar, extensive turret coverage, and massive operating range. Organizations use it as a mobile headquarters and carrier.",
    specs: { length: 242, beam: 105, height: 52, mass: 18000000, scmSpeed: 55, maxSpeed: 600, qtFuelCapacity: 20000, hydrogenFuelCapacity: 300000, shieldHp: 150000, hullHp: 250000 },
    hardpoints: [
      { slot: "Turret 1", size: 5, type: "Turret" },
      { slot: "Turret 2", size: 5, type: "Turret" },
      { slot: "Turret 3", size: 5, type: "Turret" },
      { slot: "Turret 4", size: 5, type: "Turret" },
      { slot: "Turret 5", size: 5, type: "Turret" },
      { slot: "Turret 6", size: 5, type: "Turret" },
      { slot: "Point Defense 1", size: 3, type: "Turret" },
      { slot: "Point Defense 2", size: 3, type: "Turret" },
      { slot: "Bay 1", size: 9, type: "Missile" },
      { slot: "Bay 2", size: 9, type: "Missile" },
    ],
    defaultComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Hyperion", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Hyperion", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "AbsoluteZero", type: "Cooler", size: "L", grade: "A", manufacturer: "J-Span" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [],
  },
  // === ID 70: Javelin ===
  {
    id: "70", name: "Javelin", manufacturer: "Aegis Dynamics", role: "Gunship", size: "Capital", crew: "23-80", cargo: 5400, price: 3000000, status: "In Production",
    description: "A destroyer-class warship, the largest player-ownable ship.",
    lore: "The Javelin is a decommissioned UEE Navy destroyer available to civilian organizations. At nearly 350 meters, it is the largest player-ownable ship. Its massive firepower and fighter complement make it a mobile military installation.",
    specs: { length: 345, beam: 145, height: 68, mass: 35000000, scmSpeed: 40, maxSpeed: 500, qtFuelCapacity: 30000, hydrogenFuelCapacity: 500000, shieldHp: 300000, hullHp: 500000 },
    hardpoints: [
      { slot: "Turret 1", size: 6, type: "Turret" },
      { slot: "Turret 2", size: 6, type: "Turret" },
      { slot: "Turret 3", size: 6, type: "Turret" },
      { slot: "Turret 4", size: 6, type: "Turret" },
      { slot: "Turret 5", size: 5, type: "Turret" },
      { slot: "Turret 6", size: 5, type: "Turret" },
      { slot: "Point Defense 1", size: 3, type: "Turret" },
      { slot: "Point Defense 2", size: 3, type: "Turret" },
      { slot: "Point Defense 3", size: 3, type: "Turret" },
      { slot: "Point Defense 4", size: 3, type: "Turret" },
      { slot: "Bay 1", size: 10, type: "Missile" },
      { slot: "Bay 2", size: 10, type: "Missile" },
    ],
    defaultComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Hyperion", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Hyperion", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Hyperion", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "AbsoluteZero", type: "Cooler", size: "L", grade: "A", manufacturer: "J-Span" },
      { name: "AbsoluteZero", type: "Cooler", size: "L", grade: "A", manufacturer: "J-Span" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [],
  },
  // === ID 71: Scorpius ===
  {
    id: "71", name: "Scorpius", manufacturer: "Roberts Space Industries", role: "Fighter", size: "Medium", crew: "1-2", cargo: 0, price: 220000, status: "Flight Ready",
    description: "A twin-boom heavy fighter with a manned turret.",
    lore: "The RSI Scorpius is a heavy fighter featuring a distinctive twin-boom design and a manned turret. With a co-pilot operating the turret, the Scorpius provides devastating multi-directional firepower while the pilot focuses on maneuvering.",
    specs: { length: 28, beam: 32, height: 7, mass: 75000, scmSpeed: 180, maxSpeed: 1250, qtFuelCapacity: 1680, hydrogenFuelCapacity: 35000, shieldHp: 5880, hullHp: 8400 },
    hardpoints: [
      { slot: "Wing L", size: 4, type: "Weapon", equipped: "M5A Laser Cannon" },
      { slot: "Wing R", size: 4, type: "Weapon", equipped: "M5A Laser Cannon" },
      { slot: "Turret L", size: 3, type: "Turret", equipped: "Panther Laser Repeater" },
      { slot: "Turret R", size: 3, type: "Turret", equipped: "Panther Laser Repeater" },
      { slot: "Pylon L", size: 3, type: "Missile" },
      { slot: "Pylon R", size: 3, type: "Missile" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "C", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "C", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "M", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Rampart", type: "Shield", size: "M", grade: "A", manufacturer: "Basilisk" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "A", manufacturer: "Lightning Power" },
      { name: "SnowPack", type: "Cooler", size: "M", grade: "A", manufacturer: "J-Span" },
    ],
  },
  // === ID 72: Hurricane ===
  {
    id: "72", name: "Hurricane", manufacturer: "Anvil Aerospace", role: "Fighter", size: "Medium", crew: "1-2", cargo: 0, price: 175000, status: "Flight Ready",
    description: "A heavy fighter focused on raw firepower with a crewed turret.",
    lore: "The Anvil Hurricane prioritizes firepower above all else. Its massive turret, operated by a dedicated gunner, can unleash devastating damage on targets. While its armor is lighter than other medium fighters, its offensive capability is unmatched in its class.",
    specs: { length: 24, beam: 22, height: 7, mass: 55000, scmSpeed: 185, maxSpeed: 1280, qtFuelCapacity: 1680, hydrogenFuelCapacity: 32000, shieldHp: 5880, hullHp: 6000 },
    hardpoints: [
      { slot: "Nose L", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Nose R", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Turret 1", size: 4, type: "Turret", equipped: "Revenant Ballistic Gatling" },
      { slot: "Turret 2", size: 4, type: "Turret", equipped: "Revenant Ballistic Gatling" },
      { slot: "Pylon L", size: 3, type: "Missile" },
      { slot: "Pylon R", size: 3, type: "Missile" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "C", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "C", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "M", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Rampart", type: "Shield", size: "M", grade: "A", manufacturer: "Basilisk" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "A", manufacturer: "Lightning Power" },
      { name: "SnowPack", type: "Cooler", size: "M", grade: "A", manufacturer: "J-Span" },
    ],
  },
  // === ID 73: Blade ===
  {
    id: "73", name: "Blade", manufacturer: "Esperia", role: "Fighter", size: "Small", crew: "1", cargo: 0, price: 275000, status: "Flight Ready",
    description: "A replica of the Vanduul light fighter with alien flight dynamics.",
    lore: "The Blade is Esperia's recreation of the Vanduul light fighter. Its alien aerodynamics provide a unique flight experience, and its twin forward-mounted weapons deliver punishing damage. Only the most skilled pilots can master its unconventional handling.",
    specs: { length: 20, beam: 25, height: 5, mass: 28000, scmSpeed: 215, maxSpeed: 1380, qtFuelCapacity: 583, hydrogenFuelCapacity: 18000, shieldHp: 1599, hullHp: 3800 },
    hardpoints: [
      { slot: "Wing L", size: 3, type: "Weapon", equipped: "Singe Tachyon Cannon" },
      { slot: "Wing R", size: 3, type: "Weapon", equipped: "Singe Tachyon Cannon" },
      { slot: "Pylon L", size: 2, type: "Missile" },
      { slot: "Pylon R", size: 2, type: "Missile" },
    ],
    defaultComponents: [
      { name: "Palisade", type: "Shield", size: "S", grade: "B", manufacturer: "Seal Corp" },
      { name: "Endurance", type: "Power Plant", size: "S", grade: "B", manufacturer: "ArcCorp" },
      { name: "Blizzard", type: "Cooler", size: "S", grade: "B", manufacturer: "J-Span" },
      { name: "Odyssey", type: "Quantum Drive", size: "S", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Mirage", type: "Shield", size: "S", grade: "A", manufacturer: "Basilisk" },
      { name: "Fierell Cascade", type: "Power Plant", size: "S", grade: "A", manufacturer: "Lightning Power" },
      { name: "Yeager", type: "Quantum Drive", size: "S", grade: "A", manufacturer: "ArcCorp" },
    ],
  },
  // === ID 74: Glaive ===
  {
    id: "74", name: "Glaive", manufacturer: "Esperia", role: "Fighter", size: "Medium", crew: "1", cargo: 0, price: 350000, status: "Flight Ready",
    description: "A Vanduul medium fighter replica, extremely rare.",
    lore: "The Glaive is Esperia's most ambitious reproduction—a faithful replica of the Vanduul medium fighter. Extremely rare and expensive, it features twin blade-like wings that serve as both weapons and flight surfaces. Only a handful exist in civilian hands.",
    specs: { length: 26, beam: 30, height: 6, mass: 45000, scmSpeed: 200, maxSpeed: 1340, qtFuelCapacity: 1680, hydrogenFuelCapacity: 28000, shieldHp: 5880, hullHp: 5200 },
    hardpoints: [
      { slot: "Wing L", size: 4, type: "Weapon", equipped: "Singe Tachyon Cannon" },
      { slot: "Wing R", size: 4, type: "Weapon", equipped: "Singe Tachyon Cannon" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "B", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "B", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "B", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "M", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Rampart", type: "Shield", size: "M", grade: "A", manufacturer: "Basilisk" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "A", manufacturer: "Lightning Power" },
    ],
  },
  // === ID 75: P-72 Archimedes ===
  {
    id: "75", name: "P-72 Archimedes", manufacturer: "Kruger Intergalactic", role: "Racing", size: "Small", crew: "1", cargo: 0, price: 35000, status: "Flight Ready",
    description: "A luxury snub racing craft for the Constellation Phoenix.",
    lore: "The P-72 Archimedes is Kruger's luxury snub craft, designed as the Constellation Phoenix's personal shuttle. Its sleek design and powerful thrusters make it popular for racing, though it's also used for short-range excursions from a parent ship.",
    specs: { length: 10, beam: 8, height: 3, mass: 8000, scmSpeed: 225, maxSpeed: 1400, qtFuelCapacity: 0, hydrogenFuelCapacity: 8000, shieldHp: 1599, hullHp: 1800 },
    hardpoints: [
      { slot: "Wing L", size: 1, type: "Weapon", equipped: "Badger Laser Repeater" },
      { slot: "Wing R", size: 1, type: "Weapon", equipped: "Badger Laser Repeater" },
    ],
    defaultComponents: [
      { name: "INK-Mark 1", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Torus", type: "Power Plant", size: "S", grade: "D", manufacturer: "Aegis" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
    ],
    compatibleComponents: [
      { name: "Shimmer", type: "Shield", size: "S", grade: "B", manufacturer: "Basilisk" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "B", manufacturer: "ArcCorp" },
    ],
  },
  // === ID 76: Reliant Kore ===
  {
    id: "76", name: "Reliant Kore", manufacturer: "MISC", role: "Multi-Role", size: "Small", crew: "1-2", cargo: 6, price: 45000, status: "Flight Ready",
    description: "A Xi'an-influenced two-seat starter ship with rotating wing design.",
    lore: "The Reliant Kore is MISC's Xi'an-influenced starter ship. Its distinctive rotating wing configuration shifts between vertical flight mode and horizontal landing mode. The two-seat cockpit allows for cooperative gameplay even in a small ship.",
    specs: { length: 16, beam: 15, height: 4, mass: 22000, scmSpeed: 180, maxSpeed: 1250, qtFuelCapacity: 583, hydrogenFuelCapacity: 18000, shieldHp: 1599, hullHp: 3200 },
    hardpoints: [
      { slot: "Wing L", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Wing R", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Pylon L", size: 1, type: "Missile" },
      { slot: "Pylon R", size: 1, type: "Missile" },
    ],
    defaultComponents: [
      { name: "INK-Mark 1", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Torus", type: "Power Plant", size: "S", grade: "D", manufacturer: "Aegis" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "FR-66", type: "Shield", size: "S", grade: "C", manufacturer: "Fortitude" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "C", manufacturer: "ArcCorp" },
      { name: "Beacon", type: "Quantum Drive", size: "S", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 77: Reliant Tana ===
  {
    id: "77", name: "Reliant Tana", manufacturer: "MISC", role: "Fighter", size: "Small", crew: "1-2", cargo: 0, price: 65000, status: "Flight Ready",
    description: "A combat variant of the Reliant with missile racks.",
    lore: "The Tana variant adds missile racks and enhanced weapons to the Reliant platform. Its co-pilot seat allows one crew member to manage weapons while the other flies, making it an effective budget two-person combat ship.",
    specs: { length: 16, beam: 15, height: 4, mass: 23000, scmSpeed: 190, maxSpeed: 1300, qtFuelCapacity: 583, hydrogenFuelCapacity: 18000, shieldHp: 1599, hullHp: 3200 },
    hardpoints: [
      { slot: "Wing L", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Wing R", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Pylon L1", size: 2, type: "Missile" },
      { slot: "Pylon L2", size: 2, type: "Missile" },
      { slot: "Pylon R1", size: 2, type: "Missile" },
      { slot: "Pylon R2", size: 2, type: "Missile" },
    ],
    defaultComponents: [
      { name: "Palisade", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Endurance", type: "Power Plant", size: "S", grade: "D", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Shimmer", type: "Shield", size: "S", grade: "B", manufacturer: "Basilisk" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "B", manufacturer: "ArcCorp" },
      { name: "Odyssey", type: "Quantum Drive", size: "S", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 78: Reliant Sen ===
  {
    id: "78", name: "Reliant Sen", manufacturer: "MISC", role: "Exploration", size: "Small", crew: "1-2", cargo: 2, price: 60000, status: "Flight Ready",
    description: "A science and research variant of the Reliant.",
    lore: "The Sen variant transforms the Reliant into a science vessel with a telescope and advanced scanning equipment. Researchers use it for astronomical observation and data collection, making it the most affordable dedicated science ship available.",
    specs: { length: 16, beam: 15, height: 4, mass: 22500, scmSpeed: 175, maxSpeed: 1230, qtFuelCapacity: 833, hydrogenFuelCapacity: 20000, shieldHp: 1599, hullHp: 3200 },
    hardpoints: [
      { slot: "Wing L", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Wing R", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Telescope", size: 1, type: "Utility", equipped: "Research Telescope" },
    ],
    defaultComponents: [
      { name: "INK-Mark 1", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Torus", type: "Power Plant", size: "S", grade: "D", manufacturer: "Aegis" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "C", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "FR-66", type: "Shield", size: "S", grade: "C", manufacturer: "Fortitude" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "C", manufacturer: "ArcCorp" },
      { name: "Odyssey", type: "Quantum Drive", size: "S", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 79: Reliant Mako ===
  {
    id: "79", name: "Reliant Mako", manufacturer: "MISC", role: "Multi-Role", size: "Small", crew: "1-2", cargo: 0, price: 70000, status: "Flight Ready",
    description: "A news van variant of the Reliant for broadcast journalism.",
    lore: "The Mako is the media variant of the Reliant, equipped with broadcasting equipment and cameras. Journalists and streamers use it to capture footage of events across the verse, from racing to battlefield reporting.",
    specs: { length: 16, beam: 15, height: 4, mass: 22500, scmSpeed: 185, maxSpeed: 1280, qtFuelCapacity: 583, hydrogenFuelCapacity: 18000, shieldHp: 1599, hullHp: 3200 },
    hardpoints: [
      { slot: "Wing L", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Wing R", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Camera", size: 1, type: "Utility", equipped: "Broadcast Camera" },
    ],
    defaultComponents: [
      { name: "INK-Mark 1", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Torus", type: "Power Plant", size: "S", grade: "D", manufacturer: "Aegis" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "FR-66", type: "Shield", size: "S", grade: "C", manufacturer: "Fortitude" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "C", manufacturer: "ArcCorp" },
      { name: "Beacon", type: "Quantum Drive", size: "S", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 80: Constellation Aquila ===
  {
    id: "80", name: "Constellation Aquila", manufacturer: "Roberts Space Industries", role: "Exploration", size: "Large", crew: "1-5", cargo: 72, price: 275000, status: "Flight Ready",
    description: "The exploration variant of the Constellation with enhanced scanners.",
    lore: "The Aquila is the exploration variant of the Constellation, replacing the lower turret with an advanced sensor suite and adding a rover bay. It's designed for long-range survey missions, capable of scanning and cataloging new jump points and planetary surfaces.",
    specs: { length: 61.2, beam: 26.6, height: 13.8, mass: 355000, scmSpeed: 130, maxSpeed: 970, qtFuelCapacity: 3800, hydrogenFuelCapacity: 70000, shieldHp: 15960, hullHp: 36000 },
    hardpoints: [
      { slot: "Chin L", size: 4, type: "Weapon", equipped: "M5A Laser Cannon" },
      { slot: "Chin R", size: 4, type: "Weapon", equipped: "M5A Laser Cannon" },
      { slot: "Turret Top L", size: 2, type: "Turret", equipped: "CF-227 Panther Repeater" },
      { slot: "Turret Top R", size: 2, type: "Turret", equipped: "CF-227 Panther Repeater" },
      { slot: "Scanner", size: 1, type: "Utility", equipped: "Advanced Scanner Suite" },
      { slot: "Pylons", size: 4, type: "Missile" },
    ],
    defaultComponents: [
      { name: "AllStop", type: "Shield", size: "L", grade: "C", manufacturer: "Seal Corp" },
      { name: "Drassik", type: "Power Plant", size: "L", grade: "C", manufacturer: "ArcCorp" },
      { name: "TundraFrost", type: "Cooler", size: "L", grade: "C", manufacturer: "J-Span" },
      { name: "Kama", type: "Quantum Drive", size: "L", grade: "C", manufacturer: "ArcCorp" },
      { name: "Explorer", type: "Radar", size: "L", grade: "B", manufacturer: "TM" },
    ],
    compatibleComponents: [
      { name: "Fortress", type: "Shield", size: "L", grade: "A", manufacturer: "Basilisk" },
      { name: "Eos", type: "Power Plant", size: "L", grade: "A", manufacturer: "Lightning Power" },
      { name: "Erebos", type: "Quantum Drive", size: "L", grade: "A", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 81: Spirit C1 ===
  {
    id: "81", name: "Spirit C1", manufacturer: "Crusader Industries", role: "Cargo", size: "Medium", crew: "1-2", cargo: 64, price: 125000, status: "Flight Ready",
    description: "A sleek medium cargo ship with Crusader's signature style.",
    lore: "The Spirit C1 is Crusader Industries' entry into the medium cargo market. With its distinctive angular design and efficient cargo bay, it offers a stylish alternative to the utilitarian competition. Its Crusader-engineered engines provide excellent atmospheric performance.",
    specs: { length: 36, beam: 22, height: 8, mass: 110000, scmSpeed: 165, maxSpeed: 1180, qtFuelCapacity: 1680, hydrogenFuelCapacity: 42000, shieldHp: 5880, hullHp: 11000 },
    hardpoints: [
      { slot: "Nose L", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Nose R", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Turret", size: 2, type: "Turret" },
      { slot: "Pylon L", size: 3, type: "Missile" },
      { slot: "Pylon R", size: 3, type: "Missile" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "D", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "D", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "M", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Bulwark", type: "Shield", size: "M", grade: "B", manufacturer: "Fortitude" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "B", manufacturer: "Lightning Power" },
      { name: "Pontes", type: "Quantum Drive", size: "M", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 82: Spirit E1 ===
  {
    id: "82", name: "Spirit E1", manufacturer: "Crusader Industries", role: "Medical", size: "Medium", crew: "1-2", cargo: 28, price: 150000, status: "In Production",
    description: "An emergency response variant with medical facilities.",
    lore: "The E1 converts the Spirit's cargo bay into medical facilities, creating a rapid-response medical ship. Its speed allows it to reach emergencies quickly, while onboard treatment beds provide life-saving care in the field.",
    specs: { length: 36, beam: 22, height: 8, mass: 112000, scmSpeed: 165, maxSpeed: 1180, qtFuelCapacity: 1680, hydrogenFuelCapacity: 42000, shieldHp: 5880, hullHp: 11500 },
    hardpoints: [
      { slot: "Nose L", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Nose R", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Turret", size: 2, type: "Turret" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "D", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "D", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "M", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Bulwark", type: "Shield", size: "M", grade: "B", manufacturer: "Fortitude" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "B", manufacturer: "Lightning Power" },
      { name: "Pontes", type: "Quantum Drive", size: "M", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 83: Spirit A1 ===
  {
    id: "83", name: "Spirit A1", manufacturer: "Crusader Industries", role: "Bomber", size: "Medium", crew: "1-2", cargo: 0, price: 155000, status: "In Production",
    description: "A strike variant loaded with bombs and torpedoes.",
    lore: "The A1 is the Spirit's attack variant, replacing the cargo bay with bomb racks and torpedo tubes. Its speed and stealth profile make it an effective strike craft, capable of delivering ordnance before targets can react.",
    specs: { length: 36, beam: 22, height: 8, mass: 115000, scmSpeed: 170, maxSpeed: 1200, qtFuelCapacity: 1680, hydrogenFuelCapacity: 42000, shieldHp: 5880, hullHp: 11000 },
    hardpoints: [
      { slot: "Nose L", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Nose R", size: 3, type: "Weapon", equipped: "Panther Laser Repeater" },
      { slot: "Bomb Bay 1", size: 5, type: "Missile", equipped: "Strike Bomb" },
      { slot: "Bomb Bay 2", size: 5, type: "Missile", equipped: "Strike Bomb" },
      { slot: "Pylon L", size: 3, type: "Missile" },
      { slot: "Pylon R", size: 3, type: "Missile" },
    ],
    defaultComponents: [
      { name: "STOP-Barrier", type: "Shield", size: "M", grade: "C", manufacturer: "Seal Corp" },
      { name: "Roughneck", type: "Power Plant", size: "M", grade: "C", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "M", grade: "C", manufacturer: "J-Span" },
      { name: "Voyage", type: "Quantum Drive", size: "M", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Rampart", type: "Shield", size: "M", grade: "A", manufacturer: "Basilisk" },
      { name: "Maelstrom", type: "Power Plant", size: "M", grade: "A", manufacturer: "Lightning Power" },
    ],
  },
  // === ID 84: Terrapin ===
  {
    id: "84", name: "Terrapin", manufacturer: "Anvil Aerospace", role: "Exploration", size: "Small", crew: "1-2", cargo: 0, price: 195000, status: "Flight Ready",
    description: "A heavily-armored scanning and pathfinding ship.",
    lore: "The Terrapin is built like a tank, designed to survive hostile environments while its advanced scanner suite maps the unknown. Its heavy armor and oversized shields let it endure punishment that would destroy other ships its size, making it ideal for deep-space reconnaissance.",
    specs: { length: 19.5, beam: 14, height: 6, mass: 48000, scmSpeed: 155, maxSpeed: 1100, qtFuelCapacity: 583, hydrogenFuelCapacity: 25000, shieldHp: 5880, hullHp: 9800 },
    hardpoints: [
      { slot: "Chin", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Chin R", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Scanner", size: 2, type: "Utility", equipped: "Explorer Scanner Suite" },
    ],
    defaultComponents: [
      { name: "Palisade", type: "Shield", size: "S", grade: "B", manufacturer: "Seal Corp" },
      { name: "Palisade", type: "Shield", size: "S", grade: "B", manufacturer: "Seal Corp" },
      { name: "Endurance", type: "Power Plant", size: "S", grade: "B", manufacturer: "ArcCorp" },
      { name: "Blizzard", type: "Cooler", size: "S", grade: "B", manufacturer: "J-Span" },
      { name: "Odyssey", type: "Quantum Drive", size: "S", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
    compatibleComponents: [
      { name: "Mirage", type: "Shield", size: "S", grade: "A", manufacturer: "Basilisk" },
      { name: "Fierell Cascade", type: "Power Plant", size: "S", grade: "A", manufacturer: "Lightning Power" },
      { name: "Yeager", type: "Quantum Drive", size: "S", grade: "A", manufacturer: "ArcCorp" },
    ],
  },
  // === ID 85: Hawk ===
  {
    id: "85", name: "Hawk", manufacturer: "Anvil Aerospace", role: "Fighter", size: "Small", crew: "1", cargo: 0, price: 100000, status: "Flight Ready",
    description: "A bounty hunter fighter with an EMP and prisoner pod.",
    lore: "The Hawk is designed for bounty hunters. Its built-in EMP can disable fleeing targets, and the prisoner pod in the rear allows for live capture. While lightly armored, its speed and EMP capability make it a specialist tool for apprehending fugitives.",
    specs: { length: 17, beam: 18, height: 4, mass: 22000, scmSpeed: 205, maxSpeed: 1340, qtFuelCapacity: 583, hydrogenFuelCapacity: 18000, shieldHp: 1599, hullHp: 3000 },
    hardpoints: [
      { slot: "Nose", size: 2, type: "Weapon", equipped: "Omnisky VI Laser Cannon" },
      { slot: "Wing L", size: 2, type: "Weapon", equipped: "Bulldog Laser Repeater" },
      { slot: "Wing R", size: 2, type: "Weapon", equipped: "Bulldog Laser Repeater" },
      { slot: "Belly L", size: 2, type: "Weapon", equipped: "Bulldog Laser Repeater" },
      { slot: "Belly R", size: 2, type: "Weapon", equipped: "Bulldog Laser Repeater" },
      { slot: "EMP", size: 1, type: "Utility", equipped: "EMP Device" },
    ],
    defaultComponents: [
      { name: "Palisade", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Endurance", type: "Power Plant", size: "S", grade: "D", manufacturer: "ArcCorp" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "Shimmer", type: "Shield", size: "S", grade: "B", manufacturer: "Basilisk" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "B", manufacturer: "ArcCorp" },
      { name: "Odyssey", type: "Quantum Drive", size: "S", grade: "B", manufacturer: "Roberts Space Industries" },
    ],
  },
  // === ID 86: Spartan ===
  {
    id: "86", name: "Spartan", manufacturer: "Argo Astronautics", role: "Multi-Role", size: "Small", crew: "1", cargo: 24, price: 45000, status: "Flight Ready",
    description: "A compact utility craft for cargo and personnel transport.",
    lore: "The Argo Spartan is a no-frills utility craft designed for short-range cargo and personnel transport. Affordable and reliable, it serves as a workhorse for stations, outposts, and organizations that need a simple way to move goods and people.",
    specs: { length: 15, beam: 10, height: 5, mass: 20000, scmSpeed: 165, maxSpeed: 1200, qtFuelCapacity: 583, hydrogenFuelCapacity: 16000, shieldHp: 1599, hullHp: 3000 },
    hardpoints: [
      { slot: "Nose", size: 2, type: "Weapon", equipped: "Bulldog Laser Repeater" },
    ],
    defaultComponents: [
      { name: "INK-Mark 1", type: "Shield", size: "S", grade: "D", manufacturer: "Seal Corp" },
      { name: "Torus", type: "Power Plant", size: "S", grade: "D", manufacturer: "Aegis" },
      { name: "Bracer", type: "Cooler", size: "S", grade: "D", manufacturer: "J-Span" },
      { name: "Expedition", type: "Quantum Drive", size: "S", grade: "D", manufacturer: "ArcCorp" },
    ],
    compatibleComponents: [
      { name: "FR-66", type: "Shield", size: "S", grade: "C", manufacturer: "Fortitude" },
      { name: "Regulus", type: "Power Plant", size: "S", grade: "C", manufacturer: "ArcCorp" },
      { name: "Beacon", type: "Quantum Drive", size: "S", grade: "C", manufacturer: "Roberts Space Industries" },
    ],
  },
];

export function getShipById(id: string): ShipDetailed | undefined {
  return shipsDetailed.find(s => s.id === id);
}
