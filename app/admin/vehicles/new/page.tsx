import type { Metadata } from 'next';
import VehicleCreateAdmin from '@/views/admin/VehicleCreateAdmin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin — Nouveau véhicule', robots: { index: false } };
export default VehicleCreateAdmin;
