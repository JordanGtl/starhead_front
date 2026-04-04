'use client';

import '@/i18n';
import i18n from '@/i18n';
import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { VersionProvider } from '@/contexts/VersionContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

const SUPPORTED = ['fr', 'en'];
const STORAGE_KEY = 'starhead_lang';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    // navigator n'est pas dans l'ordre de détection i18next (évite le conflit SSR).
    // On détecte ici, après hydratation, pour un changement de langue propre.
    const stored = localStorage.getItem(STORAGE_KEY);
    const normalizedStored = stored ? stored.split('-')[0] : null;

    if (!normalizedStored || !SUPPORTED.includes(normalizedStored)) {
      // Pas de préférence valide → détecter depuis le navigateur
      const browserLang = navigator.language.split('-')[0];
      const lang = SUPPORTED.includes(browserLang) ? browserLang : 'en';
      localStorage.setItem(STORAGE_KEY, lang);
      i18n.changeLanguage(lang);
    } else {
      // Langue valide → normaliser si régionale (fr-FR → fr) et appliquer
      if (normalizedStored !== stored) localStorage.setItem(STORAGE_KEY, normalizedStored);
      i18n.changeLanguage(normalizedStored);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <VersionProvider>
            {children}
            <Toaster />
            <Sonner />
          </VersionProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
