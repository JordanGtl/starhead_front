'use client';
import { useState } from "react";
import { X, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

export interface ProposeEditField {
  key: string;
  label: string;
  currentValue: string | null | undefined;
  multiline?: boolean;
}

interface Props {
  itemDataId: number;
  itemName: string;
  fields: ProposeEditField[];
  onClose: () => void;
}

const ProposeEditModal = ({ itemDataId, itemName, fields, onClose }: Props) => {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map(f => [f.key, f.currentValue ?? '']))
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Only send fields that changed
      const changes: Record<string, string> = {};
      for (const f of fields) {
        const newVal = values[f.key]?.trim();
        if (newVal && newVal !== (f.currentValue ?? '').trim()) {
          changes[f.key] = newVal;
        }
      }

      if (Object.keys(changes).length === 0) {
        setError("Aucune modification détectée.");
        return;
      }

      await apiFetch('/api/proposals', {
        method: 'POST',
        body: JSON.stringify({ itemDataId, changes }),
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <div>
            <h2 className="font-display text-sm font-bold text-foreground">Proposer une modification</h2>
            <p className="mt-0.5 text-xs text-muted-foreground truncate max-w-xs">{itemName}</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/30 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Success state */}
        {success ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            <p className="font-semibold text-foreground">Proposition envoyée !</p>
            <p className="text-sm text-muted-foreground">Merci pour ta contribution. Elle sera examinée par un modérateur.</p>
            <button onClick={onClose} className="mt-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="max-h-[60vh] overflow-y-auto px-5 py-4 space-y-4">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {f.label}
                  </label>
                  {f.multiline ? (
                    <textarea
                      rows={3}
                      className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      value={values[f.key] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                      placeholder={f.currentValue ?? '—'}
                    />
                  ) : (
                    <input
                      type="text"
                      className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      value={values[f.key] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                      placeholder={f.currentValue ?? '—'}
                    />
                  )}
                  {f.currentValue && (
                    <p className="mt-1 text-[11px] text-muted-foreground/50 truncate">
                      Actuel : {f.currentValue}
                    </p>
                  )}
                </div>
              ))}

              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <p className="text-[11px] text-muted-foreground/60">
                Chaque champ modifié rapporte <span className="text-primary font-semibold">1 point</span> contributeur si la modification est acceptée.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border/60 px-5 py-4">
              <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/20 transition-colors">
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Envoyer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProposeEditModal;
