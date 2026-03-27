import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { UserPlus } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await signup(email, name, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || t("auth.signupError"));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Left panel — branding */}
      <div className="hidden relative overflow-hidden lg:flex lg:w-1/2 border-r border-border/40 shadow-[4px_0_32px_rgba(0,0,0,0.4)]">
        {/* Background image */}
        <img src={heroBg} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/55 to-background/90" />

        {/* Content — aligné avec le container navbar (max-w = moitié du 1400px) */}
        <div className="relative z-10 ml-auto flex w-full max-w-[700px] flex-col justify-between px-8 py-12">

          {/* Top — welcome */}
          <div>
            <h2 className="font-display text-4xl font-bold text-foreground">
              {t("auth.joinTitle")}<br />
              <span className="text-primary">StarHead</span>
            </h2>
            <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
              {t("auth.signupBrandingDesc")}
            </p>
          </div>

          {/* Center — tagline */}
          <div className="flex flex-col items-center text-center -mt-28">
            <div className="mb-6 h-px w-12 bg-primary/40" />
            <p className="font-display text-3xl font-bold leading-snug text-foreground/90">
              Naviguez.<br />Combattez.<br />Survivez.
            </p>
            <div className="mt-6 h-px w-12 bg-primary/40" />
            <p className="mt-6 max-w-xs text-xs uppercase tracking-widest text-muted-foreground/50">
              La référence des pilotes de Star Citizen
            </p>
          </div>

          {/* Bottom — copyright */}
          <p className="text-xs text-muted-foreground/60">
            {t("auth.copyright")}
          </p>

        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">{t("auth.signupTitle")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("auth.signupSubtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t("auth.pilotName")}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom de pilote"
                className="h-10 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t("auth.emailLabel")}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="h-10 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t("auth.passwordLabel")}</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-10 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="h-10 w-full rounded-md bg-primary font-display text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("auth.signupButton")}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t("auth.alreadyAccount")}{" "}
            <Link to="/login" className="text-primary hover:underline">
              {t("auth.connectLink")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
