// ─── Types ────────────────────────────────────────────────────────────────────

export type CharacterStatus  = 'alive' | 'deceased' | 'unknown';
export type CharacterSpecies = 'human' | "xi'an" | 'vanduul' | 'banu' | 'other';
export type FamilyRelation =
  | 'father' | 'mother'
  | 'grandfather' | 'grandmother'
  | 'son' | 'daughter'
  | 'grandson' | 'granddaughter'
  | 'brother' | 'sister'
  | 'spouse';

export interface LocalizedString {
  fr: string;
  en: string;
}

export interface BiographySection {
  title:   LocalizedString;
  content: LocalizedString;
}

export interface FamilyMember {
  name:          string;
  relation:      FamilyRelation;
  status?:       CharacterStatus;
  born?:         string;
  died?:         string;
  /** Slug si ce membre est dans la base de données */
  characterSlug?: string;
}

export interface Character {
  id:           number;
  slug:         string;
  name:         string;
  title:        LocalizedString;
  affiliation:  LocalizedString;
  species:      CharacterSpecies;
  status:       CharacterStatus;
  born?:        string;
  died?:        string;
  /** Résumé court utilisé dans la liste et le SEO */
  description:  LocalizedString;
  /** Sections détaillées pour la page profil */
  biography?:   BiographySection[];
  /** Arbre généalogique */
  family?:      FamilyMember[];
  /** Slug du fabricant/entreprise lié — pointe vers /manufacturers/[slug] */
  companySlug?: string;
  image?:       string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function localizeChar(field: LocalizedString, lang: string): string {
  return lang.split('-')[0] === 'fr' ? field.fr : field.en;
}

export function characterAffiliations(characters: Character[]): string[] {
  return [...new Set(characters.map(c => c.affiliation.en))].sort();
}

export function getCharacterBySlug(slug: string): Character | undefined {
  return CHARACTERS.find(c => c.slug === slug);
}

// ─── Données ──────────────────────────────────────────────────────────────────

export const CHARACTERS: Character[] = [
  {
    id: 1,
    slug: 'ivar-messer-i',
    name: 'Ivar Messer I',
    title: { fr: "Premier Impérator de l'UEE", en: 'First Imperator of the UEE' },
    affiliation: { fr: 'UEE', en: 'UEE' },
    species: 'human',
    status: 'deceased',
    born: '2546 SEY',
    died: '2601 SEY',
    description: {
      fr: "Chef de guerre charismatique devenu le premier Impérator de l'UEE après la Première Guerre Tevarin. Son règne marqua le début de la Dynastique Messer, une période d'autoritarisme de plus de deux siècles.",
      en: 'Charismatic warlord who became the first Imperator of the UEE after the First Tevarin War. His rule marked the beginning of the Messer Dynasty, over two centuries of authoritarianism.',
    },
    biography: [
      {
        title: { fr: 'Jeunesse & ascension militaire', en: 'Early Life & Military Rise' },
        content: {
          fr: "Né dans une famille de colons de la ceinture d'astéroïdes de Croshaw, Ivar Messer grandit dans la pauvreté avant de s'engager dans l'armée à dix-sept ans. Doté d'un charisme naturel et d'une intelligence tactique hors du commun, il gravit rapidement les échelons pour devenir l'un des généraux les plus respectés de l'armée terrienne. Sa réputation se forja lors d'opérations contre les pirates dans les systèmes frontaliers, où il se distingua par une brutalité efficace qui lui valut autant d'admirateurs que d'ennemis.",
          en: 'Born to a family of asteroid-belt settlers in Croshaw, Ivar Messer grew up in poverty before enlisting in the military at seventeen. Blessed with natural charisma and exceptional tactical intelligence, he rapidly rose through the ranks to become one of the most respected generals in the Terran army. His reputation was forged during operations against pirates in frontier systems, where his brutal efficiency earned him as many admirers as enemies.',
        },
      },
      {
        title: { fr: 'La Première Guerre Tevarin', en: 'The First Tevarin War' },
        content: {
          fr: "Lorsque les Tevarin lancèrent leur offensive sur les colonies humaines en 2541, Messer fut promu commandant en chef des forces terrestres. En cinq ans de conflit acharné, il dirigea des campagnes décisives qui repoussèrent les Tevarin hors des systèmes humains et aboutirent à la sécurisation de leur planète natale. Sa victoire finale à la Bataille de Idris IV, où ses forces écrasèrent l'armada Tevarin en dépit d'une infériorité numérique de trois contre un, fut célébrée comme le plus grand triomphe militaire de l'histoire humaine.",
          en: 'When the Tevarin launched their offensive against human colonies in 2541, Messer was promoted to supreme commander of Terran forces. Over five years of fierce conflict, he led decisive campaigns that drove the Tevarin out of human systems and culminated in the securing of their home planet. His final victory at the Battle of Idris IV, where his forces crushed the Tevarin armada despite being outnumbered three to one, was celebrated as the greatest military triumph in human history.',
        },
      },
      {
        title: { fr: "L'Impérator & la Dynastique Messer", en: 'The Imperator & the Messer Dynasty' },
        content: {
          fr: "Fort de sa popularité, Messer reforma la constitution en 2546 et se fit nommer Premier Impérator, concentrant entre ses mains les pouvoirs exécutif, militaire et judiciaire. Il rebaptisa l'État l'Empire Uni de la Terre (UEE) et entreprit une politique expansionniste agressive. Si son règne initial bénéficia d'une relative prospérité économique, les libertés civiques furent progressivement érodées, les opposants réduits au silence et les médias contrôlés. Il établit également la règle de succession dynastique, garantissant que le titre d'Impérator resterait dans la famille Messer pour les générations suivantes.",
          en: 'Buoyed by his popularity, Messer reformed the constitution in 2546 and had himself named First Imperator, concentrating executive, military, and judicial power in his own hands. He renamed the state the United Empire of Earth (UEE) and pursued aggressive expansionist policies. While his initial reign enjoyed relative economic prosperity, civil liberties were progressively eroded, opponents silenced, and media controlled. He also established dynastic succession, ensuring that the title of Imperator would remain in the Messer family for generations.',
        },
      },
      {
        title: { fr: 'Héritage', en: 'Legacy' },
        content: {
          fr: "À sa mort en 2601, Ivar Messer fut présenté comme un héros fondateur par la propagande officielle. La réalité historique est bien plus nuancée : s'il unifia et protégea l'humanité face à une menace existentielle, il ouvrit également la porte à deux siècles de tyrannie. Aujourd'hui, son nom reste profondément ambigu dans la mémoire collective de l'UEE — symbole à la fois de courage militaire et d'abus de pouvoir institutionnalisé.",
          en: "At his death in 2601, Ivar Messer was presented as a founding hero by official propaganda. The historical reality is far more nuanced: while he unified and protected humanity against an existential threat, he also opened the door to two centuries of tyranny. Today his name remains deeply ambiguous in the UEE's collective memory — a symbol of both military courage and institutionalised abuse of power.",
        },
      },
    ],
    family: [
      { name: 'Lena Vardan Messer', relation: 'spouse',  status: 'deceased', born: '2549 SEY', died: '2598 SEY' },
      { name: 'Ivar Messer II',     relation: 'son',     status: 'deceased', born: '2568 SEY', died: '2631 SEY' },
      { name: 'Mara Messer',        relation: 'daughter', status: 'deceased', born: '2571 SEY', died: '2640 SEY' },
    ],
  },

  {
    id: 2,
    slug: 'linton-messer-xi',
    name: 'Linton Messer XI',
    title: { fr: 'Dernier Impérator de la Lignée Messer', en: 'Last Imperator of the Messer Line' },
    affiliation: { fr: 'UEE', en: 'UEE' },
    species: 'human',
    status: 'deceased',
    died: '2792 SEY',
    description: {
      fr: "Dernier de la lignée Messer, renversé en 2792 lors de la Révolution de la Liberté. Son régime brutal et sa répression des droits fondamentaux poussèrent finalement le peuple et le Sénat à se soulever contre lui.",
      en: 'Last of the Messer line, overthrown in 2792 during the Liberation Revolution. His brutal regime and suppression of fundamental rights ultimately drove the people and Senate to rise against him.',
    },
    biography: [
      {
        title: { fr: 'Accession au pouvoir', en: 'Rise to Power' },
        content: {
          fr: "Linton Messer XI hérita du titre d'Impérator dans une UEE déjà profondément fragilisée par des décennies d'autoritarisme. Contrairement à ses prédécesseurs qui avaient maintenu une façade de gouvernance fonctionnelle, il consolida son pouvoir en purgant les rangs du Sénat, remplaçant les fonctionnaires indépendants par des loyalistes et en muselant toute presse critique. Ses premières années de règne furent marquées par une paranoïa croissante et une violence institutionnelle systématisée.",
          en: 'Linton Messer XI inherited the title of Imperator in a UEE already deeply weakened by decades of authoritarianism. Unlike his predecessors who maintained a veneer of functional governance, he consolidated power by purging the Senate, replacing independent officials with loyalists, and muzzling all critical press. His early years of rule were marked by growing paranoia and systematised institutional violence.',
        },
      },
      {
        title: { fr: 'Le règne de la terreur', en: 'Reign of Terror' },
        content: {
          fr: "Sous Messer XI, les disparitions forcées de dissidents devinrent monnaie courante. Les Advocacy — normalement garants de l'ordre — furent transformés en police politique. Les Xi'An et les Banu réduisirent leurs échanges commerciaux avec l'UEE, alarmés par l'instabilité croissante. Des rébellions éclatèrent dans plusieurs systèmes, toutes réprimées dans le sang. Le régime atteignit son point de non-retour lors du massacre de New Junction en 2789, où des manifestants pacifiques furent abattus sur ordre direct de l'Impérator.",
          en: "Under Messer XI, forced disappearances of dissidents became commonplace. The Advocacy — normally guardians of order — were transformed into a political police force. The Xi'An and Banu reduced their trade with the UEE, alarmed by growing instability. Rebellions broke out in several systems, all suppressed with bloodshed. The regime reached its point of no return during the New Junction massacre of 2789, where peaceful protesters were shot on the Imperator's direct orders.",
        },
      },
      {
        title: { fr: 'La Révolution de la Liberté', en: 'The Liberation Revolution' },
        content: {
          fr: "En 2792, une coalition de sénateurs menée par Assan Kieren, appuyée par des amiraux en rupture de ban et des milices citoyennes, déclencha un mouvement de désobéissance civile massive. Lorsque les troupes refusèrent de tirer sur la foule, Messer XI fut destitué par un vote d'urgence du Sénat. Il tenta de fuir mais fut arrêté dans le système Nul. Son procès, retransmis en direct dans toute l'UEE, scella définitivement la chute de la dynastique Messer. Il mourut en détention peu après sa condamnation.",
          en: 'In 2792, a coalition of senators led by Assan Kieren, backed by dissident admirals and citizen militias, triggered a movement of mass civil disobedience. When troops refused to fire on the crowd, Messer XI was deposed by an emergency Senate vote. He attempted to flee but was arrested in the Nul system. His trial, broadcast live throughout the UEE, definitively sealed the fall of the Messer dynasty. He died in detention shortly after his conviction.',
        },
      },
    ],
    family: [
      { name: 'Linton Messer X',   relation: 'father',      status: 'deceased' },
      { name: 'Sylva Orren Messer', relation: 'mother',     status: 'deceased' },
      { name: 'Ivar Messer I',     relation: 'grandfather', status: 'deceased', characterSlug: 'ivar-messer-i' },
    ],
  },

  {
    id: 3,
    slug: 'erin-toi',
    name: 'Erin Toi',
    title: { fr: 'Première Impératrice post-Messer', en: 'First Post-Messer Imperatrix' },
    affiliation: { fr: 'UEE', en: 'UEE' },
    species: 'human',
    status: 'deceased',
    born: '2751 SEY',
    died: '2832 SEY',
    description: {
      fr: "Première Impératrice élue après la chute des Messer, Erin Toi restaura les libertés civiques et jeta les bases de l'UEE démocratique moderne.",
      en: 'First Imperatrix elected after the fall of the Messers, Erin Toi restored civil liberties and laid the foundations of the modern democratic UEE.',
    },
    biography: [
      {
        title: { fr: 'Origines & engagement politique', en: 'Origins & Political Commitment' },
        content: {
          fr: "Née sur Angeli dans le système Croshaw, Erin Toi grandit sous la répression de la fin de la dynastique Messer. Juriste de formation, elle s'engagea clandestinement dans les réseaux de résistance dès ses études universitaires. Son intelligence politique et sa capacité à forger des alliances transversales en firent rapidement une figure incontournable de l'opposition. Arrêtée deux fois par l'Advocacy politique, elle fut libérée à chaque fois grâce à la mobilisation internationale.",
          en: 'Born on Angeli in the Croshaw system, Erin Toi grew up under the repression of the late Messer dynasty. Trained as a jurist, she engaged clandestinely in resistance networks from her university years. Her political intelligence and ability to forge cross-party alliances quickly made her a key figure in the opposition. Arrested twice by the political Advocacy, she was released each time thanks to international mobilisation.',
        },
      },
      {
        title: { fr: "La reconstruction de l'UEE", en: 'Rebuilding the UEE' },
        content: {
          fr: "Élue Impératrice par le Sénat en 2793, Toi s'attela immédiatement à démanteler les structures oppressives héritées des Messer. Elle rétablit la liberté de la presse, libéra les prisonniers politiques, réforma l'Advocacy pour en faire une institution indépendante et initia la rédaction d'une nouvelle charte des droits fondamentaux. Sur le plan diplomatique, elle rouvrit les négociations commerciales avec les Xi'An et les Banu, stabilisant des relations qui avaient été dégradées pendant des décennies.",
          en: "Elected Imperatrix by the Senate in 2793, Toi immediately set about dismantling the oppressive structures inherited from the Messers. She restored freedom of the press, freed political prisoners, reformed the Advocacy into an independent institution, and initiated the drafting of a new charter of fundamental rights. Diplomatically, she reopened trade negotiations with the Xi'An and Banu, stabilising relations that had been degraded for decades.",
        },
      },
      {
        title: { fr: 'Héritage démocratique', en: 'Democratic Legacy' },
        content: {
          fr: "À sa mort en 2832, après deux mandats à la tête de l'UEE, Erin Toi laissait une institution profondément transformée. Les historiens la classent systématiquement parmi les trois personnages les plus influents de l'histoire humaine. Son modèle de transition pacifique du totalitarisme à la démocratie est aujourd'hui étudié dans les universités de l'UEE et même dans certaines institutions Xi'An comme exemple de résilience politique.",
          en: "At her death in 2832, after two terms leading the UEE, Erin Toi left a profoundly transformed institution. Historians consistently rank her among the three most influential figures in human history. Her model of peaceful transition from totalitarianism to democracy is now studied in UEE universities and even in some Xi'An institutions as an example of political resilience.",
        },
      },
    ],
    family: [
      { name: 'Joram Toi',      relation: 'father',   status: 'deceased' },
      { name: 'Yasmine Akoury', relation: 'mother',   status: 'deceased' },
      { name: 'Nils Brandvik',  relation: 'spouse',   status: 'deceased', born: '2749 SEY', died: '2819 SEY' },
      { name: 'Sena Toi',       relation: 'daughter', status: 'deceased', born: '2777 SEY' },
    ],
  },

  {
    id: 4,
    slug: 'assan-kieren',
    name: 'Assan Kieren',
    title: { fr: 'Sénateur & Architecte de la Révolution', en: 'Senator & Architect of the Revolution' },
    affiliation: { fr: "Sénat de l'UEE", en: 'UEE Senate' },
    species: 'human',
    status: 'deceased',
    born: '2748 SEY',
    description: {
      fr: "Sénateur courageux qui orchestra la coalition parlementaire ayant renversé Linton Messer XI. Vénéré comme un héros de la liberté dans les manuels d'histoire de l'UEE.",
      en: 'Courageous senator who orchestrated the parliamentary coalition that overthrew Linton Messer XI. Revered as a hero of freedom in UEE history books.',
    },
    biography: [
      {
        title: { fr: 'Le sénateur dissident', en: 'The Dissident Senator' },
        content: {
          fr: "Élu au Sénat en 2774 pour représenter les colonies du système Rhetor, Assan Kieren fut l'une des rares voix à s'élever publiquement contre les dérives du régime Messer XI, au risque de sa vie. Ses discours enregistrés en secret et diffusés sur les réseaux clandestins circulèrent dans toute l'UEE, lui bâtissant une réputation de courage rare. Plusieurs tentatives d'assassinat furent déjouées grâce à des réseaux de protection citoyens.",
          en: 'Elected to the Senate in 2774 to represent the colonies of the Rhetor system, Assan Kieren was one of the rare voices to publicly speak out against the excesses of the Messer XI regime, at great personal risk. His speeches, secretly recorded and distributed through clandestine networks, circulated throughout the UEE, building him a reputation for rare courage. Several assassination attempts were foiled thanks to citizen protection networks.',
        },
      },
      {
        title: { fr: "La coalition contre Messer", en: 'The Coalition Against Messer' },
        content: {
          fr: "À partir de 2790, Kieren travailla en secret pendant deux ans à forger une coalition de sénateurs, d'amiraux mécontents et de chefs de milices civiles. Sa stratégie reposait sur un point clé : faire basculer l'armée avant de déclencher l'action politique. Lorsque le vote de destitution fut finalement soumis au Sénat en 2792, il disposait d'une majorité suffisante pour éviter tout bain de sang institutionnel. La Révolution de la Liberté fut largement pacifique, ce que les historiens attribuent en grande partie à la minutie de sa préparation.",
          en: 'From 2790, Kieren worked in secret for two years to forge a coalition of senators, disaffected admirals, and civilian militia leaders. His strategy hinged on one key point: winning over the military before triggering political action. When the impeachment vote was finally put to the Senate in 2792, he had a sufficient majority to avoid any institutional bloodshed. The Liberation Revolution was largely peaceful — something historians attribute largely to the meticulousness of his preparation.',
        },
      },
      {
        title: { fr: 'Héritage', en: 'Legacy' },
        content: {
          fr: "Kieren refusa la présidence du Sénat et tout titre officiel après la révolution, estimant que le moment appartienait à la reconstruction plutôt qu'aux honneurs personnels. Il consacra les dernières années de sa vie à rédiger les mémoires de la résistance et à former de jeunes juristes aux principes de la démocratie constitutionnelle. Plusieurs écoles de droit portent son nom dans l'UEE moderne.",
          en: 'Kieren refused the Senate presidency and any official title after the revolution, believing the moment belonged to reconstruction rather than personal honours. He devoted his final years to writing the memoirs of the resistance and training young jurists in the principles of constitutional democracy. Several law schools bear his name in the modern UEE.',
        },
      },
    ],
  },

  {
    id: 5,
    slug: 'vernon-tar',
    name: 'Vernon Tar',
    title: { fr: "Fondateur de l'Advocacy", en: 'Founder of the Advocacy' },
    affiliation: { fr: 'Advocacy', en: 'Advocacy' },
    species: 'human',
    status: 'deceased',
    description: {
      fr: "Vétéran militaire et juriste qui fonda l'Advocacy, l'agence fédérale de maintien de l'ordre de l'UEE. Ses principes fondateurs d'intégrité et de neutralité politique restent le cœur de la mission de l'institution.",
      en: "Military veteran and jurist who founded the Advocacy, the UEE's federal law enforcement agency. His founding principles of integrity and political neutrality remain the core of the institution's mission.",
    },
    biography: [
      {
        title: { fr: 'Carrière militaire & désillusion', en: 'Military Career & Disillusionment' },
        content: {
          fr: "Vernon Tar servit vingt ans dans la marine de l'UEE avant de quitter l'armée, désillusionné par la corruption grandissante sous les premières années Messer. Il observait avec inquiétude comment les forces de l'ordre locales, fragmentées et incontrôlées, servaient souvent d'instruments d'oppression plutôt que de justice. Convaincu que l'UEE avait besoin d'une agence fédérale indépendante, il entama des études de droit à cinquante ans.",
          en: 'Vernon Tar served twenty years in the UEE navy before leaving the military, disillusioned by growing corruption under the early Messer years. He watched with concern as local law enforcement, fragmented and unaccountable, often served as instruments of oppression rather than justice. Convinced the UEE needed an independent federal agency, he began law studies at fifty.',
        },
      },
      {
        title: { fr: "Fondation de l'Advocacy", en: 'Founding the Advocacy' },
        content: {
          fr: "Après dix ans de lobbying et de rédaction, Tar obtint en 2523 que le Sénat vote la création de l'Advocacy comme agence fédérale indépendante chargée des crimes interstellaires. Il en conçut personnellement la charte fondatrice, insistant sur trois piliers : l'indépendance politique absolue, la transparence des enquêtes et la protection des lanceurs d'alerte. Il dirigea l'agence pendant douze ans, refusant systématiquement les pressions politiques et bâtissant une culture institutionnelle solide.",
          en: 'After ten years of lobbying and drafting, Tar obtained in 2523 a Senate vote creating the Advocacy as an independent federal agency responsible for interstellar crimes. He personally designed its founding charter, insisting on three pillars: absolute political independence, investigative transparency, and whistleblower protection. He led the agency for twelve years, systematically refusing political pressure and building a solid institutional culture.',
        },
      },
    ],
  },

  {
    id: 6,
    slug: 'jorun-orzechowski',
    name: 'Jorun Orzechowski',
    title: { fr: "Directeur Général de l'Advocacy", en: 'Director of the Advocacy' },
    affiliation: { fr: 'Advocacy', en: 'Advocacy' },
    species: 'human',
    status: 'alive',
    description: {
      fr: "Directeur actuel de l'Advocacy, connu pour sa rigueur et son intégrité. Orzechowski a modernisé les méthodes d'enquête et étendu la présence de l'agence dans les systèmes frontaliers.",
      en: "Current Director of the Advocacy, known for his rigor and integrity. Orzechowski has modernised the agency's investigative methods and expanded its presence in frontier systems.",
    },
    biography: [
      {
        title: { fr: 'Parcours & montée en grade', en: 'Career & Rise Through the Ranks' },
        content: {
          fr: "Jorun Orzechowski rejoignit l'Advocacy à vingt-deux ans comme agent de terrain dans le système Stanton, se spécialisant dans la criminalité organisée et les réseaux de trafic d'armes. Son sang-froid lors d'opérations à haut risque et sa capacité à démanteler des réseaux complexes lui valurent une réputation enviable. Il gravit progressivement les échelons jusqu'à diriger la division des crimes interstellaires, avant d'être nommé Directeur Général par l'Imperator Costigan.",
          en: 'Jorun Orzechowski joined the Advocacy at twenty-two as a field agent in the Stanton system, specialising in organised crime and arms trafficking networks. His composure in high-risk operations and his ability to dismantle complex networks earned him an enviable reputation. He gradually rose through the ranks to lead the interstellar crimes division, before being appointed Director-General by Imperator Costigan.',
        },
      },
      {
        title: { fr: "Modernisation de l'Advocacy", en: 'Modernising the Advocacy' },
        content: {
          fr: "Depuis sa nomination, Orzechowski a lancé un programme ambitieux de modernisation technologique : déploiement de drones d'investigation autonomes, standardisation des protocoles d'enquête entre systèmes et création d'une unité spécialisée dans la cybercriminalité. Il a également réformé la formation des recrues pour intégrer des modules de gestion du stress et d'éthique professionnelle, visant à réduire les bavures et renforcer la confiance du public.",
          en: 'Since his appointment, Orzechowski has launched an ambitious programme of technological modernisation: deployment of autonomous investigation drones, standardisation of cross-system investigation protocols, and creation of a cybercrime specialist unit. He has also reformed recruit training to include stress management and professional ethics modules, aiming to reduce misconduct and strengthen public trust.',
        },
      },
    ],
  },

  {
    id: 7,
    slug: 'imperator-costigan',
    name: 'Imperator Costigan',
    title: { fr: "Impérator de l'UEE", en: 'Imperator of the UEE' },
    affiliation: { fr: 'UEE', en: 'UEE' },
    species: 'human',
    status: 'alive',
    description: {
      fr: "Impérator en exercice de l'UEE. Partisan d'une ligne dure contre la criminalité organisée, il cherche à renforcer la présence militaire dans les systèmes frontaliers tout en maintenant des relations diplomatiques avec les Xi'An.",
      en: "Current Imperator of the UEE. A proponent of a hard line against organised crime, he seeks to strengthen military presence in frontier systems while maintaining diplomatic relations with the Xi'An.",
    },
    biography: [
      {
        title: { fr: 'Ascension politique', en: 'Political Rise' },
        content: {
          fr: "Costigan fit ses débuts comme avocat spécialisé en droit interstellaire avant d'entrer en politique par le Sénat du système Terra. Réputé pour ses positions tranchées sur la sécurité et son refus de compromis avec les intérêts corporatifs, il se fit élire sur un programme de transparence et de fermeté face à la criminalité organisée. Sa campagne à la présidence de l'Impérator fut largement soutenue par les syndicats de pilotes et les associations de colons des systèmes frontaliers.",
          en: 'Costigan began as a lawyer specialising in interstellar law before entering politics through the Terra system Senate. Known for his firm positions on security and his refusal to compromise with corporate interests, he was elected on a programme of transparency and toughness on organised crime. His campaign for the Imperatorship was broadly backed by pilot unions and settler associations in frontier systems.',
        },
      },
      {
        title: { fr: 'Politique intérieure & sécurité', en: 'Domestic Policy & Security' },
        content: {
          fr: "Son premier mandat fut marqué par une offensive contre les organisations criminelles majeures opérant dans Stanton : Nine Tails, Xenothreat et plusieurs cartels de contrebande. Il augmenta significativement le budget de l'Advocacy et autorisa des opérations militaires dans les zones non sécurisées du système. Sur le plan social, ses politiques sont plus controversées : ses critiques lui reprochent de négliger les inégalités économiques qui alimentent la criminalité.",
          en: 'His first term was marked by an offensive against major criminal organisations operating in Stanton: Nine Tails, Xenothreat, and several smuggling cartels. He significantly increased the Advocacy budget and authorised military operations in the unsecured zones of the system. On social policy his positions are more controversial: critics accuse him of neglecting the economic inequalities that fuel crime.',
        },
      },
      {
        title: { fr: 'Relations extérieures', en: 'Foreign Relations' },
        content: {
          fr: "Costigan maintient une posture délicate vis-à-vis des Xi'An : suffisamment ferme pour rassurer l'establishment militaire, suffisamment ouverte pour préserver les accords commerciaux vitaux. Face à la menace Vanduul qui s'intensifie sur les marges de l'UEE, il a approuvé le renforcement de la flotte de défense et des avant-postes militaires, tout en refusant de déclarer officiellement l'état de guerre — une ligne qu'il estime contre-productive diplomatiquement.",
          en: "Costigan maintains a delicate posture towards the Xi'An: firm enough to reassure the military establishment, open enough to preserve vital trade agreements. Facing the intensifying Vanduul threat on the UEE's margins, he has approved the strengthening of the defence fleet and military outposts, while refusing to officially declare a state of war — a line he considers diplomatically counterproductive.",
        },
      },
    ],
  },

  {
    id: 8,
    slug: 'ernst-bishop',
    name: 'Admiral Ernst Bishop',
    title: { fr: 'Amiral de la Flotte UEE', en: 'UEE Fleet Admiral' },
    affiliation: { fr: "Marine de l'UEE", en: 'UEE Navy' },
    species: 'human',
    status: 'alive',
    description: {
      fr: "Vétéran de nombreuses campagnes anti-Vanduul, Bishop est considéré comme l'un des stratèges militaires les plus brillants de sa génération.",
      en: 'Veteran of many anti-Vanduul campaigns, Bishop is considered one of the most brilliant military strategists of his generation.',
    },
    biography: [
      {
        title: { fr: 'Carrière militaire', en: 'Military Career' },
        content: {
          fr: "Fils d'un officier de marine, Ernst Bishop intégra l'Académie navale de l'UEE à dix-huit ans et se distingua immédiatement par ses capacités en simulation tactique. Après l'académie, il servit successivement comme pilote de chasseur, commandant d'escadron puis commandant de destroyer. Sa montée en grade fut rapide mais non sans obstacles : son franc-parler sur les lacunes de l'état-major lui valut plusieurs blocages d'avancement, finalement surmontés grâce à ses résultats opérationnels exceptionnels.",
          en: 'Son of a naval officer, Ernst Bishop entered the UEE Naval Academy at eighteen and immediately distinguished himself in tactical simulation. After the academy he served successively as a fighter pilot, squadron commander, and then destroyer commander. His rise was rapid but not without obstacles: his bluntness about command staff shortcomings earned him several promotion blocks, ultimately overcome by his exceptional operational results.',
        },
      },
      {
        title: { fr: 'Les campagnes Vanduul', en: 'The Vanduul Campaigns' },
        content: {
          fr: "Bishop fut le commandant de la flotte lors de la défense de Tiber en 2945, une des batailles les plus décisives de l'histoire récente contre les Vanduul. Malgré des ressources insuffisantes, sa tactique de retraite contrôlée combinée à des contre-attaques chirurgicales permit de limiter drastiquement les pertes humaines tout en infligeant des dommages significatifs à l'armada ennemie. La bataille est aujourd'hui étudiée à l'Académie navale comme modèle de défense asymétrique.",
          en: 'Bishop commanded the fleet during the defence of Tiber in 2945, one of the most decisive battles in recent history against the Vanduul. Despite insufficient resources, his tactics of controlled retreat combined with surgical counter-attacks drastically limited human casualties while inflicting significant damage on the enemy armada. The battle is now studied at the Naval Academy as a model of asymmetric defence.',
        },
      },
      {
        title: { fr: 'Commandement & doctrine actuelle', en: 'Command & Current Doctrine' },
        content: {
          fr: "Nommé Amiral de la Flotte en 2948, Bishop a entrepris une refonte profonde de la doctrine navale de l'UEE. Son approche repose sur la flexibilité plutôt que la puissance brute : flottes modulaires, renseignement en temps réel et coordination accrue avec les pilotes indépendants pour les opérations de reconnaissance. Il est également l'architecte du programme de défense avancée des systèmes frontaliers, dont la mise en œuvre se heurte à des contraintes budgétaires permanentes.",
          en: 'Appointed Fleet Admiral in 2948, Bishop has undertaken a deep revision of UEE naval doctrine. His approach prioritises flexibility over raw power: modular fleets, real-time intelligence, and increased coordination with independent pilots for reconnaissance operations. He is also the architect of the advanced defence programme for frontier systems, whose implementation faces persistent budget constraints.',
        },
      },
    ],
  },

  {
    id: 9,
    slug: 'xian-shah',
    name: 'Xian Shah',
    title: { fr: "Impératrice Xi'An", en: "Xi'An Empress" },
    affiliation: { fr: "Empire Xi'An", en: "Xi'An Empire" },
    species: "xi'an",
    status: 'alive',
    description: {
      fr: "Dirigeante suprême de l'Empire Xi'An, dont la longévité exceptionnelle et la sagesse légendaire en font une figure centrale de la diplomatie galactique.",
      en: "Supreme ruler of the Xi'An Empire, whose exceptional longevity and legendary wisdom make her a central figure in galactic diplomacy.",
    },
    biography: [
      {
        title: { fr: "La Dirigeante Immortelle", en: 'The Immortal Ruler' },
        content: {
          fr: "Par les standards humains, Xian Shah gouverne depuis une éternité : son règne s'étend sur plusieurs siècles, rendu possible par la longévité naturelle des Xi'An et les techniques médicales avancées de son empire. Elle a vu naître et mourir des dizaines de générations humaines, des premières colonies à l'ère actuelle. Cette perspective temporelle unique façonne sa vision géopolitique : là où les dirigeants humains pensent en mandats, elle pense en générations.",
          en: "By human standards, Xian Shah has ruled for an eternity: her reign spans several centuries, made possible by the natural longevity of the Xi'An and the advanced medical techniques of her empire. She has seen dozens of human generations born and die, from the first colonies to the current era. This unique temporal perspective shapes her geopolitical vision: where human leaders think in terms of mandates, she thinks in generations.",
        },
      },
      {
        title: { fr: "Relations avec l'UEE", en: 'Relations with the UEE' },
        content: {
          fr: "L'attitude de Xian Shah envers l'UEE est celle d'une observation prudente et distante. Elle a survécu à la Dynastique Messer — qu'elle jugeait prévisiblement instable — et navigué avec habileté les turbulences de la transition démocratique. Les accords commerciaux Xi'An-UEE, renégociés sous son autorité directe, sont parmi les plus complexes et les plus profitables de l'histoire galactique. Ses ambassadeurs sont réputés pour leur précision linguistique et leur mémoire infaillible des précédents diplomatiques.",
          en: "Xian Shah's attitude towards the UEE is one of cautious, distant observation. She survived the Messer dynasty — which she judged predictably unstable — and navigated the turbulence of the democratic transition with skill. The Xi'An-UEE trade agreements, renegotiated under her direct authority, are among the most complex and profitable in galactic history. Her ambassadors are renowned for their linguistic precision and infallible memory of diplomatic precedents.",
        },
      },
    ],
  },

  {
    id: 10,
    slug: 'mahdi-al-rashid',
    name: 'Dr. Mahdi Al-Rashid',
    title: { fr: 'Xéno-archéologue & Explorateur', en: 'Xenoarchaeologist & Explorer' },
    affiliation: { fr: "Université d'Apollon", en: 'University of Apollo' },
    species: 'human',
    status: 'alive',
    description: {
      fr: "Éminent xéno-archéologue spécialisé dans les civilisations disparues. Ses découvertes de reliques Antiques ont révolutionné la compréhension de l'histoire galactique.",
      en: 'Prominent xenoarchaeologist specialising in vanished civilisations. His discoveries of Ancient relics have revolutionised understanding of galactic history.',
    },
    biography: [
      {
        title: { fr: 'Formation & vocation', en: 'Education & Vocation' },
        content: {
          fr: "Mahdi Al-Rashid grandit sur Microtech, fils d'un ingénieur et d'une linguiste. C'est lors d'une excursion scolaire dans les musées de New Babbage qu'il vit pour la première fois un fragment de relique Antique — et décida sur-le-champ de consacrer sa vie à comprendre les civilisations disparues. Il obtint son doctorat en xéno-archéologie à l'Université d'Apollon avec une thèse remarquée sur les structures de communication Antiques, avant de rejoindre le corps enseignant.",
          en: 'Mahdi Al-Rashid grew up on Microtech, son of an engineer and a linguist. It was during a school trip to the museums of New Babbage that he first saw a fragment of an Ancient relic — and decided on the spot to devote his life to understanding vanished civilisations. He earned his doctorate in xenoarchaeology at the University of Apollo with a noted thesis on Ancient communication structures, before joining the faculty.',
        },
      },
      {
        title: { fr: 'Les Ancients & leurs reliques', en: 'The Ancients & Their Relics' },
        content: {
          fr: "Al-Rashid est à l'origine de la découverte du site de Tal III, considéré comme le plus grand gisement de reliques Antiques jamais mis au jour. L'analyse de ces artefacts a permis de repousser l'estimation de l'âge de la civilisation Antique de plusieurs millénaires et de valider l'hypothèse d'une présence dans des systèmes considérés jusqu'alors comme vierges d'histoire. Ses conclusions, controversées à leur publication, font aujourd'hui consensus dans la communauté scientifique.",
          en: 'Al-Rashid is responsible for the discovery of the Tal III site, considered the largest deposit of Ancient relics ever unearthed. Analysis of these artefacts pushed back the estimated age of Ancient civilisation by several millennia and validated the hypothesis of a presence in systems previously considered historically untouched. His conclusions, controversial at publication, are now consensus in the scientific community.',
        },
      },
      {
        title: { fr: 'Recherches actuelles', en: 'Current Research' },
        content: {
          fr: "Al-Rashid dirige actuellement une expédition dans les systèmes non cartographiés au-delà du Nuage de Virginie, où des anomalies gravitationnelles suggèrent la présence de structures artificielles. Il voyage fréquemment avec une escorte d'un ou deux pilotes indépendants qu'il rémunère en accès à ses données de navigation — un arrangement pragmatique dans des zones où la marine de l'UEE est absente. Ses dernières communications signalaient une découverte « susceptible de remettre en question tout ce que nous croyons savoir sur la colonisation de la galaxie ».",
          en: 'Al-Rashid currently leads an expedition into unmapped systems beyond the Virginia Cloud, where gravitational anomalies suggest the presence of artificial structures. He frequently travels with an escort of one or two independent pilots whom he pays with access to his navigation data — a pragmatic arrangement in zones where the UEE navy is absent. His latest communications reported a discovery "likely to call into question everything we believe about the colonisation of the galaxy".',
        },
      },
    ],
    family: [
      { name: 'Youssef Al-Rashid',      relation: 'father', status: 'deceased' },
      { name: 'Celine Dumont Al-Rashid', relation: 'mother', status: 'alive' },
    ],
  },

  {
    id: 11,
    slug: 'chadwick-harper',
    name: 'Chadwick "Nine Tails" Harper',
    title: { fr: 'Chef de la Faction Nine Tails', en: 'Nine Tails Faction Leader' },
    affiliation: { fr: 'Nine Tails', en: 'Nine Tails' },
    species: 'human',
    status: 'unknown',
    description: {
      fr: "Ancien pilote UEE reconverti en chef de gang, il a transformé Nine Tails en une force paramilitaire redoutable opérant dans le système Stanton.",
      en: 'Former UEE pilot turned gang leader, he transformed Nine Tails into a formidable paramilitary force operating in the Stanton system.',
    },
    biography: [
      {
        title: { fr: 'Service UEE & désillusion', en: 'UEE Service & Disillusionment' },
        content: {
          fr: "Chadwick Harper servit dix ans dans la marine de l'UEE comme pilote de combat, accumulant un palmarès impressionnant et plusieurs décorations. Sa rupture avec l'institution fut progressive : d'abord des désaccords sur les méthodes employées contre les civils lors d'opérations de pacification, puis une procédure disciplinaire qu'il vécut comme une trahison après avoir dénoncé des exactions de sa chaîne de commandement. Il déserta en 2937, emportant un chasseur militaire.",
          en: 'Chadwick Harper served ten years in the UEE navy as a combat pilot, accumulating an impressive record and several decorations. His break with the institution was gradual: first disagreements over methods used against civilians during pacification operations, then a disciplinary procedure he experienced as a betrayal after reporting abuses in his chain of command. He deserted in 2937, taking a military fighter with him.',
        },
      },
      {
        title: { fr: 'La naissance d\'un chef', en: 'Birth of a Leader' },
        content: {
          fr: "Dans les zones non sécurisées de Stanton, Harper rejoignit les Nine Tails alors simple bande de pirates désorganisée. En trois ans, il en devint le chef incontesté, apportant une discipline militaire et une organisation structurée à un groupe jusqu'alors chaotique. Sous sa direction, Nine Tails passa des attaques opportunistes à des opérations planifiées ciblant les infrastructures corporatives et les convois de l'UEE — avec une règle stricte : pas de civils non armés.",
          en: "In the unsecured zones of Stanton, Harper joined Nine Tails when it was still a simple, disorganised pirate gang. Within three years he became its undisputed leader, bringing military discipline and structured organisation to a previously chaotic group. Under his leadership, Nine Tails moved from opportunistic attacks to planned operations targeting corporate infrastructure and UEE convoys — with one strict rule: no unarmed civilians.",
        },
      },
      {
        title: { fr: 'Nine Tails aujourd\'hui', en: 'Nine Tails Today' },
        content: {
          fr: "L'Advocacy place Chadwick Harper en tête de sa liste des criminels les plus recherchés depuis 2942. Son paradoxe est bien connu : les populations des stations de Stanton le craignent autant qu'elles le respectent secrètement pour ses attaques contre des corporations jugées prédatrices. Son statut actuel — mort, en clandestinité ou toujours aux commandes — fait l'objet de spéculations intenses dans les réseaux de renseignement.",
          en: "The Advocacy has placed Chadwick Harper at the top of its most-wanted list since 2942. His paradox is well known: the populations of Stanton's stations fear him as much as they secretly respect him for his attacks on corporations seen as predatory. His current status — dead, in hiding, or still in command — is the subject of intense speculation in intelligence networks.",
        },
      },
    ],
  },

  {
    id: 12,
    slug: 'laylah-ngo',
    name: 'Laylah Ngo',
    title: { fr: 'PDG de Shubin Interstellar', en: 'CEO of Shubin Interstellar' },
    affiliation: { fr: 'Shubin Interstellar', en: 'Shubin Interstellar' },
    species: 'human',
    status: 'alive',
    companySlug: 'shubin-interstellar',
    description: {
      fr: "Dirigeante impitoyable de Shubin Interstellar. Connue pour ses méthodes agressives d'expansion et ses relations controversées avec les gouvernements locaux.",
      en: 'Ruthless leader of Shubin Interstellar. Known for aggressive expansion tactics and controversial relationships with local governments.',
    },
    biography: [
      {
        title: { fr: 'Ascension corporative', en: 'Corporate Rise' },
        content: {
          fr: "Laylah Ngo gravit les échelons de Shubin Interstellar depuis un poste d'analyste financière jusqu'au sommet en vingt ans. Sa méthode : identifier les inefficacités opérationnelles, les résoudre sans ménagement et s'attribuer les résultats. Elle fut nommée PDG en 2941 après avoir dirigé la fusion hostile de trois concurrents miniers qui doubla la capacité d'extraction du groupe. Ses anciens collègues la décrivent comme brillante, froide et absolument imperméable aux considérations affectives.",
          en: 'Laylah Ngo climbed the ranks of Shubin Interstellar from financial analyst to the top in twenty years. Her method: identify operational inefficiencies, resolve them without mercy, and claim the results. She was named CEO in 2941 after leading the hostile merger of three mining competitors that doubled the group\'s extraction capacity. Former colleagues describe her as brilliant, cold, and absolutely impervious to emotional considerations.',
        },
      },
      {
        title: { fr: "Stratégie d'expansion", en: 'Expansion Strategy' },
        content: {
          fr: "Sous sa direction, Shubin a étendu ses opérations à sept nouveaux systèmes, souvent au prix de conflits avec des communautés minières indépendantes qui se voient imposer des conditions défavorables ou rachetées de force. Ngo a développé une stratégie de lobbying agressif auprès des régulateurs de l'UEE, obtenant des exemptions fiscales et des licences d'exploitation exclusives dans plusieurs zones disputées. Ses méthodes font l'objet d'enquêtes parlementaires récurrentes, jusqu'ici sans conséquences judiciaires.",
          en: "Under her leadership, Shubin has expanded operations to seven new systems, often at the cost of conflicts with independent mining communities forced into unfavourable terms or hostile buyouts. Ngo has developed an aggressive lobbying strategy targeting UEE regulators, securing tax exemptions and exclusive operating licences in several disputed zones. Her methods are the subject of recurring parliamentary inquiries, so far without legal consequences.",
        },
      },
    ],
  },

  {
    id: 13,
    slug: 'silas-koerner',
    name: 'Silas Koerner',
    title: { fr: "PDG d'ArcCorp", en: 'CEO of ArcCorp' },
    affiliation: { fr: 'ArcCorp', en: 'ArcCorp' },
    species: 'human',
    status: 'alive',
    companySlug: 'arccorp',
    description: {
      fr: "Directeur général d'ArcCorp, la méga-corporation dont l'influence s'étend sur la planète entière d'Ariel dans le système Stanton.",
      en: "Chief Executive of ArcCorp, the mega-corporation whose influence spans the entire planet of Ariel in the Stanton system.",
    },
    biography: [
      {
        title: { fr: 'Ingénieur devenu visionnaire', en: 'Engineer Turned Visionary' },
        content: {
          fr: "Koerner commença sa carrière comme ingénieur en systèmes industriels, spécialisé dans l'optimisation des chaînes de production en microgravité. Son premier brevet — un système de tri automatique de minerais en orbite — lui rapporta assez pour créer sa propre entreprise, rachetée par ArcCorp dix ans plus tard. Plutôt que l'argent, il négocia un siège au conseil d'administration et le poste de directeur technique. Son ascension vers le poste de PDG fut inéluctable.",
          en: 'Koerner began his career as an industrial systems engineer, specialising in optimising production chains in microgravity. His first patent — an automated ore-sorting system in orbit — earned him enough to start his own company, bought out by ArcCorp ten years later. Rather than money, he negotiated a board seat and the position of CTO. His ascent to CEO was inevitable.',
        },
      },
      {
        title: { fr: 'ArcCorp sous Koerner', en: 'ArcCorp Under Koerner' },
        content: {
          fr: "Koerner a transformé ArcCorp d'un conglomérat industriel classique en une entité quasi-étatique. Ariel, sous son administration, est devenu un exemple controversé d'urbanisation planétaire totale : chaque mètre carré de la surface est couvert de structures industrielles ou résidentielles, au détriment irréversible de tout écosystème naturel. Il défend ce choix comme une nécessité économique et un modèle d'efficacité, tandis que ses détracteurs dénoncent un précédent écologique catastrophique.",
          en: 'Koerner transformed ArcCorp from a classic industrial conglomerate into a quasi-state entity. Ariel, under his administration, became a controversial example of total planetary urbanisation: every square metre of surface is covered by industrial or residential structures, at irreversible cost to any natural ecosystem. He defends this choice as economic necessity and a model of efficiency, while detractors denounce it as a catastrophic ecological precedent.',
        },
      },
    ],
  },

  {
    id: 14,
    slug: 'crusader-montoya',
    name: 'Crusader Montoya',
    title: { fr: 'Gouverneur de Crusader Industries', en: 'Governor of Crusader Industries' },
    affiliation: { fr: 'Crusader Industries', en: 'Crusader Industries' },
    species: 'human',
    status: 'alive',
    companySlug: 'crusader-industries',
    description: {
      fr: "Responsable des opérations de Crusader Industries sur Orison. Montoya gère les relations complexes entre la corporation, les habitants permanents et les autorités de l'UEE.",
      en: "Head of Crusader Industries' operations on Orison. Montoya manages the complex relationships between the corporation, permanent residents, and UEE authorities.",
    },
    biography: [
      {
        title: { fr: 'Un administrateur entre deux mondes', en: 'An Administrator Between Two Worlds' },
        content: {
          fr: "Montoya fut nommé Gouverneur d'Orison après une longue carrière dans l'administration coloniale de l'UEE, où il s'était distingué par sa capacité à résoudre des conflits entre intérêts corporatifs et communautés locales. Crusader Industries le choisit précisément pour ce profil : Orison est peuplée d'une communauté de résidents permanents vivant sur les plateformes flottantes depuis des générations, et leur adhésion aux projets industriels de la corporation n'est pas acquise.",
          en: 'Montoya was appointed Governor of Orison after a long career in UEE colonial administration, where he had distinguished himself by resolving conflicts between corporate interests and local communities. Crusader Industries chose him precisely for this profile: Orison is home to a community of permanent residents who have lived on the floating platforms for generations, and their buy-in to the corporation\'s industrial projects is not guaranteed.',
        },
      },
      {
        title: { fr: "Administration d'Orison & tensions", en: 'Administering Orison & Tensions' },
        content: {
          fr: "Son mandat est marqué par une tension permanente entre les impératifs de production de Crusader et les revendications de la communauté d'Orison : droits de propriété sur les plateformes historiques, accès aux ressources médicales, participation aux décisions urbanistiques. Montoya a instauré une instance de concertation mensuelle avec les représentants des résidents — innovation jugée insuffisante par certains, mais réelle par d'autres. Sa gestion de la crise de 2949, lors d'une tentative d'expulsion forcée d'un quartier résidentiel historique, est étudiée dans les écoles de gestion comme exemple de désescalade réussie.",
          en: "His tenure is marked by constant tension between Crusader's production imperatives and the demands of the Orison community: property rights over historic platforms, access to medical resources, and participation in urban planning decisions. Montoya established a monthly consultation body with resident representatives — an innovation deemed insufficient by some, but genuine by others. His handling of the 2949 crisis, during a forced eviction attempt of a historic residential district, is studied in management schools as an example of successful de-escalation.",
        },
      },
    ],
  },

  {
    id: 15,
    slug: 'warlord-tsuulo',
    name: 'Warlord Tsuulo',
    title: { fr: 'Seigneur de Guerre Vanduul', en: 'Vanduul Warlord' },
    affiliation: { fr: 'Vanduul', en: 'Vanduul' },
    species: 'vanduul',
    status: 'unknown',
    description: {
      fr: "L'un des plus redoutés des chefs de clans Vanduul. Ses tactiques de raid imprévisibles ont ravagé plusieurs systèmes frontaliers de l'UEE.",
      en: 'One of the most feared Vanduul clan chiefs. His unpredictable raid tactics have ravaged several UEE frontier systems.',
    },
    biography: [
      {
        title: { fr: "L'Armada de Tsuulo", en: "Tsuulo's Armada" },
        content: {
          fr: "Ce qui distingue Tsuulo des autres chefs de clan Vanduul est la taille et la cohésion de son armada. Là où la plupart des clans opèrent en groupes de quelques dizaines de vaisseaux, Tsuulo commande une flotte de plusieurs centaines d'unités, construite au fil de décennies par absorption de clans vaincus. Sa capacité à maintenir cette coalition — chose rare chez des Vanduul habitués à l'autonomie du clan — suggère une autorité charismatique ou une brutalité particulièrement efficace, probablement les deux.",
          en: "What distinguishes Tsuulo from other Vanduul clan chiefs is the size and cohesion of his armada. Where most clans operate in groups of a few dozen ships, Tsuulo commands a fleet of several hundred units, built over decades by absorbing defeated clans. His ability to maintain this coalition — rare among Vanduul accustomed to clan autonomy — suggests either charismatic authority or particularly effective brutality, probably both.",
        },
      },
      {
        title: { fr: 'Tactiques & menace pour l\'UEE', en: "Tactics & Threat to the UEE" },
        content: {
          fr: "Les analystes militaires de l'UEE ont identifié dans les raids de Tsuulo une sophistication tactique inhabituelle pour les Vanduul : utilisation de leurres, frappes simultanées sur plusieurs points d'entrée et retraites calculées pour attirer les poursuivants dans des embuscades. Son identité précise et sa localisation restent inconnues — plusieurs « Tsuulo » capturés ou tués se sont avérés être des leurres ou des imposteurs. L'Amiral Bishop le considère comme la menace Vanduul individuelle la plus dangereuse depuis une décennie.",
          en: "UEE military analysts have identified in Tsuulo's raids a tactical sophistication unusual for the Vanduul: use of decoys, simultaneous strikes on multiple entry points, and calculated retreats to draw pursuers into ambushes. His precise identity and location remain unknown — several 'Tsuulos' captured or killed have turned out to be decoys or impostors. Admiral Bishop considers him the most dangerous individual Vanduul threat in a decade.",
        },
      },
    ],
  },

  {
    id: 16,
    slug: 'kellar-the-untamed',
    name: 'Kellar the Untamed',
    title: { fr: 'Champion Vanduul', en: 'Vanduul Champion' },
    affiliation: { fr: 'Vanduul', en: 'Vanduul' },
    species: 'vanduul',
    status: 'alive',
    description: {
      fr: "Guerrier d'élite Vanduul dont les exploits au combat ont acquis une réputation légendaire. Son identifiant de vaisseau est redouté dans toute la flotte UEE.",
      en: "Elite Vanduul warrior whose combat exploits have earned a legendary reputation. His ship identifier is feared throughout the UEE fleet.",
    },
    biography: [
      {
        title: { fr: 'Le Guerrier de Légende', en: 'The Legendary Warrior' },
        content: {
          fr: "Kellar est l'un des rares Vanduul dont le nom soit connu des humains — non par sa propre volonté, mais parce que les survivants de ses attaques en ont parlé. Son vaisseau, reconnaissable à des marquages tribaux peints en rouge sang sur sa coque, est apparu dans au moins dix-sept engagements confirmés où il a systématiquement détruit l'ensemble de la résistance adverse. Son style de combat — agressif, direct, sans tactique défensive apparente — force une admiration mêlée de terreur chez les pilotes UEE qui l'ont affronté et survécu.",
          en: "Kellar is one of the few Vanduul whose name is known to humans — not by his own will, but because survivors of his attacks have spoken of him. His ship, recognisable by tribal markings painted in blood-red on its hull, has appeared in at least seventeen confirmed engagements where he systematically destroyed all opposing resistance. His combat style — aggressive, direct, with no apparent defensive tactics — forces a mixture of admiration and terror in the UEE pilots who have faced him and survived.",
        },
      },
      {
        title: { fr: "Confrontations avec l'UEE", en: 'Confrontations with the UEE' },
        content: {
          fr: "L'Advocacy et la marine de l'UEE ont placé Kellar sur leur liste de cibles prioritaires après l'attaque du convoi de Saisei en 2948, où il détruisit seul sept vaisseaux d'escorte en moins de douze minutes. Deux tentatives d'assassinat planifiées ont échoué — dans les deux cas, les équipes envoyées ne sont pas revenues. Une prime de cinquante millions d'aUEC est offerte pour sa capture ou la confirmation de sa mort. À ce jour, personne n'a réclamé cette prime.",
          en: "The Advocacy and UEE navy placed Kellar on their priority target list after the attack on the Saisei convoy in 2948, where he single-handedly destroyed seven escort ships in under twelve minutes. Two planned assassination attempts have failed — in both cases the teams sent did not return. A bounty of fifty million aUEC is offered for his capture or confirmed death. To date, no one has claimed it.",
        },
      },
    ],
  },
];
