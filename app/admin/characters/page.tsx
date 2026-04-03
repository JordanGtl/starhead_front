import type { Metadata } from 'next';
import CharactersAdmin from '@/views/admin/CharactersAdmin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin — Personnages', robots: { index: false } };
export default CharactersAdmin;
