import { Suspense } from 'react';
import ConfirmDeletion from '@/views/ConfirmDeletion';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Suppression de compte',
  robots: { index: false },
};

export default function Page() {
  return (
    <Suspense>
      <ConfirmDeletion />
    </Suspense>
  );
}
