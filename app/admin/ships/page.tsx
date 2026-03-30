import type { Metadata } from 'next';
import ShipsAdmin from '@/views/admin/ShipsAdmin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin — Vaisseaux', robots: { index: false } };
export default ShipsAdmin;
