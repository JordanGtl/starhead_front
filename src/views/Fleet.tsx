'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ZoomIn, ZoomOut, Search, X } from 'lucide-react';
import { fetchShips, type Ship } from '@/data/ships';
import { shipImagePath } from '@/data/shipImages';

/* ─── Constantes layout ───────────────────────────────────────────────────── */
const BASE_PX  = 700;   // largeur cible du plus grand vaisseau à zoom = 1
const STEP_Y   = 7;     // décalage vertical max par vaisseau (effet diagonal)
const GAP      = 14;    // espacement horizontal entre vaisseaux (px)
const LABEL_H  = 20;    // espace réservé au-dessus du vaisseau pour le nom
const PAD_L    = 64;    // marge gauche (silhouette humaine + espace)
const PAD_T    = 20;    // marge haute
const PAD_B    = 56;    // marge basse (barre d'échelle + dimensions)
const HUMAN_H  = 1.8;   // hauteur de la silhouette humaine (m)

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const getLen = (s: Ship) => s.sizeX ?? 0;
const getH   = (s: Ship) => (s.sizeZ && s.sizeZ > 0) ? s.sizeZ : (s.sizeX ? s.sizeX * 0.18 : 0);
const fmtM   = (m: number) => m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;

function niceStep(ppm: number, targetPx = 120): number {
  const rawM = targetPx / Math.max(ppm, 1e-6);
  const mag  = Math.pow(10, Math.floor(Math.log10(Math.max(rawM, 1e-6))));
  const cands = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
  return cands.reduce(
    (best, s) => Math.abs(s * mag - rawM) < Math.abs(best * mag - rawM) ? s : best, cands[0],
  ) * mag;
}

type ShipRect = { ship: Ship; x: number; y: number; w: number; h: number };

