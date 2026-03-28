import type { Metadata } from 'next';
import ShipLoadout from '@/views/ShipLoadout';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Loadout vaisseau #${params.id}`,
    robots: { index: false },
  };
}

export default ShipLoadout;
