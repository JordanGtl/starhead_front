/**
 * Mapping statique : ship_def.id → nom du fichier image (sans extension)
 * Images servies depuis /ships/{filename}.png (Next.js public/ships/)
 */
export const SHIP_IMAGES: Record<number, string> = {
  // ── Aegis Dynamics ──────────────────────────────────────────────────────────
  1:   'avenger_stalker',
  9:   'avenger_titan',
  13:  'avenger_titan_renegade',
  18:  'avenger_warlock',
  21:  'eclipse',
  27:  'gladius',
  42:  'glafius_valiant',
  45:  'hammerhead',
  56:  'hammerhead_bis',
  57:  'idris_m',
  69:  'idris_p',
  74:  'javelin',

  // ── Anvil Aerospace ─────────────────────────────────────────────────────────
  148: 'arrow',
  156: 'asgard',
  158: 'c8',
  162: 'C8r',
  166: 'C8x',
  169: 'carrack',
  176: 'carrack_expe',
  181: 'F7A_hornet_MK2',
  183: 'F7C_hornet',
  188: 'F7C_hornet_mk2',
  189: 'F7C_hornet_wildfire',
  190: 'F7CM_super_hornet_heartseeker',
  191: 'FC7M_super_hornet_heartseeker_mk2',
  192: 'F7CM_super_hornet',
  199: 'F7CM_super_hornet_mk2',
  200: 'F7CR_hornet_tracker',
  205: 'F7CR_hornet_tracker_mk2',
  206: 'F7CS_hornet_ghost',
  211: 'FC7S-hornet_ghost_mk2',
  219: 'F8C_lightning',
  222: 'f8c_lightning_exec',
  225: 'gladiator',
  229: 'hawk',
  235: 'hurricane',
  252: 'liberator',
  275: 'liberator',
  875: 'ballista',
  879: 'balista_dunestalker',
  880: 'balista_snowblind',
  881: 'centurion',

  // ── Aopoa ───────────────────────────────────────────────────────────────────
  280: 'karthual',

  // ── Argo Astronautics ────────────────────────────────────────────────────────
  288: 'mole',
  292: 'mole_carbon',
  293: 'mole_talus',
  295: 'moth',
  296: 'mpuv_cargo',
  298: 'mpuv_personnal',
  299: 'mpuv_tractor',
  884: 'csv',

  // ── Banu ────────────────────────────────────────────────────────────────────
  313: 'defender',

  // ── Consolidated Outland ─────────────────────────────────────────────────────
  323: 'hoverquad',

  // ── Crusader Industries ──────────────────────────────────────────────────────
  351: 'hercule_A2',
  360: 'ares_inferno',
  366: 'ares_ion',
  377: 'Hercule_C2',
  383: 'intrepid',
  386: 'Hercule_m2',
  392: 'mercury_star_runner',

  // ── Drake Interplanetary ─────────────────────────────────────────────────────
  403: 'buccaneer',
  411: 'caterpillar',
  426: 'caterpilar_bis',
  427: 'caterpillar_pirate',
  428: 'clipper',
  436: 'cutlass_black_bis',
  437: 'cutlass_black',
  463: 'cutlass_blue',
  467: 'cutlass_red',
  473: 'cutlass_steel',
  476: 'cutter',
  480: 'cutter_rambler',
  484: 'cutter_scout',
  488: 'dragonfly_black',
  491: 'dragonfly_starkitten',
  492: 'dragonfly_yellow',
  493: 'golem',
  496: 'golem_ox',
  499: 'herald',

  // ── Esperia ──────────────────────────────────────────────────────────────────
  515: 'blade',
  517: 'glaive',

  // ── Greycat Industrial ───────────────────────────────────────────────────────
  886: 'mdc',
  887: 'mtc',

  // ── Kruger Intergalactic ─────────────────────────────────────────────────────
  546: 'L21-lonewolf',
  549: 'L22-alphawolf',

  // ── MISC ─────────────────────────────────────────────────────────────────────
  587: 'fortune',
  590: 'freelancer',
  595: 'freelancer_dur',
  600: 'freelancer_max',
  605: 'freelancer_mis',
  610: 'hullA',
  615: 'hullc',

  // ── Mirai (ex-MISC) ──────────────────────────────────────────────────────────
  555: 'fury',
  557: 'fury_lx',
  559: 'fury_mx',
  561: 'guardian',
  565: 'guardian_mx',
  569: 'guardian_qi',

  // ── Origin Jumpworks ─────────────────────────────────────────────────────────
  677: '100i',
  681: '125a',
  684: '135c',
  687: '300i',
  693: '315p',
  697: '325a',
  702: '350r',
  706: '400i',
  712: '600i_explo',
  720: '600i_exec',
  721: '600i_touring',
  722: '85x',
  725: '890jump',
  736: 'm50',

  // ── Roberts Space Industries ─────────────────────────────────────────────────
  745: 'apollo_medivac',
  751: 'apollo_triage',
  758: 'aurora_lx',
  763: 'aurora_cl',
  768: 'aurora_es',
  773: 'aurora_ln',
  780: 'aurora_mr',
  786: 'aurora_mk2',
  787: 'bengal',
  788: 'constellation_andromeda',
  801: 'constellation_aquila',
  805: 'constellation_phenyx',
  810: 'constellation-phoenix-emerald',
  811: 'constellation_taurus',
  818: 'hermes',
  821: 'mantis',
  833: 'meteore',
  893: 'lynx',

  // ── Tumbril Land Systems ─────────────────────────────────────────────────────
  904: 'cyclone',
  906: 'cyclone_AA',
  907: 'cyclone_mt',
  908: 'cyclone_rc',
  909: 'cyclone_rn',
  910: 'cyclone_tr',
};

/** Retourne le chemin relatif Next.js vers l'image d'un vaisseau */
export function shipImagePath(shipId: number): string | null {
  const f = SHIP_IMAGES[shipId];
  if (!f) return null;
  return `/ships/${f}.png`;
}
