import type { Metadata } from 'next';
import Manufacturers from '@/views/Manufacturers';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Fabricants', description: 'Tous les fabricants de Star Citizen : Aegis, Anvil, Drake, RSI et plus encore sur Star-Head.' };
export default Manufacturers;
