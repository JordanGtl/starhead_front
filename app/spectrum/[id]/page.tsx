import type { Metadata } from 'next';
import SpectrumPostDetail from '@/views/SpectrumPostDetail';

export const dynamic = 'force-dynamic';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:11000';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${API}/api/spectrum/${params.id}`, { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error();
    const post = await res.json();
    const title = post.title ?? `Post Spectrum #${params.id}`;
    return {
      title,
      openGraph: { title, type: 'article' },
      alternates: { canonical: `/spectrum/${params.id}` },
    };
  } catch {
    return { title: 'Post Spectrum' };
  }
}

export default SpectrumPostDetail;
