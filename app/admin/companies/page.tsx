import type { Metadata } from 'next';
import CompaniesAdmin from '@/views/admin/CompaniesAdmin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin — Entreprises', robots: { index: false } };
export default CompaniesAdmin;
