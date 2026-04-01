import type { Metadata } from 'next';
import { getCharacterBySlug, localizeChar } from '@/data/characters';
import CharacterDetail from '@/views/CharacterDetail';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const character = getCharacterBySlug(params.slug);
  if (!character) {
    return { title: 'Personnage introuvable' };
  }
  return {
    title: character.name,
    description: localizeChar(character.description, 'fr').slice(0, 160),
    alternates: { canonical: `/characters/${params.slug}` },
  };
}

export default CharacterDetail;
