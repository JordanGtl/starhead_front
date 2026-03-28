import type { Metadata } from 'next';
import BlueprintDetail from '@/views/BlueprintDetail';

export const dynamic = 'force-dynamic';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:11000';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${API}/api/blueprints/${params.id}?locale=fr`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error();
    const bp = await res.json();
    const title = bp.outputName ?? bp.internalName ?? `Blueprint #${params.id}`;
    return {
      title,
      description: `Blueprint de craft : ${title}. Matériaux et temps de fabrication sur Star-Head.`,
      openGraph: { title, type: 'website' },
      alternates: { canonical: `/blueprints/${params.id}` },
    };
  } catch {
    return { title: `Blueprint #${params.id}` };
  }
}

export default BlueprintDetail;
