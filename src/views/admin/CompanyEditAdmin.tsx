'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, ChevronLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import ManufacturerForm from '@/components/admin/ManufacturerForm';
import {
  AdminManufacturer, ManufacturerFormData, Page,
  emptyFormData, toFormData, fromFormData,
} from '@/lib/manufacturer-admin';

export default function CompanyEditAdmin({ id }: { id?: number }) {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  const [item, setItem]         = useState<AdminManufacturer | null>(null);
  const [loading, setLoading]   = useState(id !== undefined);
  const [notFound, setNotFound] = useState(false);
  const [saveError, setSaveError]   = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!authLoading && (!user || !user.roles?.includes('ROLE_ADMIN'))) {
      router.replace('/');
    }
  }, [authLoading, user, router]);

  // Fetch manufacturer when editing
  useEffect(() => {
    if (id === undefined) return;
    if (!user?.roles?.includes('ROLE_ADMIN')) return;

    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    apiFetch<Page>('/api/admin/manufacturers?pagesize=500')
      .then(page => {
        if (cancelled) return;
        const found = page.items.find(m => m.id === id) ?? null;
        setItem(found);
        if (!found) setNotFound(true);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id, user]);

  const handleSave = async (formData: ManufacturerFormData) => {
    setSaveError(null);
    setSaveSuccess(false);
    const body = JSON.stringify(fromFormData(formData));
    try {
      if (id === undefined) {
        await apiFetch<AdminManufacturer>('/api/admin/manufacturers', { method: 'POST', body });
      } else {
        await apiFetch<AdminManufacturer>(`/api/admin/manufacturers/${id}`, { method: 'PATCH', body });
      }
      setSaveSuccess(true);
      router.push('/admin/companies');
    } catch (e: any) {
      setSaveError(e?.message ?? 'Erreur lors de la sauvegarde');
      throw e; // re-throw so ManufacturerForm resets its saving state
    }
  };

  const handleCancel = () => router.back();

  if (authLoading || !user?.roles?.includes('ROLE_ADMIN')) return null;

  const isCreating = id === undefined;
  const pageTitle  = isCreating
    ? 'Nouvelle entreprise'
    : item ? `Modifier — ${item.name}` : 'Modifier entreprise';

  const initialData: ManufacturerFormData = isCreating
    ? emptyFormData()
    : item ? toFormData(item) : emptyFormData();

  return (
    <AdminLayout>
      <div className="relative min-h-screen bg-background">

        {/* Hero background */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
          <img src="/hero-bg.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" style={{ objectPosition: '50% 30%' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex min-h-[18vh] items-center">
          <div className="container pb-2 pt-8">
            <Link
              href="/admin/companies"
              className="mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Entreprises
            </Link>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Base de données</span>
            </div>
            <h1 className="font-display text-4xl font-bold text-foreground">{pageTitle}</h1>
          </div>
        </div>

        <div className="relative z-10 container pb-8 pt-0">

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Not found */}
          {!loading && notFound && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Entreprise introuvable.
              </div>
              <Link
                href="/admin/companies"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                Retour à la liste
              </Link>
            </div>
          )}

          {/* Save error */}
          {saveError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {saveError}
            </div>
          )}

          {/* Save success */}
          {saveSuccess && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Enregistré avec succès.
            </div>
          )}

          {/* Form */}
          {!loading && !notFound && (
            <div className="rounded-xl border border-border bg-card p-6">
              <ManufacturerForm
                title={pageTitle}
                initialData={initialData}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
