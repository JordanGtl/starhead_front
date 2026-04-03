'use client';
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Newspaper, Users, ChevronRight, Shield, ArrowLeft, Tag, Radio, Swords, Building2, Menu, X, BookOpen, ScrollText, Rocket, BarChart2, UserCircle2 } from "lucide-react";

const NAV_CATEGORIES = [
  {
    label: "Général",
    items: [
      { label: "Statistiques",    path: "/admin/stats",         icon: BarChart2 },
      { label: "Actualités",      path: "/admin/news",          icon: Newspaper },
      { label: "Utilisateurs",    path: "/admin/users",         icon: Users     },
      { label: "Versions du jeu", path: "/admin/game-versions", icon: Tag       },
      { label: "Spectrum",        path: "/admin/spectrum",      icon: Radio     },
    ],
  },
  {
    label: "Base de données",
    items: [
      { label: "Factions",    path: "/admin/factions",  icon: Swords    },
      { label: "Entreprises", path: "/admin/companies", icon: Building2 },
      { label: "Lore",         path: "/admin/lore",        icon: BookOpen    },
      { label: "Personnages", path: "/admin/characters",  icon: UserCircle2 },
      { label: "Blueprints",  path: "/admin/blueprints",  icon: ScrollText  },
      { label: "Vaisseaux",   path: "/admin/ships",       icon: Rocket      },
    ],
  },
];

const SidebarContent = ({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) => (
  <>
    {/* Header */}
    <div className="border-b border-border px-4 py-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
          <Shield className="h-4 w-4 text-primary" />
        </div>
        <span className="font-display text-sm font-bold text-foreground">Administration</span>
      </div>
    </div>

    {/* Navigation */}
    <nav className="flex-1 px-2 py-3 space-y-4 overflow-y-auto">
      {NAV_CATEGORIES.map(({ label: catLabel, items }) => (
        <div key={catLabel}>
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            {catLabel}
          </p>
          <div className="space-y-0.5">
            {items.map(({ label, path, icon: Icon }) => {
              const active = pathname === path;
              return (
                <Link
                  key={path}
                  href={path}
                  onClick={onNavigate}
                  className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                  {active && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>

    {/* Footer */}
    <div className="border-t border-border px-2 py-3">
      <Link
        href="/"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Retour au site
      </Link>
    </div>
  </>
);

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">

      {/* Sidebar desktop */}
      <aside className="hidden w-56 shrink-0 border-r border-border bg-card/50 lg:flex flex-col">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-200 lg:hidden ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-end border-b border-border px-3 py-3">
          <button onClick={() => setOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Bouton toggle mobile */}
        <div className="sticky top-0 z-30 flex items-center border-b border-border bg-background/80 px-4 py-2 backdrop-blur lg:hidden">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-4 w-4" />
            Menu
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
