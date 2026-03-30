import type { Metadata } from 'next';
import LoreAdmin from '@/views/admin/LoreAdmin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin — Lore', robots: { index: false } };
export default LoreAdmin;
