import type { Metadata } from 'next';
import ImportAdmin from '@/views/admin/ImportAdmin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Import de données — Admin' };
export default ImportAdmin;
