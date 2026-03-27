import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Newspaper, Search, RefreshCw, Trash2, Edit2, ExternalLink,
  CheckCircle2, XCircle, Loader2, AlertCircle, Plus, X,
  FileText, Play, RotateCcw, ChevronLeft, ChevronRight, Save,
  Shield, Languages, Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  fetchAdminNews, updateAdminNews, deleteAdminNews, syncAdminNewsContent, createAdminNews,
  fetchNewsTranslations, upsertNewsTranslation, deleteNewsTranslation, generateNewsTranslation,
  type AdminNewsItem, type AdminNewsPayload, type NewsTranslation,
} from "@/data/adminNews";
import { resolveThumbnail } from "@/data/news";

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------
const CATEGORIES = ["all", "transmission", "engineering", "spectrum-dispatch", "lore-post"];
const TYPES      = ["all", "post", "video"];
const PAGE_SIZE  = 20;

const AVAILABLE_LOCALES = [
  { code: "fr", label: "Français 🇫🇷" },
  { code: "de", label: "Deutsch 🇩🇪" },
  { code: "es", label: "Español 🇪🇸" },
  { code: "it", label: "Italiano 🇮🇹" },
  { code: "pt", label: "Português 🇵🇹" },
];

// ---------------------------------------------------------------------------
// Sous-composants
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
// Panneau de traduction
// ---------------------------------------------------------------------------
interface TranslationPanelProps {
  item: AdminNewsItem;
  onClose: () => void;
}

