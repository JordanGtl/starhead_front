import type { Metadata } from 'next';
import GameVersionsAdmin from '@/views/admin/GameVersionsAdmin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin — Versions du jeu', robots: { index: false } };
export default GameVersionsAdmin;
