import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { LogIn, Rocket, Shield, Crosshair } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || t("auth.loginError"));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Left panel — branding */}
      <div className="hidden relative overflow-hidden bg-card lg:flex lg:w-1/2 flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative z-10">
          <h2 className="font-display text-4xl font-bold text-foreground">
            {t("auth.welcomeTitle")}<br />
            <span className="text-primary">StarHead</span>
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
            {t("auth.brandingDesc")}
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{t("auth.feature1Title")}</p>
              <p className="text-xs text-muted-foreground">{t("auth.feature1Desc")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10">
              <Crosshair className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{t("auth.feature2Title")}</p>
              <p className="text-xs text-muted-foreground">{t("auth.feature2Desc")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{t("auth.feature3Title")}</p>
              <p className="text-xs text-muted-foreground">{t("auth.feature3Desc")}</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-muted-foreground">
          {t("auth.copyright")}
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <LogIn className="h-6 w-6 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">{t("auth.loginTitle")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("auth.loginSubtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t("auth.emailLabel")}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@starhead.app"
                className="h-10 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t("auth.passwordLabel")}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="demo1234"
                className="h-10 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="h-10 w-full rounded-md bg-primary font-display text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("auth.loginButton")}
            </button>
          </form>

          <div className="mt-4 space-y-2 text-center text-sm">
            <Link to="/forgot-password" className="block text-primary hover:underline">
              {t("auth.forgotPassword")}
            </Link>
            <p className="text-muted-foreground">
              {t("auth.noAccount")}{" "}
              <Link to="/signup" className="text-primary hover:underline">
                {t("auth.signup")}
              </Link>
            </p>
          </div>

          <button
            type="button"
            onClick={() => { setEmail("demo@starhead.app"); setPassword("demo1234"); }}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-primary/30 bg-primary/5 px-3 py-2.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            <Rocket className="h-3.5 w-3.5" />
            {t("auth.demoFill")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
