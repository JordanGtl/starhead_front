import type { Metadata } from 'next';
import CompanyEditAdmin from '@/views/admin/CompanyEditAdmin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin — Nouvelle entreprise', robots: { index: false } };

export default function Page() {
  return <CompanyEditAdmin />;
}
