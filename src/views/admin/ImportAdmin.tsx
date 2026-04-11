'use client';
import { useState, useRef, useCallback } from "react";
import {
  Play, CheckCircle2, XCircle, Clock, Loader2, SkipForward,
  Terminal, RefreshCw, ChevronDown, ChevronUp,
  Package, Database, UploadCloud, FileArchive, X as XIcon,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { API_URL } from "@/lib/api";

// ── Types ──────────────────────────────────────────────────────────────────────

type StepStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped';

interface StepState {
  key: string;
  file: string;
  status: StepStatus;
  duration: number;
  output: string;
}

const ALL_STEPS = [
  { key: 'items',      label: 'Items',                 file: 'items_export.json'            },
  { key: 'vehicles',   label: 'Véhicules / Vaisseaux', file: 'vehicles_export.json'         },
  { key: 'shops',      label: 'Boutiques',             file: 'shop_inventories_export.json' },
  { key: 'loot',       label: 'Loot',                  file: 'harvestable_export.json'      },
  { key: 'factions',   label: 'Factions',              file: 'factions_export.json'         },
  { key: 'blueprints', label: 'Blueprints',            file: 'blueprints_export.json'       },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

const StatusIcon = ({ status, size = 4 }: { status: StepStatus; size?: number }) => {
  const cls = `h-${size} w-${size}`;
  switch (status) {
    case 'running':  return <Loader2    className={`${cls} animate-spin text-blue-400`}  />;
    case 'success':  return <CheckCircle2 className={`${cls} text-emerald-400`}          />;
    case 'failed':   return <XCircle   className={`${cls} text-red-400`}                 />;
    case 'skipped':  return <SkipForward className={`${cls} text-zinc-500`}              />;
    default:         return <Clock     className={`${cls} text-muted-foreground/40`}     />;
  }
};

const statusColor: Record<StepStatus, string> = {
  pending: 'border-border/40 bg-card/40',
  running: 'border-blue-500/40 bg-blue-500/5',
  success: 'border-emerald-500/40 bg-emerald-500/5',
  failed:  'border-red-500/40 bg-red-500/5',
  skipped: 'border-zinc-600/40 bg-zinc-500/5',
};

const StepCard = ({ step }: { step: StepState & { label: string } }) => {
  const [open, setOpen] = useState(false);
  const hasOutput = step.output.length > 0;

  return (
    <div className={`rounded-lg border transition-colors ${statusColor[step.status]}`}>
      <div className="flex items-center gap-3 px-4 py-3">
        <StatusIcon status={step.status} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{step.label}</p>
          <p className="text-[11px] text-muted-foreground font-mono truncate">{step.file}</p>
        </div>
        {step.duration > 0 && (
          <span className="text-xs text-muted-foreground tabular-nums shrink-0">{step.duration}s</span>
        )}
        {hasOutput && (
          <button
            onClick={() => setOpen(o => !o)}
            className="ml-1 rounded p-1 text-muted-foreground hover:bg-muted/30 transition-colors"
          >
            {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {open && hasOutput && (
        <div className="border-t border-border/30 bg-background/50 px-4 py-3 max-h-64 overflow-y-auto">
          <pre className="text-[11px] font-mono text-muted-foreground whitespace-pre-wrap break-all leading-relaxed">
            {step.output}
          </pre>
        </div>
      )}
    </div>
  );
};

// ── ZIP Drop Zone ──────────────────────────────────────────────────────────────

interface DropZoneProps {
  file: File | null;
  onChange: (f: File | null) => void;
  disabled: boolean;
}

const DropZone = ({ file, onChange, disabled }: DropZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const accept = (f: File) => {
    if (f.name.toLowerCase().endsWith('.zip')) onChange(f);
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Fichier ZIP <span className="text-destructive">*</span>
      </label>

      {file ? (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/40 bg-emerald-500/5 px-4 py-3">
          <FileArchive className="h-5 w-5 shrink-0 text-emerald-400" />
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-[11px] text-muted-foreground">{formatBytes(file.size)}</p>
          </div>
          {!disabled && (
            <button
              onClick={() => onChange(null)}
              className="rounded p-1 text-muted-foreground hover:text-destructive transition-colors"
              title="Supprimer"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); if (!disabled) setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault();
            setDragging(false);
            if (disabled) return;
            const f = e.dataTransfer.files[0];
            if (f) accept(f);
          }}
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 transition-colors text-center ${
            disabled
              ? 'cursor-not-allowed border-border/20 opacity-50'
              : dragging
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border/50 hover:border-primary/50 hover:bg-muted/10'
          }`}
        >
          <UploadCloud className="h-8 w-8 text-muted-foreground/40" />
          <div>
            <p className="text-sm font-medium text-foreground">Glisser-déposer ou cliquer</p>
            <p className="text-[11px] text-muted-foreground">Fichier .zip uniquement · max 512 Mo</p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".zip"
        className="hidden"
        disabled={disabled}
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) accept(f);
          e.target.value = '';
        }}
      />
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────

const ImportAdmin = () => {
  // Config form
  const [zipFile,      setZipFile]      = useState<File | null>(null);
  const [gameVersion,  setGameVersion]  = useState('');
  const [setLive,      setSetLive]      = useState(false);
  const [locale,       setLocale]       = useState('en');
  const [releasedAt,   setReleasedAt]   = useState('');
  const [selected,     setSelected]     = useState<string[]>(ALL_STEPS.map(s => s.key));

  // Run state
  const [running,       setRunning]       = useState(false);
  const [done,          setDone]          = useState(false);
  const [globalStatus,  setGlobalStatus]  = useState<'success' | 'failed' | null>(null);
  const [totalDuration, setTotalDuration] = useState(0);
  const [steps,         setSteps]         = useState<Map<string, StepState>>(new Map());
  const [error,         setError]         = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  // ── Toggle step selection ──────────────────────────────────────────────────
  const toggleStep = (key: string) => {
    setSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // ── Reset ──────────────────────────────────────────────────────────────────
  const reset = () => {
    setRunning(false);
    setDone(false);
    setGlobalStatus(null);
    setTotalDuration(0);
    setSteps(new Map());
    setError(null);
  };

  // ── Run import ─────────────────────────────────────────────────────────────
  const run = useCallback(async () => {
    if (!gameVersion.trim()) { setError('Le tag de version est requis.'); return; }
    if (!zipFile)            { setError('Sélectionne un fichier ZIP.'); return; }
    if (selected.length === 0) { setError('Sélectionne au moins un type de données.'); return; }

    setError(null);
    reset();
    setRunning(true);

    // Initialise step states as pending
    const initial = new Map<string, StepState>(
      ALL_STEPS.filter(s => selected.includes(s.key)).map(s => [
        s.key,
        { key: s.key, file: s.file, status: 'pending', duration: 0, output: '' },
      ])
    );
    setSteps(initial);

    abortRef.current = new AbortController();

    try {
      const form = new FormData();
      form.append('file', zipFile);
      form.append('gameVersion', gameVersion.trim());
      form.append('setLive', String(setLive));
      form.append('locale', locale);
      if (releasedAt) form.append('releasedAt', releasedAt);
      form.append('steps', JSON.stringify(selected));

      const res = await fetch(`${API_URL}/api/admin/import/upload`, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'text/event-stream' },
        body: form,
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() ?? '';

        for (const chunk of lines) {
          const line = chunk.replace(/^data: /, '').trim();
          if (!line) continue;
          try {
            const evt = JSON.parse(line);
            handleEvent(evt);
          } catch {}
        }
      }
    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message || 'Erreur de connexion.');
      }
    } finally {
      setRunning(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zipFile, gameVersion, setLive, locale, releasedAt, selected]);

  // ── Event handler ──────────────────────────────────────────────────────────
  const handleEvent = (evt: Record<string, unknown>) => {
    switch (evt.type) {

      case 'step_start':
        setSteps(prev => {
          const m = new Map(prev);
          const cur = m.get(evt.step as string);
          if (cur) m.set(evt.step as string, { ...cur, status: 'running' });
          return m;
        });
        break;

      case 'step_output':
        setSteps(prev => {
          const m = new Map(prev);
          const cur = m.get(evt.step as string);
          if (cur) m.set(evt.step as string, { ...cur, output: cur.output + (evt.chunk as string) });
          return m;
        });
        break;

      case 'step_done':
        setSteps(prev => {
          const m = new Map(prev);
          const cur = m.get(evt.step as string);
          if (cur) m.set(evt.step as string, {
            ...cur,
            status:   evt.status   as StepStatus,
            duration: evt.duration as number,
          });
          return m;
        });
        break;

      case 'done':
        setDone(true);
        setRunning(false);
        setGlobalStatus(evt.status as 'success' | 'failed');
        setTotalDuration(evt.totalDuration as number);
        if (evt.steps && typeof evt.steps === 'object') {
          const fullSteps = evt.steps as Record<string, { status: string; duration: number; output: string }>;
          setSteps(prev => {
            const m = new Map(prev);
            for (const [key, data] of Object.entries(fullSteps)) {
              const cur = m.get(key);
              if (cur) m.set(key, { ...cur, output: data.output ?? cur.output });
            }
            return m;
          });
        }
        break;

      case 'error':
        setError(evt.message as string);
        setRunning(false);
        break;
    }
  };

  // ── Cancel ─────────────────────────────────────────────────────────────────
  const cancel = () => {
    abortRef.current?.abort();
    setRunning(false);
  };

  // ── Render steps ───────────────────────────────────────────────────────────
  const stepList = ALL_STEPS
    .filter(s => selected.includes(s.key))
    .map(s => ({
      ...s,
      ...(steps.get(s.key) ?? { status: 'pending' as StepStatus, duration: 0, output: '' }),
    }));

  return (
    <AdminLayout>
      <div className="relative min-h-screen bg-background">

        {/* Hero */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
          <img src="/hero-bg.jpg" alt="" aria-hidden className="h-full w-full object-cover opacity-30" style={{ objectPosition: '50% 30%' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
        </div>

        <div className="relative container py-10">

          <div className="mb-8 flex items-center gap-3">
            <Database className="h-6 w-6 text-primary" />
            <h1 className="font-display text-2xl font-bold">Import de données</h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">

            {/* ── Formulaire ─────────────────────────────────────────────── */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/50 bg-card/60 overflow-hidden">
                <div className="border-b border-border/40 px-5 py-3.5">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Configuration</h2>
                </div>
                <div className="p-5 space-y-4">

                  {/* Version */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Tag de version <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={gameVersion}
                      onChange={e => setGameVersion(e.target.value)}
                      placeholder="ex: 4.7.175.49567"
                      disabled={running}
                      className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                    />
                  </div>

                  {/* ZIP file */}
                  <DropZone file={zipFile} onChange={setZipFile} disabled={running} />

                  {/* Locale */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Locale</label>
                    <select
                      value={locale}
                      onChange={e => setLocale(e.target.value)}
                      disabled={running}
                      className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
                    >
                      <option value="en">English (en)</option>
                      <option value="fr">Français (fr)</option>
                      <option value="de">Deutsch (de)</option>
                    </select>
                  </div>

                  {/* Released at */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date de sortie (optionnel)</label>
                    <input
                      type="date"
                      value={releasedAt}
                      onChange={e => setReleasedAt(e.target.value)}
                      disabled={running}
                      className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  {/* Set live */}
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/40 px-4 py-3 transition-colors hover:bg-muted/10">
                    <input
                      type="checkbox"
                      checked={setLive}
                      onChange={e => setSetLive(e.target.checked)}
                      disabled={running}
                      className="h-4 w-4 rounded border-border accent-primary"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">Marquer comme version live</p>
                      <p className="text-[11px] text-muted-foreground">Remplace la version live actuelle</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Sélection des étapes */}
              <div className="rounded-xl border border-border/50 bg-card/60 overflow-hidden">
                <div className="flex items-center justify-between border-b border-border/40 px-5 py-3.5">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Données à importer</h2>
                  <div className="flex gap-2">
                    <button onClick={() => setSelected(ALL_STEPS.map(s => s.key))} disabled={running} className="text-[11px] text-primary hover:underline disabled:opacity-40">Tout</button>
                    <span className="text-muted-foreground/40">·</span>
                    <button onClick={() => setSelected([])} disabled={running} className="text-[11px] text-muted-foreground hover:underline disabled:opacity-40">Aucun</button>
                  </div>
                </div>
                <div className="divide-y divide-border/30">
                  {ALL_STEPS.map(s => (
                    <label key={s.key} className="flex cursor-pointer items-center gap-3 px-5 py-2.5 transition-colors hover:bg-muted/10">
                      <input
                        type="checkbox"
                        checked={selected.includes(s.key)}
                        onChange={() => toggleStep(s.key)}
                        disabled={running}
                        className="h-4 w-4 rounded border-border accent-primary"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{s.label}</p>
                        <p className="text-[11px] font-mono text-muted-foreground/60 truncate">{s.file}</p>
                      </div>
                      <Package className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />
                    </label>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {!running ? (
                  <>
                    <button
                      onClick={run}
                      disabled={selected.length === 0 || !gameVersion.trim() || !zipFile}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40"
                    >
                      <Play className="h-4 w-4" />
                      Lancer l'import
                    </button>
                    {done && (
                      <button onClick={reset} className="rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/20 transition-colors">
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={cancel}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                    Annuler
                  </button>
                )}
              </div>
            </div>

            {/* ── Progression ────────────────────────────────────────────── */}
            <div className="space-y-4">

              {/* Résumé global */}
              {(running || done) && (
                <div className={`rounded-xl border px-5 py-4 flex items-center gap-3 ${
                  done
                    ? globalStatus === 'success'
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : 'border-red-500/40 bg-red-500/5'
                    : 'border-blue-500/40 bg-blue-500/5'
                }`}>
                  {running
                    ? <Loader2 className="h-5 w-5 animate-spin text-blue-400 shrink-0" />
                    : globalStatus === 'success'
                      ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                      : <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                  }
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {running
                        ? 'Import en cours…'
                        : globalStatus === 'success'
                          ? `Import terminé avec succès — ${totalDuration}s`
                          : `Import terminé avec des erreurs — ${totalDuration}s`
                      }
                    </p>
                    {running && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Ne ferme pas cette page. L'opération peut prendre plusieurs minutes.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Steps */}
              {stepList.length > 0 ? (
                <div className="space-y-2">
                  {stepList.map(step => (
                    <StepCard key={step.key} step={step} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card/30 py-16 text-center">
                  <Terminal className="h-10 w-10 text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground">La progression s'affiche ici une fois l'import lancé.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ImportAdmin;
