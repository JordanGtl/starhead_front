import type { Metadata } from 'next';
import BlueprintsAdmin from '@/views/admin/BlueprintsAdmin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin — Blueprints', robots: { index: false } };
export default BlueprintsAdmin;
