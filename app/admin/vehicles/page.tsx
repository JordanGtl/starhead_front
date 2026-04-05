import type { Metadata } from 'next';
import VehiclesAdmin from '@/views/admin/VehiclesAdmin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin — Véhicules', robots: { index: false } };
export default VehiclesAdmin;
