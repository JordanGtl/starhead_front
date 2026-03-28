import type { Metadata } from 'next';
import ForgotPassword from '@/views/ForgotPassword';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Mot de passe oublié', robots: { index: false } };
export default ForgotPassword;
