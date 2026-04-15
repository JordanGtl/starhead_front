import type { Metadata } from 'next';
import ComponentDetail from '@/views/ComponentDetail';
import { slugify } from '@/lib/slugify';

export const dynamic = 'force-dynamic';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:11000';

export async function generateMetadata({ params }: { params: { id: string; slug?: string[] } }): Promise<Metadata> {
  try {
    const res = await fetch(`${API}/api/items/${params.id}?locale=fr`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error();
    const item = await res.json();
    const title = item.name ?? `Composant #${params.id}`;
    const slug = slugify(title);
    const description = [item.name, item.type, item.grade ? `grade ${item.grade}` : null, item.size ? `taille ${item.size}` : null]
      .filter(Boolean).join(' — ');
    return {
      title,
      description,
      openGraph: { title, description, type: 'website' },
      alternates: { canonical: `/components/${params.id}/${slug}` },
    };
  } catch {
    return { title: `Composant #${params.id}` };
  }
}

export default ComponentDetail;
