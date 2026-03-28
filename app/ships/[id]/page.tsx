import type { Metadata } from 'next';
import ShipDetail from '@/views/ShipDetail';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // ShipDetail uses static local data, so we use a generic title
  return {
    title: `Vaisseau #${params.id}`,
    alternates: { canonical: `/ships/${params.id}` },
  };
}

export default ShipDetail;
