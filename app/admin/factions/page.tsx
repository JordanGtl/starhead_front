import type { Metadata } from 'next';
import FactionsAdmin from '@/views/admin/FactionsAdmin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin — Factions', robots: { index: false } };
export default FactionsAdmin;
