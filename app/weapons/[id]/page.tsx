import type { Metadata } from 'next';
import WeaponDetail from '@/views/WeaponDetail';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Arme #${params.id}`,
    alternates: { canonical: `/weapons/${params.id}` },
  };
}

export default WeaponDetail;
