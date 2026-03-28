import type { Metadata } from 'next';
import NewsDetail from '@/views/NewsDetail';

export const dynamic = 'force-dynamic';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:11000';

export async function generateMetadata({ params }: { params: { rsiId: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${API}/api/news/${params.rsiId}?locale=fr`, { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error();
    const item = await res.json();
    const title = item.title ?? `Actualité #${params.rsiId}`;
    return {
      title,
      description: item.summary ?? item.description ?? undefined,
      openGraph: {
        title,
        type: 'article',
        images: item.thumbnail ? [{ url: item.thumbnail }] : undefined,
      },
      alternates: { canonical: `/news/${params.rsiId}` },
    };
  } catch {
    return { title: `Actualité` };
  }
}

export default NewsDetail;
