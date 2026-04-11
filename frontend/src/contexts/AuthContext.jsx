import React, { createContext, useState, useEffect, useCallback } from "react";
import { getToken, setToken, removeToken } from "../utils/token";

export const AuthContext = createContext(null);

function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const payload = decodeToken(token);
      // Reject expired tokens client-side
      if (payload && payload.exp && Date.now() / 1000 < payload.exp) {
        setUser(payload);
      } else {
        removeToken();
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((token) => {
    setToken(token);
    setUser(decodeToken(token));
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
  }, []);

  // Convenience: true if JWT is still valid
  const isAuthenticated = Boolean(user && user.exp && Date.now() / 1000 < user.exp);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
