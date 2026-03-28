import type { Metadata } from 'next';
import Profile from '@/views/Profile';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Mon profil', robots: { index: false } };
export default Profile;
