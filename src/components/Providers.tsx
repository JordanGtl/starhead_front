'use client';

import '@/i18n';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { VersionProvider } from '@/contexts/VersionContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
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
