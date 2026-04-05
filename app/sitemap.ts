import { MetadataRoute } from 'next';

const BASE_URL = 'https://star-head.sc';
const API_URL  = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.star-head.sc';

// ─── Pages statiques ─────────────────────────────────────────────────────────

const staticRoutes: MetadataRoute.Sitemap = [
  { url: `${BASE_URL}/`,                priority: 1.0,  changeFrequency: 'daily'   },
  { url: `${BASE_URL}/ships`,           priority: 0.9,  changeFrequency: 'daily'   },
  { url: `${BASE_URL}/ships/compare`,   priority: 0.7,  changeFrequency: 'weekly'  },
  { url: `${BASE_URL}/ships/configure`, priority: 0.7,  changeFrequency: 'weekly'  },
  { url: `${BASE_URL}/components`,      priority: 0.8,  changeFrequency: 'daily'   },
  { url: `${BASE_URL}/locations`,       priority: 0.7,  changeFrequency: 'weekly'  },
  { url: `${BASE_URL}/blueprints`,      priority: 0.7,  changeFrequency: 'weekly'  },
  { url: `${BASE_URL}/manufacturers`,   priority: 0.6,  changeFrequency: 'monthly' },
  { url: `${BASE_URL}/factions`,        priority: 0.6,  changeFrequency: 'monthly' },
  { url: `${BASE_URL}/news`,            priority: 0.8,  changeFrequency: 'daily'   },
  { url: `${BASE_URL}/spectrum`,        priority: 0.6,  changeFrequency: 'hourly'  },
  { url: `${BASE_URL}/vehicles`,        priority: 0.6,  changeFrequency: 'weekly'  },
  { url: `${BASE_URL}/consumables`,     priority: 0.5,  changeFrequency: 'monthly' },
  { url: `${BASE_URL}/lore`,            priority: 0.5,  changeFrequency: 'monthly' },
  { url: `${BASE_URL}/missions`,        priority: 0.5,  changeFrequency: 'monthly' },
  { url: `${BASE_URL}/tools/crafting`,  priority: 0.6,  changeFrequency: 'weekly'  },
  { url: `${BASE_URL}/tools/refining`,  priority: 0.6,  changeFrequency: 'weekly'  },
  { url: `${BASE_URL}/tools/ccu`,       priority: 0.6,  changeFrequency: 'weekly'  },
  { url: `${BASE_URL}/legal/mentions-legales`,             priority: 0.2, changeFrequency: 'yearly' },
  { url: `${BASE_URL}/legal/politique-de-confidentialite`, priority: 0.2, changeFrequency: 'yearly' },
  { url: `${BASE_URL}/legal/cgu`,                          priority: 0.2, changeFrequency: 'yearly' },
  { url: `${BASE_URL}/legal/cookies`,                      priority: 0.2, changeFrequency: 'yearly' },
];

// ─── Helper fetch ─────────────────────────────────────────────────────────────

async function fetchField<T = number>(path: string, field: string): Promise<T[]> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data: any[] = await res.json();
    return data.map((item) => item[field]).filter(Boolean) as T[];
  } catch {
    return [];
  }
}

// ─── Sitemap ─────────────────────────────────────────────────────────────────

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    shipIds,
    vehicleIds,
    componentIds,
    locationIds,
    blueprintIds,
    manufacturerSlugs,
    newsRsiIds,
    spectrumIds,
    missionIds,
  ] = await Promise.all([
    fetchField<number>('/api/ships',             'id'),
    fetchField<number>('/api/vehicles',          'id'),
    fetchField<number>('/api/items',             'id'),
    fetchField<number>('/api/locations',         'id'),
    fetchField<number>('/api/blueprints',        'id'),
    fetchField<string>('/api/manufacturers',     'slug'),
    fetchField<number>('/api/news',              'id'),
    fetchField<number>('/api/spectrum/posts',    'id'),
    fetchField<number>('/api/missions',          'id'),
  ]);

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...shipIds.map(id => ({
      url:             `${BASE_URL}/ships/${id}`,
      priority:        0.8 as const,
      changeFrequency: 'weekly' as const,
    })),
    ...vehicleIds.map(id => ({
      url:             `${BASE_URL}/vehicles/${id}`,
      priority:        0.7 as const,
      changeFrequency: 'weekly' as const,
    })),
    ...componentIds.map(id => ({
      url:             `${BASE_URL}/components/${id}`,
      priority:        0.6 as const,
      changeFrequency: 'monthly' as const,
    })),
    ...locationIds.map(id => ({
      url:             `${BASE_URL}/locations/${id}`,
      priority:        0.5 as const,
      changeFrequency: 'monthly' as const,
    })),
    ...blueprintIds.map(id => ({
      url:             `${BASE_URL}/blueprints/${id}`,
      priority:        0.5 as const,
      changeFrequency: 'monthly' as const,
    })),
    ...manufacturerSlugs.map(slug => ({
      url:             `${BASE_URL}/manufacturers/${slug}`,
      priority:        0.5 as const,
      changeFrequency: 'monthly' as const,
    })),
    ...newsRsiIds.map(id => ({
      url:             `${BASE_URL}/news/${id}`,
      priority:        0.7 as const,
      changeFrequency: 'never' as const,
    })),
    ...spectrumIds.map(id => ({
      url:             `${BASE_URL}/spectrum/${id}`,
      priority:        0.4 as const,
      changeFrequency: 'never' as const,
    })),
    ...missionIds.map(id => ({
      url:             `${BASE_URL}/missions/${id}`,
      priority:        0.5 as const,
      changeFrequency: 'monthly' as const,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
