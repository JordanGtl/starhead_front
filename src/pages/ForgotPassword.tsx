import { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, ArrowLeft, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import heroBg from "@/assets/hero-bg.jpg";

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = resetPassword(email);
    if ((result as any).success) {
      setSent(true);
    } else {
      setError((result as any).error || t("forgotPassword.error"));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">

      {/* Left panel — branding */}
      <div className="hidden relative overflow-hidden lg:flex lg:w-1/2 border-r border-border/40 shadow-[4px_0_32px_rgba(0,0,0,0.4)]">
        {/* Background image */}
        <img src={heroBg} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/55 to-background/90" />

        {/* Content — aligné avec le container navbar */}
        <div className="relative z-10 ml-auto flex w-full max-w-[700px] flex-col justify-between px-8 py-12">

          {/* Top — welcome */}
          <div>
            <h2 className="font-display text-4xl font-bold text-foreground">
              {t("auth.welcomeTitle")}<br />
              <span className="text-primary">StarHead</span>
            </h2>
            <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
              {t("auth.brandingDesc")}
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

          {sent ? (
            /* État envoyé */
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">{t("forgotPassword.sentTitle")}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("forgotPassword.sentDesc", { email })}
              </p>
              <p className="mt-4 text-xs text-muted-foreground italic">
                {t("forgotPassword.demoNote")}
              </p>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t("forgotPassword.backToLogin")}
              </Link>
            </div>
          ) : (
            /* Formulaire */
            <>
              <div className="mb-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <KeyRound className="h-6 w-6 text-primary" />
                </div>
                <h1 className="font-display text-2xl font-bold text-foreground">{t("forgotPassword.title")}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("forgotPassword.subtitle")}
                </p>
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
                    placeholder="votre@email.com"
                    className="h-10 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="h-10 w-full rounded-md bg-primary font-display text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {t("forgotPassword.sendLink")}
                </button>
              </form>

              <div className="mt-4 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {t("forgotPassword.backToLogin")}
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
