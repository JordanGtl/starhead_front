export interface ShipTimelineEvent {
  date: string;
  label: string;
}

export const shipTimelines: Record<string, ShipTimelineEvent[]> = {
  // 1: Aurora MR — RSI
  "1": [
    { date: "2075", label: "RSI pose les bases de la conception d'un vaisseau d'entrée de gamme" },
    { date: "2800", label: "Lancement de la gamme Aurora pour démocratiser le vol spatial" },
    { date: "2947", label: "Révision majeure du châssis — Aurora MR modernisée" },
    { date: "2950", label: "Support pour composants Grade A aftermarket ajouté" },
  ],
  // 2: Avenger Titan — Aegis
  "2": [
    { date: "2750", label: "Aegis développe l'Avenger comme vaisseau de patrouille pour l'Advocacy" },
    { date: "2870", label: "L'Avenger entre en service dans les forces de l'ordre de l'UEE" },
    { date: "2920", label: "Version civile Titan avec soute cargo mise sur le marché" },
    { date: "2948", label: "Rework complet — nouvel intérieur et cockpit redessiné" },
  ],
  // 3: Gladius — Aegis
  "3": [
    { date: "2691", label: "Aegis Dynamics reçoit le contrat pour un chasseur léger" },
    { date: "2700", label: "Le Gladius entre en service actif dans l'UEE Navy" },
    { date: "2942", label: "Surplus militaires vendus aux civils" },
    { date: "2950", label: "Reste le chasseur léger le plus utilisé de l'UEE" },
  ],
  // 4: Cutlass Black — Drake
  "4": [
    { date: "2811", label: "Jan Drake fonde Drake Interplanetary" },
    { date: "2820", label: "Le Cutlass Black est le premier vaisseau Drake" },
    { date: "2940", label: "Réputation établie auprès des pirates malgré les dénégations de Drake" },
    { date: "2948", label: "Rework complet — soute agrandie et tourelle améliorée" },
  ],
  // 5: Freelancer — MISC
  "5": [
    { date: "2805", label: "MISC lance le Freelancer pour les indépendants" },
    { date: "2850", label: "Intégration de technologie Xi'an dans les propulseurs" },
    { date: "2940", label: "Variantes DUR, MAX et MIS disponibles" },
    { date: "2949", label: "Cockpit redessiné avec meilleure visibilité" },
  ],
  // 6: Constellation Andromeda — RSI
  "6": [
    { date: "2862", label: "RSI annonce la gamme Constellation" },
    { date: "2880", label: "Constellation Andromeda entre en production de masse" },
    { date: "2942", label: "Partenariat Kruger — le Merlin est intégré comme snub" },
    { date: "2949", label: "Refonte intérieure et amélioration du cockpit" },
    { date: "2951", label: "Nouveau système de missiles guidés" },
  ],
  // 7: Hammerhead — Aegis
  "7": [
    { date: "2800", label: "Aegis conçoit le Hammerhead comme corvette anti-chasseurs" },
    { date: "2940", label: "Premier déploiement dans les milices frontalières" },
    { date: "2946", label: "Adopté comme vaisseau de défense principal par de nombreuses orgs" },
    { date: "2951", label: "Tourelles améliorées avec tracking assisté par IA" },
  ],
  // 8: Carrack — Anvil
  "8": [
    { date: "2850", label: "Anvil commence le développement du Carrack" },
    { date: "2870", label: "Le Carrack devient le vaisseau d'exploration de référence de l'UEE Navy" },
    { date: "2949", label: "Version civile lancée — bay médicale et rover intégrés" },
    { date: "2951", label: "Capacités de cartographie Jump Point confirmées" },
  ],
  // 9: Prospector — MISC
  "9": [
    { date: "2890", label: "MISC commence le développement d'un vaisseau minier solo" },
    { date: "2940", label: "Le Prospector entre en production — succès auprès des mineurs indépendants" },
    { date: "2948", label: "Bras articulé de minage amélioré avec précision accrue" },
    { date: "2951", label: "Intégration de nouveaux modules de raffinage embarqués" },
  ],
  // 10: Reclaimer — Aegis
  "10": [
    { date: "2860", label: "Aegis développe le Reclaimer pour les opérations de récupération" },
    { date: "2900", label: "Le Reclaimer devient le standard de l'industrie de la récupération" },
    { date: "2947", label: "Pince de récupération massive améliorée" },
    { date: "2951", label: "Systèmes de traitement des débris optimisés" },
  ],
  // 11: Starfarer Gemini — MISC
  "11": [
    { date: "2870", label: "MISC développe le Starfarer pour le ravitaillement" },
    { date: "2900", label: "L'UEE adopte le Starfarer Gemini comme variante militaire" },
    { date: "2940", label: "Blindage renforcé pour les zones de conflit" },
    { date: "2947", label: "Reste le seul vaisseau de ravitaillement en service actif" },
  ],
  // 12: Vanguard Warden — Aegis
  "12": [
    { date: "2750", label: "Aegis développe le Vanguard pour les patrouilles longue distance" },
    { date: "2790", label: "Déployé massivement pendant la Guerre Froide Xi'an" },
    { date: "2940", label: "Variantes Sentinel, Harbinger et Hoplite disponibles" },
    { date: "2949", label: "Rework intérieur et refonte des systèmes BUK" },
  ],
  // 13: Mercury Star Runner — Crusader
  "13": [
    { date: "2940", label: "Crusader Industries dévoile le Mercury Star Runner" },
    { date: "2948", label: "Tests de prototype — vitesse record pour sa catégorie" },
    { date: "2951", label: "Flight Ready — succès commercial immédiat" },
    { date: "2952", label: "Salle de données sécurisée mise à jour" },
  ],
  // 14: 890 Jump — Origin
  "14": [
    { date: "2910", label: "Origin annonce le 890 Jump comme yacht spatial ultime" },
    { date: "2930", label: "Production limitée — liste d'attente de plusieurs années" },
    { date: "2945", label: "Hangar intégré pour le 85X confirmé" },
    { date: "2949", label: "Le vaisseau de luxe le plus cher du marché civil" },
  ],
  // 15: Sabre — Aegis
  "15": [
    { date: "2870", label: "Projet secret Aegis pour un chasseur stealth" },
    { date: "2940", label: "Le Sabre est révélé au public — succès immédiat" },
    { date: "2948", label: "Variante Comet dévoilée pour les opérations spéciales" },
    { date: "2951", label: "Optimisations du système de réduction de signature" },
  ],
  // 16: Caterpillar — Drake
  "16": [
    { date: "2830", label: "Drake dévoile le Caterpillar comme cargo modulaire" },
    { date: "2880", label: "Les modules interchangeables en font un favori des contrebandiers" },
    { date: "2946", label: "Capacité étendue à 576 SCU" },
    { date: "2950", label: "Module de commandement détachable confirmé" },
  ],
  // 17: Arrow — Anvil
  "17": [
    { date: "2910", label: "Anvil développe l'Arrow comme intercepteur léger" },
    { date: "2940", label: "L'Arrow entre en compétition pour remplacer le Gladius" },
    { date: "2948", label: "Flight Ready — le chasseur le plus agile de sa classe" },
  ],
  // 18: Hornet F7C — Anvil
  "18": [
    { date: "2772", label: "Anvil Aerospace décroche le contrat du chasseur embarqué" },
    { date: "2780", label: "Le F7A Hornet devient l'épine dorsale de la chasse UEE" },
    { date: "2920", label: "Version civile F7C mise sur le marché" },
    { date: "2949", label: "Refonte complète — Hornet Mk II annoncé" },
  ],
  // 19: Super Hornet F7C-M — Anvil
  "19": [
    { date: "2780", label: "Variante Super Hornet F7C-M développée" },
    { date: "2930", label: "Siège arrière ajouté pour un opérateur tourelle" },
    { date: "2948", label: "Meilleur chasseur lourd de sa catégorie selon l'UEE" },
  ],
  // 20: Buccaneer — Drake
  "20": [
    { date: "2890", label: "Drake conçoit le Buccaneer comme escorteur du Caterpillar" },
    { date: "2940", label: "Mise en production — canon S4 supérieur pour sa taille" },
    { date: "2948", label: "Populaire malgré sa fragilité grâce à sa puissance de feu" },
  ],
  // 21: Cutlass Red — Drake
  "21": [
    { date: "2830", label: "Drake adapte le Cutlass pour les opérations de secours" },
    { date: "2940", label: "Le Cutlass Red entre en service comme ambulance spatiale" },
    { date: "2948", label: "Lits médicaux de niveau 2 installés en standard" },
  ],
  // 22: Cutlass Blue — Drake
  "22": [
    { date: "2835", label: "Drake développe une variante d'interdiction du Cutlass" },
    { date: "2920", label: "Le Cutlass Blue adopté par les chasseurs de primes" },
    { date: "2940", label: "Pods de prisonniers et boucliers renforcés ajoutés" },
    { date: "2948", label: "Dispositif d'interception quantum intégré" },
  ],
  // 23: Herald — Drake
  "23": [
    { date: "2850", label: "Drake conçoit le Herald pour le transfert de données" },
    { date: "2940", label: "Populaire auprès des hackers et journalistes du 'verse" },
    { date: "2947", label: "Moteurs optimisés — l'un des vaisseaux les plus rapides" },
  ],
  // 24: Vulture — Drake
  "24": [
    { date: "2920", label: "Drake développe le Vulture comme vaisseau de récupération solo" },
    { date: "2948", label: "Bras de récupération articulé finalisé" },
    { date: "2951", label: "Flight Ready — succès auprès des récupérateurs indépendants" },
  ],
  // 25: 300i — Origin
  "25": [
    { date: "2897", label: "Origin Jumpworks lance la série 300" },
    { date: "2910", label: "Le 300i établit Origin comme marque de luxe" },
    { date: "2949", label: "Refonte intérieure avec matériaux premium personnalisables" },
  ],
  // 26: 315p — Origin
  "26": [
    { date: "2900", label: "Origin dévoile le 315p comme variante pathfinder" },
    { date: "2920", label: "Ajout du faisceau tracteur en standard" },
    { date: "2949", label: "Réservoirs étendus pour une portée d'exploration supérieure" },
  ],
  // 27: 325a — Origin
  "27": [
    { date: "2905", label: "Origin lance le 325a comme variante d'interdiction" },
    { date: "2930", label: "Hardpoints améliorés pour des armes plus lourdes" },
    { date: "2949", label: "Lance-missiles intégré au nez redessiné" },
  ],
  // 28: 600i Explorer — Origin
  "28": [
    { date: "2920", label: "Origin dévoile le 600i comme vaisseau d'exploration de luxe" },
    { date: "2948", label: "Modules touring et exploration disponibles" },
    { date: "2952", label: "Gold Standard — refonte complète de l'intérieur" },
  ],
  // 29: 100i — Origin
  "29": [
    { date: "2940", label: "Origin annonce le 100i comme vaisseau starter accessible" },
    { date: "2947", label: "Moteurs à injection de carburant pour une autonomie supérieure" },
    { date: "2950", label: "Flight Ready — le luxe accessible pour les nouveaux pilotes" },
  ],
  // 30: Freelancer MAX — MISC
  "30": [
    { date: "2810", label: "MISC développe une variante cargo étendue du Freelancer" },
    { date: "2850", label: "Le MAX double la capacité cargo du Freelancer standard" },
    { date: "2948", label: "Soute élargie à 120 SCU" },
  ],
  // 31: Freelancer DUR — MISC
  "31": [
    { date: "2815", label: "MISC conçoit le DUR pour l'exploration longue distance" },
    { date: "2860", label: "Réservoirs étendus et scanners améliorés intégrés" },
    { date: "2949", label: "Autonomie inégalée dans la classe Medium" },
  ],
  // 32: Freelancer MIS — MISC
  "32": [
    { date: "2820", label: "MISC développe la variante militaire du Freelancer" },
    { date: "2870", label: "Production limitée — racks de missiles massifs" },
    { date: "2948", label: "Le MIS reste le missile boat le plus redouté de sa classe" },
  ],
  // 33: Hull A — MISC
  "33": [
    { date: "2890", label: "MISC commence le programme Hull" },
    { date: "2920", label: "Le Hull A entre en production — spindles cargo extérieurs" },
    { date: "2950", label: "Flight Ready — porte d'entrée vers la série Hull" },
  ],
  // 34: Hull C — MISC
  "34": [
    { date: "2890", label: "MISC conçoit le Hull C comme cargo interstellaire massif" },
    { date: "2910", label: "Le Hull C devient le pilier du commerce UEE" },
    { date: "2950", label: "4608 SCU de capacité — le plus gros cargo standard" },
  ],
  // 35: Razor — MISC
  "35": [
    { date: "2930", label: "MISC développe le Razor avec technologie Xi'an" },
    { date: "2940", label: "Le Razor domine les circuits de course du 'verse" },
    { date: "2948", label: "Profil ultra-fin optimisé pour la vitesse maximale" },
  ],
  // 36: Constellation Taurus — RSI
  "36": [
    { date: "2862", label: "RSI développe la variante cargo de la Constellation" },
    { date: "2890", label: "Première livraison commerciale — succès auprès des transporteurs" },
    { date: "2948", label: "Extension de la soute à 174 SCU" },
  ],
  // 37: Constellation Phoenix — RSI
  "37": [
    { date: "2862", label: "La Constellation Phoenix est conçue comme vaisseau VIP" },
    { date: "2900", label: "Production limitée — seulement 500 exemplaires par an" },
    { date: "2945", label: "Intérieur redessiné par des designers de Terra" },
    { date: "2948", label: "P-72 Archimedes remplace le Merlin comme snub" },
  ],
  // 38: Mantis — RSI
  "38": [
    { date: "2930", label: "RSI développe un vaisseau spécialisé en interdiction quantum" },
    { date: "2945", label: "Le Quantum Enforcement Device breveté par RSI" },
    { date: "2949", label: "Flight Ready — adopté par les chasseurs de primes et l'Advocacy" },
  ],
  // 39: Pisces C8X — Anvil
  "39": [
    { date: "2850", label: "Anvil conçoit un shuttle d'exploration pour le Carrack" },
    { date: "2940", label: "Version C8X militaire avec hardpoints supplémentaires" },
    { date: "2949", label: "Disponible séparément — populaire comme micro-vaisseau" },
  ],
  // 40: Valkyrie — Anvil
  "40": [
    { date: "2920", label: "Anvil développe la Valkyrie comme dropship" },
    { date: "2946", label: "Adoptée par les Marines de l'UEE" },
    { date: "2949", label: "Version civile avec soute modulable et bay véhicule" },
  ],
  // 41: Eclipse — Aegis
  "41": [
    { date: "2880", label: "Aegis conçoit l'Eclipse comme bombardier stealth" },
    { date: "2945", label: "Utilisé lors de raids contre les Vanduul" },
    { date: "2948", label: "Version civile avec trois torpilles S9" },
  ],
  // 42: Retaliator — Aegis
  "42": [
    { date: "2780", label: "Aegis lance le programme de bombardier Retaliator" },
    { date: "2795", label: "Déploiement massif pendant les conflits Vanduul" },
    { date: "2940", label: "Modules civils (cargo, habitat) disponibles" },
    { date: "2949", label: "Refonte Gold Standard avec nouveau cockpit" },
  ],
  // 43: Vanguard Sentinel — Aegis
  "43": [
    { date: "2760", label: "Aegis développe une variante EW du Vanguard" },
    { date: "2800", label: "Le Sentinel entre en service avec dispositif EMP" },
    { date: "2940", label: "Suite de guerre électronique améliorée" },
    { date: "2949", label: "Rework intérieur aligné avec le Warden" },
  ],
  // 44: Vanguard Harbinger — Aegis
  "44": [
    { date: "2760", label: "Aegis convertit le Vanguard en bombardier d'assaut" },
    { date: "2810", label: "Le Harbinger entre en service — torpilles intégrées" },
    { date: "2940", label: "Trois torpilles S5 en baie interne" },
    { date: "2949", label: "Systèmes BUK modulaires finalisés" },
  ],
  // 45: Ares Ion — Crusader
  "45": [
    { date: "2946", label: "Crusader dévoile l'Ares Starfighter" },
    { date: "2950", label: "L'Ion entre en production — canon laser S7 dévastateur" },
    { date: "2952", label: "Ajustements d'équilibre après retours des pilotes" },
  ],
  // 46: Ares Inferno — Crusader
  "46": [
    { date: "2946", label: "Crusader annonce la variante balistique de l'Ares" },
    { date: "2950", label: "L'Inferno entre en production — gatling S7 terrifiante" },
    { date: "2952", label: "Son caractéristique devient iconique dans le 'verse" },
  ],
  // 47: C2 Hercules — Crusader
  "47": [
    { date: "2940", label: "Crusader annonce la gamme Hercules" },
    { date: "2948", label: "Le C2 entre en production — transport lourd civil" },
    { date: "2951", label: "Flight Ready — bay véhicules opérationnelle" },
  ],
  // 48: M2 Hercules — Crusader
  "48": [
    { date: "2942", label: "Crusader développe la variante militaire du Hercules" },
    { date: "2948", label: "Le M2 entre en production — blindage renforcé" },
    { date: "2951", label: "Adopté par les milices pour le transport en zone hostile" },
  ],
  // 49: A2 Hercules — Crusader
  "49": [
    { date: "2944", label: "Crusader dévoile l'A2 — la variante gunship" },
    { date: "2949", label: "MOAB intégrée — capacité de bombardement au sol" },
    { date: "2951", label: "Flight Ready — l'arme de destruction massive volante" },
  ],
  // 50: Nomad — Consolidated Outland
  "50": [
    { date: "2940", label: "Consolidated Outland annonce le Nomad" },
    { date: "2948", label: "Plateforme cargo externe unique brevetée" },
    { date: "2950", label: "Flight Ready — starter polyvalent pour les solitaires" },
  ],
  // 51: Mustang Alpha — Consolidated Outland
  "51": [
    { date: "2920", label: "Silas Koerner dévoile le Mustang Alpha" },
    { date: "2935", label: "Succès commercial — rival direct de l'Aurora" },
    { date: "2948", label: "Rework visuel et amélioration de la maniabilité" },
  ],
  // 52: Mustang Delta — Consolidated Outland
  "52": [
    { date: "2925", label: "Consolidated Outland développe une variante combat du Mustang" },
    { date: "2940", label: "Pods de roquettes ajoutés — le Delta devient un chasseur redoutable" },
    { date: "2948", label: "Populaire auprès des milices frontalières" },
  ],
  // 53: MOLE — Argo
  "53": [
    { date: "2920", label: "Argo Astronautics conçoit un vaisseau minier multi-équipage" },
    { date: "2940", label: "Le MOLE entre en production — trois tourelles de minage" },
    { date: "2949", label: "Flight Ready — efficacité minière inégalée en groupe" },
  ],
  // 54: RAFT — Argo
  "54": [
    { date: "2940", label: "Argo développe le RAFT pour le transport de conteneurs" },
    { date: "2950", label: "Système de conteneurs standardisé 32-SCU" },
    { date: "2951", label: "Flight Ready — chargement/déchargement rapide en station" },
  ],
  // 55: Prowler — Esperia
  "55": [
    { date: "2873", label: "Esperia fondée pour reproduire des vaisseaux aliens" },
    { date: "2920", label: "Le Prowler (réplique Tevarin) entre en développement" },
    { date: "2945", label: "Technologie de déploiement par lentille gravitationnelle" },
    { date: "2949", label: "Flight Ready — dropship stealth opérationnel" },
  ],
  // 56: Talon — Esperia
  "56": [
    { date: "2930", label: "Esperia étudie les chasseurs légers Tevarin" },
    { date: "2948", label: "Le Talon est dévoilé — armure cristalline unique" },
    { date: "2950", label: "Flight Ready — panneaux défensifs déployables" },
  ],
  // 57: Khartu-al — Aopoa
  "57": [
    { date: "2900", label: "Aopoa exporte le Khartu-al pour le marché humain" },
    { date: "2940", label: "Premier vaisseau Xi'an vendu aux civils humains" },
    { date: "2948", label: "Ailes articulées optimisées pour le vol VTOL" },
  ],
  // 58: San'tok.yāi — Aopoa
  "58": [
    { date: "2920", label: "Aopoa développe un chasseur medium Xi'an" },
    { date: "2945", label: "Le San'tok.yāi dévoilé lors d'un salon diplomatique" },
    { date: "2950", label: "Flight Ready — puissance de feu supérieure au Khartu-al" },
  ],
  // 59: Defender — Banu
  "59": [
    { date: "2800", label: "Les Banu conçoivent un escorteur pour le Merchantman" },
    { date: "2940", label: "Le Defender est proposé aux pilotes humains" },
    { date: "2948", label: "Canons tachyon Singe et boucliers alien intégrés" },
  ],
  // 60: Merchantman — Banu
  "60": [
    { date: "2438", label: "Premier contact Banu — observation des Merchantman" },
    { date: "2800", label: "Premiers Merchantman accessibles aux humains via échanges commerciaux" },
    { date: "2940", label: "Modèle adapté pour les pilotes humains annoncé" },
    { date: "2950", label: "En production — le plus grand vaisseau marchand du 'verse" },
  ],
  // 61: Railen — Gatac
  "61": [
    { date: "2910", label: "Gatac développe le Railen avec un design Tevarin" },
    { date: "2948", label: "Coque organique et systèmes de fret finalisés" },
    { date: "2951", label: "En production — esthétique alien unique" },
  ],
  // 62: Corsair — Drake
  "62": [
    { date: "2940", label: "Drake annonce le Corsair comme vaisseau d'exploration armé" },
    { date: "2950", label: "Tests de prototypes — plus de canons qu'un explorateur standard" },
    { date: "2952", label: "Flight Ready — populaire pour sa puissance de feu brute" },
  ],
  // 63: Vulcan — Aegis
  "63": [
    { date: "2930", label: "Aegis développe un vaisseau de support logistique" },
    { date: "2945", label: "Technologie de drones de réparation/ravitaillement brevetée" },
    { date: "2950", label: "En production — réparation, ravitaillement et réarmement" },
  ],
  // 64: Apollo Medivac — RSI
  "64": [
    { date: "2920", label: "RSI conçoit un vaisseau médical dédié" },
    { date: "2945", label: "L'Apollo dévoilé avec baies médicales modulaires" },
    { date: "2950", label: "En production — hôpital volant pour les opérations de terrain" },
  ],
  // 65: Crucible — Anvil
  "65": [
    { date: "2900", label: "Anvil développe un vaisseau de réparation dédié" },
    { date: "2940", label: "Le Crucible annoncé avec bay de réparation intégrée" },
    { date: "2950", label: "En concept — atelier de réparation volant massif" },
  ],
  // 66: Endeavor — MISC
  "66": [
    { date: "2880", label: "MISC lance le programme de vaisseau scientifique modulaire" },
    { date: "2920", label: "Système de pods détachables breveté" },
    { date: "2940", label: "Configurations biodôme, télescope et laboratoire annoncées" },
  ],
  // 67: Orion — RSI
  "67": [
    { date: "2870", label: "RSI conçoit la plateforme minière ultime" },
    { date: "2920", label: "L'Orion annoncé — faisceau de minage massif" },
    { date: "2940", label: "Raffinerie embarquée et traitement du minerai intégrés" },
  ],
  // 68: Polaris — RSI
  "68": [
    { date: "2946", label: "RSI dévoile la corvette Polaris" },
    { date: "2948", label: "Baies de torpilles et hangar pour chasseur medium confirmés" },
    { date: "2952", label: "En production — corvette de réponse rapide" },
  ],
  // 69: Idris-P — Aegis
  "69": [
    { date: "2820", label: "Aegis reçoit le contrat pour une frégate de la flotte UEE" },
    { date: "2850", label: "L'Idris entre en service dans la Navy" },
    { date: "2920", label: "Variante civile Idris-P (sans railgun) mise en vente" },
    { date: "2940", label: "Quelques exemplaires seulement en mains civiles" },
  ],
  // 70: Javelin — Aegis
  "70": [
    { date: "2800", label: "Aegis développe le destroyer Javelin pour l'UEE Navy" },
    { date: "2850", label: "Le Javelin est le fer de lance des batailles spatiales" },
    { date: "2930", label: "Destroyers décommissionnés vendus aux organisations civiles" },
    { date: "2940", label: "Le plus grand vaisseau pilotable par des joueurs — 345 mètres" },
  ],
  // 71: Scorpius — RSI
  "71": [
    { date: "2940", label: "RSI dévoile le Scorpius comme chasseur lourd bi-place" },
    { date: "2950", label: "Design twin-boom distinctif finalisé" },
    { date: "2952", label: "Flight Ready — tourelle arrière dévastatrice" },
  ],
  // 72: Hurricane — Anvil
  "72": [
    { date: "2920", label: "Anvil développe un chasseur axé sur la puissance de feu" },
    { date: "2940", label: "L'Hurricane entre en production — tourelle S4 massive" },
    { date: "2948", label: "Populaire en duo pilote-artilleur" },
  ],
  // 73: Blade — Esperia
  "73": [
    { date: "2910", label: "Esperia commence la rétro-ingénierie du chasseur Vanduul" },
    { date: "2920", label: "Le Blade est mis en vente — dynamique de vol alien" },
    { date: "2940", label: "Réservé aux pilotes les plus expérimentés" },
  ],
  // 74: Glaive — Esperia
  "74": [
    { date: "2920", label: "Esperia réplique le chasseur medium Vanduul" },
    { date: "2930", label: "Le Glaive disponible en édition extrêmement limitée" },
    { date: "2940", label: "L'un des vaisseaux les plus rares du 'verse" },
  ],
  // 75: P-72 Archimedes — Kruger
  "75": [
    { date: "2862", label: "Kruger développe un snub de luxe pour la Constellation Phoenix" },
    { date: "2940", label: "Le P-72 Archimedes lancé comme variante racing" },
    { date: "2948", label: "Populaire pour les courses courtes distances" },
  ],
  // 76: Reliant Kore — MISC
  "76": [
    { date: "2920", label: "MISC développe le Reliant avec influence Xi'an" },
    { date: "2940", label: "Ailes rotatives — concept unique dans l'industrie" },
    { date: "2948", label: "Le Kore se fait une place comme starter bi-place" },
  ],
  // 77: Reliant Tana — MISC
  "77": [
    { date: "2925", label: "MISC conçoit une variante combat du Reliant" },
    { date: "2940", label: "Le Tana entre en production — racks de missiles ajoutés" },
    { date: "2948", label: "Chasseur léger bi-place abordable" },
  ],
  // 78: Reliant Sen — MISC
  "78": [
    { date: "2925", label: "MISC développe une variante scientifique du Reliant" },
    { date: "2940", label: "Télescope et scanners avancés intégrés" },
    { date: "2948", label: "Le vaisseau de science le plus abordable du marché" },
  ],
  // 79: Reliant Mako — MISC
  "79": [
    { date: "2928", label: "MISC conçoit le Mako pour le journalisme spatial" },
    { date: "2940", label: "Équipement de diffusion et caméras intégrés" },
    { date: "2948", label: "Le véhicule de presse du 'verse" },
  ],
  // 80: Constellation Aquila — RSI
  "80": [
    { date: "2862", label: "RSI développe la variante exploration de la Constellation" },
    { date: "2910", label: "Ajout du rover Ursa en équipement standard" },
    { date: "2947", label: "Suite de scanners longue portée améliorée" },
    { date: "2949", label: "Tourelle remplacée par une suite de capteurs avancée" },
  ],
  // 81: Spirit C1 — Crusader
  "81": [
    { date: "2945", label: "Crusader annonce la gamme Spirit" },
    { date: "2950", label: "Le C1 entre en production — cargo medium élégant" },
    { date: "2952", label: "Flight Ready — performances atmosphériques remarquables" },
  ],
  // 82: Spirit E1 — Crusader
  "82": [
    { date: "2946", label: "Crusader développe la variante urgence du Spirit" },
    { date: "2950", label: "Baies médicales de premiers secours intégrées" },
    { date: "2952", label: "En production — réponse rapide aux urgences" },
  ],
  // 83: Spirit A1 — Crusader
  "83": [
    { date: "2946", label: "Crusader conçoit la variante d'attaque du Spirit" },
    { date: "2950", label: "Racks de bombes et tubes de torpilles intégrés" },
    { date: "2952", label: "En production — bombardier furtif et rapide" },
  ],
  // 84: Terrapin — Anvil
  "84": [
    { date: "2900", label: "Anvil développe un vaisseau blindé de reconnaissance" },
    { date: "2940", label: "Le Terrapin entre en production — blindage exceptionnel" },
    { date: "2948", label: "Flight Ready — survie en milieu hostile garantie" },
  ],
  // 85: Hawk — Anvil
  "85": [
    { date: "2920", label: "Anvil conçoit un chasseur spécialisé bounty hunting" },
    { date: "2940", label: "EMP intégré et pod de prisonnier ajoutés" },
    { date: "2948", label: "Flight Ready — l'outil du chasseur de primes solitaire" },
  ],
  // 86: Spartan — Argo
  "86": [
    { date: "2930", label: "Argo développe un utilitaire compact polyvalent" },
    { date: "2948", label: "Le Spartan entre en production — transport basique fiable" },
    { date: "2950", label: "Flight Ready — le cheval de travail des stations" },
  ],
};