const TranslationPanel = ({ item, onClose }: TranslationPanelProps) => {
  const { t } = useTranslation();
  const [locale, setLocale]             = useState(AVAILABLE_LOCALES[0].code);
  const [translations, setTranslations] = useState<NewsTranslation[]>([]);
  const [loadingTr, setLoadingTr]       = useState(true);
  const [saving, setSaving]             = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const [msg, setMsg]                   = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [loadError, setLoadError]   = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", content: "" });

  // Charger les traductions existantes
  const loadTranslations = useCallback(() => {
    if (!item.id) return;
    setLoadingTr(true);
    setLoadError(null);
    fetchNewsTranslations(item.id)
      .then((data) => { setTranslations(data); })
      .catch((e: any) => setLoadError(e?.message ?? "Erreur de chargement"))
      .finally(() => setLoadingTr(false));
  }, [item.id]);

  useEffect(() => { loadTranslations(); }, [loadTranslations]);

  // Pré-remplir le formulaire quand la locale change
  useEffect(() => {
    const existing = translations.find((tr) => tr.locale === locale);
    setForm({
      title:       existing?.title       ?? "",
      description: existing?.description ?? "",
      content:     existing?.content     ?? "",
    });
  }, [locale, translations]);

  const currentTranslation = translations.find((tr) => tr.locale === locale);

  const handleGenerate = async () => {
    if (!item.id) return;
    setGenerating(true);
    setMsg(null);
    try {
      const generated = await generateNewsTranslation(item.id, locale);
      setTranslations((prev) => {
        const next = prev.filter((tr) => tr.locale !== locale);
        return [...next, generated].sort((a, b) => a.locale.localeCompare(b.locale));
      });
      setForm({
        title:       generated.title       ?? "",
        description: generated.description ?? "",
        content:     generated.content     ?? "",
      });
      setMsg({ type: "ok", text: "Traduction Gemini générée et sauvegardée." });
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message ?? "Erreur Gemini" });
    } finally {
      setGenerating(false);
      setTimeout(() => setMsg(null), 4000);
    }
  };

  const handleSave = async () => {
    if (!item.id) return;
    setSaving(true);
    setMsg(null);
    try {
      const updated = await upsertNewsTranslation(item.id, locale, {
        title:       form.title       || null,
        description: form.description || null,
        content:     form.content     || null,
      });
      setTranslations((prev) => {
        const next = prev.filter((tr) => tr.locale !== locale);
        return [...next, updated].sort((a, b) => a.locale.localeCompare(b.locale));
      });
      setMsg({ type: "ok", text: t("admin.news.translationSaved") });
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message ?? t("admin.news.syncError") });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 3000);
    }
  };

  const handleDelete = async () => {
    if (!item.id || !currentTranslation) return;
    setDeleting(true);
    try {
      await deleteNewsTranslation(item.id, locale);
      setTranslations((prev) => prev.filter((tr) => tr.locale !== locale));
      setForm({ title: "", description: "", content: "" });
      setMsg({ type: "ok", text: t("admin.news.translationDeleted") });
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message ?? t("admin.news.syncError") });
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
            <span className="font-semibold text-foreground">{t("admin.news.translations")}</span>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Article référence */}
        <div className="border-b border-border bg-secondary/30 px-6 py-3">
          <p className="text-xs text-muted-foreground">{t("admin.news.originalArticle")}</p>
          <p className="mt-0.5 text-sm font-medium text-foreground line-clamp-1">{item.title}</p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Sélecteur de locale + bouton Gemini */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("admin.news.targetLocale")}
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
                {generating ? "Génération…" : "Générer avec Gemini"}
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
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" title={t("admin.news.translationExists")} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message feedback */}
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
              {/* Champ titre */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  {t("admin.news.title")}
                  <span className="ml-1 text-muted-foreground/60">({t("admin.news.optional")})</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder={item.title}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/50"
                />
              </div>

              {/* Champ description */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  {t("admin.news.description")}
                  <span className="ml-1 text-muted-foreground/60">({t("admin.news.optional")})</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder={item.description ?? ""}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/50 resize-none"
                />
              </div>

              {/* Champ contenu */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">
                    {t("admin.news.content")} (HTML)
                  </label>
                  {currentTranslation?.hasContent && (
                    <span className="text-[10px] text-emerald-400">
                      ✓ {t("admin.news.translationExists")}
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
              {t("admin.news.deleteTranslation")}
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-3">
            <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
              {t("common.close")}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {t("common.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Formulaire d'édition (slide panel)
// ---------------------------------------------------------------------------
interface EditPanelProps {
  item: AdminNewsItem | null;
  onClose: () => void;
  onSave: (data: Partial<AdminNewsPayload>) => Promise<void>;
  saving: boolean;
  isCreate?: boolean;
}

const EditPanel = ({ item, onClose, onSave, saving, isCreate = false }: EditPanelProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<AdminNewsPayload>({
    rsiId:       item?.id ?? undefined,
    title:       item?.title ?? "",
    description: item?.description ?? "",
    category:    item?.category ?? "",
    type:        item?.type ?? "post",
    url:         item?.url ?? "",
    slug:        item?.slug ?? "",
    dateRaw:     item?.dateRaw ?? "",
    content:     item?.content ?? "",
  });

  const set = (k: keyof AdminNewsPayload) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative flex w-full max-w-2xl flex-col border-l border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            {isCreate ? <Plus className="h-4 w-4 text-primary" /> : <Edit2 className="h-4 w-4 text-primary" />}
            <span className="font-semibold text-foreground">
              {isCreate ? t("admin.news.createArticle") : t("admin.news.editArticle")}
            </span>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isCreate && (
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("admin.news.rsiId")} *</label>
              <input
                type="number"
                value={form.rsiId ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, rsiId: Number(e.target.value) }))}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                placeholder="21078"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("admin.news.title")} *</label>
            <input
              type="text"
              value={form.title}
              onChange={set("title")}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("admin.news.description")}</label>
            <textarea
              value={form.description ?? ""}
              onChange={set("description")}
              rows={3}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("admin.news.category")}</label>
              <select
                value={form.category ?? ""}
                onChange={set("category")}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
              >
                <option value="">—</option>
                {CATEGORIES.filter((c) => c !== "all").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("admin.news.type")}</label>
              <select
                value={form.type ?? "post"}
                onChange={set("type")}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
              >
                <option value="post">{t("news.typePost")}</option>
                <option value="video">{t("news.typeVideo")}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("admin.news.url")} {isCreate && "*"}</label>
            <input
              type="url"
              value={form.url ?? ""}
              onChange={set("url")}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
              placeholder="https://robertsspaceindustries.com/comm-link/…"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("admin.news.slug")}</label>
              <input
                type="text"
                value={form.slug ?? ""}
                onChange={set("slug")}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("admin.news.date")}</label>
              <input
                type="text"
                value={form.dateRaw ?? ""}
                onChange={set("dateRaw")}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                placeholder="2 days ago"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("admin.news.content")} (HTML)</label>
            <textarea
              value={form.content ?? ""}
              onChange={set("content")}
              rows={12}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs text-foreground outline-none focus:border-primary/50 resize-y"
              placeholder="<p>Contenu HTML de l'article…</p>"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            {t("common.close")}
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {t("common.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Confirmation de suppression
// ---------------------------------------------------------------------------
interface DeleteDialogProps {
  item: AdminNewsItem;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}

const DeleteDialog = ({ item, onConfirm, onCancel, deleting }: DeleteDialogProps) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/15">
            <Trash2 className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{t("admin.news.confirmDelete")}</h3>
            <p className="text-sm text-muted-foreground">{t("admin.news.confirmDeleteSub")}</p>
          </div>
        </div>
        <p className="mb-6 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground line-clamp-2">
          {item.title}
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
            {t("common.close")}
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex items-center gap-2 rounded-lg bg-destructive px-5 py-2 text-sm font-medium text-white hover:bg-destructive/90 disabled:opacity-50"
          >
            {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            {t("admin.news.delete")}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Page principale
// ---------------------------------------------------------------------------
const NewsAdmin = () => {
  const { t } = useTranslation();

  const [data, setData]             = useState<Awaited<ReturnType<typeof fetchAdminNews>> | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [page, setPage]             = useState(1);
  const [q, setQ]                   = useState("");
  const [category, setCategory]     = useState("all");
  const [type, setType]             = useState("all");

  const [editItem, setEditItem]         = useState<AdminNewsItem | null>(null);
  const [isCreate, setIsCreate]         = useState(false);
  const [saving, setSaving]             = useState(false);

  const [deleteItem, setDeleteItem]     = useState<AdminNewsItem | null>(null);
  const [deleting, setDeleting]         = useState(false);

  const [translateItem, setTranslateItem] = useState<AdminNewsItem | null>(null);

  const [syncingId, setSyncingId]       = useState<number | null>(null);
  const [syncMsg, setSyncMsg]           = useState<string | null>(null);

  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Load ---
  const load = useCallback(async (p = page, _q = q, _cat = category, _type = type) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminNews({ page: p, pagesize: PAGE_SIZE, q: _q, category: _cat, type: _type });
      setData(res);
    } catch (e: any) {
      setError(e?.message ?? t("news.loadError"));
    } finally {
      setLoading(false);
    }
  }, [page, q, category, type, t]);

  useEffect(() => { load(1, q, category, type); }, [category, type]);
  useEffect(() => { load(page, q, category, type); }, [page]);

  // Debounce search
  const handleSearch = (v: string) => {
    setQ(v);
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => { setPage(1); load(1, v, category, type); }, 400);
  };

  // --- Edit / Create ---
  const handleSave = async (formData: Partial<AdminNewsPayload>) => {
    setSaving(true);
    try {
      if (isCreate) {
        await createAdminNews(formData as AdminNewsPayload);
      } else if (editItem) {
        await updateAdminNews(editItem.id!, formData);
      }
      setEditItem(null);
      setIsCreate(false);
      load(page, q, category, type);
    } catch (e: any) {
      alert(e?.message ?? "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  // --- Delete ---
  const handleDelete = async () => {
    if (!deleteItem?.id) return;
    setDeleting(true);
    try {
      await deleteAdminNews(deleteItem.id);
      setDeleteItem(null);
      load(page, q, category, type);
    } catch (e: any) {
      alert(e?.message ?? "Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  };

  // --- Sync content ---
  const handleSyncContent = async (item: AdminNewsItem) => {
    if (!item.id) return;
    setSyncingId(item.id);
    setSyncMsg(null);
    try {
      const res = await syncAdminNewsContent(item.id);
      setSyncMsg(t("admin.news.syncSuccess", { chars: res.contentLength.toLocaleString() }));
      load(page, q, category, type);
    } catch (e: any) {
      setSyncMsg(e?.message ?? t("admin.news.syncError"));
    } finally {
      setSyncingId(null);
      setTimeout(() => setSyncMsg(null), 4000);
    }
  };

  const stats = data?.stats;

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="relative mb-8 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card via-card to-secondary p-8">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative">
          <div className="mb-2 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              {t("admin.title")}
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">{t("admin.news.title")}</h1>
          {/* Stats */}
          {stats && (
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{stats.total.toLocaleString()}</span> {t("admin.news.statArticles")}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-emerald-400">{stats.withContent.toLocaleString()}</span> {t("admin.news.statWithContent")}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-muted-foreground">{(stats.total - stats.withContent).toLocaleString()}</span> {t("admin.news.statWithoutContent")}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sync message */}
      {syncMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {syncMsg}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        {/* Recherche */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={q}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t("admin.news.search")}
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50"
          />
        </div>

        {/* Catégorie */}
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === "all" ? t("common.all") : c}</option>
          ))}
        </select>

        {/* Type */}
        <select
          value={type}
          onChange={(e) => { setType(e.target.value); setPage(1); }}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
        >
          {TYPES.map((tp) => (
            <option key={tp} value={tp}>
              {tp === "all" ? t("common.all") : tp === "post" ? t("news.typePost") : t("news.typeVideo")}
            </option>
          ))}
        </select>

        {/* Refresh */}
        <button
          onClick={() => load(page, q, category, type)}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          {t("news.refresh")}
        </button>

        {/* Créer */}
        <button
          onClick={() => { setIsCreate(true); setEditItem(null); }}
          className="ml-auto flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          {t("admin.news.createArticle")}
        </button>
      </div>

      {/* Tableau */}
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
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("admin.news.title")}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("admin.news.category")}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("admin.news.type")}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("admin.news.statusCol")}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("admin.news.date")}</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("admin.news.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {data?.items.map((item) => (
                    <tr key={item.id} className="group hover:bg-secondary/30 transition-colors">
                      {/* ID */}
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.id}</td>

                      {/* Title */}
                      <td className="px-4 py-3 max-w-xs">
                        <div className="flex items-center gap-2">
                          {item.hasThumbnail && resolveThumbnail(item.thumbnail) && (
                            <img
                              src={resolveThumbnail(item.thumbnail)!}
                              alt=""
                              className="h-8 w-12 rounded object-cover shrink-0"
                            />
                          )}
                          <span className="font-medium text-foreground line-clamp-2 leading-snug">{item.title}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 text-xs text-muted-foreground">{item.category || "—"}</td>

                      {/* Type */}
                      <td className="px-4 py-3">
                        {item.type === "video" ? (
                          <span className="flex w-fit items-center gap-1 rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold text-rose-400">
                            <Play className="h-2.5 w-2.5 fill-rose-400" /> Video
                          </span>
                        ) : (
                          <span className="flex w-fit items-center gap-1 rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-semibold text-sky-400">
                            <FileText className="h-2.5 w-2.5" /> Post
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <StatusBadge ok={item.hasContent}   label={t("admin.news.content")} />
                          <StatusBadge ok={item.hasThumbnail} label="Thumbnail" />
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{item.dateRaw || "—"}</td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* Sync content */}
                          <button
                            onClick={() => handleSyncContent(item)}
                            disabled={syncingId === item.id}
                            title={t("admin.news.syncContent")}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary disabled:opacity-40"
                          >
                            {syncingId === item.id
                              ? <Loader2 className="h-4 w-4 animate-spin" />
                              : <RotateCcw className="h-4 w-4" />
                            }
                          </button>

                          {/* Translate */}
                          <button
                            onClick={() => setTranslateItem(item)}
                            title={t("admin.news.translations")}
                            className="relative rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary"
                          >
                            <Languages className="h-4 w-4" />
                            {item.translatedLocales?.length > 0 && (
                              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white">
                                {item.translatedLocales.length}
                              </span>
                            )}
                          </button>

                          {/* View */}
                          {item.id && (
                            <Link
                              to={`/news/${item.id}`}
                              target="_blank"
                              title={t("news.viewOnRsi")}
                              className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          )}

                          {/* Edit */}
                          <button
                            onClick={() => { setEditItem(item); setIsCreate(false); }}
                            title={t("admin.news.editArticle")}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteItem(item)}
                            title={t("admin.news.delete")}
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

            {/* Empty */}
            {!loading && data?.items.length === 0 && (
              <div className="flex flex-col items-center py-16 text-center">
                <Newspaper className="mb-3 h-10 w-10 text-muted-foreground/20" />
                <p className="text-muted-foreground">{t("news.noNews")}</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {data && data.total > PAGE_SIZE && (
            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t("admin.news.page", { page, total: Math.ceil(data.total / PAGE_SIZE) })}
                {" — "}
                {data.total.toLocaleString()} {t("common.entries")}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" /> {t("admin.news.prev")}
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!data.hasMore || loading}
                  className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
                >
                  {t("admin.news.next")} <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Panneaux modaux */}
      {(editItem || isCreate) && (
        <EditPanel
          item={editItem}
          isCreate={isCreate}
          onClose={() => { setEditItem(null); setIsCreate(false); }}
          onSave={handleSave}
          saving={saving}
        />
      )}

      {deleteItem && (
        <DeleteDialog
          item={deleteItem}
          onConfirm={handleDelete}
          onCancel={() => setDeleteItem(null)}
          deleting={deleting}
        />
      )}

      {translateItem && (
        <TranslationPanel
          item={translateItem}
          onClose={() => setTranslateItem(null)}
        />
      )}
    </div>
  );
};

export default NewsAdmin;
