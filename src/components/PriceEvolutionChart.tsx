'use client';
import { getShipPriceHistory } from "@/data/price-history";
import { useMemo, useState, useRef } from "react";

interface PriceEvolutionChartProps {
  shipId: string;
  currentPriceAuec: number;
  currentPriceEur: number;
}

const PriceEvolutionChart = ({ shipId, currentPriceAuec, currentPriceEur }: PriceEvolutionChartProps) => {
  const [mode, setMode] = useState<"auec" | "eur">("auec");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const data = getShipPriceHistory(shipId, currentPriceAuec, currentPriceEur);

  const chartData = useMemo(() => {
    const values = data.map((d) => (mode === "auec" ? d.priceAuec : d.priceEur));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    return data.map((d, index) => {
      const value = mode === "auec" ? d.priceAuec : d.priceEur;
      const x = data.length > 1 ? (index / (data.length - 1)) * 100 : 0;
      const y = 100 - ((value - min) / range) * 100;

      return {
        date: d.date,
        value,
        x,
        y,
      };
    });
  }, [data, mode]);

  const formatValue = (value: number) =>
    mode === "auec" ? `${value.toLocaleString()} aUEC` : `${value.toLocaleString()} €`;

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-foreground">Évolution des prix</h2>
        <div className="flex gap-1 rounded-lg border border-border bg-secondary p-0.5">
          <button
            onClick={() => setMode("auec")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              mode === "auec" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            aUEC
          </button>
          <button
            onClick={() => setMode("eur")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              mode === "eur" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            EUR €
          </button>
        </div>
      </div>

      <div className="h-64 rounded-md border border-border/60 bg-secondary/30 p-4">
        <div className="relative h-full w-full">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
            {/* Area fill */}
            <polygon
              fill="hsl(var(--primary) / 0.08)"
              points={`${chartData.map((p) => `${p.x},${p.y}`).join(" ")} ${chartData[chartData.length - 1]?.x ?? 0},100 ${chartData[0]?.x ?? 0},100`}
            />
            <polyline
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="1.8"
              points={chartData.map((p) => `${p.x},${p.y}`).join(" ")}
            />
            {/* Vertical guide line on hover */}
            {hoveredIndex !== null && chartData[hoveredIndex] && (
              <line
                x1={chartData[hoveredIndex].x}
                y1="0"
                x2={chartData[hoveredIndex].x}
                y2="100"
                stroke="hsl(var(--primary) / 0.3)"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
            )}
          </svg>

          {chartData.map((point, index) => (
            <div
              key={`${point.date}-${point.value}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Larger invisible hit area */}
              <div className="relative flex items-center justify-center h-6 w-6 cursor-pointer">
                <div
                  className={`rounded-full border border-primary bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.45)] transition-all duration-150 ${
                    hoveredIndex === index ? "h-3.5 w-3.5" : "h-2.5 w-2.5"
                  }`}
                />
              </div>

              {/* Tooltip */}
              {hoveredIndex === index && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
                  <div className="rounded-md border border-border bg-popover px-3 py-2 shadow-md whitespace-nowrap">
                    <p className="text-xs font-semibold text-foreground">{formatValue(point.value)}</p>
                    <p className="text-[10px] text-muted-foreground">{point.date}</p>
                  </div>
                  <div className="mx-auto h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>Données trimestrielles 2023-2024</span>
        <div className="flex flex-wrap gap-4">
          <span>
            Actuel : <span className="font-semibold text-primary">{currentPriceAuec.toLocaleString()} aUEC</span>
          </span>
          <span>
            Boutique : <span className="font-semibold text-accent">{currentPriceEur} €</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceEvolutionChart;
