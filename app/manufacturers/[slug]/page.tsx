import type { Metadata } from 'next';
import ManufacturerDetail from '@/views/ManufacturerDetail';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const name = params.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: name,
    description: `${name} — Fabricant Star Citizen. Vaisseaux, armes et composants sur Star-Head.`,
    alternates: { canonical: `/manufacturers/${params.slug}` },
  };
}

export default ManufacturerDetail;
