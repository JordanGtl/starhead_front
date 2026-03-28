import type { Metadata } from 'next';
import UsersAdmin from '@/views/admin/UsersAdmin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin — Utilisateurs', robots: { index: false } };
export default UsersAdmin;
