import type { Metadata } from 'next';
import Weapons from '@/views/Weapons';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Armes', description: 'Armes de vaisseau et armes FPS dans Star Citizen : stats, DPS et portée sur Star-Head.' };
export default Weapons;
