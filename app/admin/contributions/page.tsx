import type { Metadata } from 'next';
import ContributionsAdmin from '@/views/admin/ContributionsAdmin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Contributions — Admin' };
export default ContributionsAdmin;
