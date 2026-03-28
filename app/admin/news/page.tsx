import type { Metadata } from 'next';
import NewsAdmin from '@/views/admin/NewsAdmin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin — Actualités', robots: { index: false } };
export default NewsAdmin;
