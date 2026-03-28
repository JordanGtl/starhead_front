import type { Metadata } from 'next';
import Signup from '@/views/Signup';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Inscription', robots: { index: false } };
export default Signup;
