'use client';
import { useState, useEffect, useCallback } from "react";
import { Users, Shield, Search, Loader2, CheckCircle2, XCircle, RefreshCw, Ban, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
  suspendedAt: string | null;
}

const UsersAdmin = () => {
  const { user: me } = useAuth();
  const [users, setUsers]     = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [toggling, setToggling]     = useState<number | null>(null);
  const [suspending, setSuspending] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<AdminUser[]>("/api/admin/users");
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleAdmin = async (u: AdminUser) => {
    setToggling(u.id);
    try {
      const isAdmin = u.roles.includes("ROLE_ADMIN");
      const newRoles = isAdmin
        ? u.roles.filter(r => r !== "ROLE_ADMIN")
        : [...u.roles, "ROLE_ADMIN"];

      const updated = await apiFetch<AdminUser>(`/api/admin/users/${u.id}/roles`, {
        method: "PATCH",
        body: JSON.stringify({ roles: newRoles }),
      });
      setUsers(prev => prev.map(x => x.id === updated.id ? updated : x));
    } finally {
      setToggling(null);
    }
  };

  const toggleSuspend = async (u: AdminUser) => {
    setSuspending(u.id);
    try {
      const updated = await apiFetch<AdminUser>(`/api/admin/users/${u.id}/suspend`, {
        method: "PATCH",
      });
      setUsers(prev => prev.map(x => x.id === updated.id ? updated : x));
    } finally {
      setSuspending(null);
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="relative min-h-screen bg-background">

        {/* Image de fond */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] overflow-hidden">
          <img src="/hero-bg.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" style={{ objectPosition: "50% 30%" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex min-h-[18vh] items-center">
          <div className="container pb-2 pt-8 flex items-end justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Administration</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground">Utilisateurs</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {users.length} compte{users.length > 1 ? "s" : ""} enregistré{users.length > 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={load}
              disabled={loading}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Actualiser
            </button>
          </div>
        </div>

        <div className="relative z-10 container pb-8 pt-0">

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou e-mail…"
            className="h-10 w-full max-w-sm rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">E-mail</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rôles</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suspension</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(u => {
                  const isAdmin      = u.roles.includes("ROLE_ADMIN");
                  const isSuspended  = !!u.suspendedAt;
                  const isMe         = u.id === me?.id;
                  return (
                    <tr key={u.id} className={`transition-colors hover:bg-secondary/20 ${isSuspended ? "bg-red-500/5" : "bg-card"}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold ${
                            isSuspended ? "bg-red-500/10 text-red-400" : "bg-primary/10 text-primary"
                          }`}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className={`font-medium ${isSuspended ? "text-muted-foreground line-through" : "text-foreground"}`}>{u.name}</p>
                            <div className="flex items-center gap-1.5">
                              {isMe && <p className="text-[10px] text-primary">Vous</p>}
                              {isSuspended && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-red-400">
                                  <Ban className="h-2.5 w-2.5" />
                                  Suspendu
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {u.roles.map(r => (
                            <span key={r} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              r === "ROLE_ADMIN"
                                ? "bg-primary/10 text-primary"
                                : "bg-secondary text-muted-foreground"
                            }`}>
                              {r === "ROLE_ADMIN" && <Shield className="h-2.5 w-2.5" />}
                              {r.replace("ROLE_", "")}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isMe ? (
                          <span className="text-xs text-muted-foreground/50">—</span>
                        ) : (
                          <button
                            onClick={() => toggleAdmin(u)}
                            disabled={toggling === u.id}
                            title={isAdmin ? "Retirer les droits admin" : "Donner les droits admin"}
                            className="inline-flex items-center justify-center transition-opacity hover:opacity-80 disabled:opacity-40"
                          >
                            {toggling === u.id ? (
                              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            ) : isAdmin ? (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            ) : (
                              <XCircle className="h-5 w-5 text-muted-foreground/40" />
                            )}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isMe ? (
                          <span className="text-xs text-muted-foreground/50">—</span>
                        ) : (
                          <button
                            onClick={() => toggleSuspend(u)}
                            disabled={suspending === u.id}
                            title={isSuspended ? "Réactiver le compte" : "Suspendre le compte"}
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                              isSuspended
                                ? "border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                : "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            }`}
                          >
                            {suspending === u.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : isSuspended ? (
                              <ShieldCheck className="h-3.5 w-3.5" />
                            ) : (
                              <Ban className="h-3.5 w-3.5" />
                            )}
                            {isSuspended ? "Réactiver" : "Suspendre"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersAdmin;
