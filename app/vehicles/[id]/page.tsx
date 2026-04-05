import type { Metadata } from 'next';
import VehicleDetail from '@/views/VehicleDetail';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Véhicule #${params.id}`,
    alternates: { canonical: `/vehicles/${params.id}` },
  };
}

export default VehicleDetail;
