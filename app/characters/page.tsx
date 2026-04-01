import type { Metadata } from 'next';
import Characters from '@/views/Characters';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Personnages',
  description: 'Les personnages clés de l\'univers Star Citizen : dirigeants, héros, criminels et figures historiques de l\'UEE et au-delà.',
};
export default Characters;
