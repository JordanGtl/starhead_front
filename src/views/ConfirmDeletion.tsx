'use client';
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Trash2, Loader2, AlertCircle, CheckCircle, ShieldAlert } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const ConfirmDeletion = () => {
  const router       = useRouter();
  const params       = useSearchParams();
  const { logout }   = useAuth();
  const token        = params.get("token");

  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!token) setError("Lien invalide ou expiré.");
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      await apiFetch("/api/auth/account/confirm-deletion", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
      setDone(true);
      logout();
      setTimeout(() => router.push("/"), 3000);
    } catch {
      setError("Le lien est invalide ou a expiré. Veuillez refaire une demande depuis votre profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center">

        {done ? (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle className="h-7 w-7 text-emerald-400" />
            </div>
            <h1 className="font-display text-xl font-bold text-foreground">Compte supprimé</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Votre compte a été supprimé définitivement. Vous allez être redirigé…
            </p>
          </>
        ) : error ? (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-7 w-7 text-destructive" />
            </div>
            <h1 className="font-display text-xl font-bold text-foreground">Lien invalide</h1>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <button
              onClick={() => router.push("/profile")}
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-md border border-border bg-secondary px-5 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
            >
              Retour au profil
            </button>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <ShieldAlert className="h-7 w-7 text-destructive" />
            </div>
            <h1 className="font-display text-xl font-bold text-foreground">Confirmer la suppression</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Cette action est <span className="font-semibold text-destructive">irréversible</span>.
              Toutes vos données seront définitivement supprimées.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-destructive px-5 text-sm font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Supprimer définitivement mon compte
              </button>
              <button
                onClick={() => router.push("/profile")}
                className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-secondary px-5 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
              >
                Annuler
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default ConfirmDeletion;
