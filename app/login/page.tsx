import type { Metadata } from 'next';
import Login from '@/views/Login';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Connexion', robots: { index: false } };
export default Login;
