import type { Metadata } from 'next';
import News from '@/views/News';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Actualités', description: 'Dernières actualités Star Citizen : Comm-Links, mises à jour et annonces sur Star-Head.' };
export default News;
