'use client';
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslationJob } from "@/hooks/useTranslationJob";
import { useRouter } from "next/navigation";
import {
  Radio, Search, RefreshCw, Trash2, ExternalLink,
  CheckCircle2, XCircle, Loader2, AlertCircle, X,
  ChevronLeft, ChevronRight, Save, Languages, Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SpectrumItem {
  id: number;
  spectrumId: string;
  threadTitle: string;
  authorName: string;
  authorHandle: string;
  category: string | null;
  excerpt: string | null;
  hasContent: boolean;
  postedAt: string | null;
  isPinned: boolean;
  spectrumUrl: string | null;
  voteCount: number;
  repliesCount: number;
  translationCount: number;
}

interface SpectrumTranslation {
  id: number;
  locale: string;
  title: string | null;
  excerpt: string | null;
  content: string | null;
  hasContent: boolean;
  updatedAt: string | null;
}

interface SpectrumListResponse {
  items: SpectrumItem[];
  total: number;
  pages: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const PAGE_SIZE = 20;

const AVAILABLE_LOCALES = [
  { code: "fr", label: "Français 🇫🇷" },
  { code: "de", label: "Deutsch 🇩🇪" },
  { code: "es", label: "Español 🇪🇸" },
  { code: "it", label: "Italiano 🇮🇹" },
  { code: "pt", label: "Português 🇵🇹" },
];

// ---------------------------------------------------------------------------
// StatusBadge
// ---------------------------------------------------------------------------
const StatusBadge = ({ ok, label }: { ok: boolean; label: string }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
    ok ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-500/15 text-zinc-500"
  }`}>
    {ok ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
    {label}
  </span>
);

// ---------------------------------------------------------------------------
// Translation Panel
// ---------------------------------------------------------------------------
interface TranslationPanelProps {
  item: SpectrumItem;
  onClose: () => void;
}

const TranslationPanel = ({ item, onClose }: TranslationPanelProps) => {
  const [locale, setLocale]             = useState(AVAILABLE_LOCALES[0].code);
  const [translations, setTranslations] = useState<SpectrumTranslation[]>([]);
  const [loadingTr, setLoadingTr]       = useState(true);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [msg, setMsg]             = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [form, setForm]           = useState({ title: "", excerpt: "", content: "" });

  const loadTranslations = useCallback(() => {
    setLoadingTr(true);
    setLoadError(null);
    apiFetch<SpectrumTranslation[]>(`/api/admin/spectrum/${item.id}/translations`)
      .then((data) => setTranslations(data))
      .catch((e: any) => setLoadError(e?.message ?? "Erreur de chargement"))
      .finally(() => setLoadingTr(false));
  }, [item.id]);

  useEffect(() => { loadTranslations(); }, [loadTranslations]);

  useEffect(() => {
    const existing = translations.find((tr) => tr.locale === locale);
    setForm({
      title:   existing?.title   ?? "",
      excerpt: existing?.excerpt ?? "",
      content: existing?.content ?? "",
    });
  }, [locale, translations]);

  const currentTranslation = translations.find((tr) => tr.locale === locale);

  const { translating: generating, start: startTranslation } = useTranslationJob({
    onDone: async () => {
      await loadTranslations();
      setMsg({ type: "ok", text: "Traduction générée et sauvegardée." });
      setTimeout(() => setMsg(null), 4000);
    },
    onError: (err) => {
      setMsg({ type: "err", text: err });
      setTimeout(() => setMsg(null), 4000);
    },
  });

  const handleGenerate = () => {
    setMsg(null);
    startTranslation(`/api/admin/spectrum/${item.id}/translate/${locale}`);
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const updated = await apiFetch<SpectrumTranslation>(
        `/api/admin/spectrum/${item.id}/translations/${locale}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title:   form.title   || null,
            excerpt: form.excerpt || null,
            content: form.content || null,
          }),
        }
      );
      setTranslations((prev) => {
        const next = prev.filter((tr) => tr.locale !== locale);
        return [...next, updated].sort((a, b) => a.locale.localeCompare(b.locale));
      });
      setMsg({ type: "ok", text: "Traduction sauvegardée." });
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message ?? "Erreur lors de la sauvegarde" });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 3000);
    }
  };

  const handleDelete = async () => {
    if (!currentTranslation) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/admin/spectrum/${item.id}/translations/${locale}`, { method: "DELETE" });
      setTranslations((prev) => prev.filter((tr) => tr.locale !== locale));
      setForm({ title: "", excerpt: "", content: "" });
      setMsg({ type: "ok", text: "Traduction supprimée." });
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message ?? "Erreur lors de la suppression" });
    } finally {
      setDeleting(false);
      setTimeout(() => setMsg(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex w-full max-w-2xl flex-col border-l border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">Traductions</span>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Reference post */}
        <div className="border-b border-border bg-secondary/30 px-6 py-3">
          <p className="text-xs text-muted-foreground">Post original</p>
          <p className="mt-0.5 text-sm font-medium text-foreground line-clamp-1">{item.threadTitle}</p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Locale selector + Gemini button */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Langue cible
              </label>
              <button
                onClick={handleGenerate}
                disabled={generating || loadingTr}
                className="flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-400 transition-colors hover:bg-violet-500/20 disabled:opacity-50"
              >
                {generating
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Sparkles className="h-3.5 w-3.5" />
                }
                {generating ? "Traduction en cours…" : "Générer"}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_LOCALES.map((l) => {
                const exists = translations.some((tr) => tr.locale === l.code);
                return (
                  <button
                    key={l.code}
                    onClick={() => setLocale(l.code)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-all ${
                      locale === l.code
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l.label}
                    {exists && (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" title="Traduction existante" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback message */}
          {msg && (
            <div className={`mb-4 flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm ${
              msg.type === "ok"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            }`}>
              {msg.type === "ok" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {msg.text}
            </div>
          )}

          {loadingTr ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <AlertCircle className="h-8 w-8 text-destructive/60" />
              <p className="text-sm text-destructive">{loadError}</p>
              <button
                onClick={loadTranslations}
                className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Réessayer
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Titre <span className="text-muted-foreground/60">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder={item.threadTitle}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/50"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Extrait <span className="text-muted-foreground/60">(optionnel)</span>
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                  placeholder={item.excerpt ?? ""}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/50 resize-none"
                />
              </div>

              {/* Content */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">
                    Contenu (HTML)
                  </label>
                  {currentTranslation?.hasContent && (
                    <span className="text-[10px] text-emerald-400">
                      ✓ Traduction existante
                    </span>
                  )}
                </div>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                  rows={16}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs text-foreground outline-none focus:border-primary/50 resize-y"
                  placeholder="<p>Contenu traduit en HTML…</p>"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          {currentTranslation ? (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 text-sm text-destructive hover:underline disabled:opacity-50"
            >
              {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Supprimer la traduction
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Fermer
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
const SpectrumAdmin = () => {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  const [data, setData]       = useState<SpectrumListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [page, setPage]       = useState(1);
  const [q, setQ]             = useState("");

  const [translateItem, setTranslateItem] = useState<SpectrumItem | null>(null);

  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Admin guard
  useEffect(() => {
    if (!authLoading && (!user || !user.roles?.includes("ROLE_ADMIN"))) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  // Load
  const load = useCallback(async (p = page, _q = q) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), pagesize: String(PAGE_SIZE) });
      if (_q) params.set("q", _q);
      const res = await apiFetch<SpectrumListResponse>(`/api/admin/spectrum?${params}`);
      setData(res);
    } catch (e: any) {
      setError(e?.message ?? "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [page, q]);

  useEffect(() => {
    if (user?.roles?.includes("ROLE_ADMIN")) load(page, q);
  }, [page]);

  useEffect(() => {
    if (user?.roles?.includes("ROLE_ADMIN")) load(1, q);
  }, [user]);

  // Debounced search
  const handleSearch = (v: string) => {
    setQ(v);
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => { setPage(1); load(1, v); }, 350);
  };

  // Delete
  const handleDelete = async (item: SpectrumItem) => {
    if (!window.confirm(`Supprimer le post "${item.threadTitle}" et toutes ses traductions ?`)) return;
    try {
      await apiFetch(`/api/admin/spectrum/${item.id}`, { method: "DELETE" });
      load(page, q);
    } catch (e: any) {
      alert(e?.message ?? "Erreur lors de la suppression");
    }
  };

  if (authLoading) return null;
  if (!user?.roles?.includes("ROLE_ADMIN")) return null;

  return (
    <AdminLayout>
      <div className="relative min-h-screen bg-background">

        {/* Hero background */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
          <img src="/hero-bg.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" style={{ objectPosition: "50% 30%" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex min-h-[18vh] items-center">
          <div className="container pb-2 pt-8">
            <div className="mb-1 flex items-center gap-2">
              <Radio className="h-5 w-5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Administration</span>
            </div>
            <h1 className="font-display text-4xl font-bold text-foreground">Spectrum</h1>
            {data && (
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{data.total.toLocaleString()}</span> posts
              </p>
            )}
          </div>
        </div>

        <div className="relative z-10 container pb-8 pt-0">

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {error}
            </div>
          )}

          {/* Toolbar */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={q}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Rechercher un titre, auteur, catégorie…"
                className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50"
              />
            </div>

            {/* Refresh */}
            <button
              onClick={() => load(page, q)}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Actualiser
            </button>
          </div>

          {/* Table */}
          {loading && !data ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/50">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Titre</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Auteur</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Catégorie</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contenu</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Traductions</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {data?.items.map((item) => (
                        <tr key={item.id} className="group hover:bg-secondary/30 transition-colors">
                          {/* Title */}
                          <td className="px-4 py-3 max-w-xs">
                            <span className="font-medium text-foreground line-clamp-2 leading-snug">{item.threadTitle}</span>
                          </td>

                          {/* Author */}
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                            {item.authorHandle || item.authorName || "—"}
                          </td>

                          {/* Category */}
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {item.category || "—"}
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                            {item.postedAt
                              ? new Date(item.postedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
                              : "—"}
                          </td>

                          {/* Has content */}
                          <td className="px-4 py-3">
                            <StatusBadge ok={item.hasContent} label={item.hasContent ? "Oui" : "Non"} />
                          </td>

                          {/* Translation count */}
                          <td className="px-4 py-3">
                            {item.translationCount > 0 ? (
                              <span className="inline-flex items-center justify-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                                {item.translationCount}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground/50">—</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              {/* Translate */}
                              <button
                                onClick={() => setTranslateItem(item)}
                                title="Traductions"
                                className="relative rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary"
                              >
                                <Languages className="h-4 w-4" />
                                {item.translationCount > 0 && (
                                  <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white">
                                    {item.translationCount}
                                  </span>
                                )}
                              </button>

                              {/* External link */}
                              {item.spectrumUrl && (
                                <a
                                  href={item.spectrumUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Voir sur Spectrum"
                                  className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(item)}
                                title="Supprimer"
                                className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Empty state */}
                {!loading && data?.items.length === 0 && (
                  <div className="flex flex-col items-center py-16 text-center">
                    <Radio className="mb-3 h-10 w-10 text-muted-foreground/20" />
                    <p className="text-muted-foreground">Aucun post Spectrum trouvé.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {data && data.total > PAGE_SIZE && (
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Page {page} / {data.pages} — {data.total.toLocaleString()} posts
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1 || loading}
                      className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" /> Précédent
                    </button>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= (data.pages ?? 1) || loading}
                      className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
                    >
                      Suivant <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Translation panel */}
          {translateItem && (
            <TranslationPanel
              item={translateItem}
              onClose={() => setTranslateItem(null)}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SpectrumAdmin;
