'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import {
  User, Mail, Shield, KeyRound, Save, LogOut,
  CheckCircle, AlertCircle, Loader2, Lock,
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

// ─── Section card ──────────────────────────────────────────────────────────────
const Section = ({ title, icon: Icon, children }: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm">
    <div className="flex items-center gap-2.5 border-b border-border/40 px-6 py-4">
      <Icon className="h-4 w-4 text-primary" />
      <h2 className="font-display text-sm font-semibold text-foreground">{title}</h2>
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

// ─── Alerte ────────────────────────────────────────────────────────────────────
const Alert = ({ type, message }: { type: "success" | "error"; message: string }) => (
  <div className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
    type === "success"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
      : "border-destructive/30 bg-destructive/10 text-destructive"
  }`}>
    {type === "success"
      ? <CheckCircle className="h-4 w-4 shrink-0" />
      : <AlertCircle className="h-4 w-4 shrink-0" />}
    {message}
  </div>
);

// ─── Page ──────────────────────────────────────────────────────────────────────
const Profile = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  useSEO({ title: "Mon profil", noindex: true });
  const router = useRouter();

  // Infos
  const [name, setName]         = useState(user?.name ?? "");
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoAlert, setInfoAlert]     = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Mot de passe
  const [currentPwd, setCurrentPwd]   = useState("");
  const [newPwd, setNewPwd]           = useState("");
  const [confirmPwd, setConfirmPwd]   = useState("");
  const [pwdLoading, setPwdLoading]   = useState(false);
  const [pwdAlert, setPwdAlert]       = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setInfoLoading(true);
    setInfoAlert(null);
    try {
      await apiFetch("/api/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({ name: name.trim() }),
      });
      setInfoAlert({ type: "success", msg: "Profil mis à jour avec succès." });
    } catch {
      setInfoAlert({ type: "error", msg: "Impossible de mettre à jour le profil." });
    } finally {
      setInfoLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdAlert(null);
    if (newPwd.length < 6) {
      setPwdAlert({ type: "error", msg: "Le mot de passe doit contenir au moins 6 caractères." });
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdAlert({ type: "error", msg: "Les mots de passe ne correspondent pas." });
      return;
    }
    setPwdLoading(true);
    try {
      await apiFetch("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      });
      setPwdAlert({ type: "success", msg: "Mot de passe modifié avec succès." });
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    } catch {
      setPwdAlert({ type: "error", msg: "Mot de passe actuel incorrect." });
    } finally {
      setPwdLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isAdmin = user?.roles.includes("ROLE_ADMIN");

  return (
    <div className="relative min-h-screen bg-background">

      {/* Image de fond */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
        <img src="/hero-bg.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" style={{ objectPosition: "50% 30%" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex min-h-[18vh] items-center">
        <div className="container pb-2 pt-8">
          <div className="mb-1 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Mon profil</span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <h1 className="font-display text-4xl font-bold text-foreground">{user?.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
            </div>
            {isAdmin && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Shield className="h-3 w-3" />
                Administrateur
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container pb-12 pt-0">
        <div className="grid gap-6 lg:grid-cols-2">

          {/* ── Informations ─────────────────────────────────────────────── */}
          <Section title="Informations du compte" icon={User}>
            <form onSubmit={handleUpdateInfo} className="space-y-4">
              {infoAlert && <Alert type={infoAlert.type} message={infoAlert.msg} />}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Nom de pilote</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom de pilote"
                    className="h-10 w-full rounded-md border border-border bg-secondary pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Adresse e-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={user?.email ?? ""}
                    disabled
                    className="h-10 w-full cursor-not-allowed rounded-md border border-border bg-secondary/50 pl-10 pr-3 text-sm text-muted-foreground"
                  />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground/60">L'adresse e-mail ne peut pas être modifiée.</p>
              </div>

              <button
                type="submit"
                disabled={infoLoading || name.trim() === user?.name}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 font-display text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {infoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Enregistrer
              </button>
            </form>
          </Section>

          {/* ── Mot de passe ─────────────────────────────────────────────── */}
          <Section title="Changer le mot de passe" icon={KeyRound}>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {pwdAlert && <Alert type={pwdAlert.type} message={pwdAlert.msg} />}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Mot de passe actuel</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    placeholder="••••••••"
                    className="h-10 w-full rounded-md border border-border bg-secondary pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Nouveau mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    placeholder="••••••••"
                    className="h-10 w-full rounded-md border border-border bg-secondary pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    placeholder="••••••••"
                    className="h-10 w-full rounded-md border border-border bg-secondary pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={pwdLoading || !currentPwd || !newPwd || !confirmPwd}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 font-display text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pwdLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                Modifier le mot de passe
              </button>
            </form>
          </Section>

          {/* ── Zone danger ──────────────────────────────────────────────── */}
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 lg:col-span-2">
            <div className="flex items-center gap-2.5 border-b border-destructive/20 px-6 py-4">
              <LogOut className="h-4 w-4 text-destructive" />
              <h2 className="font-display text-sm font-semibold text-foreground">Session</h2>
            </div>
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className="text-sm font-medium text-foreground">Se déconnecter</p>
                <p className="text-xs text-muted-foreground">Vous serez redirigé vers la page d'accueil.</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
