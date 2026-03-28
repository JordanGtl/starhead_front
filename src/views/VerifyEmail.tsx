'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';

const VerifyEmail = () => {
  const params = useSearchParams();
  const router = useRouter();
  const token  = params.get('token');

  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setState('error');
      setMessage('Lien invalide ou incomplet.');
      return;
    }

    apiFetch('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
      .then(() => {
        setState('success');
        setTimeout(() => router.push('/profile'), 3000);
      })
      .catch(() => {
        setState('error');
        setMessage('Ce lien est invalide ou a expiré.');
      });
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center">
        {state === 'loading' && (
          <>
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Vérification en cours…</p>
          </>
        )}
        {state === 'success' && (
          <>
            <CheckCircle className="mx-auto mb-4 h-10 w-10 text-emerald-400" />
            <h1 className="mb-2 font-display text-xl font-bold text-foreground">Adresse e-mail vérifiée</h1>
            <p className="text-sm text-muted-foreground">Votre adresse e-mail a bien été confirmée. Vous allez être redirigé vers votre profil…</p>
          </>
        )}
        {state === 'error' && (
          <>
            <XCircle className="mx-auto mb-4 h-10 w-10 text-destructive" />
            <h1 className="mb-2 font-display text-xl font-bold text-foreground">Lien invalide</h1>
            <p className="mb-6 text-sm text-muted-foreground">{message}</p>
            <a href="/profile" className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              Retour au profil
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
