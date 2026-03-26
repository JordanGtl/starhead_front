import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.svg";

const navLinks = [
  { label: "Vaisseaux", path: "/ships" },
  { label: "Armes", path: "/weapons" },
  { label: "Composants", path: "/components" },
  { label: "Lieux", path: "/locations" },
  { label: "Véhicules", path: "/vehicles" },
  { label: "Entreprises", path: "/manufacturers" },
  { label: "Lore", path: "/lore" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="StarHead" className="h-8" />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-md px-3 py-2 font-display text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/search"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </Link>

          {isAuthenticated ? (
            <div className="hidden items-center gap-2 md:flex">
              <div className="flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                title="Se déconnecter"
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
              Connexion
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

      {mobileOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-md px-3 py-2 font-display text-sm font-medium ${
                location.pathname === link.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
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
                  Se déconnecter
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-primary"
              >
                <LogIn className="h-3.5 w-3.5" />
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
