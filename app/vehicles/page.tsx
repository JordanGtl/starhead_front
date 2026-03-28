import type { Metadata } from 'next';
import Vehicles from '@/views/Vehicles';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Véhicules' };
export default Vehicles;
