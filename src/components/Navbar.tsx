import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, LogIn, LogOut, User, ChevronDown, Rocket, Crosshair, Cpu, MapPin, Users, Target, Car, Building2, BookOpen, Wrench, Newspaper, Database, ChevronRight, Tag, Globe, Shield, Settings2, FlaskConical, Gem } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useVersion } from "@/contexts/VersionContext";
import { useTranslation } from "react-i18next";
import logo from "@/assets/logo.svg";

/** Toutes les langues supportées — ajouter/retirer ici */
const LANGUAGES = [
  { code: "fr", label: "Français",  flag: "🇫🇷" },
  { code: "en", label: "English",   flag: "🇬🇧" },
  // { code: "de", label: "Deutsch",   flag: "🇩🇪" },
  // { code: "es", label: "Español",   flag: "🇪🇸" },
  // { code: "it", label: "Italiano",  flag: "🇮🇹" },
  // { code: "pt", label: "Português", flag: "🇵🇹" },
  // { code: "ru", label: "Русский",   flag: "🇷🇺" },
  // { code: "zh", label: "中文",      flag: "🇨🇳" },
  // { code: "ja", label: "日本語",    flag: "🇯🇵" },
  // { code: "ko", label: "한국어",    flag: "🇰🇷" },
] as const;

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

const toolItems = [
  { labelKey: "tools.loadout.title",  path: "/tools/loadout",  icon: Settings2,    descKey: "tools.loadout.desc"  },
  { labelKey: "tools.crafting.title", path: "/tools/crafting", icon: FlaskConical, descKey: "tools.crafting.desc" },
  { labelKey: "tools.refining.title", path: "/tools/refining", icon: Gem,          descKey: "tools.refining.desc" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen]           = useState(false);
  const [openMenu, setOpenMenu]               = useState<"db" | "tools" | null>(null);
  const [mobileDbOpen, setMobileDbOpen]       = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [versionOpen, setVersionOpen]         = useState(false);
  const [langOpen, setLangOpen]               = useState(false);
  const versionRef                            = useRef<HTMLDivElement>(null);
  const langRef                               = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout }     = useAuth();
  const { versions, selectedVersion, setSelectedVersion } = useVersion();
  const { t, i18n } = useTranslation();

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  // Ferme tout sur changement de route
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
    setVersionOpen(false);
    setLangOpen(false);
  }, [location.pathname]);

  // Ferme les dropdowns sur clic extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (versionRef.current && !versionRef.current.contains(e.target as Node)) setVersionOpen(false);
      if (langRef.current    && !langRef.current.contains(e.target as Node))    setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const dbActive    = dbItems.some((g) => g.items.some((i) => location.pathname.startsWith(i.path)));
  const toolsActive = toolItems.some((i) => location.pathname.startsWith(i.path));

  const topLinks = [
    { labelKey: "nav.lore",  path: "/lore",  icon: BookOpen  },
    { labelKey: "nav.news",  path: "/news",  icon: Newspaper },
  ];

  return (
    <nav
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
      onMouseLeave={() => setOpenMenu(null)}
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
            onMouseEnter={() => setOpenMenu("db")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 font-display text-sm font-medium transition-colors ${
              dbActive || openMenu === "db"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            {t("nav.database")}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openMenu === "db" ? "rotate-180" : ""}`} />
          </button>

          {/* Trigger Outils */}
          <button
            onMouseEnter={() => setOpenMenu("tools")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 font-display text-sm font-medium transition-colors ${
              toolsActive || openMenu === "tools"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Wrench className="h-3.5 w-3.5" />
            {t("nav.tools")}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openMenu === "tools" ? "rotate-180" : ""}`} />
          </button>

          {/* Top-level links */}
          {topLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onMouseEnter={() => setOpenMenu(null)}
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

          {/* Sélecteur de langue */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen((o) => !o)}
              className="flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              title={t("nav.language")}
            >
              <span className="text-base leading-none">{currentLang.flag}</span>
              <span className="hidden text-xs font-semibold uppercase sm:block">{currentLang.code}</span>
              <ChevronDown className={`h-3 w-3 transition-transform duration-150 ${langOpen ? "rotate-180" : ""}`} />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[160px] overflow-hidden rounded-lg border border-border bg-card shadow-xl">
                <p className="border-b border-border/50 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {t("nav.language")}
                </p>
                <div className="py-1">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
                      className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
                        i18n.language === lang.code
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      <span className="text-base leading-none">{lang.flag}</span>
                      <span className="flex-1 text-xs">{lang.label}</span>
                      {i18n.language === lang.code && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

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
              {user?.roles.includes("ROLE_ADMIN") && (
                <Link
                  to="/admin/news"
                  className="flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                  title={t("admin.title")}
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}
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

      {/* ─── Mega menu Base de données ─────────────────────────────────────────── */}
      <div
        className={`absolute left-0 right-0 top-full hidden md:block overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl shadow-2xl transition-all duration-150 ${
          openMenu === "db"
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-1"
        }`}
      >
        <div className="container py-5">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {t("nav.databaseSubtitle")}
          </p>
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

      {/* ─── Mega menu Outils ──────────────────────────────────────────────────── */}
      <div
        className={`absolute left-0 right-0 top-full hidden md:block overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl shadow-2xl transition-all duration-150 ${
          openMenu === "tools"
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-1"
        }`}
      >
        <div className="container py-5">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {t("nav.toolsSubtitle")}
          </p>
          <div className="grid grid-cols-4 gap-x-6 gap-y-0">
            {toolItems.map((item) => {
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

          {/* Outils accordion */}
          <button
            onClick={() => setMobileToolsOpen((v) => !v)}
            className={`mt-0.5 flex w-full items-center justify-between rounded-md px-3 py-2 font-display text-sm font-medium ${
              toolsActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              {t("nav.tools")}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${mobileToolsOpen ? "rotate-180" : ""}`} />
          </button>

          {mobileToolsOpen && (
            <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
              {toolItems.map((item) => {
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

          {/* Top-level links */}
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
                {user?.roles.includes("ROLE_ADMIN") && (
                  <Link
                    to="/admin/news"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Admin
                  </Link>
                )}
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
