import { useState, useMemo } from "react";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { loreEntries, loreCategories, type LoreEntry } from "@/data/lore";
import { Badge } from "@/components/ui/badge";

const categoryColors: Record<string, string> = {
  Histoire: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Factions: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Espèces: "bg-green-500/10 text-green-400 border-green-500/20",
  Technologie: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Événements: "bg-red-500/10 text-red-400 border-red-500/20",
};

const Lore = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!activeCategory) return loreEntries;
    return loreEntries.filter((e) => e.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Lore</h1>
          <p className="mt-1 text-muted-foreground">
            L'histoire, les factions et les technologies du 'verse
          </p>
        </div>

        {/* Category filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              !activeCategory
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Tout
          </button>
          {loreCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="mb-4 text-sm text-muted-foreground">{filtered.length} articles</p>

        {/* Articles */}
        <div className="space-y-3">
          {filtered.map((entry) => (
            <article
              key={entry.id}
              className="rounded-lg border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                className="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-secondary/30"
              >
                <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {entry.title}
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                        categoryColors[entry.category] || ""
                      }`}
                    >
                      {entry.category}
                    </span>
                    {entry.date && (
                      <span className="text-[10px] text-muted-foreground">{entry.date}</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{entry.summary}</p>
                </div>
                {expandedId === entry.id ? (
                  <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </button>
              {expandedId === entry.id && (
                <div className="border-t border-border px-5 py-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{entry.content}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lore;
