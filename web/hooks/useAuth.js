import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as api from "../src/services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    api.restoreSession().then((session) => {
      if (!isMounted) {
        return;
      }

      if (session) {
        setCurrentUser(session.user);
        setSessionToken(session.token);
      }

      setIsReady(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async ({ email, password }) => {
    const result = await api.loginUser({ email, password });

    if (!result.success) {
      return result;
    }

    if (!result.user || !result.user.role) {
      return { success: false, message: 'Sunucu geçersiz kullanıcı verisi döndürdü.' };
    }

    setCurrentUser(result.user);
    setSessionToken(result.token);

    return result;
  };

  const logout = async () => {
    await api.logoutUser();
    setCurrentUser(null);
    setSessionToken(null);
  };

  const updateUser = (updates) =>
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : prev));

  const value = useMemo(
    () => ({
      currentUser,
      sessionToken,
      isAuthenticated: Boolean(currentUser),
      isReady,
      login,
      logout,
      updateUser,
    }),
    [currentUser, sessionToken, isReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}