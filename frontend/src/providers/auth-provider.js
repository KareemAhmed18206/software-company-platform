"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { apiRequest } from "@/lib/api/client";

const STORAGE_KEY = "software-company-platform-auth";

const AuthContext = createContext(null);

const readStoredSession = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.localStorage.getItem(STORAGE_KEY);

  return rawSession ? JSON.parse(rawSession) : null;
};

const persistSession = (session) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

const clearSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const storedSession = readStoredSession();

      if (!storedSession?.token) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await apiRequest("/auth/me", {
          token: storedSession.token
        });

        if (!isMounted) {
          return;
        }

        setToken(storedSession.token);
        setUser(response.user);
        persistSession({
          token: storedSession.token,
          user: response.user
        });
      } catch (_error) {
        clearSession();

        if (!isMounted) {
          return;
        }

        setToken(null);
        setUser(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const applySession = (session) => {
    setToken(session.token);
    setUser(session.user);
    persistSession(session);
  };

  const register = async (payload) => {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: payload
    });

    applySession({
      token: response.token,
      user: response.user
    });

    return response;
  };

  const login = async (payload) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: payload
    });

    applySession({
      token: response.token,
      user: response.user
    });

    return response;
  };

  const logout = async () => {
    const activeSession = readStoredSession();

    try {
      if (activeSession?.token) {
        await apiRequest("/auth/logout", {
          method: "POST",
          token: activeSession.token
        });
      }
    } catch (_error) {
      // Clear local auth state even if the API call fails because JWT logout is stateless.
    } finally {
      clearSession();
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        isAuthenticated: Boolean(token && user),
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside an AuthProvider.");
  }

  return context;
};

