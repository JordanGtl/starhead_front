import type { Metadata } from 'next';
import BlueprintDetail from '@/views/BlueprintDetail';
import { slugify } from '@/lib/slugify';

export const dynamic = 'force-dynamic';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:11000';

// ─── Fetch helper (Next.js déduplique les requêtes identiques dans le même render) ──

async function fetchBlueprint(id: string) {
  try {
    const res = await fetch(`${API}/api/blueprints/${id}?locale=fr`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json() as Promise<Record<string, unknown>>;
  } catch {
    return null;
  }
}

// ─── Métadonnées ──────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: { id: string; slug?: string[] } }
): Promise<Metadata> {
  const bp = await fetchBlueprint(params.id);
  if (!bp) return { title: `Blueprint #${params.id}` };

  const title = (bp.outputName ?? bp.internalName ?? `Blueprint #${params.id}`) as string;
  const slug  = slugify(title);

  return {
    title,
    description: `Blueprint de craft : ${title}. Matériaux et temps de fabrication sur Star-Head.`,
    openGraph: { title, type: 'website' },
    alternates: { canonical: `/blueprints/${params.id}/${slug}` },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlueprintPage(
  { params }: { params: { id: string; slug?: string[] } }
) {
  const bp          = await fetchBlueprint(params.id);
  const displayName = bp ? ((bp.outputName ?? bp.internalName) as string | null) : null;
  const slug        = slugify(displayName);
  const canonical   = `https://star-head.sc/blueprints/${params.id}/${slug}`;

  // ── JSON-LD (visible dans le HTML initial = garanti indexable par Google) ──
  const jsonLd = bp ? {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Accueil',     'item': 'https://star-head.sc'            },
          { '@type': 'ListItem', 'position': 2, 'name': 'Blueprints',  'item': 'https://star-head.sc/blueprints' },
          { '@type': 'ListItem', 'position': 3, 'name': displayName,   'item': canonical                         },
        ],
      },
      {
        '@type': 'HowTo',
        'name':        `Fabriquer ${displayName}`,
        'description': `Recette de fabrication pour ${displayName} dans Star Citizen.${
          bp.outputType ? ` Type : ${bp.outputType}.` : ''
        }`,
        'url': canonical,
        ...(bp.craftTimeSec != null
          ? { 'totalTime': `PT${bp.craftTimeSec}S` }
          : {}),
        // Ingrédients obligatoires comme outils HowTo
        'tool': ((bp.ingredients ?? []) as Array<{ name: string | null; ref: string; isMandatory?: boolean }>)
          .filter(ing => ing.isMandatory !== false)
          .slice(0, 15)
          .map(ing => ({ '@type': 'HowToTool', 'name': ing.name ?? ing.ref })),
      },
    ],
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {/* initialData pré-peuple le composant côté client dès l'hydratation */}
      <BlueprintDetail initialData={bp} />
    </>
  );
}
