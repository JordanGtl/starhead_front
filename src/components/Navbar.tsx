import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, LogIn, LogOut, User, ChevronDown, Rocket, Crosshair, Cpu, MapPin, Users, Target, Car, Building2, BookOpen, Wrench, Newspaper, Database, ChevronRight, Tag, Shield, Settings2, FlaskConical, Gem, Radio } from "lucide-react";
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

// ─── Helpers version ──────────────────────────────────────────────────────────

/** Extrait "4.6" depuis "Alpha 4.6.0-LIVE.9627852" */
function shortVersion(label: string): string {
  const match = label.match(/(\d+\.\d+)/);
  return match ? match[1] : label;
}

/** Détermine le canal : "LIVE" si isLive, sinon "PTU" */
function versionChannel(label: string, isLive: boolean): "LIVE" | "PTU" {
  if (isLive) return "LIVE";
  if (label.toUpperCase().includes("LIVE")) return "LIVE";
  return "PTU";
}

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
  const [userOpen, setUserOpen]               = useState(false);
  const versionRef                            = useRef<HTMLDivElement>(null);
  const langRef                               = useRef<HTMLDivElement>(null);
  const userRef                               = useRef<HTMLDivElement>(null);
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
    setUserOpen(false);
  }, [location.pathname]);

  // Ferme les dropdowns sur clic extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (versionRef.current && !versionRef.current.contains(e.target as Node)) setVersionOpen(false);
      if (langRef.current    && !langRef.current.contains(e.target as Node))    setLangOpen(false);
      if (userRef.current    && !userRef.current.contains(e.target as Node))    setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const dbActive    = dbItems.some((g) => g.items.some((i) => location.pathname.startsWith(i.path)));
  const toolsActive = toolItems.some((i) => location.pathname.startsWith(i.path));

  const topLinks = [
    { labelKey: "nav.lore",     path: "/lore",     icon: BookOpen  },
    { labelKey: "nav.news",     path: "/news",     icon: Newspaper },
    { labelKey: "nav.spectrum", path: "/spectrum", icon: Radio     },
  ];

  return (
    <nav
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="container flex h-16 items-center justify-between">

        {/* Logo + Desktop nav */}
        <div className="flex items-center gap-1">
          <Link to="/" className="mr-10 flex shrink-0 items-center gap-2">
            <img src={logo} alt="StarHead" className="h-8" />
          </Link>

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
        </div>{/* end logo + nav */}

        {/* Right actions */}
        <div className="flex h-full self-stretch items-stretch">

          {/* Search */}
          <Link
            to="/search"
            className="self-center mx-2 flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </Link>

          {/* Sélecteur de version — pleine hauteur, biseau */}
          {versions.length > 0 && (
            <div ref={versionRef} className="relative hidden self-stretch md:flex">
              <button
                onClick={() => setVersionOpen((v) => !v)}
                className="flex h-full items-center gap-1.5 border-x border-border/50 bg-secondary/20 px-4 font-mono text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <span className="flex items-center gap-1.5">
                  <Tag className="h-3 w-3 shrink-0" />
                  <span className="font-semibold text-foreground">
                    {shortVersion(selectedVersion?.label ?? "")}
                  </span>
                  {selectedVersion && (
                    <span className={`rounded-sm px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      versionChannel(selectedVersion.label, selectedVersion.isLive) === "LIVE"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {versionChannel(selectedVersion.label, selectedVersion.isLive)}
                    </span>
                  )}
                  <ChevronDown className={`h-3 w-3 transition-transform duration-150 ${versionOpen ? "rotate-180" : ""}`} />
                </span>
              </button>

              {versionOpen && (
                <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[240px] overflow-hidden rounded-lg border border-border bg-card shadow-xl">
                  <p className="border-b border-border/50 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {t("nav.versionPickerTitle")}
                  </p>
                  {versions.filter(v => versionChannel(v.label, v.isLive) === "LIVE").length > 0 && (
                    <>
                      <p className="px-3 pb-1 pt-2 text-[9px] font-bold uppercase tracking-widest text-emerald-400/70">Live</p>
                      {versions.filter(v => versionChannel(v.label, v.isLive) === "LIVE").map(v => (
                        <button
                          key={v.id}
                          onClick={() => { setSelectedVersion(v); setVersionOpen(false); }}
                          className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors ${
                            selectedVersion?.id === v.id ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"
                          }`}
                        >
                          <span className="flex-1 font-mono text-xs">{v.label}</span>
                          {selectedVersion?.id === v.id && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                        </button>
                      ))}
                    </>
                  )}
                  {versions.filter(v => versionChannel(v.label, v.isLive) !== "LIVE").length > 0 && (
                    <>
                      <p className="border-t border-border/30 px-3 pb-1 pt-2 text-[9px] font-bold uppercase tracking-widest text-amber-400/70">PTU</p>
                      {versions.filter(v => versionChannel(v.label, v.isLive) !== "LIVE").map(v => (
                        <button
                          key={v.id}
                          onClick={() => { setSelectedVersion(v); setVersionOpen(false); }}
                          className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors ${
                            selectedVersion?.id === v.id ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"
                          }`}
                        >
                          <span className="flex-1 font-mono text-xs">{v.label}</span>
                          {selectedVersion?.id === v.id && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Sélecteur de langue — pleine hauteur, biseau */}
          <div ref={langRef} className="relative self-stretch">
            <button
              onClick={() => setLangOpen((o) => !o)}
              className="flex h-full items-center gap-1.5 border-r border-border/50 bg-secondary/20 px-4 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              title={t("nav.language")}
            >
              <span className="flex items-center gap-1.5">
                <span className="text-base leading-none">{currentLang.flag}</span>
                <span className="hidden text-xs font-semibold uppercase sm:block">{currentLang.code}</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-150 ${langOpen ? "rotate-180" : ""}`} />
              </span>
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

          {/* Authentifié — dropdown profil */}
          {isAuthenticated ? (
            <div ref={userRef} className="relative hidden self-stretch md:flex">
              <button
                onClick={() => setUserOpen((o) => !o)}
                className="flex h-full items-center gap-2 border-r border-border/50 bg-secondary/20 px-4 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-medium text-foreground">{user?.name}</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-150 ${userOpen ? "rotate-180" : ""}`} />
              </button>

              {userOpen && (
                <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[200px] overflow-hidden rounded-lg border border-border bg-card shadow-xl">
                  {/* En-tête */}
                  <div className="border-b border-border/50 px-4 py-3">
                    <p className="text-xs font-semibold text-foreground">{user?.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                  </div>

                  <div className="py-1">
                    {/* Profil */}
                    <Link
                      to="/profile"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      Mon profil
                    </Link>

                    {/* Admin */}
                    {user?.roles.includes("ROLE_ADMIN") && (
                      <Link
                        to="/admin/users"
                        onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                      >
                        <Shield className="h-4 w-4 text-primary" />
                        {t("admin.title")}
                      </Link>
                    )}

                    {/* Séparateur + déconnexion */}
                    <div className="my-1 border-t border-border/50" />
                    <button
                      onClick={() => { logout(); setUserOpen(false); }}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      {t("nav.logout")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Bouton connexion — pleine hauteur, biseau marqué */
            <Link
              to="/login"
              className="hidden self-stretch md:flex items-center bg-primary/10 border-r border-primary/30 px-6 font-display text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <span className="flex items-center gap-1.5">
                <LogIn className="h-3.5 w-3.5" />
                {t("nav.login")}
              </span>
            </Link>
          )}

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 self-center mx-2 items-center justify-center rounded-md text-muted-foreground md:hidden hover:bg-secondary"
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
                    to="/admin/users"
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