/* ─── Composant ───────────────────────────────────────────────────────────── */
export default function Fleet() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const imagesRef   = useRef<Map<number, HTMLImageElement | null>>(new Map());

  const [ships,   setShips]   = useState<Ship[]>([]);
  const [zoom,    setZoom]    = useState(1);
  const [loading, setLoading] = useState(true);
  const [query,   setQuery]   = useState('');
  const [mfr,     setMfr]     = useState('');
  const [tooltip, setTooltip] = useState<{ ship: Ship; cx: number; cy: number } | null>(null);

  /* chargement */
  useEffect(() => {
    fetchShips()
      .then(list => setShips(
        list.filter(s => getLen(s) > 0).sort((a, b) => getLen(b) - getLen(a)),
      ))
      .finally(() => setLoading(false));
  }, []);

  /* vaisseaux affichés */
  const displayed = useMemo(() => {
    const q = query.toLowerCase();
    return ships.filter(s =>
      (!q || s.name.toLowerCase().includes(q) || s.manufacturer.toLowerCase().includes(q))
      && (!mfr || s.manufacturer === mfr),
    );
  }, [ships, query, mfr]);

  /* calculs de mise en page */
  const maxL  = displayed.length ? Math.max(...displayed.map(getLen)) : 100;
  const maxHm = displayed.length ? Math.max(...displayed.map(getH))   : 50;
  const n     = displayed.length;
  const ppm   = (BASE_PX / maxL) * zoom;
  const stepY = Math.min(STEP_Y, 400 / Math.max(n, 1));

  const maxShipPx = Math.max(maxHm * ppm, 30);
  const canvasH   = Math.ceil(PAD_T + LABEL_H + maxShipPx + (n > 1 ? (n - 1) * stepY : 0) + PAD_B);

  /* positions des vaisseaux */
  const shipRects = useMemo<ShipRect[]>(() => {
    const rects: ShipRect[] = [];
    let curX = PAD_L;
    displayed.forEach((ship, i) => {
      const sw        = Math.max(getLen(ship) * ppm, 6);
      const sh        = Math.max(getH(ship) * ppm, 3);
      const baselineY = PAD_T + LABEL_H + maxShipPx + (n - 1 - i) * stepY;
      rects.push({ ship, x: curX, y: baselineY - sh, w: sw, h: sh });
      curX += sw + GAP;
    });
    return rects;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayed, ppm, maxShipPx, stepY, n]);

  const canvasW = Math.ceil(
    shipRects.length
      ? shipRects[shipRects.length - 1].x + shipRects[shipRects.length - 1].w + 60
      : 400,
  );

  /* ─── dessin canvas ───────────────────────────────────────────────────── */
  function drawCanvas() {
    const canvas = canvasRef.current;
    if (!canvas || !displayed.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width  = canvasW;
    canvas.height = canvasH;

    // Fond
    ctx.fillStyle = '#07090f';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Ligne diagonale de sol
    const first = shipRects[0];
    const last  = shipRects[shipRects.length - 1];
    if (first && last) {
      const grad = ctx.createLinearGradient(first.x, 0, last.x + last.w, 0);
      grad.addColorStop(0,   'rgba(59,130,246,0.5)');
      grad.addColorStop(0.6, 'rgba(59,130,246,0.2)');
      grad.addColorStop(1,   'rgba(59,130,246,0.04)');
      ctx.beginPath();
      ctx.moveTo(0, first.y + first.h);
      shipRects.forEach(r => ctx.lineTo(r.x + r.w * 0.5, r.y + r.h));
      ctx.lineTo(canvasW, last.y + last.h);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 1.2;
      ctx.stroke();
    }

    // Silhouette humaine
    const humanPx  = HUMAN_H * ppm;
    const humanX   = PAD_L - 22;
    const humanBot = first ? first.y + first.h : PAD_T + LABEL_H + maxShipPx;
    if (humanPx > 3) {
      const hw = Math.max(humanPx * 0.35, 4);
      ctx.save();
      ctx.strokeStyle = 'rgba(74,222,128,0.5)';
      ctx.fillStyle   = 'rgba(74,222,128,0.5)';
      ctx.lineWidth   = 1.5;
      ctx.lineCap     = 'round';
      ctx.beginPath();
      ctx.arc(humanX + hw / 2, humanBot - humanPx + humanPx * 0.07, humanPx * 0.07, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(humanX + hw / 2, humanBot - humanPx + humanPx * 0.14);
      ctx.lineTo(humanX + hw / 2, humanBot - humanPx * 0.4);
      ctx.moveTo(humanX,          humanBot - humanPx * 0.65);
      ctx.lineTo(humanX + hw,     humanBot - humanPx * 0.65);
      ctx.moveTo(humanX + hw / 2, humanBot - humanPx * 0.4);
      ctx.lineTo(humanX,           humanBot);
      ctx.moveTo(humanX + hw / 2, humanBot - humanPx * 0.4);
      ctx.lineTo(humanX + hw,      humanBot);
      ctx.stroke();
      ctx.font         = '8px monospace';
      ctx.fillStyle    = 'rgba(74,222,128,0.5)';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('1.8 m', humanX + hw / 2, humanBot - humanPx - 3);
      ctx.restore();
    }

    // Vaisseaux
    shipRects.forEach(({ ship, x, y, w, h }) => {
      const img = imagesRef.current.get(ship.id);

      if (img && img.naturalWidth > 0) {
        ctx.drawImage(img, x, y, w, h);
      } else {
        ctx.fillStyle   = 'rgba(255,255,255,0.04)';
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth   = 1;
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
      }

      // Nom (au-dessus)
      const fs = Math.max(7, Math.min(11, w / 6));
      ctx.save();
      ctx.font         = `${fs}px -apple-system, system-ui, sans-serif`;
      ctx.fillStyle    = 'rgba(255,255,255,0.58)';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'bottom';
      ctx.beginPath();
      ctx.rect(x - 2, y - fs - 6, w + 4, fs + 6);
      ctx.clip();
      ctx.fillText(ship.name, x + w / 2, y - 3, Math.max(w, 50) * 2);
      ctx.restore();

      // Longueur (en-dessous de la baseline)
      if (w > 18) {
        ctx.font         = '8px monospace';
        ctx.fillStyle    = 'rgba(255,255,255,0.22)';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(fmtM(getLen(ship)), x + w / 2, y + h + 3);
      }
    });

    // Barre d'échelle
    const step   = niceStep(ppm);
    const stepPx = step * ppm;
    const scaleY = canvasH - PAD_B + 26;
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.fillStyle   = 'rgba(255,255,255,0.30)';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(PAD_L,         scaleY + 3);
    ctx.lineTo(PAD_L + stepPx, scaleY + 3);
    ctx.moveTo(PAD_L,         scaleY);
    ctx.lineTo(PAD_L,         scaleY + 6);
    ctx.moveTo(PAD_L + stepPx, scaleY);
    ctx.lineTo(PAD_L + stepPx, scaleY + 6);
    ctx.stroke();
    ctx.font = '9px monospace';
    ctx.textAlign    = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('0', PAD_L, scaleY + 9);
    ctx.textAlign = 'right';
    ctx.fillText(fmtM(step), PAD_L + stepPx, scaleY + 9);
  }

  /* redessiner quand les données changent */
  useEffect(() => { drawCanvas(); });

  /* charger les images quand la liste change */
  const idsKey = displayed.map(s => s.id).join(',');
  useEffect(() => {
    if (!displayed.length) return;
    imagesRef.current = new Map();

    displayed.forEach(ship => {
      const path = shipImagePath(ship.id);
      if (!path) {
        imagesRef.current.set(ship.id, null);
        return;
      }
      const img = new window.Image();
      img.onload = () => {
        imagesRef.current.set(ship.id, img);
        drawCanvas();
      };
      img.onerror = () => {
        imagesRef.current.set(ship.id, null);
      };
      img.src = path;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  /* ─── Tooltip ─────────────────────────────────────────────────────────── */
  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect  = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top)  * scaleY;
    const found = shipRects.find(r => mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h);
    setTooltip(found ? { ship: found.ship, cx: e.clientX, cy: e.clientY } : null);
  }

  /* ─── Fabricants pour le filtre ───────────────────────────────────────── */
  const manufacturers = useMemo(
    () => [...new Set(ships.map(s => s.manufacturer))].sort(),
    [ships],
  );

  /* ─── Render ──────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background">

      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-card/40">
        <div className="container flex h-11 items-center gap-2 text-sm text-muted-foreground">
          <Link href="/ships" className="flex items-center gap-1 transition-colors hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            Vaisseaux
          </Link>
          <span className="opacity-40">/</span>
          <span className="font-medium text-foreground">Fleet Visualizer</span>
        </div>
      </div>

      <div className="container space-y-4 py-6">

        {/* En-tête */}
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Fleet Visualizer</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Tous les vaisseaux Star Citizen à leur échelle réelle — vue diagonale.
          </p>
        </div>

        {/* Barre d'outils */}
        <div className="flex flex-wrap items-center gap-3">

          {/* Recherche */}
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus-within:border-primary/50">
            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Filtrer par nom…"
              className="w-40 bg-transparent outline-none placeholder:text-muted-foreground/40"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-muted-foreground/50 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Fabricant */}
          <select
            value={mfr}
            onChange={e => setMfr(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground outline-none focus:border-primary/50"
          >
            <option value="">Tous les fabricants</option>
            {manufacturers.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {(query || mfr) && (
            <button
              onClick={() => { setQuery(''); setMfr(''); }}
              className="text-xs text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              Réinitialiser
            </button>
          )}

          {/* Droite : compteur + zoom */}
          <div className="ml-auto flex items-center gap-1">
            <span className="mr-1 text-xs text-muted-foreground">
              {loading ? 'Chargement…' : `${n} vaisseau${n > 1 ? 'x' : ''}`}
            </span>
            <button
              onClick={() => setZoom(z => Math.max(z / 1.5, 0.02))}
              className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary/60"
              title="Dézoomer"
            ><ZoomOut className="h-3.5 w-3.5" /></button>
            <button
              onClick={() => setZoom(1)}
              className="min-w-[3.2rem] rounded px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-secondary/60"
            >{Math.round(zoom * 100)} %</button>
            <button
              onClick={() => setZoom(z => Math.min(z * 1.5, 20))}
              className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary/60"
              title="Zoomer"
            ><ZoomIn className="h-3.5 w-3.5" /></button>
          </div>
        </div>

        {/* Canvas */}
        <div
          className="overflow-auto rounded-xl border border-border"
          style={{ background: '#07090f' }}
        >
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <p className="animate-pulse text-sm text-muted-foreground">Chargement des vaisseaux…</p>
            </div>
          ) : n === 0 ? (
            <div className="flex h-48 items-center justify-center">
              <p className="text-sm opacity-25" style={{ color: '#fff' }}>Aucun vaisseau correspondant</p>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              style={{ display: 'block', cursor: 'crosshair' }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setTooltip(null)}
            />
          )}
        </div>

      </div>

      {/* Tooltip flottant */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border border-border bg-card/95 p-3 shadow-xl backdrop-blur-sm"
          style={{ left: tooltip.cx + 14, top: tooltip.cy - 10, minWidth: 175 }}
        >
          <p className="font-medium">{tooltip.ship.name}</p>
          <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
            <p>{tooltip.ship.manufacturer}</p>
            {tooltip.ship.sizeX && <p>Longueur : {fmtM(tooltip.ship.sizeX)}</p>}
            {tooltip.ship.sizeZ && <p>Hauteur   : {fmtM(tooltip.ship.sizeZ)}</p>}
            {tooltip.ship.sizeY && <p>Largeur   : {fmtM(tooltip.ship.sizeY)}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
