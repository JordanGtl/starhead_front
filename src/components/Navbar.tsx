import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, LogIn, LogOut, User, ChevronDown, Rocket, Crosshair, Cpu, MapPin, Users, Target, Car, Building2, BookOpen, Wrench, Newspaper, Database, ChevronRight, Tag } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useVersion } from "@/contexts/VersionContext";
import { useTranslation } from "react-i18next";
import logo from "@/assets/logo.svg";

const dbItems = [
  {
    groupKey: "nav.groupShips",
    items: [
      { labelKey: "nav.ships",         path: "/ships",         icon: Rocket,    descKey: "nav.descShips"    },
      { labelKey: "nav.vehicles",      path: "/vehicles",      icon: Car,       descKey: "nav.descVehicles" },
    ],
  },
  {
    groupKey: "nav.groupWeapons",
    items: [
      { labelKey: "nav.weapons",       path: "/weapons",       icon: Crosshair, descKey: "nav.descWeapons"     },
      { labelKey: "nav.components",    path: "/components",    icon: Cpu,       descKey: "nav.descComponents"  },
    ],
  },
  {
    groupKey: "nav.groupUniverse",
    items: [
      { labelKey: "nav.locations",     path: "/locations",     icon: MapPin,    descKey: "nav.descLocations"  },
      { labelKey: "nav.factions",      path: "/factions",      icon: Users,     descKey: "nav.descFactions"   },
      { labelKey: "nav.missions",      path: "/missions",      icon: Target,    descKey: "nav.descMissions"   },
    ],
  },
  {
    groupKey: "nav.groupCorp",
    items: [
      { labelKey: "nav.manufacturers", path: "/manufacturers", icon: Building2, descKey: "nav.descManufacturers" },
    ],
  },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [dbOpen, setDbOpen]             = useState(false);
  const [mobileDbOpen, setMobileDbOpen] = useState(false);
  const [versionOpen, setVersionOpen]   = useState(false);
  const versionRef                      = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { versions, selectedVersion, setSelectedVersion } = useVersion();
  const { t, i18n } = useTranslation();

  // Ferme tout sur changement de route
  useEffect(() => { setDbOpen(false); setMobileOpen(false); setVersionOpen(false); }, [location.pathname]);

  // Ferme le sélecteur de version sur clic extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (versionRef.current && !versionRef.current.contains(e.target as Node)) {
        setVersionOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const dbActive = dbItems.some((g) => g.items.some((i) => location.pathname.startsWith(i.path)));

  const topLinks = [
    { labelKey: "nav.lore",  path: "/lore",  icon: BookOpen  },
    { labelKey: "nav.tools", path: "/tools", icon: Wrench    },
    { labelKey: "nav.news",  path: "/news",  icon: Newspaper },
  ];

  return (
    // La nav couvre le trigger ET le mega menu → le hover ne se coupe pas
    <nav
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
      onMouseLeave={() => setDbOpen(false)}
    >
      <div className="container flex h-16 items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img src={logo} alt="StarHead" className="h-8" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">

          {/* Trigger Base de données */}
          <button
            onMouseEnter={() => setDbOpen(true)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 font-display text-sm font-medium transition-colors ${
              dbActive || dbOpen
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            {t("nav.database")}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${dbOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Top-level links */}
          {topLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-md px-3 py-2 font-display text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/search"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </Link>

          <button
            onClick={() => i18n.changeLanguage(i18n.language === "fr" ? "en" : "fr")}
            className="flex h-9 items-center justify-center rounded-md px-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title={i18n.language === "fr" ? "Switch to English" : "Passer en français"}
          >
            {i18n.language === "fr" ? "EN" : "FR"}
          </button>

          {/* Sélecteur de version */}
          {versions.length > 0 && (
            <div ref={versionRef} className="relative hidden md:block">
              <button
                onClick={() => setVersionOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-2.5 py-1.5 text-xs font-mono font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                <Tag className="h-3 w-3 shrink-0" />
                <span className="max-w-[110px] truncate">{selectedVersion?.label ?? "—"}</span>
                {selectedVersion?.isLive && (
                  <span className="ml-0.5 rounded-sm bg-primary/20 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">live</span>
                )}
                <ChevronDown className={`h-3 w-3 transition-transform duration-150 ${versionOpen ? "rotate-180" : ""}`} />
              </button>

              {versionOpen && (
                <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[200px] overflow-hidden rounded-lg border border-border bg-card shadow-xl">
                  <p className="border-b border-border/50 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {t("nav.versionPickerTitle")}
                  </p>
                  <div className="py-1">
                    {versions.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => { setSelectedVersion(v); setVersionOpen(false); }}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors ${
                          selectedVersion?.id === v.id
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        <span className="flex-1 font-mono">{v.label}</span>
                        {v.isLive && (
                          <span className="rounded-sm bg-primary/20 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">live</span>
                        )}
                        {selectedVersion?.id === v.id && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {isAuthenticated ? (
            <div className="hidden items-center gap-2 md:flex">
              <div className="flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                title={t("nav.logoutTitle")}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary md:inline-flex"
            >
              <LogIn className="h-3.5 w-3.5" />
              {t("nav.login")}
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground md:hidden hover:bg-secondary"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ─── Mega menu ─── positionné depuis <nav>, pleine largeur, seamless */}
      <div
        className={`absolute left-0 right-0 top-full hidden md:block overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl shadow-2xl transition-all duration-150 ${
          dbOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-1"
        }`}
      >
        <div className="container py-5">
          {/* Titre */}
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {t("nav.databaseSubtitle")}
          </p>
          {/* Grille */}
          <div className="grid grid-cols-4 gap-x-6 gap-y-0">
            {dbItems.map((group) => (
              <div key={group.groupKey}>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-primary/70">
                  {t(group.groupKey)}
                </p>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname.startsWith(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`group flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors ${
                          active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${
                          active ? "border-primary/30 bg-primary/10" : "border-border bg-secondary"
                        }`}>
                          <Icon className={`h-3.5 w-3.5 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-tight">{t(item.labelKey)}</p>
                          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground line-clamp-1">{t(item.descKey)}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Mobile menu ─── */}
      {mobileOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden">
          {/* Base de données accordion */}
          <button
            onClick={() => setMobileDbOpen((v) => !v)}
            className={`flex w-full items-center justify-between rounded-md px-3 py-2 font-display text-sm font-medium ${
              dbActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              {t("nav.database")}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${mobileDbOpen ? "rotate-180" : ""}`} />
          </button>

          {mobileDbOpen && (
            <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
              {dbItems.flatMap((g) => g.items).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                      location.pathname.startsWith(item.path)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t(item.labelKey)}
                    <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-40" />
                  </Link>
                );
              })}
            </div>
          )}

          {topLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`mt-0.5 flex items-center gap-2 rounded-md px-3 py-2 font-display text-sm font-medium ${
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t(link.labelKey)}
              </Link>
            );
          })}

          <div className="mt-3 border-t border-border pt-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-1.5 px-3 py-2">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm font-medium text-foreground">{user?.name}</span>
                </div>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex w-full items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-primary"
              >
                <LogIn className="h-3.5 w-3.5" />
                {t("nav.login")}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
