import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { apiFetch, API_URL } from "@/lib/api";
import i18n from "@/i18n";

export interface User {
  id: number;
  email: string;
  name: string;
  roles: string[];
  emailVerifiedAt: string | null;
  contributorPoints: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Restaure la session depuis le cookie
  useEffect(() => {
    apiFetch<User>('/api/auth/me')
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const loginRes = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        const body = await loginRes.json().catch(() => ({}));
        throw new Error(body.message ?? i18n.t('auth.incorrectCredentials'));
      }

      const me = await apiFetch<User>('/api/auth/me');
      setUser(me);
      return { success: true };
    } catch (e: unknown) {
      return { success: false, error: e instanceof Error ? e.message : i18n.t('auth.loginError') };
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
      return { success: false, error: e instanceof Error ? e.message : i18n.t('auth.signupError') };
    }
  }, [login]);

  const logout = useCallback(async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!email) return { success: false, error: i18n.t('auth.emailRequired') };
    return { success: true };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, authLoading, login, signup, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
