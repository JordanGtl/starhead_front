import type { Metadata } from 'next';
import LocationDetail from '@/views/LocationDetail';

export const dynamic = 'force-dynamic';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:11000';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${API}/api/locations/${params.id}?locale=fr`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error();
    const loc = await res.json();
    const title = loc.name ?? `Lieu #${params.id}`;
    const description = `${loc.type ?? 'Lieu'} ${title} — Star Citizen. Découvrez ce lieu dans Star-Head.`;
    return {
      title,
      description,
      openGraph: { title, description, type: 'website' },
      alternates: { canonical: `/locations/${params.id}` },
    };
  } catch {
    return { title: `Lieu #${params.id}` };
  }
}

export default LocationDetail;
