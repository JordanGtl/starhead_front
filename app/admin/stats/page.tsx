import type { Metadata } from 'next';
import StatsAdmin from '@/views/admin/StatsAdmin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin — Statistiques', robots: { index: false } };
export default StatsAdmin;
