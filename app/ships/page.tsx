import type { Metadata } from 'next';
import Ships from '@/views/Ships';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Vaisseaux', description: 'Tous les vaisseaux Star Citizen : specs, prix, hardpoints et comparaisons sur Star-Head.' };
export default Ships;
