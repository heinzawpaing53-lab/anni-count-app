import {
  clearAuthToken,
  getAuthToken,
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  setAuthToken,
  updateProfile as updateProfileRequest,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from "@/src/lib/api";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (
    updates: Partial<Pick<AuthUser, "name" | "partnerName" | "anniversaryDate">>
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSession = useCallback((nextToken: string, nextUser: AuthUser) => {
    setAuthToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const clearSession = useCallback(() => {
    clearAuthToken();
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const activeToken = getAuthToken();
    if (!activeToken) {
      setLoading(false);
      setUser(null);
      return;
    }

    try {
      const response = await getCurrentUser(activeToken);
      setToken(activeToken);
      setUser(response.user);
    } catch {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await loginRequest(payload);
      handleSession(response.token, response.user);
    },
    [handleSession]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await registerRequest(payload);
    },
    []
  );

  const logout = useCallback(async () => {
    const activeToken = getAuthToken();
    try {
      if (activeToken) {
        await logoutRequest(activeToken);
      }
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const updateProfile = useCallback(
    async (
      updates: Partial<Pick<AuthUser, "name" | "partnerName" | "anniversaryDate">>
    ) => {
      const response = await updateProfileRequest(updates, getAuthToken());
      setUser(response.user);
    },
    []
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      refreshUser,
      updateProfile,
    }),
    [user, token, loading, login, register, logout, refreshUser, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
