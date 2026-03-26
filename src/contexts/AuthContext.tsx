import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { apiFetch, getToken, setToken, removeToken, API_URL } from "@/lib/api";

export interface User {
  id: number;
  email: string;
  name: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Restaure la session depuis le token JWT stocké
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    apiFetch<User>('/api/auth/me')
      .then(setUser)
      .catch(() => removeToken());
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { token } = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }).then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message ?? 'Email ou mot de passe incorrect');
        }
        return res.json();
      });

      setToken(token);
      const me = await apiFetch<User>('/api/auth/me');
      setUser(me);
      return { success: true };
    } catch (e: unknown) {
      return { success: false, error: e instanceof Error ? e.message : 'Erreur de connexion' };
    }
  }, []);

  const signup = useCallback(async (email: string, name: string, password: string) => {
    try {
      await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, name, password }),
      });
      return login(email, password);
    } catch (e: unknown) {
      return { success: false, error: e instanceof Error ? e.message : "Erreur lors de l'inscription" };
    }
  }, [login]);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!email) return { success: false, error: 'Email requis' };
    return { success: true };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
