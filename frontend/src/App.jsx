import React from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";

// Scrolls to top on every page change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

// Waits for auth to finish loading before rendering any routes
// This prevents the flash-to-/login bug on first load
function AuthGate({ children }) {
  const { loading } = useAuth();
  if (loading) return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "#f4f6f8",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: "linear-gradient(135deg,#2a9d8f,#3dbbad)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, margin: "0 auto 12px",
        }}>🧰</div>
        <div style={{ color: "#2a9d8f", fontWeight: 700, fontSize: 14 }}>Loading...</div>
      </div>
    </div>
  );
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthGate>
          <ScrollToTop />
          <AppRoutes />
        </AuthGate>
      </AuthProvider>
    </BrowserRouter>
  );
}