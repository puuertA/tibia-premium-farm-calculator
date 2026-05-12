import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../services/authApi";
import { userApi } from "../services/userApi";
import type { UserProfile } from "../types/backend";

const AUTH_STORAGE_KEY = "tibia-premium-auth";

interface AuthContextValue {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; confirmPassword: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (payload: { name?: string; email?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStoredToken = () => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as { token?: string };
    return parsed.token ?? null;
  } catch {
    return null;
  }
};

const storeToken = (token: string | null) => {
  if (!token) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token }));
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => readStoredToken());
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async (activeToken: string) => {
    const response = await authApi.me(activeToken);
    setUser(response.user);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        await loadUser(token);
      } catch {
        setToken(null);
        setUser(null);
        storeToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, [token, loadUser]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    setToken(response.token);
    setUser(response.user);
    storeToken(response.token);
  }, []);

  const register = useCallback(async (payload: { name: string; email: string; password: string; confirmPassword: string }) => {
    const response = await authApi.register(payload);
    setToken(response.token);
    setUser(response.user);
    storeToken(response.token);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    storeToken(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    const response = await userApi.me(token);
    setUser(response.user);
  }, [token]);

  const updateProfile = useCallback(
    async (payload: { name?: string; email?: string }) => {
      if (!token) return;
      const response = await userApi.update(token, payload);
      setUser(response.user);
    },
    [token]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      refreshUser,
      updateProfile
    }),
    [user, token, isLoading, login, register, logout, refreshUser, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
