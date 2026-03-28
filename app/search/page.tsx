import type { Metadata } from 'next';
import SearchPage from '@/views/SearchPage';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Recherche', robots: { index: false } };
export default SearchPage;
