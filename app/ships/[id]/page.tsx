import type { Metadata } from 'next';
import ShipDetail from '@/views/ShipDetail';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}/api/ships/${params.id}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const ship = await res.json();
      const title = ship.name ?? `Vaisseau #${params.id}`;
      const desc  = `${title}${ship.role ? ` — ${ship.role}` : ''}${ship.manufacturer ? ` par ${ship.manufacturer}` : ''}. Spécifications, loadout et prix sur StarHead.`;
      return {
        title,
        description: desc,
        alternates: { canonical: `/ships/${params.id}` },
      };
    }
  } catch {}

  return {
    title: `Vaisseau #${params.id}`,
    alternates: { canonical: `/ships/${params.id}` },
  };
}

export default ShipDetail;
