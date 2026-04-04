import type { Metadata } from 'next';
import GlossaryAdmin from '@/views/admin/GlossaryAdmin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin — Glossaire', robots: { index: false } };
export default GlossaryAdmin;
