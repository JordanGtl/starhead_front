import type { Metadata } from 'next';
import MyContributions from '@/views/MyContributions';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Mes contributions',
  robots: { index: false },
};
export default MyContributions;
