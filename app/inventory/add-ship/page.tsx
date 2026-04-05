import type { Metadata } from 'next';
import AddShipToFleet from '@/views/AddShipToFleet';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Ajouter un vaisseau', robots: { index: false } };
export default AddShipToFleet;
