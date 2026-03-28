import type { Metadata } from 'next';
import Locations from '@/views/Locations';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Lieux', description: 'Planètes, lunes, stations et avant-postes de Star Citizen : explorez l\'univers sur Star-Head.' };
export default Locations;
