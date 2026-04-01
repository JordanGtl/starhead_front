import type { Metadata } from 'next';
import CompanyEditAdmin from '@/views/admin/CompanyEditAdmin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin — Modifier entreprise', robots: { index: false } };

export default function Page({ params }: { params: { id: string } }) {
  return <CompanyEditAdmin id={Number(params.id)} />;
}
