import type { Metadata } from 'next';
import Blueprints from '@/views/Blueprints';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Blueprints', description: 'Tous les blueprints de craft Star Citizen : matériaux, temps et niveaux sur Star-Head.' };
export default Blueprints;
