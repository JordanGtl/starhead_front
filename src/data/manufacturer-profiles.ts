export interface ManufacturerSpecialty {
  label: string;
  description: string;
  icon: string; // emoji ou identifiant
}

export interface ManufacturerShip {
  name: string;
  role: string;
  description: string;
}

export interface ManufacturerStat {
  value: string;
  label: string;
}

export interface ManufacturerProfile {
  tagline:       string;
  positioning:   string; // militaire, civil, industriel…
  quote?:        string;
  quoteAuthor?:  string;
  stats:         ManufacturerStat[];
  specialties:   ManufacturerSpecialty[];
  flagships:     ManufacturerShip[];
  relations:     { name: string; description: string }[];
}

export const manufacturerProfiles: Record<string, ManufacturerProfile> = {
  'aegis-dynamics': {
    tagline:     'Forgé pour la guerre. Approuvé par l\'UEE.',
    positioning: 'Constructeur militaire',
    quote:       'Nos vaisseaux ne demandent pas la permission.',
    quoteAuthor: 'Slogan publicitaire Aegis, 2947',
    stats: [
      { value: '300+',  label: 'Années d\'histoire' },
      { value: '60%',   label: 'De la flotte UEE équipée' },
      { value: '12',    label: 'Vaisseaux au catalogue' },
      { value: '2691',  label: 'Année de fondation' },
    ],
    specialties: [
      {
        label:       'Chasseurs de supériorité',
        description: 'Du Gladius au Sabre, Aegis définit les standards du combat rapproché avec des appareils alliant agilité et puissance de feu.',
        icon:        '✦',
      },
      {
        label:       'Bombardiers & frappes',
        description: 'Le Retaliator et l\'Eclipse incarnent la doctrine de frappe profonde d\'Aegis — des plateformes capables d\'atteindre des cibles lourdes derrière les lignes ennemies.',
        icon:        '◆',
      },
      {
        label:       'Défense de flotte',
        description: 'Le Hammerhead et le Nautilus complètent la doctrine défensive d\'Aegis, permettant à des organisations entières de sécuriser leurs zones d\'opération.',
        icon:        '▲',
      },
      {
        label:       'Polyvalence civile',
        description: 'Depuis la chute du régime Messer, Aegis a su adapter ses technologies militaires au marché civil avec des appareils comme l\'Avenger et le Vanguard.',
        icon:        '●',
      },
    ],
    flagships: [
      { name: 'Sabre',         role: 'Chasseur furtif',          description: 'Le fer de lance furtif d\'Aegis. Faible signature, haute létalité.' },
      { name: 'Hammerhead',    role: 'Corvette anti-chasseurs',   description: 'Six tourelles, un équipage de sept. La réponse d\'Aegis aux essaims de chasseurs.' },
      { name: 'Vanguard',      role: 'Chasseur lourd longue portée', description: 'Conçu pour opérer aux confins de l\'espace connu, loin de tout soutien.' },
      { name: 'Eclipse',       role: 'Bombardier stealth',        description: 'Invisible aux radars. Trois torpilles. Une seule chance de frapper.' },
      { name: 'Retaliator',    role: 'Bombardier lourd',          description: 'L\'ancêtre. Trois siècles de service continu au sein de l\'UEE Navy.' },
      { name: 'Redeemer',      role: 'Canonnière d\'assaut',      description: 'Transport de troupes armé jusqu\'aux dents. L\'assaut sous escorte intégrée.' },
    ],
    relations: [
      { name: 'UEE Navy',           description: 'Partenaire historique et premier client d\'Aegis depuis 2715. La majorité des contrats militaires de la Navy transitent par Aegis.' },
      { name: 'Advocacy',           description: 'Aegis fournit certains appareils légers utilisés par les forces d\'intervention rapide de l\'Advocacy dans les systèmes frontaliers.' },
      { name: 'Basilisk',           description: 'Partenariat technologique pour l\'intégration des systèmes furtifs Basilisk sur le Sabre et l\'Eclipse.' },
      { name: 'Behring',            description: 'Les vaisseaux Aegis sortent d\'usine pré-équipés en armement Behring, une collaboration industrielle de longue date.' },
    ],
  },
};
