import type { Metadata } from 'next';
import ShipCreateAdmin from '@/views/admin/ShipCreateAdmin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin — Nouveau vaisseau', robots: { index: false } };

export default ShipCreateAdmin;
