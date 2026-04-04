import type { Metadata } from 'next';
import MissionDetail from '@/views/MissionDetail';

export const dynamic = 'force-dynamic';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:11000';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${API}/api/missions/${params.id}?locale=fr`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error();
    const m = await res.json();
    const title = m.title ?? `Mission #${params.id}`;
    return {
      title,
      description: `${m.type ?? 'Mission'} — ${m.source ?? ''} · Star-Head`,
      openGraph: { title, type: 'website' },
      alternates: { canonical: `/missions/${params.id}` },
    };
  } catch {
    return { title: `Mission #${params.id}` };
  }
}

export default MissionDetail;
