import type { Metadata } from 'next';
import SpectrumAdmin from '@/views/admin/SpectrumAdmin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin — Spectrum', robots: { index: false } };
export default SpectrumAdmin;
