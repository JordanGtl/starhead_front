import { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, ArrowLeft, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

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
    <div className="container flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="rounded-lg border border-border bg-card p-8">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
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
            <>
              <div className="mb-6 text-center">
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
                    placeholder="demo@starhead.app"
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

              <Link
                to="/login"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t("forgotPassword.backToLogin")}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
