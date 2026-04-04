import { useState } from 'react';
import { apiFetch } from '@/lib/api';

interface UseTranslationOptions {
  onDone:  () => void | Promise<void>;
  onError: (message: string) => void;
}

export function useTranslationJob({ onDone, onError }: UseTranslationOptions) {
  const [translating, setTranslating] = useState(false);

  const start = async (endpoint: string) => {
    if (translating) return;
    setTranslating(true);
    try {
      await apiFetch(endpoint, { method: 'POST' });
      await onDone();
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? 'Erreur lors de la traduction';
      onError(msg);
    } finally {
      setTranslating(false);
    }
  };

  return { translating, start };
}
