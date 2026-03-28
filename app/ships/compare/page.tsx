import type { Metadata } from 'next';
import ShipCompare from '@/views/ShipCompare';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Comparer des vaisseaux' };
export default ShipCompare;
