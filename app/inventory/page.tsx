import type { Metadata } from 'next';
import Inventory from '@/views/Inventory';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Mon inventaire', robots: { index: false } };
export default Inventory;
