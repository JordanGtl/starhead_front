export interface LoreEntry {
  id: string;
  title: string;
  category: "Histoire" | "Factions" | "Espèces" | "Technologie" | "Événements";
  summary: string;
  content: string;
  date?: string;
}

export const loreCategories = ["Histoire", "Factions", "Espèces", "Technologie", "Événements"] as const;

export const loreEntries: LoreEntry[] = [
  {
    id: "l1", title: "L'United Empire of Earth (UEE)", category: "Factions",
    summary: "Le gouvernement supranational qui régit l'humanité à travers les étoiles.",
    content: "L'United Empire of Earth est le successeur de l'United Nations of Earth (UNE) et de l'United Planets of Earth (UPE). Fondé en 2546 par Ivar Messer, qui s'est auto-proclamé Imperator, l'Empire a connu des siècles de régime autoritaire avant la Révolution de 2792 qui a restauré la démocratie. Aujourd'hui, l'UEE est dirigé par un Imperator élu et un Sénat, mais les tensions entre les systèmes centraux prospères et les systèmes frontaliers restent vives. L'UEE contrôle des dizaines de systèmes stellaires et maintient une flotte militaire massive pour protéger ses frontières, notamment contre la menace Vanduul.",
    date: "2546",
  },
  {
    id: "l2", title: "Les Vanduul", category: "Espèces",
    summary: "Race guerrière nomade et principale menace pour l'humanité.",
    content: "Les Vanduul sont une espèce extraterrestre nomade organisée en clans indépendants. Contrairement aux autres espèces connues, les Vanduul n'ont pas de monde natal fixe : chaque clan navigue à travers l'espace dans des flottes massives, revendiquant des territoires par la force. Le premier contact avec les humains en 2681 s'est soldé par un massacre sur le monde colonie d'Armitage. Depuis, les Vanduul et l'humanité sont en état de guerre quasi-permanent. La chute du système Vega en 2945 (Bataille de Vega II) a rappelé à l'UEE que la menace Vanduul était loin d'être contenue. Les Vanduul possèdent des vaisseaux organiques-mécaniques d'une technologie unique, notamment le redoutable Kingship.",
    date: "2681",
  },
  {
    id: "l3", title: "Les Xi'an", category: "Espèces",
    summary: "Empire ancien et patient, ancien ennemi devenu allié prudent.",
    content: "L'Empire Xi'an est l'une des plus anciennes civilisations connues, avec une durée de vie individuelle de plusieurs siècles. La Guerre Froide entre humains et Xi'an (2530-2789) a défini les relations intergalactiques pendant des générations. Suite à la chute du régime Messer, les relations se sont considérablement améliorées, aboutissant à des accords commerciaux et au Partenariat Human-Xi'an de 2789. Les Xi'an sont réputés pour leur patience, leur technologie avancée (notamment en biotechnologie) et leur sens aigu de la diplomatie. L'échange de technologies a permis à des entreprises comme MISC d'intégrer des innovations Xi'an dans leurs vaisseaux.",
    date: "2530",
  },
  {
    id: "l4", title: "Les Banu", category: "Espèces",
    summary: "Marchands nomades, premier contact extraterrestre de l'humanité.",
    content: "Les Banu ont été la première espèce extraterrestre rencontrée par l'humanité en 2438. Ce sont des commerçants nés, organisés en souks (guildes commerciales) plutôt qu'en nations. Les Banu sont neutres dans les conflits galactiques et commercent avec toutes les espèces, y compris les Vanduul. Leur culture est centrée sur le commerce et l'artisanat : un Banu mesure sa valeur à ses compétences marchandes. Le Merchantman, leur vaisseau emblématique, est un bazar volant capable de transporter et d'exposer d'énormes quantités de marchandises.",
    date: "2438",
  },
  {
    id: "l5", title: "Les Tevarin", category: "Espèces",
    summary: "Espèce guerrière conquise, intégrée de force dans l'UEE.",
    content: "Les Tevarin sont une espèce humanoïde qui a mené deux guerres contre l'humanité (2541-2546 et 2603-2610). Après leur défaite finale, les Tevarin ont perdu leur monde natal Kaleeth (rebaptisé Gemma par l'UEE) et ont été contraints de s'intégrer à la société humaine. Aujourd'hui, les Tevarin vivent comme citoyens de seconde zone, leur culture et traditions progressivement effacées. Certains Tevarin s'efforcent de préserver leur héritage, tandis que d'autres ont pleinement embrassé la culture humaine. Le Prowler d'Esperia est une réplique d'un vaisseau de débarquement Tevarin.",
    date: "2541",
  },
  {
    id: "l6", title: "Le Quantum Drive", category: "Technologie",
    summary: "Le moteur qui a permis l'expansion humaine dans les étoiles.",
    content: "Le Quantum Drive est la technologie fondamentale du voyage spatial. Développé par RSI au 21e siècle, il permet aux vaisseaux d'atteindre 0.2c (20% de la vitesse de la lumière) en comprimant l'espace devant le vaisseau. Le Quantum Drive ne permet pas le voyage interstellaire à lui seul : pour cela, les vaisseaux utilisent les Jump Points. Différents fabricants produisent des quantum drives avec des caractéristiques variées : vitesse, consommation de carburant, temps de spool. Les modèles militaires privilégient la vitesse de spool pour les situations de combat, tandis que les modèles civils optimisent la consommation.",
  },
  {
    id: "l7", title: "Les Jump Points", category: "Technologie",
    summary: "Tunnels naturels reliant les systèmes stellaires entre eux.",
    content: "Les Jump Points sont des anomalies spatiales naturelles qui créent des passages entre les systèmes stellaires. Découverts pour la première fois par Nick Croshaw en 2271, ces tunnels dimensionnels permettent le voyage interstellaire en quelques minutes. Chaque Jump Point a une taille qui détermine quels vaisseaux peuvent l'emprunter : Small, Medium ou Large. La navigation dans un Jump Point nécessite des compétences de pilotage et un Jump Drive spécialisé. La découverte de nouveaux Jump Points est une activité lucrative et dangereuse, car les tunnels peuvent être instables.",
    date: "2271",
  },
  {
    id: "l8", title: "L'ère Messer", category: "Histoire",
    summary: "Deux siècles de régime totalitaire sous la dynastie Messer.",
    content: "L'ère Messer (2546-2792) représente la période la plus sombre de l'histoire humaine interstellaire. Ivar Messer a exploité la peur des Tevarin pour se faire nommer Premier Citoyen, puis Imperator. Sa dynastie a régné pendant 246 ans, imposant un régime de surveillance, de propagande et de répression. Les Messer ont commis des atrocités, notamment le bombardement de Garron II qui a déclenché la révolution. La chute du dernier Messer, Linton Messer XI, en 2792 a été célébrée dans tout l'empire et a conduit à la restauration des institutions démocratiques.",
    date: "2546-2792",
  },
  {
    id: "l9", title: "La Bataille de Vega II", category: "Événements",
    summary: "Attaque Vanduul massive qui a choqué l'UEE en 2945.",
    content: "En 2945, une flotte Vanduul massive a attaqué le système Vega, ciblant la colonie d'Aremis (Vega II). L'attaque, menée par un Kingship Vanduul, a pris l'UEE Navy par surprise. La défense héroïque de la flotte locale et l'intervention rapide de renforts ont permis de repousser les Vanduul, mais les pertes civiles et militaires ont été considérables. La Bataille de Vega II a servi de signal d'alarme pour l'UEE, prouvant que les Vanduul étaient capables de frapper profondément dans le territoire humain.",
    date: "2945",
  },
  {
    id: "l10", title: "Le système Stanton", category: "Histoire",
    summary: "Seul système entièrement privatisé de l'UEE.",
    content: "Le système Stanton est unique dans l'UEE : ses quatre planètes ont été vendues à des méga-corporations. Hurston Dynamics possède Hurston, Crusader Industries possède Crusader, ArcCorp possède ArcCorp, et microTech possède microTech. Ce système est devenu un hub commercial majeur grâce à sa position stratégique et ses Jump Points multiples. Chaque corporation gère sa planète selon ses propres règles, créant un patchwork de cultures et de réglementations. Pour les pilotes indépendants, Stanton est un terrain de jeu idéal avec ses opportunités de commerce, de minage et de missions.",
  },
  {
    id: "l11", title: "Le Projet Archangel", category: "Événements",
    summary: "Programme secret de construction du vaisseau-monde Bengal.",
    content: "Le Projet Archangel est le programme militaire classifié qui a donné naissance au Bengal Carrier, le plus grand vaisseau de combat jamais construit par l'humanité. Long de près d'un kilomètre, le Bengal est un porte-vaisseaux capable d'opérer de manière autonome pendant des années. Seuls quelques exemplaires existent, chacun représentant un investissement colossal. Des rumeurs persistent sur l'existence de Bengal abandonnés ou perdus dans des systèmes non cartographiés, alimentant les rêves des explorateurs.",
  },
  {
    id: "l12", title: "Nick Croshaw et le premier Jump Point", category: "Histoire",
    summary: "La découverte qui a ouvert l'ère de l'expansion interstellaire.",
    content: "En 2271, le pilote Nick Croshaw a découvert et traversé le premier Jump Point, reliant le système Sol au système qui porte désormais son nom : Croshaw. Cette découverte a transformé l'humanité d'une espèce confinée à un seul système stellaire en une civilisation interstellaire. Croshaw est devenu un héros légendaire, et la profession de 'Jumper' (explorateur de Jump Points) est née. La colonisation de Croshaw a débuté peu après, marquant le début de l'expansion humaine à travers la galaxie.",
    date: "2271",
  },
  {
    id: "l13", title: "L'Advocacy", category: "Factions",
    summary: "L'agence fédérale de maintien de l'ordre de l'UEE.",
    content: "L'Advocacy est l'agence fédérale de maintien de l'ordre de l'UEE, comparable à un FBI interstellaire. Ses agents opèrent à travers tous les systèmes de l'UEE, traquant les criminels, démantelant les réseaux de contrebande et enquêtant sur les menaces internes. L'Advocacy dispose de pouvoirs étendus et de ressources considérables, mais sa juridiction s'arrête aux frontières de l'UEE. Dans les systèmes frontaliers, l'Advocacy collabore souvent avec les milices locales et les chasseurs de primes indépendants.",
  },
  {
    id: "l14", title: "La terraformation", category: "Technologie",
    summary: "La technologie qui transforme des mondes inhospitaliers en paradis habitables.",
    content: "La terraformation est le processus de modification de l'atmosphère, de la température et de l'écosystème d'une planète pour la rendre habitable par les humains. Ce processus peut prendre des décennies, voire des siècles, et représente un investissement colossal. L'UEE a terraformé des dizaines de mondes, mais le processus reste controversé : la terraformation de Garron II sous le régime Messer a détruit un écosystème alien primitif, provoquant un scandale galactique. Les débats sur l'éthique de la terraformation continuent de diviser la société.",
  },
  {
    id: "l15", title: "La chute de Caliban", category: "Événements",
    summary: "Un système humain tombé aux mains des Vanduul.",
    content: "Caliban était autrefois un système humain prospère avant d'être conquis par les Vanduul. L'échec de l'UEE à défendre Caliban a été un traumatisme national, soulevant des questions sur la capacité de l'Empire à protéger ses citoyens. Aujourd'hui, Caliban est un système Vanduul, et les tentatives de le reconquérir se sont toutes soldées par des échecs. Le sort de Caliban hante la conscience collective de l'UEE et alimente les discours de ceux qui réclament une offensive massive contre les Vanduul.",
  },
  {
    id: "l16", title: "Les Guildes de Pilotes", category: "Factions",
    summary: "Organisations indépendantes structurant la vie des pilotes civils.",
    content: "Les guildes de pilotes sont des organisations qui rassemblent les pilotes civils autour d'intérêts communs : commerce, exploration, minage, sécurité ou course. Ces guildes offrent à leurs membres des contrats, du soutien logistique et un réseau social. Certaines guildes sont des organisations respectables avec des bureaux dans les grandes stations, tandis que d'autres opèrent dans les zones grises de la légalité. Les guildes jouent un rôle crucial dans l'économie du 'verse, comblant le vide entre les corporations et les travailleurs indépendants.",
  },
];
