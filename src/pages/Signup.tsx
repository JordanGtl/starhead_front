import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus, Rocket, Shield, Crosshair } from "lucide-react";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
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
      setError(result.error || "Erreur lors de l'inscription");
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
            Rejoignez<br />
            <span className="text-primary">StarHead</span>
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
            Créez votre compte pilote et accédez à tous les outils de la base de données Star Citizen.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">16+ vaisseaux détaillés</p>
              <p className="text-xs text-muted-foreground">Specs, composants et hardpoints</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10">
              <Crosshair className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Arsenal complet</p>
              <p className="text-xs text-muted-foreground">Armes embarquées et FPS</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Comparateur avancé</p>
              <p className="text-xs text-muted-foreground">Comparez jusqu'à 4 vaisseaux</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-muted-foreground">
          © 2954 StarHead · Données non officielles
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Inscription</h1>
            <p className="mt-1 text-sm text-muted-foreground">Créez votre compte StarHead</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Nom de pilote</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Commander Shepard"
                className="h-10 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pilote@example.com"
                className="h-10 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Mot de passe</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 caractères minimum"
                className="h-10 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="h-10 w-full rounded-md bg-primary font-display text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Créer mon compte
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
